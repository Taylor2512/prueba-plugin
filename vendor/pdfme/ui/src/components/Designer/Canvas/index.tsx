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
import { theme, Button } from 'antd';
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
import { X } from 'lucide-react';
import { RULER_HEIGHT, DESIGNER_CLASSNAME } from '../../../constants.js';
import { usePrevious } from '../../../hooks.js';
import { round, flatten, uuid } from '../../../helper.js';
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

const mm2px = (mm: number) => mm * 3.7795275591;

const DELETE_BTN_ID = uuid();
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

const SelectionActionsOverlay = ({
  activeElements: aes,
  paperSize,
  onDelete,
}: {
  activeElements: HTMLElement[];
  paperSize: Size;
  onDelete: () => void;
}) => {
  const { token } = theme.useToken();
  if (!aes.length) return null;

  const top = Math.min(...aes.map(({ style }) => fmt4Num(style.top)));
  const left = Math.min(...aes.map(({ style }) => fmt4Num(style.left)));
  const right = Math.max(...aes.map(({ style }) => fmt4Num(style.left) + fmt4Num(style.width)));
  const bottom = Math.max(...aes.map(({ style }) => fmt4Num(style.top) + fmt4Num(style.height)));
  const selectionCount = aes.length;

  const overlayWidth = selectionCount > 1 ? 72 : 44;
  const overlayHeight = 30;
  const defaultTop = top - overlayHeight - 8;
  const shouldFlipBelow = defaultTop < 6;
  const resolvedTop = shouldFlipBelow ? Math.min(paperSize.height - overlayHeight - 6, bottom + 8) : defaultTop;
  const desiredLeft = right + 8;
  const resolvedLeft = Math.max(
    6,
    Math.min(paperSize.width - overlayWidth - 6, desiredLeft > paperSize.width - overlayWidth ? left - overlayWidth - 8 : desiredLeft),
  );

  return (
    <div className={DESIGNER_CLASSNAME + 'selection-actions'}>
      {selectionCount > 1 ? (
        <span
          className={DESIGNER_CLASSNAME + "span-auto"}
        >
          {selectionCount}
        </span>
      ) : null}
      <Button
        id={DELETE_BTN_ID}
        aria-label="Eliminar selección"
        className={DESIGNER_CLASSNAME + 'delete-button'}
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}>
        <X size={14} className={DESIGNER_CLASSNAME + "x-auto"} />
      </Button>
    </div>
  );
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
  removeSchemas: (ids: string[]) => void;
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
    removeSchemas,
    onChangeHoveringSchemaId,
    paperRefs,
    sidebarOpen,
    sidebarWidth = 0,
    preserveSidebarSpace = true,
    featureToggles,
    styleOverrides,
    classNames,
    useDefaultStyles = true,
    components,
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
    deleteButton: featureToggles?.deleteButton !== false,
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
    const targetWidth = fmt(_width);
    const targetHeight = fmt(_height);
    const actualTop = top / ZOOM;
    const actualLeft = left / ZOOM;
    const { width: pageWidth, height: pageHeight } = pageSizes[pageCursor];
    let topPadding = 0;
    let rightPadding = 0;
    let bottomPadding = 0;
    let leftPadding = 0;

    if (isBlankPdf(basePdf)) {
      const [t, r, b, l] = basePdf.padding;
      topPadding = t * ZOOM;
      rightPadding = r;
      bottomPadding = b;
      leftPadding = l * ZOOM;
    }

    const clampTop = (value: number) => {
      if (value + targetHeight > pageHeight - bottomPadding) {
        return pageHeight - targetHeight - bottomPadding;
      }
      return value < topPadding ? topPadding : value;
    };
    const clampLeft = (value: number) => {
      if (value + targetWidth > pageWidth - rightPadding) {
        return pageWidth - targetWidth - rightPadding;
      }
      return value < leftPadding ? leftPadding : value;
    };

    const currentSchemas = schemasList[pageCursor] || [];
    const others = currentSchemas
      .filter((s) => !activeElements.map((ae) => ae.id).includes(s.id))
      .map((s) => ({ x: s.position.x, y: s.position.y, width: s.width, height: s.height }));

    const snapResult = isPressAltKey
      ? { snapped: { x: actualLeft, y: actualTop }, lines: [] as SnapLine[] }
      : computeSnapResult(
          { x: actualLeft, y: actualTop, width: targetWidth, height: targetHeight },
          { width: pageWidth, height: pageHeight },
          others,
        );

    const nextTop = clampTop(snapResult.snapped.y);
    const nextLeft = clampLeft(snapResult.snapped.x);
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

  const safeCanvasWidth = Number.isFinite(size.width) ? Math.max(0, size.width) : 0;
  const safeCanvasHeight = Number.isFinite(size.height) ? Math.max(0, size.height) : 0;
  const safeSidebarOffset =
    preserveSidebarSpace && sidebarOpen && sidebarWidth > 0
      ? Math.max(0, Math.min(sidebarWidth, Math.max(0, safeCanvasWidth - 120)))
      : 0;
  const effectiveCanvasWidth = Math.max(0, safeCanvasWidth - safeSidebarOffset);
  const zoomPercent = Math.max(1, Math.round(scale * 100));
  const zoomTier = zoomPercent < 80 ? 'low' : zoomPercent > 140 ? 'high' : 'medium';
  const activePageSchemaCount = (schemasList[pageCursor] || []).length;
  const selectionState = editing ? 'editing' : activeElements.length > 0 ? 'selected' : hoveringSchemaId ? 'hover' : 'idle';
  const selectionCountState = activeElements.length > 1 ? 'multi' : activeElements.length === 1 ? 'single' : 'none';

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
      data-zoom-percent={zoomPercent}
      data-zoom-tier={zoomTier}
      data-active-page={pageCursor}
      data-active-page-empty={(activePageSchemaCount === 0).toString()}
      data-selection-state={selectionState}
      data-selection-count={selectionCountState}
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

          // Check if the target is an HTMLElement and has an id property
          const targetElement = target as HTMLElement | null;
          if (targetElement && targetElement.id === DELETE_BTN_ID) {
            removeSchemas(activeElements.map((ae) => ae.id));
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
          onEdit(newActiveElements);

          if (newActiveElements != activeElements) {
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
      {feature.snapLines && snapLines.length > 0 ? (
        <SnapLinesSlot
          className={classNames?.snapLines}
          useDefaultStyles={useDefaultStyles}
          palette={styleOverrides?.snapLines}
          lines={snapLines}
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
            {!editing && activeElements.length > 0 && pageCursor === index && feature.deleteButton ? (
              <SelectionActionsOverlay
                activeElements={activeElements}
                paperSize={paperSize}
                onDelete={() => removeSchemas(activeElements.map((ae) => ae.id))}
              />
            ) : null}
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
                  Arrastra un campo desde el panel izquierdo para comenzar a diseñar esta página.
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
                  onDragEnd={onDragEnd}
                  onDragGroupEnd={onDragEnds}
                  onRotate={onRotate}
                  onRotateEnd={onRotateEnd}
                  onRotateGroupEnd={onRotateEnds}
                  onResize={onResize}
                  onResizeEnd={onResizeEnd}
                  onResizeGroupEnd={onResizeEnds}
                  onClick={onClickMoveable}
                />
              )
            )}
          </>
        )}
        renderSchema={({ schema, index }) => {
          const mode =
            editing && activeElements.map((ae) => ae.id).includes(schema.id)
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
              outline={`1px ${hoveringSchemaId === schema.id ? 'solid' : 'dashed'} ${
                schema.readOnly && hoveringSchemaId !== schema.id
                  ? 'transparent'
                  : resolveSchemaTone(schema, token.colorPrimary)
              }`}
              scale={scale}
            />
          );
        }}
      />
    </div>
  );
};
export default forwardRef<HTMLDivElement, CanvasProps>(Canvas);
