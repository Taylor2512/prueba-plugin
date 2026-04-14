import React,
{
  Ref,
  useMemo,
  useContext,
  MutableRefObject,
  useRef,
  useState,
  useEffect,
  forwardRef,
  useCallback,
} from 'react';
import { theme } from 'antd';
import MoveableComponent, { OnDrag, OnRotate, OnResize } from 'react-moveable';
import {
  ZOOM,
  SchemaForUI,
  Size,
  ChangeSchemas,
  BasePdf,
  isBlankPdf,
  replacePlaceholders,
} from '@pdfme/common';
import type { DesignerComponentBridge } from '../../../types.js';
import { PluginsRegistry } from '../../../contexts.js';
import { RULER_HEIGHT, DESIGNER_CLASSNAME, SELECTABLE_CLASSNAME } from '../../../constants.js';
import { usePrevious } from '../../../hooks.js';
import { round, flatten } from '../../../helper.js';
import Paper from '../../Paper.js';
import Renderer from '../../Renderer.js';
import Selecto from './Selecto.js';
import Moveable from './Moveable.js';
import Guides from './Guides.js';
import Mask from './Mask.js';
import Padding from './Padding.js';
import StaticSchema from '../../StaticSchema.js';
import SnapLines, { computeSnapResult, SnapLine } from './SnapLines.js';
import { resolveSchemaTone } from '../shared/schemaTone.js';
import { deriveInteractionState } from '../shared/interactionState.js';
import type { InteractionState } from '../shared/interactionState.js';
import type { SelectionCommandSet } from '../shared/selectionCommands.js';
import CanvasOverlayManager from './overlays/CanvasOverlayManager.js';
import CanvasContextMenu from './overlays/CanvasContextMenu.js';

const mm2px = (mm: number) => mm * 3.7795275591;

const fmt4Num = (prop: string) => Number(prop.replace('px', ''));
const fmt = (prop: string) => round(fmt4Num(prop) / ZOOM, 2);
const isTopLeftResize = (d: string) => d === '-1,-1' || d === '-1,0' || d === '0,-1';
const normalizeRotate = (angle: number) => ((angle % 360) + 360) % 360;
const parseRotateFromTransform = (transform: string) =>
  normalizeRotate(Number(transform.replace('rotate(', '').replace('deg)', '')));
const buildPositionChanges = (schemaId: string, top: string, left: string) => [
  { key: 'position.y', value: fmt(top), schemaId },
  { key: 'position.x', value: fmt(left), schemaId },
];
const buildSizeAndPositionChanges = (schemaId: string, width: string, height: string, top: string, left: string) => [
  { key: 'width', value: fmt(width), schemaId },
  { key: 'height', value: fmt(height), schemaId },
  { key: 'position.y', value: fmt(top), schemaId },
  { key: 'position.x', value: fmt(left), schemaId },
];
const dedupeById = <T extends { id: string }>(items: T[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};
const getPaddingMm = (basePdf: BasePdf): [number, number, number, number] => {
  if (!isBlankPdf(basePdf)) return [0, 0, 0, 0];
  const [top, right, bottom, left] = basePdf.padding;
  return [top, right, bottom, left];
};
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type CanvasContextMenuState = {
  mode: 'empty' | 'single' | 'multi';
  x: number;
  y: number;
  targetIds: string[];
};

interface GuidesInterface {
  getGuides(): number[];
  scroll(pos: number): void;
  scrollGuides(pos: number): void;
  loadGuides(guides: number[]): void;
  resize(): void;
}

export type CanvasFeatureToggles = {
  selecto?: boolean;
  snapLines?: boolean;
  guides?: boolean;
  padding?: boolean;
  mask?: boolean;
  moveable?: boolean;
  deleteButton?: boolean;
};

export type CanvasStyleOverrides = {
  canvasContainer?: React.CSSProperties;
  selectoSelection?: {
    backgroundColor?: string;
    borderColor?: string;
    opacity?: number;
  };
  moveable?: {
    color?: string;
  };
  snapLines?: {
    lineColor?: string;
    centerColor?: string;
  };
  guides?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    cornerBackground?: string;
    unit?: number;
  };
  mask?: {
    color?: string;
    blur?: number;
  };
  padding?: {
    color?: string;
    opacity?: number;
  };
};

