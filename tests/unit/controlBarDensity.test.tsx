import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CtlBar from '@/sisad-pdfme/ui/components/CtlBar.js';

const baseProps = {
  size: { width: 1280, height: 720 },
  pageCursor: 0,
  pageNum: 2,
  setPageCursor: vi.fn(),
  zoomLevel: 1,
  setZoomLevel: vi.fn(),
  onUndo: vi.fn(),
  onRedo: vi.fn(),
  onSave: vi.fn(),
  onFitWidth: vi.fn(),
  onFitPage: vi.fn(),
  onOpenShortcuts: vi.fn(),
};

describe('CtlBar density', () => {
  test('uses compact density when width is between 900 and 1199', () => {
    const { container } = render(<CtlBar {...baseProps} size={{ width: 980, height: 700 }} />);
    const bar = container.querySelector('.sisad-pdfme-ui-control-bar');
    expect(bar).toHaveAttribute('data-density', 'compact');
    expect(container.querySelector('.sisad-pdfme-ui-control-bar-cluster--top-center')).toBeInTheDocument();
    expect(container.querySelector('.sisad-pdfme-ui-control-bar-cluster--top-right')).toBeInTheDocument();
    expect(container.querySelector('.sisad-pdfme-ui-control-bar-cluster--bottom-right')).toBeInTheDocument();
  });

  test('keeps save button visible in minimal density', () => {
    render(<CtlBar {...baseProps} size={{ width: 760, height: 700 }} />);
    const save = screen.getByTitle('Guardar');
    expect(save).toBeInTheDocument();
  });

  test('keeps zoom stepper controls visible in compact density', () => {
    render(<CtlBar {...baseProps} size={{ width: 760, height: 700 }} />);
    expect(screen.getByTestId('designer-zoom-out')).toBeInTheDocument();
    expect(screen.getByTestId('designer-zoom-in')).toBeInTheDocument();
  });
});
