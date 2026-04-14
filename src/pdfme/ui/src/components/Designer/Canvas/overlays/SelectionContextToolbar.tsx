import React from 'react';
import type { SchemaForUI } from '@pdfme/common';
import {
  buildSelectionQuickActions,
} from './canvasContextMenuActions.js';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import type { InteractionState } from '../../shared/interactionState.js';

type SelectionContextToolbarProps = {
  position: { top: number; left: number; width: number; height: number } | null;
  commands?: SelectionCommandSet;
  activeElements: HTMLElement[];
  activeSchemas: SchemaForUI[];
  interactionState: InteractionState;
  contextMenuOpen?: boolean;
};

const formatSchemaType = (value?: string | null) => {
  if (!value) return null;
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
    .trim();
};

const SelectionContextToolbar = ({
  position,
  commands,
  activeElements,
  activeSchemas,
  interactionState,
  contextMenuOpen = false,
}: SelectionContextToolbarProps) => {
  if (!position || !commands || !activeElements.length) return null;
  if (['editing', 'dragging', 'resizing', 'rotating'].includes(interactionState.phase)) return null;
  if (contextMenuOpen) return null;

  const selectionCount = interactionState.selectionCount;
  const primarySchema = activeSchemas[0];
  const allReadOnly = activeSchemas.length > 0 && activeSchemas.every((schema) => schema.readOnly);
  const allRequired = activeSchemas.length > 0 && activeSchemas.every((schema) => schema.required);

  const buttonConfig = buildSelectionQuickActions(commands, allReadOnly);

  const summaryChips: string[] = [];

  if (selectionCount > 1) {
    summaryChips.push(`${selectionCount} elementos`);
    summaryChips.push('Selección múltiple');
  } else {
    const name = primarySchema?.name?.trim();
    const type = formatSchemaType(primarySchema?.type);
    if (name) summaryChips.push(name);
    if (type) summaryChips.push(type);
    if (!summaryChips.length) summaryChips.push('Campo activo');
  }

  if (allRequired) {
    summaryChips.push('Requerido');
  }
  if (allReadOnly) {
    summaryChips.push('Solo lectura');
  }

  return (
    <div
      className="pdfme-ui-selection-context-toolbar"
      data-selection-count={String(selectionCount)}
      data-interaction-phase={interactionState.phase}
      data-selection-kind={selectionCount > 1 ? 'multi' : 'single'}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        maxWidth: 'min(100%, 324px)',
      }}
    >
      <div className="pdfme-ui-selection-context-toolbar-summary" aria-label="Resumen de selección">
        {summaryChips.map((chip, index) => (
          <span
            key={`${chip}-${index}`}
            className={[
              'pdfme-ui-selection-context-toolbar-chip',
              index === 0 ? 'is-primary' : '',
            ].filter(Boolean).join(' ')}
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="pdfme-ui-selection-context-toolbar-actions" role="group" aria-label="Acciones rápidas">
        {buttonConfig.map((btn) => (
          <button
            key={btn.id}
            type="button"
            title={btn.label}
            aria-label={btn.label}
            aria-pressed={btn.active ? 'true' : 'false'}
            data-active={btn.active ? 'true' : 'false'}
            data-danger={btn.danger ? 'true' : 'false'}
            disabled={!btn.onSelect}
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              btn.onSelect?.();
            }}
          >
            <span className="pdfme-ui-selection-context-toolbar-action-icon" aria-hidden="true">
              {btn.icon}
            </span>
            <span className="pdfme-ui-selection-context-toolbar-action-label">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectionContextToolbar;
