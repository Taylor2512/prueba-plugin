import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

const surfacePropsSpy = vi.hoisted(() => vi.fn());

vi.mock('@/sisad-pdfme/react/index.js', () => ({
  SisadPdfmeDesigner: (props: Record<string, unknown>) => {
    surfacePropsSpy(props);
    return null;
  },
  SisadPdfmeForm: (props: Record<string, unknown>) => {
    surfacePropsSpy(props);
    return null;
  },
  SisadPdfmeViewer: (props: Record<string, unknown>) => {
    surfacePropsSpy(props);
    return null;
  },
}));

vi.mock('@/sisad-pdfme/ui/index.js', () => ({
  Designer: () => null,
  Form: () => null,
  Viewer: () => null,
  PdfEditor: () => null,
  PdfEditorEngineBuilder: class PdfEditorEngineBuilder {},
  PdfFormView: () => null,
  PdfViewer: () => null,
  RuntimeFormPanel: () => null,
  createDesignerRuntimeEventHub: () => ({}),
}));

import {
  SisadPdfmeInstance,
  createSisadPdfmeInstanceBundle,
  defineSisadPdfmeInstance,
  parseSisadPdfmeInstanceBundle,
  serializeSisadPdfmeInstanceBundle,
} from '@/sisad-pdfme';

describe('public root consumer', () => {
  beforeEach(() => {
    surfacePropsSpy.mockClear();
  });

  it('monta una instancia registrada desde el barrel raíz', () => {
    const instance = defineSisadPdfmeInstance({
      id: 'contract-form',
      definition: {
        mode: 'form',
        defaultState: {
          inputs: [{ name: 'initial' }],
        },
      },
    });

    render(<SisadPdfmeInstance instance={instance} />);

    const props = surfacePropsSpy.mock.calls.at(-1)?.[0];
    expect(props?.inputs).toEqual([{ name: 'initial' }]);
    expect(props?.onInputChange).toEqual(expect.any(Function));
  });

  it('serializa y restaura un bundle portable desde el barrel raíz', () => {
    const bundle = createSisadPdfmeInstanceBundle({
      definition: {
        mode: 'viewer',
      },
    });

    const serialized = serializeSisadPdfmeInstanceBundle(bundle);
    const parsed = parseSisadPdfmeInstanceBundle(serialized);

    expect(bundle.version).toBe(1);
    expect(bundle.valid).toBe(true);
    expect(parsed.valid).toBe(true);
    expect(parsed.bundle?.definition.mode).toBe('viewer');
  });
});
