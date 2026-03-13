import React, { useMemo } from 'react';
import type { SchemaForUI } from '@pdfme/common';
import type { SnapLine } from '../SnapLines.js';
import SelectionContextToolbar from './SelectionContextToolbar.js';
import InlineMetricsOverlay from './InlineMetricsOverlay.js';
import SelectionBadgesOverlay from './SelectionBadgesOverlay.js';
import SnapFeedbackOverlay from './SnapFeedbackOverlay.js';
import { useFloatingToolbarPosition } from './useFloatingToolbarPosition.js';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import type { InteractionState } from '../../shared/interactionState.js';

export type SnapLinesSlot = React.ComponentType<{
  lines: SnapLine[];
  className?: string;
  style?: React.CSSProperties;
  useDefaultStyles?: boolean;
}>;

type CanvasOverlayManagerProps = {
  activeElements: HTMLElement[];
  schemasList: SchemaForUI[][];
  pageCursor: number;
  snapLines: SnapLine[];
  SnapLinesSlot: SnapLinesSlot;
  selectionCommands?: SelectionCommandSet;
  interactionState: InteractionState;
  featureSnapLines: boolean;
  className?: string;
};

const CanvasOverlayManager = (props: CanvasOverlayManagerProps) => {
  const {
    activeElements,
    schemasList,
    pageCursor,
    snapLines,
    SnapLinesSlot,
    selectionCommands,
    interactionState,
    featureSnapLines,
    className,
  } = props;

  const selectionBounds = useFloatingToolbarPosition(activeElements);

  const activeSchemas = useMemo(() => {
    const ids = activeElements.map((element) => element.id);
    return schemasList[pageCursor]?.filter((schema) => ids.includes(schema.id)) || [];
  }, [activeElements, pageCursor, schemasList]);

  return (
    <div className={`pdfme-ui-canvas-overlay-manager ${className || ''}`}>
      <SelectionContextToolbar
        position={selectionBounds}
        commands={selectionCommands}
        activeElements={activeElements}
      />
      <InlineMetricsOverlay bounds={selectionBounds} />
      <SelectionBadgesOverlay
        bounds={selectionBounds}
        selectionCount={interactionState.selectionCount}
        activeSchemas={activeSchemas}
      />
      <SnapFeedbackOverlay bounds={selectionBounds} snapLines={snapLines} />
      {featureSnapLines ? (
        <SnapLinesSlot lines={snapLines} />
      ) : null}
    </div>
  );
};

export default CanvasOverlayManager;
