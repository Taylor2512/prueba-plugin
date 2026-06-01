import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DetailFormSection from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailFormSection.js';

vi.mock('form-render', () => ({
  default: (props: { schema: { properties?: Record<string, { widget?: string }> }; widgets: Record<string, () => React.JSX.Element> }) => {
    const properties = props.schema.properties || {};
    return (
      <div data-testid="mock-form-render">
        {Object.entries(properties).map(([fieldKey, fieldSchema]) => {
          const Widget = fieldSchema.widget ? props.widgets[fieldSchema.widget] : undefined;
          return Widget ? <Widget key={fieldKey} /> : <div key={fieldKey}>missing-widget:{fieldKey}</div>;
        })}
      </div>
    );
  },
}));

describe('DetailFormSection', () => {
  const renderSection = (props?: Partial<React.ComponentProps<typeof DetailFormSection>>) =>
    render(
      <DetailFormSection
        sectionKey="box"
        title="Caja"
        description="Posición y tamaño"
        schema={{
          type: 'object',
          properties: {
            align: {
              type: 'void',
              widget: 'AlignWidget',
            },
          },
        }}
        form={{} as never}
        widgets={{
          AlignWidget: () => <div data-testid="align-widget">align-widget</div>,
        }}
        watchHandler={vi.fn()}
        defaultCollapsed={false}
        resetToken="schema-1:box"
        {...props}
      />,
    );

  test('renders title, description and configured widgets', () => {
    renderSection();

    expect(screen.getByText('Caja')).toBeInTheDocument();
    expect(screen.getByText('Posición y tamaño')).toBeInTheDocument();
    expect(screen.getByTestId('align-widget')).toBeInTheDocument();
  });

  test('respects defaultCollapsed and keeps accessible toggle semantics', async () => {
    const user = userEvent.setup();
    renderSection({ defaultCollapsed: true });

    const toggle = screen.getByRole('button', { name: /Expandir sección Caja/i });
    expect(toggle).toBeInTheDocument();
    expect(screen.queryByTestId('align-widget')).not.toBeInTheDocument();

    await user.click(toggle);
    expect(screen.getByTestId('align-widget')).toBeInTheDocument();
  });

  test('resetToken remounts section and restores collapsed state', async () => {
    const user = userEvent.setup();
    const { rerender } = renderSection({ defaultCollapsed: true, resetToken: 'schema-1:box' });

    const toggle = screen.getByRole('button', { name: /Expandir sección Caja/i });
    await user.click(toggle);
    expect(screen.getByTestId('align-widget')).toBeInTheDocument();

    rerender(
      <DetailFormSection
        sectionKey="box"
        title="Caja"
        description="Posición y tamaño"
        schema={{ type: 'object', properties: { align: { type: 'void', widget: 'AlignWidget' } } }}
        form={{} as never}
        widgets={{ AlignWidget: () => <div data-testid="align-widget">align-widget</div> }}
        watchHandler={vi.fn()}
        defaultCollapsed={true}
        resetToken="schema-2:box"
      />,
    );

    expect(screen.queryByTestId('align-widget')).not.toBeInTheDocument();
  });
});
