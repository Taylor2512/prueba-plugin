import React from 'react';
import type { SchemaForUI } from '@pdfme/common';

type SelectionBadgesOverlayProps = {
  bounds: { top: number; left: number } | null;
  selectionCount: number;
  activeSchemas: SchemaForUI[];
};

const SelectionBadgesOverlay = ({ bounds, selectionCount, activeSchemas }: SelectionBadgesOverlayProps) => {
  if (!bounds || selectionCount === 0) return null;
  const badges = [];
  if (selectionCount > 1) {
    badges.push(`${selectionCount} elementos`);
  }
  const hasRequired = activeSchemas.some((schema) => schema.required);
  const hasReadOnly = activeSchemas.some((schema) => schema.readOnly);
  if (hasRequired) badges.push('Requerido');
  if (hasReadOnly) badges.push('Solo lectura');

  if (!badges.length) return null;

  return (
    <div
      className="pdfme-ui-selection-badges"
      style={{
        top: `${bounds.top - 34}px`,
        left: `${bounds.left}px`,
      }}>
      {badges.map((badge) => (
        <span key={badge}>{badge}</span>
      ))}
    </div>
  );
};

export default SelectionBadgesOverlay;
