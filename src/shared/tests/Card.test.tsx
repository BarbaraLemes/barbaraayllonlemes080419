import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../components/ui/Card';

describe('Card', () => {
  it('deve renderizar children corretamente', () => {
    render(
      <Card>
        <p>Conteúdo do card</p>
      </Card>
    );
    
    expect(screen.getByText('Conteúdo do card')).toBeInTheDocument();
  });

  it('deve aplicar variante default por padrão', () => {
    const { container } = render(<Card>Conteúdo</Card>);
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('rounded-lg', 'bg-white', 'shadow-md');
  });

  it('deve aplicar variante elevated corretamente', () => {
    const { container } = render(<Card variant="elevated">Conteúdo</Card>);
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-md');
  });

  it('deve aplicar variante flat sem sombra', () => {
    const { container } = render(<Card variant="flat">Conteúdo</Card>);
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('border-none', 'shadow-none');
  });

  it('deve aplicar padding small', () => {
    const { container } = render(<Card padding="sm">Conteúdo</Card>);
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('p-3');
  });

  it('deve aplicar padding large', () => {
    const { container } = render(<Card padding="lg">Conteúdo</Card>);
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('p-6');
  });

  it('deve aplicar padding none sem padding', () => {
    const { container } = render(<Card padding="none">Conteúdo</Card>);
    
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toMatch(/p-\d/);
  });

  it('deve adicionar hover quando hover é true', () => {
    const { container } = render(<Card hover>Conteúdo</Card>);
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('cursor-pointer');
  });

  it('deve renderizar como elemento customizado', () => {
    const { container } = render(<Card as="section">Conteúdo</Card>);
    
    const card = container.firstChild as HTMLElement;
    expect(card.tagName).toBe('SECTION');
  });

  it('deve aplicar className customizada', () => {
    const { container } = render(<Card className="custom-class">Conteúdo</Card>);
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
  });

  it('deve permitir data attributes', () => {
    const { container } = render(
      <Card data-testid="card-test" data-custom="value">
        Conteúdo
      </Card>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveAttribute('data-testid', 'card-test');
    expect(card).toHaveAttribute('data-custom', 'value');
  });

  it('deve renderizar múltiplos children', () => {
    render(
      <Card>
        <h2>Título</h2>
        <p>Parágrafo</p>
        <button>Ação</button>
      </Card>
    );
    
    expect(screen.getByRole('heading', { name: 'Título' })).toBeInTheDocument();
    expect(screen.getByText('Parágrafo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ação' })).toBeInTheDocument();
  });
});
