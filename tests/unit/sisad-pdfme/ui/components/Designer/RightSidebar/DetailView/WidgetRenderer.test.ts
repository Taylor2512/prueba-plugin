import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import * as moduleUnderTest from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/WidgetRenderer';

describe('sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/WidgetRenderer.tsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });

  it('does not remount the imperative widget when relevant props stay stable', () => {
    const widget = vi.fn(({ rootElement }: { rootElement: HTMLDivElement }) => {
      rootElement.textContent = 'mounted';
    });

    const { rerender } = render(
      React.createElement(moduleUnderTest.default, {
        widget,
        value: 'draw',
        readOnly: false,
        disabled: false,
        hidden: false,
        activeSchema: { id: 'schema-1', type: 'signature' },
      } as never),
    );

    rerender(
      React.createElement(moduleUnderTest.default, {
        widget,
        value: 'draw',
        readOnly: false,
        disabled: false,
        hidden: false,
        activeSchema: { id: 'schema-1', type: 'signature' },
      } as never),
    );

    expect(widget).toHaveBeenCalledTimes(1);
  });
});
