import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('deve renderizar com texto correto', () => {
    render(<Button>Clique Aqui</Button>);
    
    expect(screen.getByRole('button', { name: /clique aqui/i })).toBeInTheDocument();
  });

  it('deve aplicar variante primary por padrão', () => {
    render(<Button>Botão</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-slate-800');
  });

  it('deve aplicar variante danger corretamente', () => {
    render(<Button variant="danger">Excluir</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
  });

  it('deve exibir ícone à esquerda quando iconPos é left', () => {
    render(<Button icon="pi-trash" iconPos="left">Excluir</Button>);
    
    const icon = screen.getByRole('button').querySelector('.pi-trash');
    expect(icon).toBeInTheDocument();
  });

  it('deve exibir ícone à direita quando iconPos é right', () => {
    render(<Button icon="pi-arrow-right" iconPos="right">Próximo</Button>);
    
    const icon = screen.getByRole('button').querySelector('.pi-arrow-right');
    expect(icon).toBeInTheDocument();
  });

  it('deve chamar onClick quando clicado', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Clique</Button>);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('deve estar desabilitado quando disabled é true', () => {
    render(<Button disabled>Desabilitado</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('deve mostrar loading quando isLoading é true', () => {
    render(<Button isLoading>Salvar</Button>);
    
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('deve exibir texto customizado de loading', () => {
    render(<Button isLoading loadingText="Processando...">Enviar</Button>);
    
    expect(screen.getByText(/processando/i)).toBeInTheDocument();
  });

  it('não deve chamar onClick quando desabilitado', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button disabled onClick={handleClick}>Clique</Button>);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('deve aplicar className customizada', () => {
    render(<Button className="custom-class">Botão</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('deve renderizar com tamanho small', () => {
    render(<Button size="sm">Pequeno</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-8', 'px-3', 'text-sm');
  });

  it('deve renderizar com tamanho large', () => {
    render(<Button size="lg">Grande</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-12', 'px-6');
  });
});
