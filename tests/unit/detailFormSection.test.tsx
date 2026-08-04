import React from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DetailFormSection from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailFormSection.js';

/** Instancias de formulario creadas por las secciones montadas. */
const createdForms: Array<{ setValues: ReturnType<typeof vi.fn>; validateFields: ReturnType<typeof vi.fn> }> = [];

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
  useForm: () => {
    const form = React.useMemo(
      () => ({ setValues: vi.fn(), validateFields: vi.fn(() => Promise.resolve()) }),
      [],
    );
    React.useEffect(() => {
      createdForms.push(form);
    }, [form]);
    return form;
  },
}));

describe('DetailFormSection', () => {
  beforeEach(() => {
    createdForms.length = 0;
  });

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
        hydrationValues={{ name: 'campo_1' }}
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
        hydrationValues={{ name: 'campo_1' }}
        widgets={{ AlignWidget: () => <div data-testid="align-widget">align-widget</div> }}
        watchHandler={vi.fn()}
        defaultCollapsed={true}
        resetToken="schema-2:box"
      />,
    );

    expect(screen.queryByTestId('align-widget')).not.toBeInTheDocument();
  });

  test('cada sección monta su propio formulario y lo hidrata', () => {
    // Compartir una instancia de `useForm` entre secciones dejaba a todas menos
    // una con `value === undefined`: los switches nacían apagados.
    renderSection();

    expect(createdForms).toHaveLength(1);
    expect(createdForms[0].setValues).toHaveBeenCalledWith({ name: 'campo_1' });
  });

  test('no emite el watch mientras hidrata', () => {
    const watchHandler = vi.fn();
    renderSection({ watchHandler });

    expect(watchHandler).not.toHaveBeenCalled();
  });
});
