import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OptionsContext } from '@/sisad-pdfme/ui/contexts';
import RightSidebar from '@/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar';

vi.mock('@/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView', () => ({
  default: (props: { activeSchemaIds?: string[] }) => (
    <div data-testid="list-view" data-active-schema-ids={(props.activeSchemaIds || []).join(',')} />
  ),
}));

vi.mock('@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView', () => ({
  default: () => <div data-testid="detail-view" />,
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

describe('RightSidebar visibility', () => {
  it('hides the comments tab when visibility.sidebars.right.panels.comments is false', () => {
    render(
      <OptionsContext.Provider
        value={{
          visibility: {
            sidebars: {
              right: {
                visible: true,
                tabs: true,
                contextHeader: false,
                collapseButton: false,
                panels: {
                  fields: true,
                  detail: true,
                  comments: false,
                  documents: false,
                },
              },
            },
          },
        } as any}
      >
        <RightSidebar
          height={300}
          hoveringSchemaId={null}
          onChangeHoveringSchemaId={() => undefined}
          size={{ width: 800, height: 600 }}
          pageSize={{ width: 800, height: 600 }}
          basePdf={basePdf}
          activeElements={[]}
          schemas={[]}
          schemasList={[]}
          onSortEnd={() => undefined}
          onEdit={() => undefined}
          onEditEnd={() => undefined}
          changeSchemas={() => undefined}
          deselectSchema={() => undefined}
          sidebarOpen
          setSidebarOpen={() => undefined}
          comments={{ items: [] }}
        />
      </OptionsContext.Provider>,
    );

    expect(screen.queryByRole('tab', { name: /comentarios/i })).toBeNull();
  });

  it('forwards canvas selection ids into the list view header wiring', () => {
    const activeElement = document.createElement('div');
    activeElement.id = 'schema-dom-id';
    activeElement.setAttribute('data-schema-id', 'schema-1');

    render(
      <OptionsContext.Provider
        value={{
          visibility: {
            sidebars: {
              right: {
                visible: true,
                tabs: true,
                contextHeader: false,
                collapseButton: false,
                panels: {
                  fields: true,
                  detail: true,
                  comments: false,
                  documents: false,
                },
              },
            },
          },
        } as any}
      >
        <RightSidebar
          height={300}
          hoveringSchemaId={null}
          onChangeHoveringSchemaId={() => undefined}
          size={{ width: 800, height: 600 }}
          pageSize={{ width: 800, height: 600 }}
          basePdf={basePdf}
          activeElements={[activeElement]}
          schemas={[[{ id: 'schema-1', type: 'text', name: 'field-1', content: '', position: { x: 0, y: 0 }, width: 10, height: 10 } as any]]}
          schemasList={[[{ id: 'schema-1', type: 'text', name: 'field-1', content: '', position: { x: 0, y: 0 }, width: 10, height: 10 } as any]]}
          onSortEnd={() => undefined}
          onEdit={() => undefined}
          onEditEnd={() => undefined}
          changeSchemas={() => undefined}
          deselectSchema={() => undefined}
          sidebarOpen
          setSidebarOpen={() => undefined}
          comments={{ items: [] }}
          viewMode="fields"
        />
      </OptionsContext.Provider>,
    );

    expect(screen.getByTestId('list-view')).toHaveAttribute('data-active-schema-ids', 'schema-1');
  });
});
