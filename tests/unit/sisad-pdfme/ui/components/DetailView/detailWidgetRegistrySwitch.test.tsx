/**
 * INSPECTOR-001/002 — widget `switch` del registro del inspector.
 *
 * Cubre el contrato de form-render (`valuePropName: 'checked'` para switches) y
 * la resolución del `disabled` efectivo desde `SchemaAccessState`.
 */
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { PropPanelWidgetProps, SchemaForUI } from '@sisad-pdfme/common';
import buildDetailWidgets from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry';
import {
  resolveDesignerSchemaAccessState,
  type SchemaAccessState,
} from '@/sisad-pdfme/ui/components/Designer/shared/accessPolicy';

const activeSchema = {
  id: 's-1',
  name: 'campo',
  type: 'text',
  position: { x: 0, y: 0 },
  width: 45,
  height: 7,
} as SchemaForUI;

const buildSwitchWidget = (accessState?: SchemaAccessState) => {
  const widgets = buildDetailWidgets(() => ({
    pluginsRegistry: { values: () => [] },
    options: {} as never,
    token: {} as never,
    typedI18n: (key: string) => key,
    normalizeColorHex: () => '#000000',
    accessState,
    props: {
      size: { width: 100, height: 100 },
      schemas: [],
      schemasList: [],
      pageSize: { width: 210, height: 297 },
      basePdf: '',
      changeSchemas: vi.fn(),
      activeElements: [],
      deselectSchema: vi.fn(),
      activeSchema,
      updateSchemaConfig: vi.fn(),
    } as never,
  }));
  return widgets.switch;
};

const renderSwitch = (
  widgetProps: Partial<PropPanelWidgetProps>,
  accessState?: SchemaAccessState,
) => {
  const SwitchWidget = buildSwitchWidget(accessState);
  return render(
    <>{SwitchWidget({ id: 'required', schema: { title: 'Obligatorio' }, ...widgetProps } as PropPanelWidgetProps)}</>,
  );
};

describe('widget switch del inspector', () => {
  it('lee el valor desde `checked`, como lo entrega form-render', () => {
    // form-render declara `valuePropName: 'checked'` para switches: leer solo
    // `value` dejaba todos los switches apagados sin importar el schema.
    renderSwitch({ checked: true } as Partial<PropPanelWidgetProps>);

    expect(screen.getByTestId('inspector-required-switch').getAttribute('aria-checked')).toBe('true');
  });

  it('sigue aceptando `value` cuando el widget se usa fuera de form-render', () => {
    renderSwitch({ value: true });

    expect(screen.getByTestId('inspector-required-switch').getAttribute('aria-checked')).toBe('true');
  });

  it('deriva el data-testid del path del campo', () => {
    renderSwitch({ id: 'readOnly', checked: false } as Partial<PropPanelWidgetProps>);

    expect(screen.getByTestId('inspector-readonly-switch')).toBeTruthy();
  });

  it('emite un solo cambio por clic', () => {
    const onChange = vi.fn();
    renderSwitch({ checked: false, onChange } as Partial<PropPanelWidgetProps>);

    fireEvent.click(screen.getByTestId('inspector-required-switch'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('se deshabilita cuando el schema está bloqueado por otro usuario', () => {
    const onChange = vi.fn();
    const accessState = resolveDesignerSchemaAccessState(
      { ...activeSchema, lockedByActorId: 'alice' } as never,
      { collaborationContext: { isCollaborative: true, userId: 'bob', canEditStructure: true } } as never,
    );

    renderSwitch({ checked: false, onChange } as Partial<PropPanelWidgetProps>, accessState);
    const control = screen.getByTestId('inspector-required-switch');
    fireEvent.click(control);

    expect(control).toHaveProperty('disabled', true);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('permite editar cuando el schema es readOnly pero el diseñador tiene permiso', () => {
    const onChange = vi.fn();
    const accessState = resolveDesignerSchemaAccessState({ ...activeSchema, readOnly: true } as never, {});

    renderSwitch({ checked: true, onChange } as Partial<PropPanelWidgetProps>, accessState);
    fireEvent.click(screen.getByTestId('inspector-required-switch'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
