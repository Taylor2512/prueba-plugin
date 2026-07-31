/**
 * COREUX-014 — Tooltip controlada.
 *
 * Criterios: los controles de chrome tienen tooltip propia, los nombres
 * truncados muestran el contenido completo y no hay tooltip duplicada.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DesignerTooltip } from '@/sisad-pdfme/ui/components/shared/DesignerTooltip';

const setup = (props: Partial<React.ComponentProps<typeof DesignerTooltip>> = {}) =>
  render(
    <DesignerTooltip label="Deshacer" delay={0} {...props}>
      <button type="button">↶</button>
    </DesignerTooltip>,
  );

describe('no hay tooltip duplicada', () => {
  it('elimina el title nativo del disparador', () => {
    render(
      <DesignerTooltip label="Deshacer" delay={0}>
        <button type="button" title="Deshacer">
          ↶
        </button>
      </DesignerTooltip>,
    );

    expect(screen.getByRole('button')).not.toHaveAttribute('title');
  });

  it('renderiza una sola tooltip a la vez', async () => {
    const user = userEvent.setup();
    setup();

    await user.hover(screen.getByRole('button'));
    await user.hover(screen.getByRole('button'));

    expect(screen.getAllByTestId('designer-tooltip')).toHaveLength(1);
  });
});

describe('hover y teclado', () => {
  it('aparece al pasar el ratón y desaparece al salir', async () => {
    const user = userEvent.setup();
    setup();
    const button = screen.getByRole('button');

    expect(screen.queryByTestId('designer-tooltip')).toBeNull();

    await user.hover(button);
    expect(screen.getByTestId('designer-tooltip')).toHaveTextContent('Deshacer');

    await user.unhover(button);
    expect(screen.queryByTestId('designer-tooltip')).toBeNull();
  });

  it('aparece con foco de teclado', async () => {
    const user = userEvent.setup();
    setup({ delay: 1000 });

    await user.tab();

    // Con foco se muestra de inmediato aunque el retardo sea alto.
    expect(screen.getByTestId('designer-tooltip')).toBeInTheDocument();
  });

  it('Escape la cierra', async () => {
    const user = userEvent.setup();
    setup();

    await user.tab();
    expect(screen.getByTestId('designer-tooltip')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByTestId('designer-tooltip')).toBeNull();
  });
});

describe('accesibilidad', () => {
  it('describe el disparador solo mientras está visible', async () => {
    const user = userEvent.setup();
    setup();
    const button = screen.getByRole('button');

    expect(button).not.toHaveAttribute('aria-describedby');

    await user.hover(button);
    const tooltip = screen.getByRole('tooltip');
    expect(button.getAttribute('aria-describedby')).toBe(tooltip.id);
  });

  it('usa role tooltip', async () => {
    const user = userEvent.setup();
    setup();

    await user.hover(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});

describe('contenido', () => {
  it('muestra el nombre completo de un texto truncado', async () => {
    const user = userEvent.setup();
    const full = 'Nombre de campo extremadamente largo que la UI trunca';
    render(
      <DesignerTooltip label={full} delay={0}>
        <span className="truncate">Nombre de campo extrema…</span>
      </DesignerTooltip>,
    );

    await user.hover(screen.getByText('Nombre de campo extrema…'));
    expect(screen.getByTestId('designer-tooltip')).toHaveTextContent(full);
  });

  it('sin label no envuelve ni renderiza tooltip', () => {
    render(
      <DesignerTooltip label="   " delay={0}>
        <button type="button">solo</button>
      </DesignerTooltip>,
    );

    expect(screen.queryByTestId('designer-tooltip')).toBeNull();
    expect(screen.queryByTestId('designer-tooltip-anchor')).toBeNull();
  });

  it('acepta control externo', () => {
    setup({ open: true });
    expect(screen.getByTestId('designer-tooltip')).toBeInTheDocument();
  });
});

describe('handlers del hijo', () => {
  it('preserva los handlers originales', async () => {
    const user = userEvent.setup();
    const onMouseEnter = vi.fn();
    const onFocus = vi.fn();

    render(
      <DesignerTooltip label="Ajustar" delay={0}>
        <button type="button" onMouseEnter={onMouseEnter} onFocus={onFocus}>
          fit
        </button>
      </DesignerTooltip>,
    );

    await user.hover(screen.getByRole('button'));
    expect(onMouseEnter).toHaveBeenCalledTimes(1);

    await user.tab();
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('coloca la tooltip según placement', async () => {
    const user = userEvent.setup();
    setup({ placement: 'bottom' });

    await user.hover(screen.getByRole('button'));
    expect(screen.getByTestId('designer-tooltip')).toHaveAttribute('data-placement', 'bottom');
  });
});
