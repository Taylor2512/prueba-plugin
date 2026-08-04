/**
 * InspectorSwitch — fila etiquetada con switch booleano.
 *
 * Adaptador de `InspectorBooleanSwitch` que conserva la firma pública previa.
 * La implementación anterior envolvía el `Switch` de Ant en un `<button>`, lo
 * que anidaba dos controles interactivos y provocaba propagación doble, foco
 * inconsistente y comportamiento distinto entre navegadores.
 */
import React from 'react';
import { InspectorBooleanSwitch } from './InspectorBooleanSwitch.js';

export type InspectorSwitchProps = {
  checked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (_nextChecked: boolean) => void;
  label?: string;
  className?: string;
  testId?: string;
  disabledReason?: string;
};

export const InspectorSwitch = ({
  checked,
  disabled,
  readOnly,
  onChange,
  label,
  className,
  testId,
  disabledReason,
}: InspectorSwitchProps) => (
  <InspectorBooleanSwitch
    checked={checked}
    disabled={disabled}
    readOnly={readOnly}
    onChange={onChange}
    label={label ?? ''}
    className={className}
    testId={testId}
    disabledReason={disabledReason}
    aria-label={label}
  />
);

export default InspectorSwitch;
