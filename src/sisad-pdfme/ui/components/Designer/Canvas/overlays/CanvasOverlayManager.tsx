import React, { useEffect, useMemo, useState } from 'react';
import type { SchemaForUI, Size } from '@sisad-pdfme/common';
import type { SnapLine } from '../SnapLines.js';
import SelectionContextToolbar from './SelectionContextToolbar.js';
import InlineMetricsOverlay from './InlineMetricsOverlay.js';
import SnapFeedbackOverlay from './SnapFeedbackOverlay.js';
import { useFloatingToolbarPosition } from './useFloatingToolbarPosition.js';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import type { SelectionToolbarMode } from './canvasContextMenuActions.js';
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
  pageSize: Size;
  snapLines: SnapLine[];
  SnapLinesSlot: SnapLinesSlot;
  selectionCommands?: SelectionCommandSet;
  interactionState: InteractionState;
  featureSnapLines: boolean;
  contextMenuOpen?: boolean;
  className?: string;
};

const MICRO_TOOLBAR_SIZE = { width: 288, height: 160 };
const COMPACT_TOOLBAR_SIZE = { width: 384, height: 224 };
const EXPANDED_TOOLBAR_SIZE = { width: 512, height: 360 };

const CanvasOverlayManager = (props: CanvasOverlayManagerProps) => {
  const {
    activeElements,
    schemasList,
    pageCursor,
    pageSize,
    snapLines,
    SnapLinesSlot,
    selectionCommands,
    interactionState,
    featureSnapLines,
    contextMenuOpen = false,
    className,
  } = props;

  const [toolbarMode, setToolbarMode] = useState<SelectionToolbarMode>(
    interactionState.selectionCount > 1 ? 'expanded' : 'micro',
  );

  useEffect(() => {
    const nextMode = interactionState.selectionCount > 1 ? 'expanded' : 'micro';
    setToolbarMode((prev) => (prev === nextMode ? prev : nextMode));
  }, [interactionState.selectionCount]);

  const toolbarSize =
    toolbarMode === 'expanded' ? EXPANDED_TOOLBAR_SIZE : toolbarMode === 'compact' ? COMPACT_TOOLBAR_SIZE : MICRO_TOOLBAR_SIZE;

  const selectionBounds = useFloatingToolbarPosition(
    activeElements,
    pageSize,
    toolbarSize,
  );

  const activeSchemas = useMemo(() => {
    const ids = new Set(activeElements.map((element) => element.id));
    return schemasList[pageCursor]?.filter((schema) => ids.has(schema.id)) || [];
  }, [activeElements, pageCursor, schemasList]);

  return (
    <div className={`sisad-pdfme-ui-canvas-overlay-manager ${className || ''}`}>
      <SelectionContextToolbar
        position={selectionBounds}
        commands={selectionCommands}
        activeElements={activeElements}
        activeSchemas={activeSchemas}
        interactionState={interactionState}
        contextMenuOpen={contextMenuOpen}
        toolbarMode={toolbarMode}
        onToolbarModeChange={setToolbarMode}
      />
      <InlineMetricsOverlay bounds={selectionBounds} />
      <SnapFeedbackOverlay bounds={selectionBounds} snapLines={snapLines} />
      {featureSnapLines ? (
        <SnapLinesSlot lines={snapLines} />
      ) : null}
    </div>
  );
};

export default React.memo(CanvasOverlayManager);
