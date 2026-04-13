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
  const allReadOnly = activeSchemas.length > 0 && activeSchemas.every((schema) => schema.readOnly);
  const allRequired = activeSchemas.length > 0 && activeSchemas.every((schema) => schema.required);
  const statusBadges: string[] = [];

  if (selectionCount > 1) {
    statusBadges.push(`${selectionCount} elementos`);
  }
  if (allRequired) {
    statusBadges.push('Requerido');
  }
  if (allReadOnly) {
    statusBadges.push('Solo lectura');
  }

  const buttonConfig = buildSelectionQuickActions(commands, allReadOnly);

  return (
    <div
      className="pdfme-ui-selection-context-toolbar"
      data-selection-count={String(selectionCount)}
      data-interaction-phase={interactionState.phase}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        maxWidth: 'min(100%, 292px)',
      }}
    >
      {selectionCount > 1 ? (
        <span className="pdfme-ui-selection-context-toolbar-count">{selectionCount}</span>
      ) : null}
      <div className="pdfme-ui-selection-context-toolbar-actions">
        {buttonConfig.map((btn) => (
          <button
            key={btn.id}
            type="button"
            title={btn.label}
            aria-label={btn.label}
            data-active={btn.active ? 'true' : 'false'}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              btn.onSelect?.();
            }}>
            {btn.icon}
          </button>
        ))}
      </div>
      {statusBadges.length > 0 ? (
        <div className="pdfme-ui-selection-context-toolbar-badges">
          {statusBadges.map((badge) => (
            <span key={badge}>{badge}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SelectionContextToolbar;
