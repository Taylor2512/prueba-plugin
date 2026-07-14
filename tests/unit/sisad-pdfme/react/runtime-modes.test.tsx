import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const usePdfmeRuntimeInstance = vi.hoisted(() => vi.fn());

vi.mock('@/sisad-pdfme/runtime/usePdfmeRuntimeInstance', () => ({
  usePdfmeRuntimeInstance,
}));

import { SisadPdfmeForm } from '@/sisad-pdfme/react/SisadPdfmeForm';
import { SisadPdfmeViewer } from '@/sisad-pdfme/react/SisadPdfmeViewer';

describe('SisadPdfme runtime wrappers', () => {
  it('forces form mode in SisadPdfmeForm', () => {
    render(<SisadPdfmeForm template={{}} values={[]} />);

    expect(usePdfmeRuntimeInstance).toHaveBeenCalled();
    expect(usePdfmeRuntimeInstance.mock.calls.at(-1)?.[0]?.mode).toBe('form');
  });

  it('forces viewer mode in SisadPdfmeViewer', () => {
    render(<SisadPdfmeViewer template={{}} />);

    expect(usePdfmeRuntimeInstance).toHaveBeenCalled();
    expect(usePdfmeRuntimeInstance.mock.calls.at(-1)?.[0]?.mode).toBe('viewer');
  });
});
