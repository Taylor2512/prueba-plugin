import React from 'react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import type { InteractionState } from '../../shared/interactionState.js';

type Props = {
  activeElements: HTMLElement[];
  activeSchemas: SchemaForUI[];
  selectionCommands?: SelectionCommandSet;
  interactionState: InteractionState;
};

const GROUP_TYPES = new Set(['checkboxGroup', 'radioGroup']);
const BUTTON_GAP_PX = 6;
const BUTTON_SIZE_PX = 22;

/**
 * GroupOptionFloatingAction
 *
 * Renders a "+" button BELOW the selected group schema element, outside the
 * Moveable control box. This ensures Moveable measures only the option
 * indicator boxes and not the add button.
 *
 * Visibility rules:
 * - exactly one schema selected
 * - schema type is checkboxGroup or radioGroup
 * - not during drag/resize/rotate
 * - selectionCommands.addGroupOption is available
 *
 * Positioning: computed relative to the .sisad-pdfme-designer-canvas root
 * using getBoundingClientRect(), same approach as useFloatingToolbarPosition.
 *
 * DOM contract:
 * - data-role="group-add-option"  (no data-schema-id, no data-option-id)
 * - pointerEvents: none on container, auto on button
 */
const GroupOptionFloatingAction = ({
  activeElements,
  activeSchemas,
  selectionCommands,
  interactionState,
}: Props) => {
  if (
    activeElements.length !== 1 ||
    activeSchemas.length !== 1 ||
    interactionState.isDragging ||
    interactionState.isResizing ||
    interactionState.isRotating
  ) {
    return null;
  }

  const schema = activeSchemas[0] as SchemaForUI & { type?: string };
  if (!GROUP_TYPES.has(String(schema?.type || ''))) return null;
  if (!selectionCommands?.addGroupOption) return null;

  const element = activeElements[0];
  if (!element) return null;

  const canvasRoot = element.closest('.sisad-pdfme-designer-canvas');
  if (!(canvasRoot instanceof Element)) return null;

  const canvasRect = canvasRoot.getBoundingClientRect();
  const elemRect = element.getBoundingClientRect();

  const centerX = elemRect.left - canvasRect.left + elemRect.width / 2;
  const topY = elemRect.bottom - canvasRect.top + BUTTON_GAP_PX;

  return (
    <div
      className="sisad-pdfme-option-group-floating-action"
      style={{
        position: 'absolute',
        left: `${centerX}px`,
        top: `${topY}px`,
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 201,
      }}
    >
      <button
        type="button"
        className="sisad-pdfme-option-group__add-button"
        data-role="group-add-option"
        title={schema.type === 'radioGroup' ? 'Agregar opción al grupo' : 'Agregar casilla al grupo'}
        style={{
          pointerEvents: 'auto',
          width: `${BUTTON_SIZE_PX}px`,
          height: `${BUTTON_SIZE_PX}px`,
          borderRadius: '4px',
          border: '1.5px solid #4d00c8',
          background: '#4d00c8',
          color: '#fff',
          fontSize: '16px',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(77,0,200,0.3)',
          padding: '0',
          lineHeight: '1',
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          selectionCommands.addGroupOption?.();
        }}
      >
        +
      </button>
    </div>
  );
};

export default React.memo(GroupOptionFloatingAction);
