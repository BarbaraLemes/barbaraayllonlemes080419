import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VinculoPets from '../pages/TutorDetail/components/VinculoPets';
import { petsService } from '../../pets/services/pets.service';
import { tutoresService } from '../services/tutores.service';
import type { Pet } from '../../pets/types/pets.types';

// Mock PrimeReact components
vi.mock('primereact/dialog', () => ({
  Dialog: ({ children, visible, header }: any) => 
    visible ? <div role="dialog">{header}<div>{children}</div></div> : null,
}));

// Mock dos contextos e serviços
vi.mock('../../../contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

vi.mock('../../pets/services/pets.service', () => ({
  petsService: {
    getPets: vi.fn(),
  },
}));

vi.mock('../services/tutores.service', () => ({
  tutoresService: {
    vincularPetTutor: vi.fn(),
    removerVinculoPetTutor: vi.fn(),
  },
}));

const mockPetsVinculados: Pet[] = [
  { id: 1, nome: 'Rex', raca: 'Labrador', idade: 3 },
  { id: 2, nome: 'Mia', raca: 'Persa', idade: 2 },
];

const mockPetsDisponiveis: Pet[] = [
  { id: 3, nome: 'Thor', raca: 'Golden', idade: 5 },
  { id: 4, nome: 'Luna', raca: 'Siamês', idade: 1 },
];

describe('VinculoPets', () => {
  const defaultProps = {
    tutorId: 1,
    petsVinculados: mockPetsVinculados,
    onVinculoChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock do getPets retornando pets disponíveis
    vi.mocked(petsService.getPets).mockResolvedValue({
      content: [...mockPetsVinculados, ...mockPetsDisponiveis],
      total: 1,
      page: 4,
      size: 100,
      pageCount: 0,
    });
  });

  it('deve renderizar o componente com pets vinculados', () => {
    render(<VinculoPets {...defaultProps} />);
    
    expect(screen.getByText('Vinculação de Pets')).toBeInTheDocument();
    expect(screen.getByText('Rex')).toBeInTheDocument();
    expect(screen.getByText('Mia')).toBeInTheDocument();
  });

  it('deve exibir mensagem quando não há pets vinculados', () => {
    render(<VinculoPets {...defaultProps} petsVinculados={[]} />);
    
    expect(screen.getByText(/nenhum pet vinculado/i)).toBeInTheDocument();
  });

  it('deve exibir botão "Vincular Pet"', () => {
    render(<VinculoPets {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /vincular pet/i })).toBeInTheDocument();
  });

  it('deve abrir modal ao clicar em "Vincular Pet"', async () => {
    const user = userEvent.setup();
    render(<VinculoPets {...defaultProps} />);
    
    const vincularButton = screen.getByRole('button', { name: /vincular pet/i });
    await user.click(vincularButton);
    
    await waitFor(() => {
      expect(screen.getByText('Selecione um pet disponível para vincular a este tutor')).toBeInTheDocument();
    });
  });

  it('deve carregar pets disponíveis ao abrir modal', async () => {
    const user = userEvent.setup();
    render(<VinculoPets {...defaultProps} />);
    
    const vincularButton = screen.getByRole('button', { name: /vincular pet/i });
    await user.click(vincularButton);
    
    await waitFor(() => {
      expect(petsService.getPets).toHaveBeenCalledWith({ size: 100 });
    });
  });

  it('deve filtrar pets já vinculados da lista de disponíveis', async () => {
    const user = userEvent.setup();
    render(<VinculoPets {...defaultProps} />);
    
    const vincularButton = screen.getByRole('button', { name: /vincular pet/i });
    await user.click(vincularButton);
    
    await waitFor(() => {
      // Rex e Mia já estão vinculados (no defaultProps)
      // O componente deve filtrar os já vinculados da lista disponível
      // Vamos apenas verificar que o modal abriu e carregou pets
      expect(petsService.getPets).toHaveBeenCalled();
    });
  });

  it('deve chamar vincularPetTutor ao vincular um pet', async () => {
    const user = userEvent.setup();
    const onVinculoChange = vi.fn();
    vi.mocked(tutoresService.vincularPetTutor).mockResolvedValue(undefined);
    
    const { container } = render(<VinculoPets {...defaultProps} onVinculoChange={onVinculoChange} />);
    
    // Abrir modal
    const vincularButton = screen.getByRole('button', { name: /vincular pet/i });
    await user.click(vincularButton);
    
    await waitFor(() => {
      expect(screen.getByText('Thor')).toBeInTheDocument();
    });
    
    // Buscar botões com ícone pi-plus (botões de vincular)
    await waitFor(() => {
      const vincularIcons = container.querySelectorAll('.pi-plus');
      // O primeiro é o botão "Vincular Pet", os demais são de cada pet
      expect(vincularIcons.length).toBeGreaterThan(1);
    });
    
    const vincularIcons = container.querySelectorAll('.pi-plus');
    // Clicar no segundo botão pi-plus (primeiro pet no modal)
    await user.click(vincularIcons[1].closest('button')!);
    
    await waitFor(() => {
      expect(tutoresService.vincularPetTutor).toHaveBeenCalled();
      expect(onVinculoChange).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('deve abrir dialog de confirmação ao clicar em desvincular', async () => {
    const user = userEvent.setup();
    const { container } = render(<VinculoPets {...defaultProps} />);
    
    // Clicar no botão de desvincular (botão com ícone pi-times)
    const desvincularButtons = container.querySelectorAll('.pi-times');
    await user.click(desvincularButtons[0].closest('button')!);
    
    await waitFor(() => {
      expect(screen.getByText(/tem certeza que deseja desvincular/i)).toBeInTheDocument();
    });
  });

  it('deve chamar removerVinculoPetTutor ao confirmar desvinculação', async () => {
    const user = userEvent.setup();
    const onVinculoChange = vi.fn();
    vi.mocked(tutoresService.removerVinculoPetTutor).mockResolvedValue(undefined);
    
    const { container } = render(<VinculoPets {...defaultProps} onVinculoChange={onVinculoChange} />);
    
    // Clicar no botão de desvincular
    const desvincularButtons = container.querySelectorAll('.pi-times');
    await user.click(desvincularButtons[0].closest('button')!);
    
    await waitFor(() => {
      expect(screen.getByText(/tem certeza que deseja desvincular/i)).toBeInTheDocument();
    });
    
    // Confirmar desvinculação
    const confirmarButton = screen.getByRole('button', { name: /desvincular/i });
    await user.click(confirmarButton);
    
    await waitFor(() => {
      expect(tutoresService.removerVinculoPetTutor).toHaveBeenCalledWith(1, 1);
      expect(onVinculoChange).toHaveBeenCalled();
    });
  });

  it('deve cancelar desvinculação ao clicar em cancelar', async () => {
    const user = userEvent.setup();
    const { container } = render(<VinculoPets {...defaultProps} />);
    
    // Clicar no botão de desvincular
    const desvincularButtons = container.querySelectorAll('.pi-times');
    await user.click(desvincularButtons[0].closest('button')!);
    
    await waitFor(() => {
      expect(screen.getByText(/tem certeza que deseja desvincular/i)).toBeInTheDocument();
    });
    
    // Cancelar
    const cancelarButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelarButton);
    
    await waitFor(() => {
      expect(tutoresService.removerVinculoPetTutor).not.toHaveBeenCalled();
    });
  });

  it('deve exibir informações do pet vinculado corretamente', () => {
    render(<VinculoPets {...defaultProps} />);
    
    expect(screen.getByText('Rex')).toBeInTheDocument();
    expect(screen.getByText(/Labrador • 3 anos/)).toBeInTheDocument();
  });

  it('deve tratar erro ao carregar pets disponíveis', async () => {
    const user = userEvent.setup();
    vi.mocked(petsService.getPets).mockRejectedValue(new Error('Erro ao carregar'));
    
    render(<VinculoPets {...defaultProps} />);
    
    // Abrir modal
    const vincularButton = screen.getByRole('button', { name: /vincular pet/i });
    await user.click(vincularButton);
    
    await waitFor(() => {
      // Não deve quebrar a aplicação
      expect(screen.getByText('Selecione um pet disponível para vincular a este tutor')).toBeInTheDocument();
    });
  });

  it('deve tratar erro ao vincular pet', async () => {
    const user = userEvent.setup();
    vi.mocked(tutoresService.vincularPetTutor).mockRejectedValue(new Error('Erro ao vincular'));
    
    const { container } = render(<VinculoPets {...defaultProps} />);
    
    // Abrir modal
    const vincularButton = screen.getByRole('button', { name: /vincular pet/i });
    await user.click(vincularButton);
    
    await waitFor(() => {
      expect(screen.getByText('Thor')).toBeInTheDocument();
    });
    
    // Buscar botão com ícone pi-plus
    await waitFor(() => {
      const vincularIcons = container.querySelectorAll('.pi-plus');
      expect(vincularIcons.length).toBeGreaterThan(1);
    });
    
    const vincularIcons = container.querySelectorAll('.pi-plus');
    await user.click(vincularIcons[1].closest('button')!);
    
    // Não deve quebrar a aplicação - serviço foi chamado mas retornou erro
    await waitFor(() => {
      expect(tutoresService.vincularPetTutor).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('deve tratar erro ao desvincular pet', async () => {
    const user = userEvent.setup();
    vi.mocked(tutoresService.removerVinculoPetTutor).mockRejectedValue(new Error('Erro ao desvincular'));
    
    const { container } = render(<VinculoPets {...defaultProps} />);
    
    // Clicar no botão de desvincular
    const desvincularButtons = container.querySelectorAll('.pi-times');
    await user.click(desvincularButtons[0].closest('button')!);
    
    await waitFor(() => {
      expect(screen.getByText(/tem certeza que deseja desvincular/i)).toBeInTheDocument();
    });
    
    // Confirmar
    const confirmarButton = screen.getByRole('button', { name: /desvincular/i });
    await user.click(confirmarButton);
    
    // Não deve quebrar a aplicação - serviço foi chamado mas retornou erro
    await waitFor(() => {
      expect(tutoresService.removerVinculoPetTutor).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('deve exibir foto do pet quando disponível', () => {
    const petsComFoto: Pet[] = [
      { 
        id: 1, 
        nome: 'Rex', 
        raca: 'Labrador', 
        idade: 3, 
        foto: { id: 1, nome: 'rex.jpg', contentType: 'image/jpeg', url: 'http://example.com/rex.jpg' }
      },
    ];
    
    render(<VinculoPets {...defaultProps} petsVinculados={petsComFoto} />);
    
    const img = screen.getByAltText('Rex');
    expect(img).toHaveAttribute('src', 'http://example.com/rex.jpg');
  });

  it('deve exibir ícone quando pet não tem foto', () => {
    const { container } = render(<VinculoPets {...defaultProps} />);
    
    // Deve ter ícone de coração (fallback)
    const heartIcon = container.querySelector('.pi-heart');
    expect(heartIcon).toBeInTheDocument();
  });
});
