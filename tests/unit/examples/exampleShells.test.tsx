/**
 * Contrato de los shells del módulo de ejemplos.
 *
 * Cubre lo que la matriz de aceptación exige y jsdom sí puede comprobar:
 * clases de dimensión, drawer que no consume espacio cerrado y ausencia de
 * remount del runtime al abrir/cerrar información.
 */
import React, { useEffect, useRef } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/sisad-pdfme/react', () => ({
  SisadPdfmeDesigner: () => null,
  SisadPdfmeForm: () => null,
  SisadPdfmeViewer: () => null,
}));

vi.mock('@/sisad-pdfme', () => ({
  SisadPdfmeInstance: () => null,
  defineSisadPdfmeInstance: (value: unknown) => value,
  SisadPdfmeDesigner: () => null,
  SisadPdfmeForm: () => null,
  SisadPdfmeViewer: () => null,
}));

vi.mock('@/sisad-pdfme/react/hostSurface', () => ({
  SISAD_PDFME_HOST_SURFACE_CLASS: 'h-full min-h-0 w-full min-w-0 overflow-hidden',
}));

import { ExampleImmersiveShell, RuntimeViewport } from '@/examples/index.jsx';
import { EXAMPLE_ROUTE_PATHS } from '@/examples/routes/routeDefinitions.js';

function renderShell(children: React.ReactNode) {
  return render(
    <MemoryRouter>
      <ExampleImmersiveShell
        title="Designer · prueba"
        modeBadge="designer"
        currentPath={EXAMPLE_ROUTE_PATHS.designerSingleUser}
        actions={<div data-testid="example-actions" />}
        infoTitle="Resumen"
        info={<div data-testid="info-body">métricas</div>}
      >
        {children}
      </ExampleImmersiveShell>
    </MemoryRouter>,
  );
}

describe('ExampleImmersiveShell', () => {
  it('usa el viewport completo con filas auto/1fr y sin scroll de página', () => {
    const { container } = renderShell(<div>runtime</div>);
    const shell = container.querySelector('[data-example-shell="immersive"]') as HTMLElement;

    expect(shell.className).toContain('h-dvh');
    expect(shell.className).toContain('min-h-0');
    expect(shell.className).toContain('grid-rows-[auto_minmax(0,1fr)]');
    expect(shell.className).toContain('overflow-hidden');
    // Ninguna altura arbitraria en vh: el alto restante lo da el grid.
    expect(shell.className).not.toMatch(/h-\[\d+vh\]/);
  });

  it('deja el main como caja de alto restante', () => {
    const { container } = renderShell(<div>runtime</div>);
    const main = container.querySelector('[data-example-main]') as HTMLElement;

    expect(main.className).toContain('min-h-0');
    expect(main.className).toContain('min-w-0');
    expect(main.className).toContain('overflow-hidden');
  });

  it('mantiene la topbar compacta y sin controles del runtime', () => {
    renderShell(<div>runtime</div>);
    const topbar = screen.getByTestId('example-topbar');

    expect(topbar.className).toContain('h-12');
    ['Guardar', 'Zoom', 'Página'].forEach((label) => {
      expect(screen.queryByRole('button', { name: label })).toBeNull();
    });
  });

  it('no renderiza el drawer cerrado y por tanto no consume espacio', () => {
    renderShell(<div>runtime</div>);

    expect(screen.queryByTestId('example-info-panel')).toBeNull();
    expect(screen.queryByTestId('info-body')).toBeNull();
    expect(screen.getByTestId('example-info-toggle')).toHaveAttribute('aria-expanded', 'false');
  });

  it('abre y cierra la información sin remontar el runtime', async () => {
    const user = userEvent.setup();
    const onMount = vi.fn();

    function FakeRuntime() {
      const mounted = useRef(false);
      useEffect(() => {
        if (mounted.current) return;
        mounted.current = true;
        onMount();
      }, []);
      return <div data-testid="fake-runtime" />;
    }

    renderShell(
      <RuntimeViewport name="test">
        <FakeRuntime />
      </RuntimeViewport>,
    );

    expect(onMount).toHaveBeenCalledTimes(1);

    await act(async () => {
      await user.click(screen.getByTestId('example-info-toggle'));
    });
    expect(screen.getByTestId('example-info-panel')).toBeInTheDocument();
    expect(screen.getByTestId('info-body')).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    });
    expect(screen.queryByTestId('example-info-panel')).toBeNull();

    // El runtime nunca se desmontó: el drawer es una superposición, no una columna.
    expect(onMount).toHaveBeenCalledTimes(1);
  });

  it('cierra el drawer con Escape', async () => {
    const user = userEvent.setup();
    renderShell(<div>runtime</div>);

    await act(async () => {
      await user.click(screen.getByTestId('example-info-toggle'));
    });
    expect(screen.getByTestId('example-info-panel')).toBeInTheDocument();

    // El listener de Escape es nativo sobre `document`, fuera del sistema de
    // eventos de React: hay que envolverlo en act para no ensuciar la salida.
    await act(async () => {
      await user.keyboard('{Escape}');
    });
    expect(screen.queryByTestId('example-info-panel')).toBeNull();
  });
});

describe('RuntimeViewport', () => {
  it('entrega la caja completa sin superficies visuales extra', () => {
    render(
      <RuntimeViewport name="designer-single-user">
        <div>runtime</div>
      </RuntimeViewport>,
    );
    const viewport = screen.getByTestId('example-runtime-viewport');

    expect(viewport.className).toBe('h-full min-h-0 w-full min-w-0 overflow-hidden');
    expect(viewport).toHaveAttribute('data-example-runtime-viewport', 'designer-single-user');
  });
});
