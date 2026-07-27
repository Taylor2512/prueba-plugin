/**
 * Drag overlay for the right sidebar schema list.
 *
 * During dnd-kit drag operations this component renders a portal-backed preview
 * of the active field plus any additional selected fields. The overlay is
 * rendered into `document.body` so it is not clipped by sidebar overflow.
 */
import { DESIGNER_CLASSNAME } from "../../../../constants.js";
import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { DragOverlay } from '@dnd-kit/core';
import { SchemaForUI } from '@sisad-pdfme/common';
import Item from './Item.js';
import { mergeClassNames } from '../../shared/className.js';
import { resolveListViewItemDescriptor } from './listViewItemResolver.js';


/**
 * Props required to render the current drag preview.
 */
type Props = {
  activeId: string | null;
  schemas: SchemaForUI[];
  selectedSchemas: SchemaForUI[];
  renderIcon: (schema: string | SchemaForUI) => ReactNode;
  densityMode?: 'compact' | 'comfortable' | 'minimal';
};


/**
 * Renders the dnd-kit drag overlay for one active schema and the rest of the
 * selected schemas.
 *
 * @returns A body-level portal containing the overlay, or null when no drag is active.
 */
const ListViewDragOverlay = ({ activeId, schemas, selectedSchemas, renderIcon, densityMode = 'compact' }: Props) => {
  if (typeof document === 'undefined' || !activeId) return null;

  const activeSchema = schemas.find((schema) => schema.id === activeId);
  if (!activeSchema) return null;
  const activeDescriptor = resolveListViewItemDescriptor(activeSchema);
  // Cuando se arrastran varios campos, no se apilan tarjetas (cubrirían el
  // destino): la fila activa se muestra al ancho real y el resto se resume en
  // un chip "+N".
  const extraCount = selectedSchemas.filter((item) => item.id !== activeId).length;

  return createPortal(
    // `adjustScale={false}` conserva el tamaño natural de la fila (sin
    // deformar/ensanchar). El overlay no captura pointer events ni selecciona
    // texto, y usa un drop-shadow moderado para "levantar" la fila.
    <DragOverlay
      adjustScale={false}
      className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-drag-overlay', 'pointer-events-none select-none')}
    >
      <div className="pointer-events-none relative select-none [filter:drop-shadow(0_12px_24px_rgba(15,23,42,0.18))]">
        <Item
          icon={renderIcon(activeId)}
          value={activeDescriptor.primaryLabel}
          title={activeDescriptor.secondaryLabel || activeDescriptor.primaryLabel}
          typeLabel={activeDescriptor.typeLabel}
          required={activeDescriptor.isRequired}
          readOnly={activeDescriptor.isReadOnly}
          accentColor={activeDescriptor.ownerColor || undefined}
          metaBadges={activeDescriptor.badges}
          dragOverlay
          densityMode={densityMode}
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'item-auto',
            'w-full cursor-grabbing rounded-lg',
          )}
        />
        {extraCount > 0 ? (
          <span
            aria-hidden="true"
            className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full border border-sky-200 bg-sky-600 px-1 text-[0.625rem] font-semibold text-white shadow-md"
          >
            +{extraCount}
          </span>
        ) : null}
      </div>
    </DragOverlay>,
    document.body,
  );
};

export default ListViewDragOverlay;
