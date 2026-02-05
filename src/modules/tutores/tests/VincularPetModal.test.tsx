import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VincularPetModal from '../pages/TutorDetail/components/VincularPetModal';
import type { Pet } from '../../pets/types/pets.types';

// Mock PrimeReact components
vi.mock('primereact/dialog', () => ({
  Dialog: ({ children, visible, header }: any) => 
    visible ? <div role="dialog">{header}<div>{children}</div></div> : null,
}));

vi.mock('primereact/paginator', () => ({
  Paginator: ({ totalRecords, rows }: any) => 
    totalRecords > rows ? <nav>Paginator</nav> : null,
}));

const mockPets: Pet[] = [
  { id: 1, nome: 'Rex', raca: 'Labrador', idade: 3 },
  { id: 2, nome: 'Mia', raca: 'Persa', idade: 2 },
  { id: 3, nome: 'Thor', raca: 'Golden', idade: 5 },
  { id: 4, nome: 'Luna', raca: 'Siamês', idade: 1 },
  { id: 5, nome: 'Max', raca: 'Bulldog', idade: 4 },
  { id: 6, nome: 'Bella', raca: 'Poodle', idade: 2 },
  { id: 7, nome: 'Duke', raca: 'Pastor Alemão', idade: 6 },
  { id: 8, nome: 'Lola', raca: 'Beagle', idade: 3 },
  { id: 9, nome: 'Zeus', raca: 'Rottweiler', idade: 7 },
  { id: 10, nome: 'Daisy', raca: 'Shih Tzu', idade: 2 },
  { id: 11, nome: 'Rocky', raca: 'Boxer', idade: 4 },
  { id: 12, nome: 'Chloe', raca: 'Maine Coon', idade: 3 },
];

describe('VincularPetModal', () => {
  const defaultProps = {
    visible: true,
    onHide: vi.fn(),
    petsDisponiveis: mockPets,
    isLoading: false,
    onVincular: vi.fn(),
  };

  it('deve renderizar o modal quando visible é true', () => {
    render(<VincularPetModal {...defaultProps} />);
    
    expect(screen.getByText('Vincular Pet')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/buscar por nome ou raça/i)).toBeInTheDocument();
  });

  it('não deve renderizar quando visible é false', () => {
    render(<VincularPetModal {...defaultProps} visible={false} />);
    
    expect(screen.queryByText('Vincular Pet')).not.toBeInTheDocument();
  });

  it('deve exibir spinner quando isLoading é true', () => {
    render(<VincularPetModal {...defaultProps} isLoading={true} />);
    
    const spinner = screen.getByRole('dialog').querySelector('.pi-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('deve exibir mensagem quando não há pets disponíveis', () => {
    render(<VincularPetModal {...defaultProps} petsDisponiveis={[]} />);
    
    expect(screen.getByText(/nenhum pet disponível/i)).toBeInTheDocument();
  });

  it('deve exibir os pets disponíveis', () => {
    render(<VincularPetModal {...defaultProps} />);
    
    expect(screen.getByText('Rex')).toBeInTheDocument();
    expect(screen.getByText('Mia')).toBeInTheDocument();
  });

  it('deve filtrar pets por nome', async () => {
    const user = userEvent.setup();
    render(<VincularPetModal {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText(/buscar por nome ou raça/i);
    await user.type(searchInput, 'Rex');
    
    await waitFor(() => {
      expect(screen.getByText('Rex')).toBeInTheDocument();
      expect(screen.queryByText('Mia')).not.toBeInTheDocument();
    });
  });

  it('deve filtrar pets por raça', async () => {
    const user = userEvent.setup();
    render(<VincularPetModal {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText(/buscar por nome ou raça/i);
    await user.type(searchInput, 'Labrador');
    
    await waitFor(() => {
      expect(screen.getByText('Rex')).toBeInTheDocument();
      expect(screen.queryByText('Mia')).not.toBeInTheDocument();
    });
  });

  it('deve ser case-insensitive na busca', async () => {
    const user = userEvent.setup();
    render(<VincularPetModal {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText(/buscar por nome ou raça/i);
    await user.type(searchInput, 'REX');
    
    await waitFor(() => {
      expect(screen.getByText('Rex')).toBeInTheDocument();
    });
  });

  it('deve exibir apenas 10 pets por página', () => {
    render(<VincularPetModal {...defaultProps} />);
    
    // Deve mostrar os primeiros 10
    expect(screen.getByText('Rex')).toBeInTheDocument();
    expect(screen.getByText('Daisy')).toBeInTheDocument();
    // Não deve mostrar o 11º
    expect(screen.queryByText('Rocky')).not.toBeInTheDocument();
  });

  it('deve chamar onVincular quando clicar em um pet', async () => {
    const user = userEvent.setup();
    const onVincular = vi.fn();
    const { container } = render(<VincularPetModal {...defaultProps} onVincular={onVincular} />);
    
    // Buscar botão com ícone pi-plus (botão de vincular)
    const vincularButtons = container.querySelectorAll('.pi-plus');
    await user.click(vincularButtons[0].closest('button')!);
    
    expect(onVincular).toHaveBeenCalledWith(1);
  });

  it('deve resetar busca e página quando o modal abre', () => {
    const { rerender } = render(<VincularPetModal {...defaultProps} visible={false} />);
    
    // Abrir modal
    rerender(<VincularPetModal {...defaultProps} visible={true} />);
    
    const searchInput = screen.getByPlaceholderText(/buscar por nome ou raça/i) as HTMLInputElement;
    expect(searchInput.value).toBe('');
  });

  it('deve exibir paginator quando há mais de 10 pets', () => {
    render(<VincularPetModal {...defaultProps} />);
    
    // PrimeReact Paginator deve estar presente (mockado como nav)
    expect(screen.getByText('Paginator')).toBeInTheDocument();
  });

  it('deve resetar para primeira página quando a busca muda', async () => {
    const user = userEvent.setup();
    render(<VincularPetModal {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText(/buscar por nome ou raça/i);
    
    // Mudar busca deve resetar paginação
    await user.type(searchInput, 'a');
    await user.clear(searchInput);
    await user.type(searchInput, 'Rex');
    
    // Deve mostrar Rex (que está na primeira página)
    await waitFor(() => {
      expect(screen.getByText('Rex')).toBeInTheDocument();
    });
  });

  it('deve exibir informações do pet corretamente', () => {
    render(<VincularPetModal {...defaultProps} />);
    
    expect(screen.getByText('Rex')).toBeInTheDocument();
    expect(screen.getByText(/Labrador/)).toBeInTheDocument();
    // Usar getAllByText pois pode haver múltiplos pets com mesma idade
    const idadeElements = screen.getAllByText(/3 anos/);
    expect(idadeElements.length).toBeGreaterThan(0);
  });
});
