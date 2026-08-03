/**
 * Contrato público de dimensiones de los wrappers React.
 *
 * Verifica que el contenedor del runtime siempre pueda ocupar el 100% de la
 * caja del host y que `className`/`style` sean aditivos, no sustitutivos.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const usePdfmeRuntimeInstance = vi.hoisted(() => vi.fn(() => ({ instanceRef: { current: null } })));

vi.mock('@/sisad-pdfme/runtime/usePdfmeRuntimeInstance', () => ({
  usePdfmeRuntimeInstance,
}));

vi.mock('@/sisad-pdfme/ui/Designer.js', () => ({ default: class FakeDesigner {} }));

import {
  SISAD_PDFME_HOST_SURFACE_CLASS,
  mergeHostSurfaceClassName,
} from '@/sisad-pdfme/react/hostSurface';
import { SisadPdfmeDesigner } from '@/sisad-pdfme/react/SisadPdfmeDesigner';
import { SisadPdfmeForm } from '@/sisad-pdfme/react/SisadPdfmeForm';
import { SisadPdfmeViewer } from '@/sisad-pdfme/react/SisadPdfmeViewer';

const template = { schemas: [[]] };

describe('contrato de dimensiones del host', () => {
  it('declara alto, ancho y min-* sin imponer viewport', () => {
    expect(SISAD_PDFME_HOST_SURFACE_CLASS.split(' ')).toEqual([
      'h-full',
      'min-h-0',
      'w-full',
      'min-w-0',
      'overflow-hidden',
    ]);
    // El host es dueño del viewport: el wrapper nunca lo hardcodea.
    expect(SISAD_PDFME_HOST_SURFACE_CLASS).not.toMatch(/vh|vw|fixed|max-w-/);
  });

  it('suma las clases del host en lugar de reemplazar el contrato', () => {
    expect(mergeHostSurfaceClassName('rounded-xl')).toBe(
      `${SISAD_PDFME_HOST_SURFACE_CLASS} rounded-xl`,
    );
    expect(mergeHostSurfaceClassName()).toBe(SISAD_PDFME_HOST_SURFACE_CLASS);
  });

  it.each([
    ['designer', () => <SisadPdfmeDesigner template={template} />],
    ['form', () => <SisadPdfmeForm template={template} values={[]} />],
    ['viewer', () => <SisadPdfmeViewer template={template} />],
  ])('aplica el contrato base al contenedor de %s', (mode, renderElement) => {
    const { container } = render(renderElement());
    const host = container.querySelector(`[data-sisad-pdfme-root="${mode}"]`);

    expect(host).not.toBeNull();
    expect(host?.className).toBe(SISAD_PDFME_HOST_SURFACE_CLASS);

    if (mode === 'designer') {
      expect(usePdfmeRuntimeInstance).toHaveBeenCalled();
      expect(usePdfmeRuntimeInstance.mock.calls.at(-1)?.[0]).toMatchObject({
        autoFit: 'none',
        mode: 'designer',
      });
    }
  });

  it('acepta className y style del host de forma aditiva', () => {
    const { container } = render(
      <SisadPdfmeViewer template={template} className="rounded-2xl" style={{ background: 'black' }} />,
    );
    const host = container.querySelector('[data-sisad-pdfme-root="viewer"]') as HTMLElement;

    expect(host.className).toBe(`${SISAD_PDFME_HOST_SURFACE_CLASS} rounded-2xl`);
    expect(host.style.background).toBe('black');
  });
});
