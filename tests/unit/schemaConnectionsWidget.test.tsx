import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SchemaConnectionsWidget from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsWidget.js';

describe('SchemaConnectionsWidget', () => {
  const widgetShellProps = {
    rootElement: document.createElement('div'),
    activeElements: [] as HTMLElement[],
    changeSchemas: vi.fn(),
    schemas: [] as never[],
    options: {} as never,
    theme: {} as never,
    i18n: (key: string) => key,
    value: '',
    onChange: vi.fn(),
    schema: {} as never,
    style: {} as never,
    id: 'schema-connections-widget',
    addons: {} as never,
  };

  it('keeps advanced connection editors inside a modal while preserving quick toggles', () => {
    const updateSchemaConfig = vi.fn();

    render(
      <SchemaConnectionsWidget
        {...widgetShellProps}
        schemaConfig={{
          persistence: { enabled: true, mode: 'local', key: 'role' },
          form: { enabled: true, collect: true, format: 'nested', rootKey: 'formData' },
          api: { enabled: true, endpoint: '/api/fields/options', method: 'GET' },
        }}
        updateSchemaConfig={updateSchemaConfig}
        designerEngine={undefined}
        activeSchema={{ id: 'schema-1', name: 'role', type: 'text' } as never}
      />,
    );

    expect(screen.getByText('Conexiones y persistencia')).toBeVisible();
    expect(screen.getByText('Guardar datos')).toBeVisible();
    expect(screen.queryByText('Encabezados personalizados')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Configuración avanzada' }));
    const dialog = screen.getByRole('dialog', { name: 'Configurar conexiones y persistencia' });

    expect(within(dialog).getByText('Persistencia de datos')).toBeInTheDocument();
    expect(within(dialog).getByText('Salida de formulario JSON')).toBeInTheDocument();
    expect(within(dialog).getByText('Consulta API / Axios')).toBeInTheDocument();
  });

  it('updates quick toggles without opening advanced settings', () => {
    const updateSchemaConfig = vi.fn();

    render(
      <SchemaConnectionsWidget
        {...widgetShellProps}
        schemaConfig={{
          persistence: { enabled: false },
          form: { enabled: false },
          api: { enabled: false },
        }}
        updateSchemaConfig={updateSchemaConfig}
        designerEngine={undefined}
        activeSchema={{ id: 'schema-1', name: 'role', type: 'text' } as never}
      />,
    );

    fireEvent.click(screen.getAllByRole('switch')[0]);
    expect(updateSchemaConfig).toHaveBeenCalled();
  });
});
