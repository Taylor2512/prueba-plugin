import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';

let capturedModalProps: Record<string, unknown> | null = null;

vi.mock('antd', () => {
  const Modal = ({ children, ...props }: { children?: React.ReactNode }) => {
    capturedModalProps = props;
    return React.createElement('div', { 'data-testid': 'mock-modal' }, children);
  };

  const Input = ({ allowClear: _allowClear, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { allowClear?: boolean }) =>
    React.createElement('input', { ...props, 'data-testid': props['data-testid'] || 'mock-input' });

  const Radio = Object.assign(
    ({ children, ...props }: { children?: React.ReactNode }) =>
      React.createElement('label', props, children),
    {
      Group: ({ children }: { children?: React.ReactNode }) =>
        React.createElement('div', { 'data-testid': 'mock-radio-group' }, children),
    },
  );

  return { Modal, Input, Radio };
});

import SchemaAssignmentDialog from '@/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SchemaAssignmentDialog';

const makeSchema = (overrides: Partial<SchemaForUI> & { id: string }): SchemaForUI =>
  ({
    id: overrides.id,
    name: overrides.id,
    type: 'text',
    position: { x: 0, y: 0 },
    width: 10,
    height: 10,
    ...overrides,
  }) as unknown as SchemaForUI;

describe('SchemaAssignmentDialog', () => {
  it('marks the dialog as an interaction exclusion and resets on close', () => {
    capturedModalProps = null;
    const onAfterClose = vi.fn();

    render(
      <SchemaAssignmentDialog
        open
        selectedSchemas={[makeSchema({ id: 'schema-1' })]}
        recipients={[{ id: 'recipient-1', name: 'Cliente Principal' }]}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        onAfterClose={onAfterClose}
      />,
    );

    expect(screen.getByTestId('schema-assignment-dialog')).toBeInTheDocument();
    expect(capturedModalProps).toMatchObject({
      rootClassName: 'sisad-pdfme-schema-assignment-dialog',
    });

    const rendered = (capturedModalProps?.modalRender as ((node: React.ReactNode) => React.ReactNode) | undefined)?.(
      React.createElement('div', { 'data-testid': 'inner-modal-node' }),
    ) as React.ReactElement | undefined;
    expect(rendered?.props['data-designer-modal']).toBe('true');
    expect(rendered?.props['data-interaction-exclusion']).toBe('true');

    (capturedModalProps?.afterOpenChange as ((visible: boolean) => void) | undefined)?.(false);
    expect(onAfterClose).toHaveBeenCalledTimes(1);
  });
});
