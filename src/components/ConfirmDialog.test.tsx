import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from './ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    visible: true,
    onHide: vi.fn(),
    onConfirm: vi.fn(),
    message: 'Deseja realmente continuar?',
  };

  it('deve renderizar quando visible é true', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    expect(screen.getByText('Deseja realmente continuar?')).toBeInTheDocument();
  });

  it('não deve renderizar quando visible é false', () => {
    render(<ConfirmDialog {...defaultProps} visible={false} />);
    
    expect(screen.queryByText('Deseja realmente continuar?')).not.toBeInTheDocument();
  });

  it('deve exibir título padrão "Confirmação"', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    expect(screen.getByText('Confirmação')).toBeInTheDocument();
  });

  it('deve exibir título customizado', () => {
    render(<ConfirmDialog {...defaultProps} title="Exclusão Permanente" />);
    
    expect(screen.getByText('Exclusão Permanente')).toBeInTheDocument();
  });

  it('deve exibir labels padrão dos botões', () => {
    render(<ConfirmDialog {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('deve exibir labels customizadas dos botões', () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmLabel="Sim, excluir"
        cancelLabel="Não, voltar"
      />
    );
    
    expect(screen.getByRole('button', { name: /sim, excluir/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /não, voltar/i })).toBeInTheDocument();
  });

  it('deve chamar onHide quando clicar em Cancelar', async () => {
    const user = userEvent.setup();
    
    render(<ConfirmDialog {...defaultProps} />);
    
    await user.click(screen.getByRole('button', { name: /cancelar/i }));
    
    expect(defaultProps.onHide).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onConfirm e onHide quando clicar em Confirmar', async () => {
    const user = userEvent.setup();
    const mockOnHide = vi.fn();
    const mockOnConfirm = vi.fn();
    
    render(
      <ConfirmDialog
        {...defaultProps}
        onHide={mockOnHide}
        onConfirm={mockOnConfirm}
      />
    );
    
    await user.click(screen.getByRole('button', { name: /confirmar/i }));
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnHide).toHaveBeenCalledTimes(1);
  });

  it('deve exibir mensagem customizada', () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        message="Esta ação não poderá ser desfeita. Tem certeza?"
      />
    );
    
    expect(screen.getByText(/esta ação não poderá ser desfeita/i)).toBeInTheDocument();
  });
});
