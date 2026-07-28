import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RightSidebar from '@/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar';

vi.mock('@/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView', () => ({
  default: () => <div data-testid="list-view" />,
}));

vi.mock('@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView', () => ({
  default: (props: { activeSchema?: { id?: string } }) => (
    <div data-testid="detail-view" data-schema-id={props.activeSchema?.id || ''} />
  ),
}));

vi.mock('@/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail', () => ({
  default: () => <div data-testid="documents-rail" />,
}));

vi.mock('@/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail', () => ({
  default: () => <div data-testid="comments-rail" />,
}));

vi.mock('@/sisad-pdfme/ui/components/Designer/RightSidebar/layout', () => ({
  SidebarFrame: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarRail', () => ({
  SidebarRail: () => <div data-testid="sidebar-rail" />,
}));

vi.mock('@/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarCollapseHandle', () => ({
  SidebarCollapseHandle: () => <button type="button">collapse</button>,
}));

const basePdf = { type: 'blank', padding: [0, 0, 0, 0] } as any;

const buildSchema = (id: string) =>
  ({
    id,
    name: id,
    type: 'text',
    position: { x: 0, y: 0 },
    width: 45,
    height: 10,
    content: '',
  }) as any;

const buildElement = (id: string) => {
  const element = document.createElement('div');
  element.dataset.schemaId = id;
  return element;
};

/**
 * Host equivalente al Designer real: refleja `onViewModeChange` en su propio
 * estado y lo devuelve como `viewMode` controlado.
 */
const ControlledHost = ({ activeElements }: { activeElements: HTMLElement[] }) => {
  const [viewMode, setViewMode] = useState<'auto' | 'fields' | 'detail' | 'docs' | 'comments'>('auto');
  return (
    <RightSidebar
      height={300}
      hoveringSchemaId={null}
      onChangeHoveringSchemaId={() => undefined}
      size={{ width: 800, height: 600 }}
      pageSize={{ width: 800, height: 600 }}
      basePdf={basePdf}
      activeElements={activeElements}
      schemas={[buildSchema('schema-a'), buildSchema('schema-b')]}
      schemasList={[[buildSchema('schema-a'), buildSchema('schema-b')]]}
      onSortEnd={() => undefined}
      onEdit={() => undefined}
      onEditEnd={() => undefined}
      changeSchemas={() => undefined}
      deselectSchema={() => undefined}
      sidebarOpen
      setSidebarOpen={() => undefined}
      documents={{ items: [{ id: 'doc-1', name: 'Doc 1' }] } as any}
      autoFocusDetail
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    />
  );
};

const panelMode = () =>
  document.querySelector('[data-panel-mode]')?.getAttribute('data-panel-mode');

describe('RightSidebar auto focus detail', () => {
  it('abre el panel de detalle al seleccionar un schema aunque el host controle viewMode', () => {
    const { rerender } = render(<ControlledHost activeElements={[]} />);
    expect(panelMode()).toBe('list');

    rerender(<ControlledHost activeElements={[buildElement('schema-a')]} />);
    expect(panelMode()).toBe('detail');
    expect(screen.getByTestId('detail-view').getAttribute('data-schema-id')).toBe('schema-a');
  });

  it('vuelve a enfocar detalle tras haber cambiado manualmente de pestaña', () => {
    const { rerender } = render(<ControlledHost activeElements={[buildElement('schema-a')]} />);
    expect(panelMode()).toBe('detail');

    fireEvent.click(screen.getByLabelText('Abrir panel Docs'));
    expect(panelMode()).toBe('docs');

    rerender(<ControlledHost activeElements={[buildElement('schema-b')]} />);
    expect(panelMode()).toBe('detail');
    expect(screen.getByTestId('detail-view').getAttribute('data-schema-id')).toBe('schema-b');
  });

  it('respeta el cambio manual de pestaña mientras la selección no cambia', () => {
    render(<ControlledHost activeElements={[buildElement('schema-a')]} />);
    expect(panelMode()).toBe('detail');

    fireEvent.click(screen.getByLabelText('Abrir panel Campos'));
    expect(panelMode()).toBe('list');
  });

  it('sale de detalle cuando se pierde la selección', () => {
    const { rerender } = render(<ControlledHost activeElements={[buildElement('schema-a')]} />);
    expect(panelMode()).toBe('detail');

    rerender(<ControlledHost activeElements={[]} />);
    expect(panelMode()).toBe('list');
  });
});
