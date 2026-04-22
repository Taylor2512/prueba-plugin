import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import InlineEditOverlay, { type InlineEditSession } from '../../src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.js';

describe('InlineEditOverlay', () => {
  const baseSession: InlineEditSession = {
    schemaId: 'schema-1',
    target: 'content',
    value: 'Texto inicial',
    rect: { top: 24, left: 24, width: 120, height: 32 },
  };

  it('commits with Enter and exposes a clear placeholder for content edits', () => {
    const onCommit = vi.fn();
    const onCancel = vi.fn();

    render(
      <InlineEditOverlay
        session={baseSession}
        canvasSize={{ width: 800, height: 600 }}
        onCommit={onCommit}
        onCancel={onCancel}
      />,
    );

    const input = screen.getByPlaceholderText('Escribe el contenido');
    expect(input).toBeVisible();

    fireEvent.change(input, { target: { value: 'Texto nuevo' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onCommit).toHaveBeenCalledWith('Texto nuevo');
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('cancels with Escape for name edits', () => {
    const onCommit = vi.fn();
    const onCancel = vi.fn();

    render(
      <InlineEditOverlay
        session={{ ...baseSession, target: 'name', value: 'campo-1' }}
        canvasSize={{ width: 800, height: 600 }}
        onCommit={onCommit}
        onCancel={onCancel}
      />,
    );

    const input = screen.getByPlaceholderText('Nombre del campo');
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onCommit).not.toHaveBeenCalled();
  });
});
