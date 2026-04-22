import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DetailHeaderCard from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.js';

describe('DetailHeaderCard', () => {
  it('renders schema identity, config tags and collaboration chips in a single header surface', () => {
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

    expect(screen.getByText('Campo principal')).toBeVisible();
    expect(screen.getByText('text')).toBeVisible();
    expect(screen.getByText('Guardar')).toBeVisible();
    expect(screen.getByText('Requerido')).toBeVisible();
    expect(screen.getByText('UID: schema-uid-1')).toBeVisible();
    expect(screen.getByText('Creado por: creator-1')).toBeVisible();
    expect(screen.getByText('Modificado por: modifier-1')).toBeVisible();
    expect(screen.getByText('Owner: user-1')).toBeVisible();
    expect(screen.getByText('+5 más')).toBeVisible();
  });
});
