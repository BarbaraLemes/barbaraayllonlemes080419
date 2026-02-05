import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../../../contexts/ToastContext';

// Mock dos hooks
vi.mock('../hooks/useAuth');
vi.mock('../../../contexts/ToastContext');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const mockLogin = vi.fn();
const mockShowToast = vi.fn();

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
      isLoading: false,
      error: null,
      user: null,
      isAuthenticated: false,
    });

    vi.mocked(useToast).mockReturnValue({
      showToast: mockShowToast,
    });
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it('deve renderizar formulário de login', () => {
    renderLogin();
    
    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve exibir erros de validação quando campos estão vazios', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/usuário é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
    });
  });

  it('deve chamar login com credenciais válidas', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce(undefined);
    
    renderLogin();
    
    await user.type(screen.getByLabelText(/usuário/i), 'admin');
    await user.type(screen.getByLabelText(/senha/i), 'password123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'admin',
        password: 'password123',
      });
    });
  });

  it('deve exibir estado de loading durante login', async () => {
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
      isLoading: true,
      error: null,
      user: null,
      isAuthenticated: false,
    });

    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: /carregando/i });
    expect(submitButton).toBeDisabled();
  });

  it('deve permitir alternar visibilidade da senha', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const passwordInput = screen.getByLabelText(/senha/i) as HTMLInputElement;
    expect(passwordInput.type).toBe('password');
    
    const toggleButton = screen.getByRole('button', { name: '' }); // Botão sem nome acessível
    await user.click(toggleButton);
    
    expect(passwordInput.type).toBe('text');
  });

  it('deve exibir mensagem de erro quando login falhar', async () => {
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
      isLoading: false,
      error: 'Credenciais inválidas',
      user: null,
      isAuthenticated: false,
    });

    renderLogin();
    
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('deve chamar showToast ao clicar em "Esqueci minha senha"', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const forgotPasswordLink = screen.getByText(/esqueci minha senha/i);
    await user.click(forgotPasswordLink);
    
    expect(mockShowToast).toHaveBeenCalledWith(
      'info',
      'Funcionalidade Ilustrativa',
      expect.any(String),
      5000
    );
  });
});
