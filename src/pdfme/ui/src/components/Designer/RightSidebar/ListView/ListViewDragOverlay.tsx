import { DESIGNER_CLASSNAME } from "../../../../constants.js";
import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { DragOverlay } from '@dnd-kit/core';
import { SchemaForUI } from '@pdfme/common';
import { theme } from 'antd';
import Item from './Item.js';

type Props = {
  activeId: string | null;
  schemas: SchemaForUI[];
  selectedSchemas: SchemaForUI[];
  renderIcon: (schema: string | SchemaForUI) => ReactNode;
};

const ListViewDragOverlay = ({ activeId, schemas, selectedSchemas, renderIcon }: Props) => {
  const { token } = theme.useToken();

  if (typeof document === 'undefined' || !activeId) return null;

  const activeSchema = schemas.find((schema) => schema.id === activeId);
  if (!activeSchema) return null;

  return createPortal(
    <DragOverlay adjustScale>
      <>
        <ul className={DESIGNER_CLASSNAME + "ul-auto"}>
          <Item
            icon={renderIcon(activeId)}
            value={activeSchema.name}
            title={activeSchema.name}
            required={activeSchema.required}
            readOnly={activeSchema.readOnly}
            dragOverlay
            className={DESIGNER_CLASSNAME + 'item-auto'}
          />
        </ul>
        <ul className={DESIGNER_CLASSNAME + "ul-auto"}>
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
                className={DESIGNER_CLASSNAME + 'item-auto'}
              />
            ))}
        </ul>
      </>
    </DragOverlay>,
    document.body,
  );
};

export default ListViewDragOverlay;
