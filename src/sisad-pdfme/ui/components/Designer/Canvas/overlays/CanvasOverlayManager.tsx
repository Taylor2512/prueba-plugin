import React, { useEffect, useMemo, useState } from 'react';
import type { SchemaForUI, Size } from '@sisad-pdfme/common';
import type { SnapLine } from '../SnapLines.js';
import SelectionContextToolbar from './SelectionContextToolbar.js';
import InlineMetricsOverlay from './InlineMetricsOverlay.js';
import SnapFeedbackOverlay from './SnapFeedbackOverlay.js';
import GroupOptionFloatingAction from './GroupOptionFloatingAction.js';
import { useFloatingToolbarPosition } from './useFloatingToolbarPosition.js';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import type { SelectionToolbarMode } from './canvasContextMenuActions.js';
import type { InteractionState } from '../../shared/interactionState.js';
import {
  resolveActiveSchemasFromElements,
  resolveSelectionPageIndex,
} from '../../shared/selectionIdentityResolver.js';
import CommentsOverlay from './CommentsOverlay.js';
import ShortcutHelpPanel from '../../Shortcuts/ShortcutHelpPanel.js';

export type SnapLinesSlot = React.ComponentType<{
  lines: SnapLine[];
  className?: string;
  style?: React.CSSProperties;
  useDefaultStyles?: boolean;
}>;

type CanvasOverlayManagerProps = {
  activeElements: HTMLElement[];
  schemasList: SchemaForUI[][];
  topLevelComments?: Array<{ anchor?: Record<string, unknown>; comment?: Record<string, unknown> }>;
  pageCursor: number;
  pageSize: Size;
  paperRefs: React.MutableRefObject<HTMLDivElement[]>;
  scale?: number;
  snapLines: SnapLine[];
  SnapLinesSlot: SnapLinesSlot;
  selectionCommands?: SelectionCommandSet;
  interactionState: InteractionState;
  featureSnapLines: boolean;
  externalSchemaDragActive?: boolean;
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
    topLevelComments = [],
    pageCursor,
    pageSize,
    paperRefs,
    snapLines,
    SnapLinesSlot,
    selectionCommands,
    interactionState,
    featureSnapLines,
    externalSchemaDragActive = false,
    contextMenuOpen = false,
    className,
  } = props;

  const [toolbarMode, setToolbarMode] = useState<SelectionToolbarMode>(
    interactionState.selectionCount > 1 ? 'compact' : 'micro',
  );
  const [shortcutHelpOpen, setShortcutHelpOpen] = useState(false);

  useEffect(() => {
    const nextMode = interactionState.selectionCount > 1 ? 'compact' : 'micro';
    setToolbarMode((prev) => (prev === nextMode ? prev : nextMode));
  }, [interactionState.selectionCount]);

  useEffect(() => {
    const openShortcutPanel = () => setShortcutHelpOpen(true);
    window.addEventListener('sisad-pdfme:shortcut-open-panel', openShortcutPanel as EventListener);
    return () => {
      window.removeEventListener('sisad-pdfme:shortcut-open-panel', openShortcutPanel as EventListener);
    };
  }, []);

  const toolbarSize =
    toolbarMode === 'expanded' ? EXPANDED_TOOLBAR_SIZE : toolbarMode === 'compact' ? COMPACT_TOOLBAR_SIZE : MICRO_TOOLBAR_SIZE;

  const selectionBounds = useFloatingToolbarPosition(
    activeElements,
    pageSize,
    toolbarSize,
  );

  const activeSchemas = useMemo(
    () => resolveActiveSchemasFromElements(schemasList, activeElements),
    [activeElements, schemasList],
  );
  const activePageIndex = useMemo(
    () => resolveSelectionPageIndex(activeElements, pageCursor) ?? pageCursor,
    [activeElements, pageCursor],
  );

  return (
    <div className={`sisad-pdfme-ui-canvas-overlay-manager ${className || ''}`}>
      {!externalSchemaDragActive ? (
        <>
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
          <GroupOptionFloatingAction
            activeElements={activeElements}
            activeSchemas={activeSchemas}
            selectionCommands={selectionCommands}
            interactionState={interactionState}
          />
          <InlineMetricsOverlay bounds={selectionBounds} />
          <SnapFeedbackOverlay bounds={selectionBounds} snapLines={snapLines} />
          {featureSnapLines ? <SnapLinesSlot lines={snapLines} /> : null}
        </>
      ) : null}
      {/* Comments overlay (pins, click handlers) */}
      <CommentsOverlay
        schemas={schemasList[activePageIndex] || []}
        topLevelComments={topLevelComments}
        scale={props.scale || 1}
        pageIndex={activePageIndex}
        paperRefs={paperRefs}
      />
      <ShortcutHelpPanel open={shortcutHelpOpen} onClose={() => setShortcutHelpOpen(false)} />
    </div>
  );
};

export default React.memo(CanvasOverlayManager);
