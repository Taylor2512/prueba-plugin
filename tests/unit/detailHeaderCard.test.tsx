import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DetailHeaderCard from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.js';

describe('DetailHeaderCard', () => {
  it('renders schema identity and primary state tags in a compact single-row header', () => {
    render(
      <DetailHeaderCard
        activeSchema={{
          id: 'schema-1',
          schemaUid: 'schema-uid-1',
          name: 'Campo principal',
          type: 'text',
          position: { x: 12, y: 24 },
          required: true,
          createdBy: 'creator-1',
          lastModifiedBy: 'modifier-1',
          ownerRecipientId: 'user-1',
          fileId: 'file-1',
          state: 'locked',
          ownerMode: 'shared',
          commentsCount: 3,
          commentAnchors: [{ id: 'anchor-1' }],
        } as never}
        schemaConfig={{
          persistence: { enabled: true },
          api: { enabled: false },
          form: { enabled: false },
          prefill: { enabled: false },
        } as never}
      />,
    );

    // Schema identity always visible
    expect(screen.getByText('Campo principal')).toBeVisible();
    expect(screen.getByText('text')).toBeVisible();

    // Primary state tags visible inline
    expect(screen.getByText('Requerido')).toBeVisible();
    expect(screen.getByText('Guardar')).toBeVisible();

    // Metadata (UID, owners, etc.) is NOT shown as standalone inline tags
    // to avoid visual overload – it lives in a tooltip on the overflow badge.
    expect(screen.queryByText('UID: schema-uid-1')).toBeNull();
    expect(screen.queryByText('Creado por: creator-1')).toBeNull();
  });

  it('shows overflow badge when more tags exist than the visible limit', () => {
    render(
      <DetailHeaderCard
        activeSchema={{
          id: 'schema-2',
          name: 'Campo saturado',
          type: 'text',
          position: { x: 0, y: 0 },
          // required + readOnly + hidden = 3 state tags; persistence adds a 4th
          // so MAX_VISIBLE=3 forces overflowCount=1 → badge reads "+1"
          required: true,
          readOnly: true,
          hidden: true,
        } as never}
        schemaConfig={{
          persistence: { enabled: true },
          api: { enabled: false },
          form: { enabled: false },
          prefill: { enabled: false },
        } as never}
      />,
    );

    expect(screen.getByText('Campo saturado')).toBeVisible();
    // The 4th state item (Guardar) overflows — badge shows "+1"
    expect(screen.getByText('+1')).toBeVisible();
  });

  it('renders the position indicator in the header row', () => {
    render(
      <DetailHeaderCard
        activeSchema={{
          id: 'schema-3',
          name: 'Pos test',
          type: 'text',
          position: { x: 5.5, y: 10.2 },
        } as never}
        schemaConfig={null}
      />,
    );

    expect(screen.getByText('5.5,10.2')).toBeVisible();
  });
});