export type CanvasClassNames = {
  canvasContainer?: string;
  selecto?: string;
  snapLines?: string;
  guides?: string;
  mask?: string;
  padding?: string;
  moveable?: string;
  emptyState?: string;
};

export type CanvasComponentSlots = {
  Selecto?: typeof Selecto;
  SnapLines?: typeof SnapLines;
  Guides?: typeof Guides;
  Mask?: typeof Mask;
  Padding?: typeof Padding;
  Moveable?: typeof Moveable;
};

export interface CanvasProps {
  basePdf: BasePdf;
  height: number;
  hoveringSchemaId: string | null;
  onChangeHoveringSchemaId: (id: string | null) => void;
  pageCursor: number;
  schemasList: SchemaForUI[][];
  scale: number;
  backgrounds: string[];
  pageSizes: Size[];
  size: Size;
  activeElements: HTMLElement[];
  onEdit: (targets: HTMLElement[]) => void;
  changeSchemas: ChangeSchemas;
  paperRefs: MutableRefObject<HTMLDivElement[]>;
  sidebarOpen: boolean;
  sidebarWidth?: number;
  preserveSidebarSpace?: boolean;
  featureToggles?: CanvasFeatureToggles;
  styleOverrides?: CanvasStyleOverrides;
  classNames?: CanvasClassNames;
  useDefaultStyles?: boolean;
  components?: CanvasComponentSlots;
  bridge?: DesignerComponentBridge;
  canvasActions?: {
    addPageAfter?: () => void;
    uploadPdf?: () => void;
  };
  selectionCommands?: SelectionCommandSet;
  onInteractionStateChange?: (state: InteractionState) => void;
}

