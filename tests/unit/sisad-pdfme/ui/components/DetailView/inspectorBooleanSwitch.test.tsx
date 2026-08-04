/**
 * INSPECTOR-001 — Primitive única de switch del inspector.
 *
 * Criterios: un clic produce exactamente un cambio, no hay estado local que
 * haga rebotar el valor, no se anidan controles interactivos y los atributos de
 * exclusión de Selecto/Moveable se conservan.
 */
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  InspectorBooleanSwitch,
  normalizeInspectorBoolean,
} from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorBooleanSwitch';
import { InspectorSwitch } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorSwitch';
import { BooleanSwitchWidget } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives';

describe('normalización de valores', () => {
  it('normaliza true, false, 1, 0 y strings', () => {
    expect(normalizeInspectorBoolean(true)).toBe(true);
    expect(normalizeInspectorBoolean(false)).toBe(false);
    expect(normalizeInspectorBoolean(1)).toBe(true);
    expect(normalizeInspectorBoolean(0)).toBe(false);
    expect(normalizeInspectorBoolean('true')).toBe(true);
    expect(normalizeInspectorBoolean('on')).toBe(true);
    expect(normalizeInspectorBoolean('1')).toBe(true);
    // El caso que rompe `Boolean(value)`: un string no vacío es truthy.
    expect(normalizeInspectorBoolean('false')).toBe(false);
    expect(normalizeInspectorBoolean('0')).toBe(false);
    expect(normalizeInspectorBoolean('')).toBe(false);
    expect(normalizeInspectorBoolean(undefined)).toBe(false);
    expect(normalizeInspectorBoolean(null)).toBe(false);
  });
});

describe('InspectorBooleanSwitch', () => {
  it('emite un solo cambio por clic', () => {
    const onChange = vi.fn();
    render(<InspectorBooleanSwitch checked={false} onChange={onChange} testId="s" />);

    fireEvent.click(screen.getByTestId('s'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('no contiene botones interactivos anidados', () => {
    const { container } = render(
      <InspectorBooleanSwitch checked={false} label="Obligatorio" onChange={vi.fn()} testId="s" />,
    );

    expect(container.querySelectorAll('button')).toHaveLength(1);
    expect(container.querySelector('button button')).toBeNull();
    expect(screen.getByRole('switch')).toBeTruthy();
  });

  it('es controlado: sin cambio de prop el valor no se queda pegado', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <InspectorBooleanSwitch checked={false} onChange={onChange} testId="s" />,
    );

    // El padre ignora el cambio (p. ej. persistencia rechazada): el switch debe
    // seguir reflejando la prop, no un estado local optimista.
    fireEvent.click(screen.getByTestId('s'));
    expect(screen.getByTestId('s').getAttribute('aria-checked')).toBe('false');

    rerender(<InspectorBooleanSwitch checked onChange={onChange} testId="s" />);
    expect(screen.getByTestId('s').getAttribute('aria-checked')).toBe('true');
  });

  it('no modifica cuando está deshabilitado por acceso', () => {
    const onChange = vi.fn();
    render(
      <InspectorBooleanSwitch
        checked={false}
        onChange={onChange}
        disabled
        disabledReason="Este campo está bloqueado por otro usuario."
        testId="s"
      />,
    );

    fireEvent.click(screen.getByTestId('s'));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByTestId('s')).toHaveProperty('disabled', true);
  });

  it('readOnly del formulario también impide mutar', () => {
    const onChange = vi.fn();
    render(<InspectorBooleanSwitch checked onChange={onChange} readOnly testId="s" />);

    fireEvent.click(screen.getByTestId('s'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('conserva los atributos de exclusión de Selecto/Moveable', () => {
    const { container } = render(
      <InspectorBooleanSwitch checked={false} label="Obligatorio" onChange={vi.fn()} testId="s" />,
    );
    const wrapper = container.querySelector('[data-sisad-inspector-interactive="true"]');

    expect(wrapper).not.toBeNull();
    expect(wrapper?.getAttribute('data-selecto-ignore')).toBe('true');
    expect(wrapper?.getAttribute('data-moveable-ignore')).toBe('true');
    expect(wrapper?.getAttribute('data-canvas-drop-ignore')).toBe('true');
  });

  it('no deja que el clic llegue al canvas', () => {
    const onPointerDown = vi.fn();
    render(
      <div onPointerDown={onPointerDown}>
        <InspectorBooleanSwitch checked={false} onChange={vi.fn()} testId="s" />
      </div>,
    );

    fireEvent.pointerDown(screen.getByTestId('s'));

    expect(onPointerDown).not.toHaveBeenCalled();
  });
});

describe('adaptadores sobre la primitive', () => {
  it('InspectorSwitch emite un solo cambio y no anida botones', () => {
    const onChange = vi.fn();
    const { container } = render(
      <InspectorSwitch checked={false} label="Solo lectura" onChange={onChange} testId="s" />,
    );

    fireEvent.click(screen.getByTestId('s'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(container.querySelectorAll('button')).toHaveLength(1);
    expect(container.querySelector('button button')).toBeNull();
  });

  it('BooleanSwitchWidget emite un solo cambio por clic', () => {
    const onChange = vi.fn();
    render(<BooleanSwitchWidget value={0} onChange={onChange} testId="s" />);

    fireEvent.click(screen.getByTestId('s'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
