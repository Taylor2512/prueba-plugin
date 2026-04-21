import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { resolveRightSidebarContextHeader } from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/contextHeader.js';

describe('RightSidebar contextHeader', () => {
  it('returns the provided static node unchanged', () => {
    const header = resolveRightSidebarContextHeader(
      <div data-testid="context-header-static">Cabecera estática</div>,
      { mode: 'list', activeCount: 0 },
    );

    render(<>{header}</>);

    expect(screen.getByTestId('context-header-static')).toBeVisible();
    expect(resolveRightSidebarContextHeader(undefined, { mode: 'list', activeCount: 0 })).toBeNull();
  });

  it('preserves valid falsy React nodes', () => {
    expect(resolveRightSidebarContextHeader(0, { mode: 'bulk', activeCount: 2 })).toBe(0);
  });

  it('invokes function-based context headers with the current panel mode and active count', function () {
    const header = resolveRightSidebarContextHeader(
      function (ctx) {
        const { mode, activeCount } = ctx;
        return (
          <div data-testid="context-header-function">
            Modo {mode} / Activos {activeCount}
          </div>
        );
      },
      { mode: 'bulk', activeCount: 2 },
    );

    render(<>{header}</>);

    expect(screen.getByTestId('context-header-function')).toHaveTextContent('Modo bulk / Activos 2');
  });
});
