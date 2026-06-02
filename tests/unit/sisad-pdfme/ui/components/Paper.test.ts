import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as moduleUnderTest from '@/sisad-pdfme/ui/components/Paper';

describe('sisad-pdfme/ui/components/Paper.tsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });

  it('keeps rendering when backgrounds lag behind pageSizes during transient rerenders', () => {
    const Paper = moduleUnderTest.default;

    const { container } = render(
      React.createElement(Paper, {
        scale: 1,
        size: { width: 1200, height: 1600 },
        schemasList: [[]],
        pageSizes: [{ width: 210, height: 297 }],
        backgrounds: [],
        renderPaper: () => null,
        renderSchema: () => null,
        registerPaperRef: () => undefined,
      }),
    );

    expect(container.querySelector('[data-paper-root="true"]')).toBeInTheDocument();
    expect(document.querySelectorAll('[data-paper-page="true"]').length).toBe(1);
  });
});
