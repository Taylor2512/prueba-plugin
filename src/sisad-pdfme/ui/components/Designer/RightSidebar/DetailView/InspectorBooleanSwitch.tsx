/**
 * InspectorBooleanSwitch — primitive única de switch booleano del inspector.
 *
 * Autoridad única para todos los schemas: cualquier control booleano del
 * DetailView debe pasar por aquí. Reglas del contrato (INSPECTOR-001):
 *
 * - Componente controlado: no mantiene estado local del valor.
 * - Un único evento de cambio (`Switch.onChange`); nunca `onClick` en paralelo,
 *   porque Ant Design dispara ambos por clic y produciría dos commits.
 * - Nunca anida elementos interactivos: el `Switch` de Ant ya renderiza un
 *   `<button role="switch">`, así que el contenedor es `<label>`/`<span>`.
 * - Solo detiene la propagación hacia el canvas; no llama `preventDefault()`
 *   sobre el control ni bloquea la activación por teclado.
 */
import React from 'react';
import { Switch } from 'antd';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';
import { stopInspectorPointerEvent } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorInteractionGuards';

/** Props de la primitive booleana del inspector. */
export type InspectorBooleanSwitchProps = {
  /** Valor actual. Se normaliza para tolerar `1`, `'true'`, `'on'`, etc. */
  checked?: unknown;
  onChange?: (_nextChecked: boolean) => void;
  /** Deshabilitado por capacidad/acceso. */
  disabled?: boolean;
  /** Solo lectura del formulario. Equivale a deshabilitado para un switch. */
  readOnly?: boolean;
  /** Texto visible de la fila. Sin label se renderiza solo el control. */
  label?: React.ReactNode;
  /** Motivo mostrado como tooltip nativo cuando está deshabilitado. */
  disabledReason?: string;
  checkedLabel?: string;
  uncheckedLabel?: string;
  className?: string;
  testId?: string;
  'aria-label'?: string;
};

/**
 * Normaliza valores heterogéneos a booleano.
 *
 * Los schemas persistidos y los plugins entregan booleanos como `1/0`,
 * `'true'/'false'` o `'on'`, así que el switch no puede confiar en `Boolean()`
 * a secas: `Boolean('false')` es `true`.
 */
const normalizeInspectorBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return false;
    return ['true', '1', 'yes', 'y', 'on', 'checked'].includes(normalized);
  }
  return Boolean(value);
};

/** Atributos que impiden que el canvas reaccione a interacciones del inspector. */
const INSPECTOR_EXCLUSION_ATTRS = {
  'data-sisad-inspector-interactive': 'true',
  'data-selecto-ignore': 'true',
  'data-moveable-ignore': 'true',
  'data-canvas-drop-ignore': 'true',
} as const;

/**
 * Switch booleano controlado del inspector.
 *
 * @param props Valor, handler de cambio, estado de acceso y textos.
 * @returns Fila con label opcional y un único control interactivo.
 */
export const InspectorBooleanSwitch = ({
  checked,
  onChange,
  disabled = false,
  readOnly = false,
  label,
  disabledReason,
  checkedLabel,
  uncheckedLabel,
  className,
  testId,
  'aria-label': ariaLabel,
}: InspectorBooleanSwitchProps) => {
  const isChecked = normalizeInspectorBoolean(checked);
  const effectiveDisabled = disabled || readOnly;

  const control = (
    <Switch
      onPointerDown={stopInspectorPointerEvent}
      onMouseDown={stopInspectorPointerEvent}
      data-testid={testId}
      checked={isChecked}
      disabled={effectiveDisabled}
      aria-label={ariaLabel}
      // Única ruta de commit: Ant Design ya emite onChange por clic, teclado y
      // activación programática. Añadir onClick duplicaría la persistencia.
      onChange={(nextChecked) => {
        if (effectiveDisabled) return;
        onChange?.(Boolean(nextChecked));
      }}
      size="small"
    />
  );

  const status =
    checkedLabel || uncheckedLabel ? (
      <span className="sr-only">
        {isChecked ? checkedLabel || 'Activado' : uncheckedLabel || 'Desactivado'}
      </span>
    ) : null;

  if (label === undefined || label === null) {
    return (
      <span {...INSPECTOR_EXCLUSION_ATTRS} className={className} title={effectiveDisabled ? disabledReason : undefined}>
        {control}
        {status}
      </span>
    );
  }

  return (
    // `label` (no `button`): el Switch de Ant ya es un botón y anidarlos rompe
    // foco, teclado y lectores de pantalla.
    <label
      {...INSPECTOR_EXCLUSION_ATTRS}
      title={effectiveDisabled ? disabledReason : undefined}
      className={mergeClassNames(
        'flex min-h-8 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-left text-[11px] text-slate-700 shadow-none transition',
        effectiveDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-slate-300',
        className,
      )}
    >
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {control}
      {status}
    </label>
  );
};

export default InspectorBooleanSwitch;
