import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Template } from '@sisad-pdfme/common';

vi.mock('../../src/sisad-pdfme/ui/components/Renderer.js', () => ({
  default: ({ schema }: { schema: { id: string } }) => (
    <div data-testid="mock-renderer" data-schema-id={schema.id} />
  ),
}));

import StaticSchema from '../../src/sisad-pdfme/ui/components/StaticSchema.js';

describe('StaticSchema', () => {
  it('keeps static schema ids stable across rerenders', () => {
    const template: Template = {
      basePdf: {
        width: 210,
        height: 297,
        padding: [0, 0, 0, 0],
        staticSchema: [
          {
            name: 'static-field',
            type: 'text',
            content: 'hello',
            position: { x: 10, y: 10 },
            width: 20,
            height: 10,
          },
        ],
      },
      schemas: [[]],
    };

    const { rerender } = render(
      <StaticSchema template={template} input={{}} scale={1} totalPages={1} currentPage={1} />,
    );

    const firstId = screen.getByTestId('mock-renderer').getAttribute('data-schema-id');
    expect(firstId).toBe('static-schema-0-static-field');

    rerender(<StaticSchema template={template} input={{}} scale={1} totalPages={1} currentPage={1} />);

    const secondId = screen.getByTestId('mock-renderer').getAttribute('data-schema-id');
    expect(secondId).toBe(firstId);
  });
});
