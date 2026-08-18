import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import InlineEditOverlay from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay';
import SchemaDropCommitFlash from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash';
import CommentDialog from '@sisad-pdfme/ui/components/Designer/Comments/CommentDialog';
import { PairEditor } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsShared';
import Paper from '@sisad-pdfme/ui/components/Paper';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('React state-model session boundaries', () => {
  it('preserva el draft inline durante la sesión y lo reinicia al cambiar de target', () => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    const onCommit = vi.fn();
    const baseSession = {
      schemaId: 'schema-a',
      target: 'content' as const,
      value: 'Texto A',
      rect: { top: 0, left: 0, width: 40, height: 10 },
    };
    const view = render(
      <InlineEditOverlay
        session={baseSession}
        canvasSize={{ width: 800, height: 600 }}
        onCommit={onCommit}
        onCancel={vi.fn()}
      />,
    );

    const input = view.getByPlaceholderText('Escribe el contenido');
    fireEvent.change(input, { target: { value: 'Draft rápido' } });
    expect(input).toHaveValue('Draft rápido');

    view.rerender(
      <InlineEditOverlay
        session={{ ...baseSession, value: 'Prop sin cambio de identidad' }}
        canvasSize={{ width: 800, height: 600 }}
        onCommit={onCommit}
        onCancel={vi.fn()}
      />,
    );
    expect(view.getByPlaceholderText('Escribe el contenido')).toHaveValue('Draft rápido');

    view.rerender(
      <InlineEditOverlay
        session={{ ...baseSession, target: 'name', value: 'Nombre B' }}
        canvasSize={{ width: 800, height: 600 }}
        onCommit={onCommit}
        onCancel={vi.fn()}
      />,
    );
    expect(view.getByPlaceholderText('Nombre del campo')).toHaveValue('Nombre B');
  });

  it('crea un draft de comentario nuevo al cerrar, reabrir o cambiar el comentario', () => {
    const props = { onClose: vi.fn(), onSave: vi.fn() };
    const view = render(<CommentDialog open initialText="Comentario A" {...props} />);
    const textarea = view.getByPlaceholderText('Escribe un comentario...');
    fireEvent.change(textarea, { target: { value: 'Draft A' } });
    expect(textarea).toHaveValue('Draft A');

    view.rerender(<CommentDialog open initialText="Comentario B" {...props} />);
    expect(view.getByPlaceholderText('Escribe un comentario...')).toHaveValue('Comentario B');

    view.rerender(<CommentDialog open={false} initialText="Comentario B" {...props} />);
    view.rerender(<CommentDialog open initialText="Comentario A" {...props} />);
    expect(view.getByPlaceholderText('Escribe un comentario...')).toHaveValue('Comentario A');
  });

  it('conserva ediciones locales de pares y reinicia sólo ante valores externos distintos', () => {
    const onChange = vi.fn();
    const view = render(
      <PairEditor
        title="Headers"
        values={{ token: 'uno' }}
        onChange={onChange}
        placeholderKey="Clave"
        placeholderValue="Valor"
      />,
    );
    const valueInput = view.getByDisplayValue('uno');
    fireEvent.change(valueInput, { target: { value: 'draft' } });

    view.rerender(
      <PairEditor
        title="Headers"
        values={{ token: 'uno' }}
        onChange={onChange}
        placeholderKey="Clave"
        placeholderValue="Valor"
      />,
    );
    expect(view.getByDisplayValue('draft')).toBeInTheDocument();

    view.rerender(
      <PairEditor
        title="Headers"
        values={{ token: 'dos' }}
        onChange={onChange}
        placeholderKey="Clave"
        placeholderValue="Valor"
      />,
    );
    expect(view.getByDisplayValue('dos')).toBeInTheDocument();
  });

  it('reinicia el lifecycle del flash por commit sin setters síncronos de effect', () => {
    vi.useFakeTimers();
    let enterFrame: FrameRequestCallback | null = null;
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      enterFrame = callback;
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const view = render(
      <SchemaDropCommitFlash paperRect={{ left: 10, top: 20 }} xMm={1} yMm={2} zoom={1} />,
    );
    const flash = view.container.firstElementChild;
    expect(flash).toHaveClass('opacity-0');
    act(() => enterFrame?.(0));
    expect(flash).toHaveClass('opacity-100');
    act(() => vi.advanceTimersByTime(110));
    expect(flash).toHaveClass('opacity-0');

    view.rerender(
      <SchemaDropCommitFlash paperRect={{ left: 11, top: 20 }} xMm={1} yMm={2} zoom={1} />,
    );
    expect(view.container.firstElementChild).toHaveClass('opacity-0');
  });

  it('mantiene el último layout estable de Paper durante un vacío transitorio', () => {
    const props = {
      scale: 1,
      size: { width: 100, height: 200 },
      schemasList: [[]],
      backgrounds: [],
      renderPaper: () => null,
      renderSchema: () => null,
      registerPaperRef: vi.fn(),
    };
    const view = render(
      <Paper {...props} pageSizes={[{ width: 100, height: 200 }]} />,
    );
    expect(view.container.querySelector('[data-paper-page="true"]')).toBeInTheDocument();

    view.rerender(<Paper {...props} pageSizes={[]} schemasList={[]} />);
    expect(view.container.querySelector('[data-paper-page="true"]')).toBeInTheDocument();

    view.rerender(
      <Paper {...props} pageSizes={[{ width: 120, height: 220 }]} />,
    );
    const width = Number.parseFloat(
      view.container.querySelector<HTMLElement>('[data-paper-root="true"]')?.style.width || '0',
    );
    expect(width).toBeCloseTo(453.543307092);
  });
});
