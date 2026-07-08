import { DESIGNER_CLASSNAME } from "../../../../constants.js";
import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { DragOverlay } from '@dnd-kit/core';
import { SchemaForUI } from '@sisad-pdfme/common';
import Item from './Item.js';
import { mergeClassNames } from '../../shared/className.js';

type Props = {
  activeId: string | null;
  schemas: SchemaForUI[];
  selectedSchemas: SchemaForUI[];
  renderIcon: (schema: string | SchemaForUI) => ReactNode;
};

const ListViewDragOverlay = ({ activeId, schemas, selectedSchemas, renderIcon }: Props) => {
  if (typeof document === 'undefined' || !activeId) return null;

  const activeSchema = schemas.find((schema) => schema.id === activeId);
  if (!activeSchema) return null;

  return createPortal(
    <DragOverlay adjustScale>
      <>
        <ul className={mergeClassNames(DESIGNER_CLASSNAME + 'ul-auto', 'space-y-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg')}>
          <Item
            icon={renderIcon(activeId)}
            value={activeSchema.name}
            title={activeSchema.name}
            required={activeSchema.required}
            readOnly={activeSchema.readOnly}
            dragOverlay
            className={mergeClassNames(DESIGNER_CLASSNAME + 'item-auto', 'rounded-xl')}
          />
        </ul>
        <ul className={mergeClassNames(DESIGNER_CLASSNAME + 'ul-auto', 'space-y-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg')}>
          {selectedSchemas
            .filter((item) => item.id !== activeId)
            .map((item) => (
              <Item
                icon={renderIcon(item)}
                key={item.id}
                value={item.name}
                title={item.name}
                required={item.required}
                readOnly={item.readOnly}
                dragOverlay
                className={mergeClassNames(DESIGNER_CLASSNAME + 'item-auto', 'rounded-xl')}
              />
            ))}
        </ul>
      </>
    </DragOverlay>,
    document.body,
  );
};

export default ListViewDragOverlay;
