/**
 * Regresión: el log de eventos no puede tumbar la aplicación.
 *
 * Los callbacks del wrapper entregan objetos (`{ recipient }`, `{ recipients }`).
 * Renderizarlos como hijo de React lanza «Objects are not valid as a React
 * child» y deja `#root` vacío: cambiar el recipient activo dejaba la ruta en
 * blanco. El log debe normalizar cualquier payload a texto.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/sisad-pdfme/react', () => ({
  SisadPdfmeDesigner: () => null,
  SisadPdfmeForm: () => null,
  SisadPdfmeViewer: () => null,
}));

import { ExampleEventLog } from '@/examples/index.jsx';

const baseEvent = { id: '1', name: 'onActiveRecipientChange', at: '10:00:00' };

describe('ExampleEventLog', () => {
  it('renderiza un payload de objeto sin romper el árbol', () => {
    const events = [{ ...baseEvent, detail: { recipient: { id: 'bob', name: 'Bob' } } }];

    expect(() => render(<ExampleEventLog events={events} onClear={() => {}} />)).not.toThrow();
    expect(screen.getByText('onActiveRecipientChange')).toBeInTheDocument();
    expect(screen.getByText('recipient: Bob')).toBeInTheDocument();
  });

  it('resume arrays por longitud en lugar de volcarlos', () => {
    const events = [{ ...baseEvent, id: '2', detail: { recipients: [1, 2, 3] } }];

    render(<ExampleEventLog events={events} onClear={() => {}} />);
    expect(screen.getByText('recipients: 3')).toBeInTheDocument();
  });

  it('acepta strings y valores vacíos', () => {
    const events = [
      { ...baseEvent, id: '3', detail: 'texto plano' },
      { ...baseEvent, id: '4', name: 'onSave', detail: undefined },
    ];

    render(<ExampleEventLog events={events} onClear={() => {}} />);
    expect(screen.getByText('texto plano')).toBeInTheDocument();
    expect(screen.getByText('onSave')).toBeInTheDocument();
  });
});
