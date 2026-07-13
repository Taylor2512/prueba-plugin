import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewFooter';
import ListViewFooter from '@/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewFooter';

describe('sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewFooter.tsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });

  it('renders an accessible icon-only bulk entry button in idle mode', () => {
    render(React.createElement(ListViewFooter, {
      bulkMode: false,
      hasSchemas: true,
      onCommit: vi.fn(),
      onCancel: vi.fn(),
      onStartBulk: vi.fn(),
      labels: {
        bulkUpdateFieldName: 'Renombrar',
        commitBulkUpdateFieldName: 'Aplicar',
        cancel: 'Cancelar',
      },
    }));

    expect(screen.getByRole('button', { name: 'Renombrar' })).toBeInTheDocument();
  });
});
