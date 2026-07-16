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
  beforeEach(() => {
    usePdfmeRuntimeInstance.mockClear();
  });

  const template = { schemas: [[]] };

  it('forces form mode in SisadPdfmeForm', () => {
    render(<SisadPdfmeForm template={template} values={[]} />);

    expect(usePdfmeRuntimeInstance).toHaveBeenCalled();
    expect(usePdfmeRuntimeInstance.mock.calls.at(-1)?.[0]?.mode).toBe('form');
  });

  it('forces viewer mode in SisadPdfmeViewer', () => {
    render(<SisadPdfmeViewer template={template} />);

    expect(usePdfmeRuntimeInstance).toHaveBeenCalled();
    expect(usePdfmeRuntimeInstance.mock.calls.at(-1)?.[0]?.mode).toBe('viewer');
  });

  it('forwards input changes and global view into the Form runtime', () => {
    const onInputChange = vi.fn();

    render(
      <SisadPdfmeForm
        template={template}
        values={[]}
        config={{ collaboration: { isGlobalView: true } } as any}
        onInputChange={onInputChange}
      />,
    );

    expect(usePdfmeRuntimeInstance).toHaveBeenCalled();
    const configArg = usePdfmeRuntimeInstance.mock.calls.at(-1)?.[0];
    expect(configArg?.onInputChange).toBe(onInputChange);
    expect(configArg?.options?.collaboration?.isGlobalView).toBe(true);
  });

  it('keeps the Viewer in global view when the config asks for it', () => {
    render(<SisadPdfmeViewer template={template} config={{ collaboration: { isGlobalView: true } } as any} />);

    expect(usePdfmeRuntimeInstance).toHaveBeenCalled();
    expect(usePdfmeRuntimeInstance.mock.calls.at(-1)?.[0]?.options?.collaboration?.isGlobalView).toBe(true);
  });
});