const Canvas = (props: CanvasProps, ref: Ref<HTMLDivElement>) => {
  const {
    basePdf,
    pageCursor,
    scale,
    backgrounds,
    pageSizes,
    size,
    activeElements,
    schemasList,
    hoveringSchemaId,
    onEdit,
    changeSchemas,
    onChangeHoveringSchemaId,
    paperRefs,
    featureToggles,
    styleOverrides,
    classNames,
    useDefaultStyles = true,
    components,
    bridge,
    canvasActions,
    selectionCommands,
    onInteractionStateChange,
} = props;
  const SelectoSlot = components?.Selecto || Selecto;
  const SnapLinesSlot = components?.SnapLines || SnapLines;
  const GuidesSlot = components?.Guides || Guides;
  const MaskSlot = components?.Mask || Mask;
  const PaddingSlot = components?.Padding || Padding;
  const MoveableSlot = components?.Moveable || Moveable;

  const feature = {
    selecto: featureToggles?.selecto !== false,
    snapLines: featureToggles?.snapLines !== false,
    guides: featureToggles?.guides !== false,
    padding: featureToggles?.padding !== false,
    mask: featureToggles?.mask !== false,
    moveable: featureToggles?.moveable !== false,
  };
  const { token } = theme.useToken();
  const pluginsRegistry = useContext(PluginsRegistry);
  const verticalGuides = useRef<GuidesInterface[]>([]);
  const horizontalGuides = useRef<GuidesInterface[]>([]);
  const moveable = useRef<MoveableComponent>(null);

  const [isPressShiftKey, setIsPressShiftKey] = useState(false);
  const [isPressAltKey, setIsPressAltKey] = useState(false);
  const [editing, setEditing] = useState(false);
  const [snapLines, setSnapLines] = useState<SnapLine[]>([]);
  const snapRafRef = useRef<number | null>(null);
  const snapLinesKeyRef = useRef<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [contextMenu, setContextMenu] = useState<CanvasContextMenuState | null>(null);
  const [pendingContextMenu, setPendingContextMenu] = useState<CanvasContextMenuState | null>(null);

  const prevSchemas = usePrevious(schemasList[pageCursor]);

  const onKeydown = (e: KeyboardEvent) => {
    if (e.shiftKey) setIsPressShiftKey(true);
    if (e.altKey) setIsPressAltKey(true);
  };
  const onKeyup = (e: KeyboardEvent) => {
    if (e.key === 'Shift' || !e.shiftKey) setIsPressShiftKey(false);
    if (e.key === 'Alt' || !e.altKey) setIsPressAltKey(false);
    if (e.key === 'Escape' || e.key === 'Esc') setEditing(false);
  };

  const initEvents = useCallback(() => {
    window.addEventListener('keydown', onKeydown);
    window.addEventListener('keyup', onKeyup);
  }, []);

  const destroyEvents = useCallback(() => {
    window.removeEventListener('keydown', onKeydown);
    window.removeEventListener('keyup', onKeyup);
  }, []);

  useEffect(() => {
    initEvents();

    return () => {
      destroyEvents();
      if (snapRafRef.current != null) {
        cancelAnimationFrame(snapRafRef.current);
      }
    };
  }, [initEvents, destroyEvents]);

  useEffect(() => {
    moveable.current?.updateRect();
    if (!prevSchemas) {
      return;
    }

    const prevSchemaKeys = JSON.stringify(prevSchemas[pageCursor] || {});
    const schemaKeys = JSON.stringify(schemasList[pageCursor] || {});

    if (prevSchemaKeys === schemaKeys) {
      moveable.current?.updateRect();
    }
  }, [pageCursor, schemasList, prevSchemas]);

  const onDrag = ({ target, top, left }: OnDrag) => {
    const { width: _width, height: _height } = target.style;
    const targetWidthMm = fmt(_width);
    const targetHeightMm = fmt(_height);
    const actualTop = top / ZOOM;
    const actualLeft = left / ZOOM;
    const { width: pageWidthMm, height: pageHeightMm } = pageSizes[pageCursor];
    const [paddingTopMm, paddingRightMm, paddingBottomMm, paddingLeftMm] = getPaddingMm(basePdf);
    const minY = paddingTopMm;
    const minX = paddingLeftMm;
    const maxY = Math.max(minY, pageHeightMm - paddingBottomMm - targetHeightMm);
    const maxX = Math.max(minX, pageWidthMm - paddingRightMm - targetWidthMm);

    const currentSchemas = schemasList[pageCursor] || [];
    const others = currentSchemas
      .filter((s) => !activeElements.map((ae) => ae.id).includes(s.id))
      .map((s) => ({ x: s.position.x, y: s.position.y, width: s.width, height: s.height }));

    const snapResult = isPressAltKey
      ? { snapped: { x: actualLeft, y: actualTop }, lines: [] as SnapLine[] }
      : computeSnapResult(
        { x: actualLeft, y: actualTop, width: targetWidthMm, height: targetHeightMm },
        { width: pageWidthMm, height: pageHeightMm },
        others,
      );

    const nextTop = clamp(snapResult.snapped.y, minY, maxY);
    const nextLeft = clamp(snapResult.snapped.x, minX, maxX);
    target.style.top = `${nextTop * ZOOM}px`;
    target.style.left = `${nextLeft * ZOOM}px`;

    if (snapRafRef.current != null) {
      cancelAnimationFrame(snapRafRef.current);
    }
    snapRafRef.current = requestAnimationFrame(() => {
      const key = JSON.stringify(
        snapResult.lines.map((line) => `${line.type}:${line.pos}:${line.label || ''}`),
      );
      if (snapLinesKeyRef.current !== key) {
        snapLinesKeyRef.current = key;
        setSnapLines(snapResult.lines);
      }
    });
  };

  const onDragEnd = ({ target }: { target: HTMLElement | SVGElement }) => {
    setIsDragging(false);
    const { top, left } = target.style;
    changeSchemas(buildPositionChanges(target.id, top, left));
    setSnapLines([]);
    snapLinesKeyRef.current = '';
  };

  const onDragEnds = ({ targets }: { targets: (HTMLElement | SVGElement)[] }) => {
    const arg = targets.map(({ style: { top, left }, id }) => buildPositionChanges(id, top, left));
    changeSchemas(flatten(arg));
    setSnapLines([]);
    snapLinesKeyRef.current = '';
  };

  const onRotate = ({ target, rotate }: OnRotate) => {
    target.style.transform = `rotate(${rotate}deg)`;
  };

  const onRotateEnd = ({ target }: { target: HTMLElement | SVGElement }) => {
    setIsRotating(false);
    const normalizedRotate = parseRotateFromTransform(target.style.transform);
    changeSchemas([{ key: 'rotate', value: normalizedRotate, schemaId: target.id }]);
  };

  const onRotateEnds = ({ targets }: { targets: (HTMLElement | SVGElement)[] }) => {
    const arg = targets.map(({ style: { transform }, id }) => {
      const normalizedRotate = parseRotateFromTransform(transform);
      return [{ key: 'rotate', value: normalizedRotate, schemaId: id }];
    });
    changeSchemas(flatten(arg));
  };

  const onResizeEnd = ({ target }: { target: HTMLElement | SVGElement }) => {
    setIsResizing(false);
    const { id, style } = target;
    const { width, height, top, left } = style;
    changeSchemas(buildSizeAndPositionChanges(id, width, height, top, left));

    const targetSchema = schemasList[pageCursor].find((schema) => schema.id === id);

    if (!targetSchema) return;

    targetSchema.position.x = fmt(left);
    targetSchema.position.y = fmt(top);
    targetSchema.width = fmt(width);
    targetSchema.height = fmt(height);
  };

  const onResizeEnds = ({ targets }: { targets: (HTMLElement | SVGElement)[] }) => {
    const arg = targets.map(({ style: { width, height, top, left }, id }) =>
      buildSizeAndPositionChanges(id, width, height, top, left),
    );
    changeSchemas(flatten(arg));
  };

  const onResize = ({ target, width, height, direction }: OnResize) => {
    if (!target) return;
    let topPadding = 0;
    let rightPadding = 0;
    let bottomPadding = 0;
    let leftPadding = 0;

    if (isBlankPdf(basePdf)) {
      const [t, r, b, l] = basePdf.padding;
      topPadding = t * ZOOM;
      rightPadding = mm2px(r);
      bottomPadding = mm2px(b);
      leftPadding = l * ZOOM;
    }

    const pageWidth = mm2px(pageSizes[pageCursor].width);
    const pageHeight = mm2px(pageSizes[pageCursor].height);

    const obj: { top?: string; left?: string; width: string; height: string } = {
      width: `${width}px`,
      height: `${height}px`,
    };

    const s = target.style;
    let newLeft = fmt4Num(s.left) + (fmt4Num(s.width) - width);
    let newTop = fmt4Num(s.top) + (fmt4Num(s.height) - height);
    if (newLeft < leftPadding) {
      newLeft = leftPadding;
    }
    if (newTop < topPadding) {
      newTop = topPadding;
    }
    if (newLeft + width > pageWidth - rightPadding) {
      obj.width = `${pageWidth - rightPadding - newLeft}px`;
    }
    if (newTop + height > pageHeight - bottomPadding) {
      obj.height = `${pageHeight - bottomPadding - newTop}px`;
    }

    const d = direction.toString();
    if (isTopLeftResize(d)) {
      obj.top = `${newTop}px`;
      obj.left = `${newLeft}px`;
    } else if (d === '1,-1') {
      obj.top = `${newTop}px`;
    } else if (d === '-1,1') {
      obj.left = `${newLeft}px`;
    }
    Object.assign(s, obj);
  };

  const getGuideLines = (guides: GuidesInterface[], index: number) =>
    guides[index] && guides[index].getGuides().map((g) => g * ZOOM);

  const onClickMoveable = () => {
    // Just set editing to true without trying to access event properties
    setEditing(true);
  };

  const handleDragStart = () => setIsDragging(true);
  const handleResizeStart = () => setIsResizing(true);
  const handleRotateStart = () => setIsRotating(true);
  const handleCanvasContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as Element | null;
    if (!target) return;

    const activePaper = paperRefs.current[pageCursor];
    const selectableTarget = target.closest?.(`.${SELECTABLE_CLASSNAME}`) as HTMLElement | null;
    const isSelectableTarget = Boolean(selectableTarget && activePaper?.contains(selectableTarget));

    event.preventDefault();
    event.stopPropagation();

    if (isSelectableTarget && selectableTarget) {
      const isTargetAlreadySelected = activeElements.some((element) => element.id === selectableTarget.id);
      const targetIds = isTargetAlreadySelected
        ? activeElements.map((element) => element.id)
        : [selectableTarget.id];
      const mode = targetIds.length > 1 ? 'multi' : 'single';

      if (!isTargetAlreadySelected) {
        setPendingContextMenu({
          mode,
          x: event.clientX,
          y: event.clientY,
          targetIds,
        });
        onEdit([selectableTarget]);
        return;
      }

      setContextMenu({
        mode,
        x: event.clientX,
        y: event.clientY,
        targetIds,
      });
      return;
    }

    setContextMenu({
      mode: 'empty',
      x: event.clientX,
      y: event.clientY,
      targetIds: [],
    });
  };

  const rotatable = useMemo(() => {
    const selectedSchemas = (schemasList[pageCursor] || []).filter((s) =>
      activeElements.map((ae) => ae.id).includes(s.id),
    );
    const schemaTypes = selectedSchemas.map((s) => s.type);
    const uniqueSchemaTypes = [...new Set(schemaTypes)];

    // Create a type-safe array of default schemas
    const defaultSchemas: Record<string, unknown>[] = [];

    pluginsRegistry.entries().forEach(([, plugin]) => {
      if (plugin.propPanel.defaultSchema) {
        defaultSchemas.push(plugin.propPanel.defaultSchema as Record<string, unknown>);
      }
    });

    // Check if all schema types have rotate property
    return uniqueSchemaTypes.every((type) => {
      const matchingSchema = defaultSchemas.find((ds) => ds && 'type' in ds && ds.type === type);
      return matchingSchema && 'rotate' in matchingSchema;
    });
  }, [activeElements, pageCursor, schemasList, pluginsRegistry]);

  const isEventInsideActivePaper = (target: EventTarget | null) => {
    const activePaper = paperRefs.current[pageCursor];
    if (!activePaper || !(target instanceof Node)) return false;
    return target === activePaper || activePaper.contains(target);
  };
  const normalizeActiveTargets = (targets: HTMLElement[]) => {
    const activePaper = paperRefs.current[pageCursor];
    if (!activePaper) return [];
    return dedupeById(
      targets.filter((target) => {
        if (!(target instanceof HTMLElement)) return false;
        if (!target.classList.contains(SELECTABLE_CLASSNAME)) return false;
        return target === activePaper || activePaper.contains(target);
      }),
    );
  };

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
    setPendingContextMenu(null);
  }, []);

  const handleInsertField = useCallback(() => {
    bridge?.runtime.addSchemaByType('text');
  }, [bridge]);

  const handlePaste = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.readText) return;
    const clipboardText = (await navigator.clipboard.readText().catch(() => '')).trim();
    if (!clipboardText || !bridge?.runtime) return;
    const normalized = clipboardText.replace(/^['"]|['"]$/g, '').trim();
    const knownTypes = new Set(['text', 'multiVariableText', 'date', 'dateTime', 'time', 'checkbox', 'radioGroup', 'select']);
    if (knownTypes.has(normalized)) {
      bridge.runtime.addSchemaByType(normalized);
      return;
    }
    try {
      const parsed = JSON.parse(clipboardText) as { type?: unknown };
      if (typeof parsed?.type === 'string' && knownTypes.has(parsed.type)) {
        bridge.runtime.addSchemaByType(parsed.type);
      }
    } catch {
      // Ignore clipboard content that isn't a schema payload.
    }
  }, [bridge]);

  const canvasContextMenuExternalActions = useMemo(
    () => ({
      onInsertField: handleInsertField,
      onPaste: handlePaste,
      onAddPage: canvasActions?.addPageAfter,
      onOpenCatalog: () => bridge?.runtime.setSidebarOpen(true),
      onUploadOrReplacePdf: canvasActions?.uploadPdf,
      onOpenGroupProperties: selectionCommands?.openProperties,
    }),
    [bridge, canvasActions?.addPageAfter, canvasActions?.uploadPdf, handleInsertField, handlePaste, selectionCommands],
  );
  const hasClipboardData = typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.readText);
  const contextMenuSelectionSchemas = useMemo(() => {
    if (!contextMenu) return [];
    const targetIds = new Set(contextMenu.targetIds);
    return (schemasList[pageCursor] || []).filter((schema) => targetIds.has(schema.id));
  }, [contextMenu, pageCursor, schemasList]);
  const contextMenuSelectionReadOnly = contextMenuSelectionSchemas.length > 0
    && contextMenuSelectionSchemas.every((schema) => schema.readOnly);
  const contextMenuSelectionRequired = contextMenuSelectionSchemas.length > 0
    && contextMenuSelectionSchemas.every((schema) => schema.required);

  useEffect(() => {
    if (!pendingContextMenu) return;
    const pendingIds = pendingContextMenu.targetIds.join('|');
    const currentIds = activeElements.map((element) => element.id).join('|');
    if (pendingIds === currentIds) {
      setContextMenu(pendingContextMenu);
      setPendingContextMenu(null);
    } else if (currentIds) {
      setPendingContextMenu(null);
    }
  }, [activeElements, pendingContextMenu]);

  useEffect(() => {
    if (!contextMenu || contextMenu.mode === 'empty') return;
    const currentIds = activeElements.map((element) => element.id).join('|');
    if (currentIds !== contextMenu.targetIds.join('|')) {
      closeContextMenu();
    }
  }, [activeElements, closeContextMenu, contextMenu]);

  const zoomPercent = Math.max(1, Math.round(scale * 100));
  const zoomTier = zoomPercent < 80 ? 'low' : zoomPercent > 140 ? 'high' : 'medium';
  const activePageSchemaCount = (schemasList[pageCursor] || []).length;
  const interactionState = deriveInteractionState({
    activeElements,
    hoveringSchemaId,
    editing,
    isDragging,
    isResizing,
    isRotating,
  });
  useEffect(() => {
    onInteractionStateChange?.(interactionState);
  }, [interactionState, onInteractionStateChange]);

  useEffect(() => {
    paperRefs.current.forEach((paper, index) => {
      if (!paper) return;
      paper.dataset.canvasPage = 'true';
      paper.dataset.pageIndex = String(index);
      paper.dataset.pageActive = index === pageCursor ? 'true' : 'false';
      paper.dataset.pageEmpty = ((schemasList[index] || []).length === 0).toString();
    });
  }, [paperRefs, pageCursor, schemasList]);

  return (
    <div
      className={[DESIGNER_CLASSNAME + 'canvas', classNames?.canvasContainer]
        .filter(Boolean)
        .join(' ')}
      onContextMenu={handleCanvasContextMenu}
      data-zoom-percent={zoomPercent}
      data-zoom-tier={zoomTier}
      data-active-page={pageCursor}
      data-active-page-empty={(activePageSchemaCount === 0).toString()}
      data-interaction-phase={interactionState.phase}
      data-interaction-count={String(interactionState.selectionCount)}
      data-interaction-dragging={interactionState.isDragging ? 'true' : 'false'}
      data-interaction-resizing={interactionState.isResizing ? 'true' : 'false'}
      data-interaction-rotating={interactionState.isRotating ? 'true' : 'false'}
      ref={ref}>
      {feature.selecto ? (
        <SelectoSlot
          container={paperRefs.current[pageCursor]}
          continueSelect={isPressShiftKey}
          className={classNames?.selecto}
          useDefaultStyles={useDefaultStyles}
          selectionStyle={styleOverrides?.selectoSelection}
          onDragStart={(e) => {
            // Use type assertion to safely access inputEvent properties
            const inputEvent = e.inputEvent as MouseEvent | TouchEvent;
            const target = inputEvent.target as Element | null;
            const isInsidePaper = isEventInsideActivePaper(target);
            if (!isInsidePaper) {
              return;
            }
            const isMoveableElement = moveable.current?.isMoveableElement(target as Element);

            if ((inputEvent.type === 'touchstart' && e.isTrusted) || isMoveableElement) {
              e.stop();
            }

            if (paperRefs.current[pageCursor] === target) {
              onEdit([]);
            }

          }}
          onSelect={(e) => {
            // Use type assertions to safely access properties
            const inputEvent = e.inputEvent as MouseEvent | TouchEvent;
            const target = inputEvent.target as Element | null;
            const isInsidePaper = isEventInsideActivePaper(target);
            if (!isInsidePaper) {
              return;
            }
            const added = e.added as HTMLElement[];
            const removed = e.removed as HTMLElement[];
            const selected = e.selected as HTMLElement[];

            const isClick = inputEvent.type === 'mousedown';
            let newActiveElements: HTMLElement[] = isClick ? selected : [];

            if (!isClick && added.length > 0) {
              newActiveElements = activeElements.concat(added);
            }
            if (!isClick && removed.length > 0) {
              newActiveElements = activeElements.filter((ae) => !removed.includes(ae));
            }
            const normalizedSelection = normalizeActiveTargets(newActiveElements);
            onEdit(normalizedSelection);

            const selectionChanged =
              normalizedSelection.length !== activeElements.length ||
              normalizedSelection.some((element, index) => element.id !== activeElements[index]?.id);
            if (selectionChanged) {
              setEditing(false);
            }

            // For MacOS CMD+SHIFT+3/4 screenshots where the keydown event is never received, check mouse too
            const mouseEvent = inputEvent as MouseEvent;
            if (mouseEvent && typeof mouseEvent.shiftKey === 'boolean' && !mouseEvent.shiftKey) {
              setIsPressShiftKey(false);
            }
          }}
        />
      ) : null}
      <Paper
        paperRefs={paperRefs}
        scale={scale}
        size={size}
        schemasList={schemasList}
        pageSizes={pageSizes}
        backgrounds={backgrounds}
        hasRulers={true}
        renderPaper={({ index, paperSize }) => (
          <>
            {feature.padding ? (
              <PaddingSlot
                basePdf={basePdf}
                className={classNames?.padding}
                color={styleOverrides?.padding?.color}
                opacity={styleOverrides?.padding?.opacity}
              />
            ) : null}
            {pageCursor === index && (schemasList[index] || []).length === 0 ? (
              <div
                className={[DESIGNER_CLASSNAME + 'canvas-empty-state', classNames?.emptyState]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className={DESIGNER_CLASSNAME + 'canvas-empty-state-card'}>
                  <span className={DESIGNER_CLASSNAME + 'canvas-empty-state-title'}>
                    Esta página todavía no tiene campos
                  </span>
                  <span className={DESIGNER_CLASSNAME + 'canvas-empty-state-hint'}>
                    Arrastra un campo del catálogo izquierdo para empezar a construir el documento.
                  </span>
                </div>
              </div>
            ) : null}
            <StaticSchema
              template={{ schemas: schemasList, basePdf }}
              input={Object.fromEntries(
                schemasList.flat().map(({ name, content = '' }) => [name, content]),
              )}
              scale={scale}
              totalPages={schemasList.length}
              currentPage={index + 1}
            />
            {feature.guides ? (
              <GuidesSlot
                className={classNames?.guides}
                paperSize={paperSize}
                unit={styleOverrides?.guides?.unit}
                palette={{
                  backgroundColor: styleOverrides?.guides?.backgroundColor,
                  lineColor: styleOverrides?.guides?.lineColor,
                  textColor: styleOverrides?.guides?.textColor,
                  cornerBackground: styleOverrides?.guides?.cornerBackground,
                }}
                horizontalRef={(e) => {
                  if (e) horizontalGuides.current[index] = e;
                }}
                verticalRef={(e) => {
                  if (e) verticalGuides.current[index] = e;
                }}
              />
            ) : null}
            {pageCursor !== index ? (
              feature.mask ? (
                <MaskSlot
                  className={classNames?.mask}
                  width={paperSize.width + RULER_HEIGHT}
                  height={paperSize.height + RULER_HEIGHT}
                  maskColor={styleOverrides?.mask?.color}
                  blur={styleOverrides?.mask?.blur}
                />
              ) : null
            ) : (
              !editing && feature.moveable && (
                <MoveableSlot
                  ref={moveable}
                  className={classNames?.moveable}
                  useDefaultStyles={useDefaultStyles}
                  moveableColor={styleOverrides?.moveable?.color}
                  target={activeElements}
                  bounds={{ left: 0, top: 0, bottom: paperSize.height, right: paperSize.width }}
                  horizontalGuidelines={getGuideLines(horizontalGuides.current, index)}
                  verticalGuidelines={getGuideLines(verticalGuides.current, index)}
                  keepRatio={isPressShiftKey}
                  rotatable={rotatable}
                  onDrag={onDrag}
                  onDragStart={handleDragStart}
                  onDragEnd={onDragEnd}
                  onDragGroupEnd={onDragEnds}
                  onRotate={onRotate}
                  onRotateStart={handleRotateStart}
                  onRotateEnd={onRotateEnd}
                  onRotateGroupEnd={onRotateEnds}
                  onResize={onResize}
                  onResizeStart={handleResizeStart}
                  onResizeEnd={onResizeEnd}
                  onResizeGroupEnd={onResizeEnds}
                  onClick={onClickMoveable}
                />
              )
            )}
          </>
        )}
        renderSchema={({ schema, index }) => {
          const isActive = activeElements.map((ae) => ae.id).includes(schema.id);
          const isHovering = hoveringSchemaId === schema.id;
          const mode =
            editing && isActive
              ? 'designer'
              : 'viewer';

          const content = schema.content || '';
          let value = content;

          if (mode !== 'designer' && schema.readOnly) {
            const variables = {
              ...schemasList.flat().reduce(
                (acc, currSchema) => {
                  acc[currSchema.name] = currSchema.content || '';
                  return acc;
                },
                {} as Record<string, string>,
              ),
              totalPages: schemasList.length,
              currentPage: index + 1,
            };

            value = replacePlaceholders({ content, variables, schemas: schemasList });
          }

          return (
            <Renderer
              key={schema.id}
              schema={schema}
              basePdf={basePdf}
              value={value}
              onChangeHoveringSchemaId={onChangeHoveringSchemaId}
              mode={mode}
              onChange={
                (schemasList[pageCursor] || []).some((s) => s.id === schema.id)
                  ? (arg) => {
                    // Use type assertion to safely handle the argument
                    type ChangeArg = { key: string; value: unknown };
                    const args = Array.isArray(arg) ? (arg as ChangeArg[]) : [arg as ChangeArg];
                    changeSchemas(
                      args.map(({ key, value }) => ({ key, value, schemaId: schema.id })),
                    );
                  }
                  : undefined
              }
              stopEditing={() => setEditing(false)}
              isActive={isActive}
              isHovering={isHovering}
              isEditing={editing && isActive}
              outline={`1px ${hoveringSchemaId === schema.id ? 'solid' : 'dashed'} ${schema.readOnly && hoveringSchemaId !== schema.id
                ? 'transparent'
                : resolveSchemaTone(schema, token.colorPrimary)
                }`}
              scale={scale}
            />
          );
        }}
      />
      <CanvasOverlayManager
        activeElements={activeElements}
        schemasList={schemasList}
        pageCursor={pageCursor}
        pageSize={pageSizes[pageCursor] ?? { width: 0, height: 0 }}
        snapLines={snapLines}
        SnapLinesSlot={SnapLinesSlot}
        selectionCommands={selectionCommands}
        interactionState={interactionState}
        featureSnapLines={feature.snapLines}
        contextMenuOpen={Boolean(contextMenu)}
      />
      <CanvasContextMenu
        open={Boolean(contextMenu)}
        mode={contextMenu?.mode || 'empty'}
        position={contextMenu ? { x: contextMenu.x, y: contextMenu.y } : null}
        commands={selectionCommands}
        externalActions={canvasContextMenuExternalActions}
        hasClipboardData={hasClipboardData}
        selectionCount={contextMenu?.targetIds.length}
        activeReadOnly={contextMenuSelectionReadOnly}
        activeRequired={contextMenuSelectionRequired}
        onClose={closeContextMenu}
      />
    </div>
  );
};
export default forwardRef<HTMLDivElement, CanvasProps>(Canvas);
