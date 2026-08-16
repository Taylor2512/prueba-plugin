/**
 * Canvas — núcleo visual e interactivo del diseñador SISAD PDFME.
 *
 * Este componente orquesta el lienzo completo del editor:
 *
 * - renderizado de páginas/Paper y schemas;
 * - selección con Selecto;
 * - transformación con Moveable;
 * - guías, padding, máscara, snap lines y overlays;
 * - menú contextual y toolbar de selección;
 * - edición inline de texto/nombre;
 * - creación de comentarios libres;
 * - estados no listos del canvas: loading, error, página vacía y desconexión;
 * - compatibilidad multidocumento/multipágina.
 *
 * Regla arquitectónica:
 * Este archivo coordina interacciones del canvas, pero no debe contener reglas
 * de negocio del host, lógica Uanataca, lógica de StepOne/StepTwo ni hacks de
 * integración externos. Las operaciones deben pasar por comandos, bridge o
 * callbacks inyectados.
 */
import React,
{
  Ref,
  useMemo,
  useContext,
  MutableRefObject,
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
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
} from '@sisad-pdfme/common';
import type { DesignerComponentBridge } from '@sisad-pdfme/ui/types';
import { OptionsContext, PluginsRegistry } from '@sisad-pdfme/ui/contexts';
import { RULER_HEIGHT, DESIGNER_CLASSNAME, SELECTABLE_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { usePrevious } from '@sisad-pdfme/ui/hooks';
import { round, flatten } from '@sisad-pdfme/ui/helper';
import Paper from '@sisad-pdfme/ui/components/Paper';
import Renderer from '@sisad-pdfme/ui/components/Renderer';
import { useSisadPdfmeConfig } from '@sisad-pdfme/react/useSisadPdfmeConfig';
import { configFromRuntimeOptions } from '@sisad-pdfme/config/configFromRuntimeOptions';
import Selecto from '@sisad-pdfme/ui/components/Designer/Canvas/Selecto';
import Moveable from '@sisad-pdfme/ui/components/Designer/Canvas/Moveable';
import Guides from '@sisad-pdfme/ui/components/Designer/Canvas/Guides';
import Mask from '@sisad-pdfme/ui/components/Designer/Canvas/Mask';
import Padding from '@sisad-pdfme/ui/components/Designer/Canvas/Padding';
import StaticSchema from '@sisad-pdfme/ui/components/StaticSchema';
import SnapLines from '@sisad-pdfme/ui/components/Designer/Canvas/SnapLines';
import { computeSnapResult, type SnapLine } from '@sisad-pdfme/ui/components/Designer/Canvas/snapEngine';
import {
  canvasViewDataAttributes,
  resolveCanvasViewCapabilities,
} from '@sisad-pdfme/ui/components/Designer/Canvas/canvasViewCapabilities';
import { createGridGeometry, gridCssVariables, snapPointToGrid } from '@sisad-pdfme/ui/components/Designer/Canvas/gridGeometry';
import { resolveSchemaTone } from '@sisad-pdfme/ui/components/Designer/shared/schemaTone';
import { mixHexColor } from '@sisad-pdfme/schemas/shared/fieldChrome';
import { deriveInteractionState } from '@sisad-pdfme/ui/components/Designer/shared/interactionState';
import type { InteractionState } from '@sisad-pdfme/ui/components/Designer/shared/interactionState';
import {
  type InlineEditTarget,
  type SelectionCommandSet,
} from '@sisad-pdfme/ui/components/Designer/shared/selectionCommands';
import {
  detectPlatform,
  resolveSelectionIntent,
  isAdditiveSelectionIntent,
  type PlatformKind,
} from '@sisad-pdfme/ui/components/Designer/shared/selectionPolicy';
import {
  resolveDesignerSchemaAccessState,
  isTransformable,
  type SchemaAccessContext,
} from '@sisad-pdfme/ui/components/Designer/shared/accessPolicy';
import { DesignerCoordinateService } from '@sisad-pdfme/ui/components/Designer/shared/designerCoordinateService';
import {
  shouldSuppressCanvasRegionSelection,
  isEditableTarget,
  isAntDPopupTarget,
} from '@sisad-pdfme/ui/components/Designer/shared/interactionGuards';
import { isMoveableTarget } from '@sisad-pdfme/ui/components/Designer/shared/transformTargetGuards';
import { isSelectoExcludedTarget } from '@sisad-pdfme/ui/components/Designer/shared/selectableTargetGuards';
import { isCanvasSelectionExcludedTarget } from '@sisad-pdfme/ui/components/Designer/shared/interactionTargetPolicy';
import {
  isSameDocumentPageSelection,
  resolveSelectionPageIndex,
} from '@sisad-pdfme/ui/components/Designer/shared/selectionIdentityResolver';
import { applyPageMetadataDataset } from '@sisad-pdfme/ui/components/shared/pageMetadata';
import type { EffectiveCollaborationContext } from '@sisad-pdfme/ui/collaborationContext';
import { buildRecipientNameMap, buildRecipientColorMap, normalizeCollaborationRecipients } from '@sisad-pdfme/ui/collaborationContext';
import CanvasOverlayManager from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager';
import CanvasContextMenu from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu';
import CanvasStateOverlay from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasStateOverlay';
import InlineEditOverlay, { type InlineEditSession } from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay';
import {
  deriveCanvasBlockReason,
  shouldDisplayBlockingMask,
  type CanvasInteractionMode,
} from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/overlayState';
import { useCanvasRenderState } from '@sisad-pdfme/canvas/useCanvasRenderState';
import { isCanvasInteractive } from '@sisad-pdfme/canvas/canvasRenderState';

/**
 * Convierte milímetros a píxeles usando el factor CSS estándar de 96 DPI.
 *
 * Se usa para calcular bounds visuales de Moveable y overlays dentro del Paper.
 */
const mmToPxCanvas = (mm: number) => mm * 3.7795275591;

/**
 * Convierte una medida CSS en px a número crudo.
 */
const fmt4Num = (prop: string) => Number(prop.replace('px', ''));
/**
 * Convierte una medida CSS en px a milímetros de template, redondeada.
 */
const fmt = (prop: string) => round(fmt4Num(prop) / ZOOM, 2);
/**
 * Indica si el handle de resize modifica el origen superior/izquierdo.
 */
const isTopLeftResize = (d: string) => d === '-1,-1' || d === '-1,0' || d === '0,-1';
/**
 * Normaliza rotación a un rango positivo 0..359.
 */
const normalizeRotate = (angle: number) => ((angle % 360) + 360) % 360;
/**
 * Extrae el ángulo desde un transform CSS `rotate(Xdeg)` y lo normaliza.
 */
const parseRotateFromTransform = (transform: string) =>
  normalizeRotate(Number(transform.replace('rotate(', '').replace('deg)', '')));
/**
 * Construye cambios de posición compatibles con `changeSchemas`.
 */
const buildPositionChanges = (schemaId: string, top: string, left: string) => [
  { key: 'position.y', value: fmt(top), schemaId },
  { key: 'position.x', value: fmt(left), schemaId },
];
/**
 * Construye cambios de tamaño y posición compatibles con `changeSchemas`.
 */
const buildSizeAndPositionChanges = (schemaId: string, width: string, height: string, top: string, left: string) => [
  { key: 'width', value: fmt(width), schemaId },
  { key: 'height', value: fmt(height), schemaId },
  { key: 'position.y', value: fmt(top), schemaId },
  { key: 'position.x', value: fmt(left), schemaId },
];
/**
 * Resuelve padding del PDF base en milímetros.
 *
 * Solo aplica cuando el template usa PDF en blanco; para PDFs reales el padding
 * se considera cero porque el contenido del documento define el área útil.
 */
const getPaddingMm = (basePdf: BasePdf): [number, number, number, number] => {
  if (!isBlankPdf(basePdf)) return [0, 0, 0, 0];
  const [top, right, bottom, left] = basePdf.padding;
  return [top, right, bottom, left];
};
/**
 * Limita un valor numérico dentro de un rango inclusivo.
 */
const clampValue = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
/**
 * Convierte dataset numérico a number entero seguro.
 */
const toNumber = (value: string | undefined): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
};
/**
 * Tipos cuyo doble click debe priorizar edición de contenido visible.
 */
const CONTENT_DRIVEN_INLINE_EDIT_TYPES = new Set(['text', 'multivariabletext']);

/**
 * Construye selector CSS seguro para ubicar un schema por `data-schema-id`.
 */
const buildSchemaSelector = (schemaId: string): string => {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return `[data-schema-id="${CSS.escape(schemaId)}"]`;
  }
  return `[data-schema-id="${schemaId.replace(/"/g, '\\"')}"]`;
};

/**
 * Estado serializable del menú contextual del canvas.
 *
 * Guarda modo, coordenada de apertura y schemas objetivo para evitar depender
 * del evento original después de que React lo libere.
 */
type CanvasContextMenuState = {
  mode: 'empty' | 'single' | 'multi';
  x: number;
  y: number;
  targetIds: string[];
};

/**
 * Interfaz mínima consumida por Canvas desde @scena/react-guides.
 */
interface GuidesInterface {
  getGuides(): number[];
  scroll(pos: number): void;
  scrollGuides(pos: number): void;
  loadGuides(guides: number[]): void;
  resize(): void;
}

/**
 * Feature flags visuales/interactivos del canvas.
 *
 * Permiten apagar Selecto, Moveable, guías, padding, máscara o snap lines sin
 * modificar el flujo principal del diseñador.
 */
export type CanvasFeatureToggles = {
  selecto?: boolean;
  snapLines?: boolean;
  grid?: boolean;
  guides?: boolean;
  padding?: boolean;
  mask?: boolean;
  moveable?: boolean;
  deleteButton?: boolean;
  /**
   * Reglas. Tienen toggle propio: antes se derivaban de `guides`, así que
   * apagar las guías apagaba también las reglas (RTP-455).
   */
  rulers?: boolean;
  /** Ajuste a la rejilla. Independiente de que la rejilla se vea. */
  snapToGrid?: boolean;
  /** Ajuste contra otros elementos y bordes de página (`snapEngine`). */
  objectSnap?: boolean;
  /** El usuario puede crear guías arrastrando desde las reglas. */
  guideCreation?: boolean;
  /** Ajuste contra las guías creadas por el usuario. */
  guideSnap?: boolean;
};

/**
 * Overrides visuales opcionales para slots del canvas.
 *
 * Se usan para tematizar sin introducir CSS host contra clases internas.
 */
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

/**
 * Clases CSS opcionales para slots controlados del canvas.
 */
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

/**
 * Slots reemplazables del canvas.
 *
 * Útil para tests, laboratorios visuales o integraciones que necesitan usar
 * variantes controladas de Selecto/Moveable/Guides sin duplicar Canvas.
 */
export type CanvasComponentSlots = {
  Selecto?: typeof Selecto;
  SnapLines?: typeof SnapLines;
  Guides?: typeof Guides;
  Mask?: typeof Mask;
  Padding?: typeof Padding;
  Moveable?: typeof Moveable;
};

/**
 * Props principales del Canvas del diseñador.
 *
 * Agrupan documento base, páginas, schemas, selección, callbacks de edición,
 * refs de Paper, slots visuales, bridge runtime, comandos, colaboración y estado
 * de renderizado.
 */
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
  registerPaperRef: (paperIndex: number, element: HTMLDivElement | null) => void;
  renderedSchemasList?: SchemaForUI[][];
  sidebarOpen: boolean;
  sidebarWidth?: number;
  preserveSidebarSpace?: boolean;
  contentOffsetX?: number;
  featureToggles?: CanvasFeatureToggles;
  styleOverrides?: CanvasStyleOverrides;
  classNames?: CanvasClassNames;
  useDefaultStyles?: boolean;
  components?: CanvasComponentSlots;
  bridge?: DesignerComponentBridge;
  topLevelComments?: Array<{ anchor?: Record<string, unknown>; comment?: Record<string, unknown> }>;
  activeDocumentId?: string | null;
  externalSchemaDragActive?: boolean;
  canvasActions?: {
    addPageAfter?: () => void;
    uploadPdf?: () => void;
  };
  selectionCommands?: SelectionCommandSet;
  collaborationContext?: Partial<EffectiveCollaborationContext>;
  onInteractionStateChange?: (state: InteractionState) => void;

  // ── Canvas render state inputs (Phase 4) ────────────────────────────
  isLoadingDocument?: boolean;
  isSwitchingDocument?: boolean;
  switchFromDocId?: string;
  switchToDocId?: string;
  isLoadingPage?: boolean;
  renderError?: Error | null;
  renderErrorRecoverable?: boolean;
  pdfLoadError?: { reason: 'not_found' | 'encrypted' | 'unsupported' | 'network' } | null;
  isCollaborationDisconnected?: boolean;
  lastSyncAt?: number;
  onRetryRender?: () => void;
}

/**
 * Componente principal de canvas.
 *
 * Coordina renderizado del documento y todas las capas de interacción. Exporta
 * un ref imperativo extendido para abrir/cancelar edición inline desde comandos
 * externos del diseñador.
 */
const Canvas = function Canvas(props: CanvasProps, ref: Ref<HTMLDivElement | null>) {
  const {
    basePdf,
    pageCursor,
    scale,
    backgrounds,
    pageSizes,
    size,
    activeElements,
    schemasList,
    renderedSchemasList,
    hoveringSchemaId,
    onEdit,
    changeSchemas,
    onChangeHoveringSchemaId,
    paperRefs,
    registerPaperRef,
    contentOffsetX = 0,
    featureToggles,
    styleOverrides,
    classNames,
    useDefaultStyles = true,
    components,
    bridge,
    topLevelComments = [],
    activeDocumentId = null,
    externalSchemaDragActive = false,
    canvasActions,
    selectionCommands,
    collaborationContext,
    onInteractionStateChange,
    isLoadingDocument = false,
    isSwitchingDocument = false,
    switchFromDocId,
    switchToDocId,
    isLoadingPage = false,
    renderError,
    renderErrorRecoverable,
    pdfLoadError,
    isCollaborationDisconnected = false,
    lastSyncAt,
    onRetryRender,
} = props;
  /**
   * Slots efectivos usados por el canvas.
   *
   * Cada slot puede reemplazarse desde props para pruebas o personalización.
   */
  const SelectoSlot = components?.Selecto || Selecto;
  const SnapLinesSlot = components?.SnapLines || SnapLines;
  const GuidesSlot = components?.Guides || Guides;
  const MaskSlot = components?.Mask || Mask;
  const PaddingSlot = components?.Padding || Padding;
  const MoveableSlot = components?.Moveable || Moveable;

  /**
   * Feature flags normalizados.
   *
   * Por defecto todo está activo salvo que el host lo apague explícitamente.
   */
  const feature = {
    selecto: featureToggles?.selecto !== false,
    snapLines: featureToggles?.snapLines !== false,
    grid: featureToggles?.grid !== false,
    guides: featureToggles?.guides !== false,
    padding: featureToggles?.padding !== false,
    mask: featureToggles?.mask !== false,
    moveable: featureToggles?.moveable !== false,
  };
  /**
   * Tokens visuales Ant Design usados para tonos de selección/outline.
   */
  const { token } = theme.useToken();
  /**
   * Registry de plugins necesario para determinar capacidades como rotación.
   */
  const pluginsRegistry = useContext(PluginsRegistry);
  const options = useContext(OptionsContext);
  const configFromOptions = useMemo(() => configFromRuntimeOptions(options), [options]);
  const resolvedConfig = useSisadPdfmeConfig(configFromOptions);
  const canvasVisibility = resolvedConfig.visibility.canvas;
  /**
   * Estado efectivo de las ocho capabilities de vista, cada una resuelta por
   * separado. Sustituye a las expresiones inline que ataban las reglas a las
   * guías y confundían «snap activo» con «líneas de snap visibles» (RTP-455).
   */
  const viewCapabilities = useMemo(
    () =>
      resolveCanvasViewCapabilities({
        toggles: featureToggles,
        visibility: canvasVisibility,
        canvasEnabled: resolvedConfig.config.canvas.enabled !== false,
      }),
    [featureToggles, canvasVisibility, resolvedConfig.config.canvas.enabled],
  );
  const viewDataAttributes = useMemo(
    () => canvasViewDataAttributes(viewCapabilities),
    [viewCapabilities],
  );
  /**
   * Plataforma detectada para normalización de atajos y selección.
   */
  const platform = useMemo<PlatformKind>(() => detectPlatform(), []);

  /**
   * Estado de teclas modificadoras usadas para selección múltiple, ratio y snap.
   */
  const [modifierKeys, setModifierKeys] = useState({
    shift: false,
    alt: false,
    ctrl: false,
    meta: false,
  });
  const clearModifierKeys = useCallback(() => {
    setModifierKeys({
      shift: false,
      alt: false,
      ctrl: false,
      meta: false,
    });
  }, []);

  /**
   * Indica si la intención de selección actual es acumulativa (Shift/Ctrl/Cmd).
   * Shift es acumulativo en cualquier plataforma (paridad DocuSign/Wix);
   * Ctrl/Cmd siguen la convención por SO.
   */
  const isMultiSelectActive = useMemo(() => {
    const isMac = platform === 'mac';
    return modifierKeys.shift || (isMac ? modifierKeys.meta : modifierKeys.ctrl);
  }, [platform, modifierKeys]);

  /**
   * Contexto de acceso para reglas de bloqueo y edición.
   */
  const accessContext = useMemo<SchemaAccessContext>(() => ({
    isReadonly: false, // Por ahora el diseñador es siempre escritura, o depende de feature
    activeUserId: collaborationContext?.actorId,
    canEditStructure: collaborationContext?.canEditStructure ?? true,
  }), [collaborationContext?.actorId, collaborationContext?.canEditStructure]);

  const safeCollaborationContext = useMemo<EffectiveCollaborationContext | undefined>(() => {
    if (!collaborationContext) return undefined;
    const rawRecipientOptions = collaborationContext.recipientOptions ?? [];
    const recipientOptions = normalizeCollaborationRecipients(rawRecipientOptions);
    const recipientNameMap = collaborationContext.recipientNameMap ?? buildRecipientNameMap(recipientOptions);
    const recipientColorMap =
      collaborationContext.recipientColorMap ??
      buildRecipientColorMap(
        recipientOptions.map((r) => ({
          id: r.id,
          label: r.name || r.tag || r.id,
          color: r.color ?? undefined,
          email: r.email ?? undefined,
          company: r.company ?? undefined,
          title: r.title ?? undefined,
        })),
      );
    return {
      ...collaborationContext,
      recipientOptions,
      recipientNameMap,
      recipientColorMap,
    } as EffectiveCollaborationContext;
  }, [collaborationContext]);

  /**
   * Refs a guías verticales/horizontales por página.
   */
  const verticalGuides = useRef<GuidesInterface[]>([]);
  const horizontalGuides = useRef<GuidesInterface[]>([]);
  /**
   * Ref al adapter Moveable para actualizar rects y delegar dragStart manual.
   */
  const moveable = useRef<MoveableComponent>(null);
  /**
   * Estado local de edición inline activa.
   */
  const [editing, setEditing] = useState(false);
  const [inlineEditSession, setInlineEditSession] = useState<InlineEditSession | null>(null);
  /**
   * Snap lines visibles durante drag/resize.
   */
  const [snapLines, setSnapLines] = useState<SnapLine[]>([]);
  const snapRafRef = useRef<number | null>(null);
  const snapLinesKeyRef = useRef<string>('');
  const suppressPaperFocusOnEscapeRef = useRef(false);
  /**
   * Flags de interacción transformacional usados por overlays y guards.
   */
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  /**
   * Estado del menú contextual.
   *
   * `pendingContextMenu` permite abrir menú sobre un target que primero debe
   * sincronizarse como selección activa.
   */
  const [contextMenuState, setContextMenuState] = useState<{
    contextMenu: CanvasContextMenuState | null;
    pendingContextMenu: CanvasContextMenuState | null;
  }>({
    contextMenu: null,
    pendingContextMenu: null,
  });
  const contextMenu = contextMenuState.contextMenu;
  const pendingContextMenu = contextMenuState.pendingContextMenu;
  /**
   * Nodo raíz scrollable del canvas.
   */
  const rootRef = useRef<HTMLDivElement>(null);
  /**
   * Sesión de selección por región anclada a página/documento real.
   *
   * Evita que un rect de selección que cruza visualmente otra página capture
   * schemas fuera de la página donde inició el gesto.
   */
  const regionSelectionSessionRef = useRef<{
    pageIndex: number | null;
    pageNumber: number | null;
    documentId?: string;
    startedInsidePaper: boolean;
  } | null>(null);
  const clearRegionSelectionSession = useCallback(() => {
    regionSelectionSessionRef.current = null;
  }, []);
  const resetTransientCanvasInteraction = useCallback(() => {
    clearModifierKeys();
    clearRegionSelectionSession();
    setEditing(false);
    setInlineEditSession(null);
  }, [clearModifierKeys, clearRegionSelectionSession]);
  /**
   * Servicio de coordenadas usado para adaptar Selecto al sistema del diseñador.
   */
  const coordinateService = useMemo(
    () =>
      // Excepción a react-hooks/refs: las refs se pasan como getters que el
      // servicio invoca al resolver coordenadas, ya montado, no en el render.
      
      new DesignerCoordinateService({
        getZoom: () => scale,
        getCanvasRoot: () => rootRef.current,
        getPageElement: (pageIndex: number) => paperRefs.current[pageIndex] || null,
      }),
    [paperRefs, scale],
  );
  const setContextMenu = useCallback((next: CanvasContextMenuState | null) => {
    setContextMenuState((prev) => ({ ...prev, contextMenu: next }));
  }, []);
  const setPendingContextMenu = useCallback((next: CanvasContextMenuState | null) => {
    setContextMenuState((prev) => ({ ...prev, pendingContextMenu: next }));
  }, []);

  /**
   * Lista efectiva de schemas renderizados.
   *
   * Puede diferir de `schemasList` cuando existe una vista filtrada o preprocesada.
   */
  const renderedPageSchemasList = renderedSchemasList || schemasList;
  /**
   * Schemas visibles de la página actual del cursor.
   */
  const currentPageSchemas = useMemo(
    () => renderedPageSchemasList[pageCursor] || [],
    [pageCursor, renderedPageSchemasList],
  );
  /**
   * IDs DOM de elementos seleccionados.
   */
  const activeElementIds = useMemo(
    () => {
      const ids: string[] = [];
      for (const element of activeElements) {
        if (element) ids.push(element.id);
      }
      return ids;
    },
    [activeElements],
  );
  const activeElementIdSet = useMemo(() => new Set(activeElementIds), [activeElementIds]);
  const activeSelectionPageIndex = useMemo(
    () => resolveSelectionPageIndex(activeElements, pageCursor),
    [activeElements, pageCursor],
  );
  const moveablePageIndex = activeSelectionPageIndex ?? pageCursor;
  const moveablePageSchemas = useMemo(
    () => renderedPageSchemasList[moveablePageIndex] || [],
    [moveablePageIndex, renderedPageSchemasList],
  );
  const prevSchemas = usePrevious(moveablePageSchemas);
  const activeSelectionSchemas = useMemo(
    () => renderedPageSchemasList[moveablePageIndex] || currentPageSchemas,
    [currentPageSchemas, moveablePageIndex, renderedPageSchemasList],
  );
  // Keep Moveable scoped to the real page of the current selection, not the
  // global cursor page, so multi-page selections don't drift.
  /**
   * Targets efectivos para Moveable.
   *
   * En selección multipágina, filtra al pageIndex real para evitar drift de
   * transformaciones entre páginas. Además, excluye elementos bloqueados.
   */
  const moveableTargets = useMemo(() => {
    const targetPageIndex = moveablePageIndex;
    const samePageElements = isSameDocumentPageSelection(activeElements)
      ? activeElements
      : activeElements.filter((el) => toNumber(el.dataset.pageIndex) === targetPageIndex);

    // Filtrar transformables usando la política de acceso
    return samePageElements.filter((el) => {
      const id = el.dataset.schemaId;
      if (!id) return false;
      const schema = schemasList.flat().find((s) => s.id === id);
      if (!schema) return false;
      return isTransformable(resolveDesignerSchemaAccessState(schema, accessContext));
    });
  }, [activeElements, moveablePageIndex, schemasList, accessContext]);
  /**
   * Variables disponibles para reemplazo de placeholders en modo viewer/readOnly.
   */
  const placeholderVariables = useMemo(
    () =>
      Object.fromEntries(
        schemasList.flat().map(({ name, content = '' }) => [name, content]),
      ) as Record<string, string>,
    [schemasList],
  );
  /**
   * Template mínimo usado por StaticSchema/Renderer para render de página.
   */
  const paperTemplate = useMemo(
    () => ({ schemas: renderedPageSchemasList, basePdf }),
    [basePdf, renderedPageSchemasList],
  );

  /**
   * Sincroniza teclas modificadoras globales.
   */
  const onKeydown = (e: KeyboardEvent) => {
    setModifierKeys({
      shift: e.shiftKey,
      alt: e.altKey,
      ctrl: e.ctrlKey,
      meta: e.metaKey,
    });
    if (e.key === 'Escape' || e.key === 'Esc') {
      suppressPaperFocusOnEscapeRef.current = Boolean(
        typeof document !== 'undefined' && document.querySelector('.sisad-pdfme-ui-canvas-context-menu'),
      );
    }
  };
  /**
   * Libera modificadores y cancela edición con Escape.
   */
  const onKeyup = (e: KeyboardEvent) => {
    setModifierKeys({
      shift: e.shiftKey,
      alt: e.altKey,
      ctrl: e.ctrlKey,
      meta: e.metaKey,
    });
    if (e.key === 'Escape' || e.key === 'Esc') {
      setEditing(false);
      setInlineEditSession(null);
      const skipPaperFocus = suppressPaperFocusOnEscapeRef.current;
      suppressPaperFocusOnEscapeRef.current = false;
      if (!skipPaperFocus) {
        requestAnimationFrame(() => {
          const paper = rootRef.current?.querySelector<HTMLElement>('[data-paper-page="true"]');
          paper?.focus({ preventScroll: true });
        });
      }
    }
  };

  const initEvents = useCallback(() => {
    globalThis.addEventListener('keydown', onKeydown);
    globalThis.addEventListener('keyup', onKeyup);
    globalThis.addEventListener('blur', resetTransientCanvasInteraction);
    globalThis.addEventListener('sisad-pdfme:designer-interaction-reset', resetTransientCanvasInteraction as EventListener);
    document.addEventListener('visibilitychange', resetTransientCanvasInteraction);
  }, [resetTransientCanvasInteraction]);

  const destroyEvents = useCallback(() => {
    globalThis.removeEventListener('keydown', onKeydown);
    globalThis.removeEventListener('keyup', onKeyup);
    globalThis.removeEventListener('blur', resetTransientCanvasInteraction);
    globalThis.removeEventListener('sisad-pdfme:designer-interaction-reset', resetTransientCanvasInteraction as EventListener);
    document.removeEventListener('visibilitychange', resetTransientCanvasInteraction);
  }, [resetTransientCanvasInteraction]);

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
    if (!prevSchemas) {
      return;
    }

    const prevSchemaKeys = JSON.stringify(prevSchemas || []);
    const schemaKeys = JSON.stringify(moveablePageSchemas || []);

    if (prevSchemaKeys === schemaKeys) {
      moveable.current?.updateRect();
    }
  }, [moveablePageSchemas, prevSchemas]);

  /**
   * Maneja drag individual de Moveable con snap lines y límites de página.
   */
  const onDrag = ({ target, top, left }: OnDrag) => {
    const { width: _width, height: _height } = target.style;
    const targetWidthMm = fmt(_width);
    const targetHeightMm = fmt(_height);
    const actualTop = top / ZOOM;
    const actualLeft = left / ZOOM;
    const snapThresholdMm = 0.5;
    const targetPageIndex = resolvePageIndexForSchema(target.id, target as HTMLElement);
    const pageSize = pageSizes[targetPageIndex ?? pageCursor] || pageSizes[pageCursor];
    const { width: pageWidthMm, height: pageHeightMm } = pageSize;
    const [paddingTopMm, paddingRightMm, paddingBottomMm, paddingLeftMm] = getPaddingMm(basePdf);
    const minY = paddingTopMm;
    const minX = paddingLeftMm;
    const maxY = Math.max(minY, pageHeightMm - paddingBottomMm - targetHeightMm);
    const maxX = Math.max(minX, pageWidthMm - paddingRightMm - targetWidthMm);

    const currentSchemas = renderedPageSchemasList[targetPageIndex ?? pageCursor] || currentPageSchemas;
    const others = currentSchemas
      .filter((s) => !activeElementIdSet.has(s.id))
      .map((s) => ({ x: s.position.x, y: s.position.y, width: s.width, height: s.height }));

    /*
     * Object snap y snap-to-grid son capabilities INDEPENDIENTES y se componen
     * en un orden fijo: primero la rejilla —que es una retícula absoluta del
     * documento— y sobre su resultado el ajuste contra vecinos, que es
     * relativo y debe poder ganarle. Alt suspende ambos, como siempre.
     */
    const suppressSnap = modifierKeys.alt;
    const gridSnapped =
      !suppressSnap && viewCapabilities.snapToGrid.active
        ? snapPointToGrid(
          createGridGeometry({
            pageMm: { width: pageWidthMm, height: pageHeightMm },
            stepMm: resolvedConfig.config.canvas.gridStepMm,
            subdivisions: resolvedConfig.config.canvas.gridSubdivisions,
            originMm: { x: paddingLeftMm, y: paddingTopMm },
          }),
          { x: actualLeft, y: actualTop },
        ).point
        : { x: actualLeft, y: actualTop };

    const snapResult =
      suppressSnap || !viewCapabilities.objectSnap.active
        ? { snapped: gridSnapped, lines: [] as SnapLine[] }
        : computeSnapResult(
          { x: gridSnapped.x, y: gridSnapped.y, width: targetWidthMm, height: targetHeightMm },
          { width: pageWidthMm, height: pageHeightMm },
          others,
          snapThresholdMm,
        );

    const nextTop = clampValue(snapResult.snapped.y, minY, maxY);
    const nextLeft = clampValue(snapResult.snapped.x, minX, maxX);
    Object.assign(target.style, {
      top: `${nextTop * ZOOM}px`,
      left: `${nextLeft * ZOOM}px`,
    });

    if (snapRafRef.current != null) {
      cancelAnimationFrame(snapRafRef.current);
    }
    snapRafRef.current = requestAnimationFrame(() => {
      // Ver las líneas y que el snap actúe son capabilities distintas: el
      // ajuste puede estar activo sin pintar nada.
      const visibleLines = viewCapabilities.snapLines.active ? snapResult.lines : [];
      const key = JSON.stringify(
        visibleLines.map((line) => `${line.type}:${line.pos}:${line.label || ''}`),
      );
      if (snapLinesKeyRef.current !== key) {
        snapLinesKeyRef.current = key;
        setSnapLines(visibleLines);
      }
    });
  };

  /**
   * Persiste posición final de drag individual.
   */
  const onDragEnd = ({ target }: { target: HTMLElement | SVGElement }) => {
    setIsDragging(false);
    const { top, left } = target.style;
    changeSchemas(buildPositionChanges(target.id, top, left));
    setSnapLines([]);
    snapLinesKeyRef.current = '';
  };

  /**
   * Persiste posiciones finales de drag grupal.
   */
  const onDragEnds = ({ targets }: { targets: (HTMLElement | SVGElement)[] }) => {
    setIsDragging(false);
    const arg = targets.map(({ style: { top, left }, id }) => buildPositionChanges(id, top, left));
    changeSchemas(flatten(arg));
    setSnapLines([]);
    snapLinesKeyRef.current = '';
  };

  /**
   * Aplica rotación visual durante la interacción.
   */
  const onRotate = ({ target, rotate }: OnRotate) => {
    target.style.transform = `rotate(${rotate}deg)`;
  };

  /**
   * Persiste rotación final de un schema.
   */
  const onRotateEnd = ({ target }: { target: HTMLElement | SVGElement }) => {
    setIsRotating(false);
    const normalizedRotate = parseRotateFromTransform(target.style.transform);
    changeSchemas([{ key: 'rotate', value: normalizedRotate, schemaId: target.id }]);
  };

  const onRotateEnds = ({ targets }: { targets: (HTMLElement | SVGElement)[] }) => {
    setIsRotating(false);
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

    const targetPageIndex = resolvePageIndexForSchema(id, target as HTMLElement);
    const targetSchema = schemasList[targetPageIndex ?? pageCursor].find((schema) => schema.id === id);

    if (!targetSchema) return;

    targetSchema.position.x = fmt(left);
    targetSchema.position.y = fmt(top);
    targetSchema.width = fmt(width);
    targetSchema.height = fmt(height);
  };

  const onResizeEnds = ({ targets }: { targets: (HTMLElement | SVGElement)[] }) => {
    setIsResizing(false);
    const arg = targets.map(({ style: { width, height, top, left }, id }) =>
      buildSizeAndPositionChanges(id, width, height, top, left),
    );
    changeSchemas(flatten(arg));
  };

  /**
   * Aplica resize visual respetando padding y bounds de página.
   */
  const onResize = ({ target, width, height, direction }: OnResize) => {
    if (!target) return;
    let topPadding = 0;
    let rightPadding = 0;
    let bottomPadding = 0;
    let leftPadding = 0;
    const targetPageIndex = resolvePageIndexForSchema(target.id, target as HTMLElement);
    const pageSize = pageSizes[targetPageIndex ?? pageCursor] || pageSizes[pageCursor];

    if (isBlankPdf(basePdf)) {
      const [t, r, b, l] = basePdf.padding;
      topPadding = t * ZOOM;
      rightPadding = mmToPxCanvas(r);
      bottomPadding = mmToPxCanvas(b);
      leftPadding = l * ZOOM;
    }

    const pageWidth = mmToPxCanvas(pageSize.width);
    const pageHeight = mmToPxCanvas(pageSize.height);

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

  /**
   * Resuelve la página real de un schema desde dataset, selección activa o fallback.
   */
  const resolvePageIndexForSchema = useCallback(
    (schemaId: string, targetElement?: HTMLElement | null): number | null => {
      const targetPageIndex = targetElement?.dataset.pageIndex;
      if (targetPageIndex != null) {
        const parsedPageIndex = Number(targetPageIndex);
        if (Number.isInteger(parsedPageIndex) && parsedPageIndex >= 0) {
          return parsedPageIndex;
        }
      }

      for (const element of activeElements) {
        if (!element || element.dataset.schemaId !== schemaId) continue;
        const parsedPageIndex = Number(element.dataset.pageIndex);
        if (Number.isInteger(parsedPageIndex) && parsedPageIndex >= 0) {
          return parsedPageIndex;
        }
      }

      for (const element of activeElements) {
        const parsedPageIndex = Number(element?.dataset.pageIndex);
        if (Number.isInteger(parsedPageIndex) && parsedPageIndex >= 0) {
          return parsedPageIndex;
        }
      }

      return Number.isInteger(pageCursor) && pageCursor >= 0 ? pageCursor : null;
    },
    [activeElements, pageCursor],
  );

  /**
   * Busca un schema por ID priorizando página conocida y luego todas las páginas.
   */
  const resolveSchemaById = useCallback(
    (schemaId: string, pageIndex?: number | null) => {
      const candidates = [
        pageIndex,
        resolvePageIndexForSchema(schemaId),
        pageCursor,
      ].filter((value): value is number => typeof value === 'number' && value >= 0);

      for (const candidate of candidates) {
        const schema = renderedPageSchemasList[candidate]?.find((item) => item.id === schemaId);
        if (schema) return schema;
      }

      for (const pageSchemas of renderedPageSchemasList) {
        const schema = pageSchemas?.find((item) => item.id === schemaId);
        if (schema) return schema;
      }

      return null;
    },
    [pageCursor, renderedPageSchemasList, resolvePageIndexForSchema],
  );

  /**
   * Ubica el nodo DOM de un schema, con búsqueda scoped por página antes de global.
   */
  // Excepción a preserve-manual-memoization: el compilador infiere
  // `paperRefs.current` como dependencia y no coincide con las declaradas. La
  // memoización manual es la correcta —la ref es estable— pero reescribirla
  // para satisfacer al compilador cambiaría cuándo se recalcula el selector.
  const resolveSchemaElementById = useCallback(
     
    (schemaId: string, pageIndex?: number | null) => {
      const selector = buildSchemaSelector(schemaId);

      for (const element of activeElements) {
        if (element?.dataset.schemaId === schemaId) {
          return element;
        }
      }

      const candidatePageIndex = resolvePageIndexForSchema(schemaId) ?? pageIndex ?? pageCursor;
      if (Number.isInteger(candidatePageIndex) && candidatePageIndex >= 0) {
        const pageElement = paperRefs.current[candidatePageIndex];
        const scopedElement = pageElement?.querySelector<HTMLElement>(selector) || null;
        if (scopedElement) {
          return scopedElement;
        }
      }

      for (const pageElement of paperRefs.current) {
        const scopedElement = pageElement?.querySelector<HTMLElement>(selector) || null;
        if (scopedElement) {
          return scopedElement;
        }
      }

      return document.querySelector<HTMLElement>(selector);
    },
    [activeElements, pageCursor, paperRefs, resolvePageIndexForSchema],
  );

  /**
   * Convierte el rect viewport de un schema a coordenadas relativas al canvas.
   */
  const resolveInlineEditRect = useCallback((element: HTMLElement) => {
    const canvasRoot = document.querySelector('.sisad-pdfme-designer-canvas') as HTMLElement | null;
    const canvasRect = canvasRoot?.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    return {
      top: canvasRect ? rect.top - canvasRect.top : rect.top,
      left: canvasRect ? rect.left - canvasRect.left : rect.left,
      width: rect.width,
      height: rect.height,
    };
  }, []);

  /**
   * Decide si la edición inline apunta a contenido visible o nombre interno.
   */
  const resolveInlineEditTarget = useCallback((schemaId: string, target?: InlineEditTarget) => {
    if (target) return target;
    const schema = resolveSchemaById(schemaId);
    if (!schema) return 'content';
    const content = String(schema.content || '');
    if (CONTENT_DRIVEN_INLINE_EDIT_TYPES.has(schema.type) || content.length > 0) {
      return 'content';
    }
    return 'name';
  }, [resolveSchemaById]);

  /**
   * Inicia edición inline para un schema seleccionado.
   */
  const startInlineEdit = useCallback(
    (schemaId: string, targetRect: HTMLElement, target?: InlineEditTarget) => {
      const schema = resolveSchemaById(schemaId);
      if (!schema) {
        selectionCommands?.openProperties?.();
        return;
      }
      const resolvedTarget = resolveInlineEditTarget(schemaId, target);
      const value = resolvedTarget === 'content' ? String(schema.content || '') : String(schema.name || '');
      setInlineEditSession({
        schemaId,
        target: resolvedTarget,
        value,
        rect: resolveInlineEditRect(targetRect),
        multiline: resolvedTarget === 'content' && (schema.type === 'multivariabletext' || value.includes('\n')),
      });
      setEditing(true);
      setContextMenu(null);
      setPendingContextMenu(null);
      onEdit([targetRect]);
    },
    [
      onEdit,
      resolveInlineEditRect,
      resolveInlineEditTarget,
      resolveSchemaById,
      selectionCommands,
      setContextMenu,
      setPendingContextMenu,
    ],
  );

  /**
   * Devuelve foco a la selección activa o al paper tras cerrar overlays.
   */
  const refocusCanvas = useCallback(() => {
    requestAnimationFrame(() => {
      const activeEl = activeElements.find(Boolean);
      if (activeEl && activeEl.tabIndex !== undefined) {
        activeEl.focus({ preventScroll: true });
        return;
      }
      const paper = rootRef.current?.querySelector<HTMLElement>('[data-paper-page="true"]');
      paper?.focus({ preventScroll: true });
    });
  }, [activeElements]);

  /**
   * Confirma edición inline y emite cambio si el valor realmente cambió.
   */
  const finishInlineEdit = useCallback(
    (nextValue: string) => {
      if (!inlineEditSession) return;
      const schemaId = inlineEditSession.schemaId;
      const key = inlineEditSession.target === 'content' ? 'content' : 'name';
      const currentSchema = resolveSchemaById(schemaId);
      if (!currentSchema) {
        setInlineEditSession(null);
        setEditing(false);
        refocusCanvas();
        return;
      }
        const currentValue = key === 'content' ? String(currentSchema.content || '') : String(currentSchema.name || '');
        if (currentValue === nextValue) {
        setInlineEditSession(null);
        setEditing(false);
        refocusCanvas();
        return;
      }
      changeSchemas([{ key, value: nextValue, schemaId }]);
      setInlineEditSession(null);
      setEditing(false);
      refocusCanvas();
    },
    [changeSchemas, inlineEditSession, refocusCanvas, resolveSchemaById],
  );

  const cancelInlineEdit = useCallback(() => {
    setInlineEditSession(null);
    setEditing(false);
    refocusCanvas();
  }, [refocusCanvas]);

  /**
   * Expone API imperativa mínima sobre el nodo raíz del canvas.
   */
  useImperativeHandle(ref, () => {
    const node = rootRef.current;
    if (!node) return null;

    const imperativeNode = node as HTMLDivElement & {
      openInlineEdit?: (request: { schemaId: string; target: InlineEditTarget }) => void;
      cancelInlineEdit?: () => void;
    };

    imperativeNode.openInlineEdit = (request) => {
      const targetElement = resolveSchemaElementById(request.schemaId);
      node.dataset.inlineEditRequest = `${request.schemaId}:${request.target}`;
      if (!targetElement) {
        selectionCommands?.openProperties?.();
        return;
      }
      const schema = resolveSchemaById(request.schemaId, resolvePageIndexForSchema(request.schemaId, targetElement));
      if (!schema) {
        selectionCommands?.openProperties?.();
        return;
      }
      const resolvedTarget = resolveInlineEditTarget(request.schemaId, request.target);
      const value = resolvedTarget === 'content' ? String(schema.content || '') : String(schema.name || '');
      setInlineEditSession({
        schemaId: request.schemaId,
        target: resolvedTarget,
        value,
        rect: resolveInlineEditRect(targetElement),
        multiline: resolvedTarget === 'content' && (schema.type === 'multivariabletext' || value.includes('\n')),
      });
      setEditing(true);
      setContextMenu(null);
      setPendingContextMenu(null);
    };
    imperativeNode.cancelInlineEdit = cancelInlineEdit;
    return imperativeNode;
  }, [
    cancelInlineEdit,
    resolveInlineEditRect,
    resolveInlineEditTarget,
    resolvePageIndexForSchema,
    resolveSchemaById,
    resolveSchemaElementById,
    selectionCommands,
    setContextMenu,
    setPendingContextMenu,
  ]);

  const onClickMoveable = useCallback(() => {
    setContextMenu(null);
    setPendingContextMenu(null);
  }, [setContextMenu, setPendingContextMenu]);

  const handleDragStart = () => setIsDragging(true);
  const handleResizeStart = () => setIsResizing(true);
  const handleRotateStart = () => setIsRotating(true);
  /**
   * Abre menú contextual diferenciando canvas vacío, selección única y múltiple.
   */
  const handleCanvasContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as Element | null;
    if (!target) return;
    if (isEditableTarget(target) || isAntDPopupTarget(target)) return;

    const activePaper = paperRefs.current[activeSelectionPageIndex ?? pageCursor];
    const selectableTarget = target.closest?.(`.${SELECTABLE_CLASSNAME}`) as HTMLElement | null;
    const isSelectableTarget = Boolean(selectableTarget && activePaper?.contains(selectableTarget));

    event.preventDefault();
    event.stopPropagation();

      if (isSelectableTarget && selectableTarget) {
        const isTargetAlreadySelected = activeElementIdSet.has(selectableTarget.id);
        const targetIds = isTargetAlreadySelected
          ? activeElementIds
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

  /**
   * Solicita creación de comentario libre en la página bajo el doble click.
   */
  const dispatchFreeCommentRequest = useCallback(
    (event: MouseEvent, pageIndex: number) => {
      const target = event.target as Element | null;
      if (!target) return;
      const selectableTarget = target.closest?.(`.${SELECTABLE_CLASSNAME}`);
      if (selectableTarget) return;

      globalThis.dispatchEvent(
        new CustomEvent('sisad-pdfme:create-comment-request', {
          detail: {
            coordinateSpace: 'client',
            clientX: event.clientX,
            clientY: event.clientY,
            pageIndex,
            pageNumber: pageIndex + 1,
            fileId: activeDocumentId || null,
            targetIds: [],
          },
        }),
      );
    },
    [activeDocumentId],
  );

  /**
   * Determina si todos los tipos seleccionados soportan rotación según plugins.
   */
  const rotatable = useMemo(() => {
    const selectedSchemas = activeSelectionSchemas.filter((s) => activeElementIdSet.has(s.id));
    const schemaTypes = selectedSchemas.map((s) => s.type);
    const uniqueSchemaTypes = [...new Set(schemaTypes)];

    // Create a type-safe array of default schemas
    const defaultSchemas: Array<{ type?: string; rotate?: unknown }> = [];

    pluginsRegistry.entries().forEach(([, plugin]) => {
      if (plugin.propPanel.defaultSchema) {
        defaultSchemas.push(plugin.propPanel.defaultSchema as { type?: string; rotate?: unknown });
      }
    });

    // Check if all schema types have rotate property
    return uniqueSchemaTypes.every((type) => {
      const matchingSchema = defaultSchemas.find((ds) => ds && 'type' in ds && ds.type === type);
      return matchingSchema && 'rotate' in matchingSchema;
    });
  }, [activeElementIdSet, activeSelectionSchemas, pluginsRegistry]);

  // Multi-page: selection/interaction is valid inside ANY rendered paper, not
  // only the cursor page. Scoping to a single paper broke selection on page 2+.
  /**
   * Valida si un evento ocurrió dentro de cualquier paper renderizado.
   */
  const isEventInsideAnyPaper = (target: EventTarget | null) => {
    if (!(target instanceof Node)) return false;
    for (const paper of paperRefs.current) {
      if (paper && (target === paper || paper.contains(target))) return true;
    }
    return false;
  };
  const isEventInsideActivePaper = (target: EventTarget | null) => isEventInsideAnyPaper(target);

  // Resolve the real paper page under a pointer target (not pageCursor).
  /**
   * Resuelve el Paper real bajo un target/evento.
   */
  const getPaperFromTarget = (target: EventTarget | null): HTMLElement | null => {
    if (!(target instanceof Node)) return null;
    const paperPage =
      target instanceof Element ? target.closest('[data-paper-page="true"]') : null;
    if (paperPage instanceof HTMLElement) return paperPage;
    for (const paper of paperRefs.current) {
      if (paper && (target === paper || paper.contains(target))) return paper;
    }
    return null;
  };
  const getPaperIdentity = (paper: HTMLElement | null) => ({
    pageIndex: paper ? toNumber(paper.dataset.pageIndex) : null,
    pageNumber: paper ? toNumber(paper.dataset.pageNumber) : null,
    documentId: paper?.dataset.documentId || undefined,
  });

  /**
   * Normaliza targets seleccionables filtrando página, documento, deduplicados y exclusiones.
   */
  const normalizeActiveTargets = (
    targets: HTMLElement[],
    options?: { pageIndex?: number | null; documentId?: string; allowCrossPage?: boolean },
  ): HTMLElement[] => {
    const papers = paperRefs.current.filter(Boolean);
    if (!papers.length) return [];
    const seen = new Set<string>();
    return targets
      .map((target) => (target?.closest?.('[data-schema-id]') as HTMLElement | null) || target)
      .filter((target): target is HTMLElement => Boolean(target))
      .filter((target) => {
        if (!isMoveableTarget(target)) return false;
        if (isSelectoExcludedTarget(target)) return false;

        // Region/selection is scoped to the page where the drag started, so a
        // rect crossing into page 1 never grabs page 1 schemas.
        if (!options?.allowCrossPage && typeof options?.pageIndex === 'number') {
          const targetPageIndex = toNumber(target.dataset.pageIndex);
          if (targetPageIndex !== options.pageIndex) return false;
        }
        if (
          options?.documentId &&
          target.dataset.documentId &&
          target.dataset.documentId !== options.documentId
        ) {
          return false;
        }

        // Dedupe by uid (cross-page safe), fall back to schemaId/id.
        const key = target.dataset.schemaUid || target.dataset.schemaId || target.id;
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return papers.some((paper) => target === paper || paper.contains(target));
      });
  };

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
    setPendingContextMenu(null);
  }, [setContextMenu, setPendingContextMenu]);

  /**
   * Inserta campo por defecto desde menú contextual de canvas vacío.
   */
  const handleInsertField = useCallback(() => {
    bridge?.runtime.addSchemaByType('text');
  }, [bridge]);

  /**
   * Intenta interpretar clipboard como tipo de schema o payload simple de schema.
   */
  const handlePaste = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.readText) return;
    const clipboardText = (await navigator.clipboard.readText().catch(() => '')).trim();
    if (!clipboardText || !bridge?.runtime) return;
    const normalized = clipboardText.replace(/^['"]|['"]$/g, '').trim();
    const knownTypes = new Set(['text', 'number', 'multiVariableText', 'date', 'dateTime', 'time', 'checkbox', 'radioGroup', 'select']);
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

  useEffect(() => {
    const handleInsertShortcut = (event: Event) => {
      const detail = (event as CustomEvent<{ type?: string }>).detail || {};
      if (typeof detail.type !== 'string' || !detail.type.trim()) return;
      bridge?.runtime.addSchemaByType(detail.type.trim());
    };

    window.addEventListener('sisad-pdfme:shortcut-insert-schema', handleInsertShortcut as EventListener);
    return () => {
      window.removeEventListener('sisad-pdfme:shortcut-insert-schema', handleInsertShortcut as EventListener);
    };
  }, [bridge]);

  /**
   * Acciones externas entregadas al menú contextual del canvas.
   */
  const canvasContextMenuExternalActions = useMemo(
    () => ({
      onInsertField: handleInsertField,
      onPaste: handlePaste,
      onAddPage: canvasActions?.addPageAfter,
      onOpenCatalog: () => bridge?.runtime.setSidebarOpen(true),
      onUploadOrReplacePdf: canvasActions?.uploadPdf,
      onOpenGroupProperties: selectionCommands?.openProperties,
      onCreateComment: () => {
        try {
          if (typeof window === 'undefined' || !contextMenu) return;
          const detail = {
          coordinateSpace: 'client',
          clientX: contextMenu.x,
          clientY: contextMenu.y,
          pageIndex: activeSelectionPageIndex ?? pageCursor,
          pageNumber: (activeSelectionPageIndex ?? pageCursor) + 1,
          fileId: activeDocumentId || null,
          targetIds: contextMenu.targetIds,
        };
          window.dispatchEvent(new CustomEvent('sisad-pdfme:create-comment', { detail }));
        } finally {
          closeContextMenu();
        }
      },
    }),
    [
      activeDocumentId,
      activeSelectionPageIndex,
      bridge,
      canvasActions?.addPageAfter,
      canvasActions?.uploadPdf,
      handleInsertField,
      handlePaste,
      selectionCommands,
      contextMenu,
      pageCursor,
      closeContextMenu,
    ],
  );
  const hasClipboardData = typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.readText);
  /**
   * Schemas asociados al menú contextual abierto.
   */
  const contextMenuSelectionSchemas = useMemo(() => {
    if (!contextMenu) return [];
    const targetIds = new Set(contextMenu.targetIds);
    return activeSelectionSchemas.filter((schema) => targetIds.has(schema.id));
  }, [activeSelectionSchemas, contextMenu]);
  const contextMenuSelectionReadOnly = contextMenuSelectionSchemas.length > 0
    && contextMenuSelectionSchemas.every((schema) => schema.readOnly);
  const contextMenuSelectionRequired = contextMenuSelectionSchemas.length > 0
    && contextMenuSelectionSchemas.every((schema) => schema.required);
  const contextMenuSelectionHidden = contextMenuSelectionSchemas.length > 0
    && contextMenuSelectionSchemas.every((schema) => (schema as SchemaForUI & { hidden?: boolean }).hidden === true);

  useEffect(() => {
    if (!pendingContextMenu) return;
    const pendingIds = pendingContextMenu.targetIds.join('|');
    const currentIds = activeElementIds.join('|');
    setContextMenuState((prev) => {
      if (pendingIds === currentIds) {
        return { contextMenu: pendingContextMenu, pendingContextMenu: null };
      }
      if (currentIds) {
        return { ...prev, pendingContextMenu: null };
      }
      return prev;
    });
  }, [activeElementIds, pendingContextMenu]);

  useEffect(() => {
    if (!contextMenu || contextMenu.mode === 'empty') return;
    const currentIds = activeElementIds.join('|');
    if (currentIds !== contextMenu.targetIds.join('|')) {
      closeContextMenu();
    }
  }, [activeElementIds, closeContextMenu, contextMenu]);

  const zoomPercent = Math.max(1, Math.round(scale * 100));
  const zoomTier = zoomPercent < 80 ? 'low' : zoomPercent > 140 ? 'high' : 'medium';
  const activePageSchemaCount = currentPageSchemas.length;
  /**
   * Estado derivado de interacción usado por overlays, data attributes y host.
   */
  const interactionState = useMemo(
    () =>
      deriveInteractionState({
        activeElements,
        hoveringSchemaId,
        editing,
        isDragging,
        isResizing,
        isRotating,
      }),
    [activeElements, editing, hoveringSchemaId, isDragging, isResizing, isRotating],
  );

  const interactionMode: CanvasInteractionMode = externalSchemaDragActive
    ? 'dragging-new-schema'
    : interactionState.isDragging
      ? 'dragging'
      : interactionState.isResizing
        ? 'resizing'
        : interactionState.isRotating
          ? 'rotating'
          : editing
            ? 'editing-text'
            : interactionState.hasSelection
              ? 'selecting'
              : 'idle';

  useEffect(() => {
    onInteractionStateChange?.(interactionState);
  }, [interactionState, onInteractionStateChange]);

  // ── Canvas render state (Phase 4) ───────────────────────────────────
  /**
   * Estado visual/no listo del canvas, centralizado en canvasRenderState.
   */
  const canvasRenderState = useCanvasRenderState({
    schemaCount: activePageSchemaCount,
    pageCursor,
    documentId: activeDocumentId,
    isLoadingDocument,
    isSwitchingDocument,
    switchFromDocId,
    switchToDocId,
    isLoadingPage,
    renderError,
    renderErrorRecoverable,
    pdfLoadError,
    isCollaborationDisconnected,
    lastSyncAt,
  });
  const canvasInteractive = isCanvasInteractive(canvasRenderState);
  const canvasBlockReason = deriveCanvasBlockReason(canvasRenderState);
  const canvasBlockingMaskVisible = shouldDisplayBlockingMask(canvasBlockReason, interactionMode);
  const shouldHideMaskByInteraction = [
    'dragging',
    'resizing',
    'rotating',
    'selected-single',
    'selected-multi',
  ].includes(interactionState.phase);

  useEffect(() => {
    paperRefs.current.forEach((paper, index) => {
      if (!paper) return;
      paper.dataset.canvasPage = 'true';
      applyPageMetadataDataset(paper, {
        pageIndex: index,
        pageActive: index === pageCursor,
        pageEmpty: (schemasList[index] || []).length === 0,
      });
    });
  }, [paperRefs, pageCursor, schemasList]);

  /**
   * Pinta la rejilla en el espacio de CADA página.
   *
   * Antes era un `background-image` de paso fijo `24px` sobre el contenedor
   * del canvas: no significaba ninguna medida del documento, no seguía al
   * zoom y no se alineaba con el borde del papel en multipágina.
   *
   * Las variables se proyectan a zoom 1 a propósito: el zoom es un
   * `transform: scale()` de una capa ancestro (`Paper`), así que escala el
   * patrón junto con el papel y la paridad rejilla/snap se conserva sola.
   */
  useEffect(() => {
    paperRefs.current.forEach((paper, index) => {
      if (!paper) return;
      const pageSize = pageSizes[index] || pageSizes[0];
      if (!pageSize) return;
      const [paddingTopMm, , , paddingLeftMm] = getPaddingMm(basePdf);
      const geometry = createGridGeometry({
        pageMm: { width: pageSize.width, height: pageSize.height },
        stepMm: resolvedConfig.config.canvas.gridStepMm,
        subdivisions: resolvedConfig.config.canvas.gridSubdivisions,
        originMm: { x: paddingLeftMm, y: paddingTopMm },
      });
      Object.entries(gridCssVariables(geometry, 1)).forEach(([name, value]) => {
        paper.style.setProperty(name, value);
      });
      paper.dataset.gridVisible = String(viewCapabilities.grid.active);
    });
  }, [
    paperRefs,
    pageSizes,
    basePdf,
    resolvedConfig.config.canvas.gridStepMm,
    resolvedConfig.config.canvas.gridSubdivisions,
    viewCapabilities.grid.active,
  ]);

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    paperRefs.current.forEach((paper, index) => {
      if (!paper) return;
      const handleDoubleClick = (event: MouseEvent) => dispatchFreeCommentRequest(event, index);
      paper.addEventListener('dblclick', handleDoubleClick);
      cleanups.push(() => paper.removeEventListener('dblclick', handleDoubleClick));
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [dispatchFreeCommentRequest, pageCursor, paperRefs, schemasList.length]);

  return (
    <div
      className={[DESIGNER_CLASSNAME + 'canvas', classNames?.canvasContainer]
        .concat([
          // `items-start` + `justify-center` posicionan el papel; el centrado
          // real lo aporta el `mx-auto` de `[data-paper-root]`, que además evita
          // que el borde izquierdo quede fuera de alcance al desbordar por zoom.
          'box-border relative flex h-full min-h-0 min-w-0 flex-1 w-full max-w-full items-start justify-center overflow-auto overscroll-contain [scrollbar-gutter:stable_both-edges] pt-14 px-4 pb-4',
          'bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.08),transparent_22%),linear-gradient(180deg,rgba(248,250,252,0.96),rgba(241,245,249,0.98))]',
        ])
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
      {...viewDataAttributes}
      data-owner-badges-visible={canvasVisibility?.ownerBadges !== false ? 'true' : 'false'}
      data-required-markers-visible={canvasVisibility?.requiredMarkers !== false ? 'true' : 'false'}
      data-lock-badges-visible={canvasVisibility?.lockBadges !== false ? 'true' : 'false'}
      data-padding-visible={feature.padding ? 'true' : 'false'}
      data-canvas-state={canvasRenderState.type}
      data-canvas-blocked={canvasBlockingMaskVisible ? 'true' : 'false'}
      data-canvas-block-reason={canvasBlockReason || 'none'}
      ref={rootRef}>
      {!editing && feature.selecto && !externalSchemaDragActive && canvasInteractive ? (
        /*
         * Excepción a react-hooks/refs: Selecto necesita los nodos DOM reales
         * como contenedores. En el primer render valen `null` y la librería los
         * revalúa tras el commit, que es el contrato que ya asume el runtime.
         */
        <SelectoSlot
          container={rootRef.current}
          rootContainer={rootRef.current}
          dragContainer={rootRef.current}
          boundContainer={rootRef.current}
          checkInput
          continueSelect={isMultiSelectActive}
          className={classNames?.selecto}
          useDefaultStyles={useDefaultStyles}
          getElementRect={(element) => coordinateService.elementRectToViewportRect(element)}
          selectionStyle={styleOverrides?.selectoSelection}
          dragCondition={(dragStart) => {
            const inputEvent = dragStart.inputEvent as MouseEvent | TouchEvent;
            const target = inputEvent.target as EventTarget | null;
            if (isSelectoExcludedTarget(target)) {
              clearRegionSelectionSession();
              return false;
            }
            const shouldSuppress = shouldSuppressCanvasRegionSelection(target, {
              isModalOpen: contextMenu !== null,
              isInlineEditing: editing,
              isSchemaDragging: isDragging,
              isResizing,
              isRotating,
              externalSchemaDragActive,
            });
            if (shouldSuppress) {
              clearRegionSelectionSession();
            }
            return !shouldSuppress;
          }}
          onDragStart={(e) => {
            // Use type assertion to safely access inputEvent properties
            const inputEvent = e.inputEvent as MouseEvent | TouchEvent;
            const target = inputEvent.target as Element | null;
            const isInsidePaper = isEventInsideActivePaper(target);
            if (
              !isInsidePaper ||
              isSelectoExcludedTarget(target) ||
              shouldSuppressCanvasRegionSelection(target, {
                isModalOpen: contextMenu !== null,
                isInlineEditing: editing,
                isSchemaDragging: isDragging,
                isResizing,
              isRotating,
              externalSchemaDragActive,
            })
            ) {
              clearRegionSelectionSession();
              e.stop();
              return;
            }
            const isMoveableElement = moveable.current?.isMoveableElement(target as Element);

            if ((inputEvent.type === 'touchstart' && e.isTrusted) || isMoveableElement) {
              clearRegionSelectionSession();
              e.stop();
              return;
            }

            // Pin region selection to the REAL page under the pointer, not
            // pageCursor/activePaper. Targets later get filtered to this page.
            const paper = getPaperFromTarget(target);
            const identity = getPaperIdentity(paper);
            regionSelectionSessionRef.current = {
              pageIndex: identity.pageIndex,
              pageNumber: identity.pageNumber,
              documentId: identity.documentId,
              startedInsidePaper: Boolean(paper),
            };

            if (paperRefs.current.some((p) => p === target)) {
              onEdit([]);
            }

          }}
          onSelect={(e) => {
            const inputEvent = e.inputEvent as MouseEvent | PointerEvent | undefined;
            const target = inputEvent?.target as Element | null;
            try {
              if (!isEventInsideAnyPaper(target)) return;

              const session = regionSelectionSessionRef.current;
              // Session anchors the page; fall back to the page under the pointer
              // (single click without a prior drag-start session).
              const sessionPageIndex =
                session?.pageIndex ?? getPaperIdentity(getPaperFromTarget(target)).pageIndex;
              const sessionDocumentId =
                session?.documentId ?? getPaperIdentity(getPaperFromTarget(target)).documentId;
              const scope = { pageIndex: sessionPageIndex, documentId: sessionDocumentId, allowCrossPage: false };

              const isAdditive = inputEvent ? isAdditiveSelectionIntent(resolveSelectionIntent({
                platform,
                event: inputEvent,
                pointerKind: session ? 'drag-region' : 'click'
              })) : false;

              // e.selected is the source of truth for both click and region drag.
              const selected = normalizeActiveTargets(e.selected as HTMLElement[], scope);
              const previous = isAdditive ? normalizeActiveTargets(activeElements, scope) : [];
              const nextSelection = normalizeActiveTargets([...previous, ...selected], scope);

              onEdit(nextSelection);

              const selectionChanged =
                nextSelection.length !== activeElements.length ||
                nextSelection.some((el, i) => el.id !== activeElements[i]?.id);
              if (selectionChanged) {
                setEditing(false);
              }

              // For MacOS CMD+SHIFT+3/4 screenshots where the keydown event is never received, check mouse too
              const mouseEvent = inputEvent as MouseEvent | undefined;
              if (mouseEvent && typeof mouseEvent.shiftKey === 'boolean') {
                setModifierKeys({
                  shift: mouseEvent.shiftKey,
                  alt: mouseEvent.altKey,
                  ctrl: mouseEvent.ctrlKey,
                  meta: mouseEvent.metaKey,
                });
              }
            } finally {
              clearRegionSelectionSession();
            }
          }}
        />
      ) : null}
      <Paper
        scale={scale}
        size={size}
        schemasList={renderedPageSchemasList}
        pageSizes={pageSizes}
        backgrounds={backgrounds}
        documentId={activeDocumentId}
        hasRulers={true}
        registerPaperRef={registerPaperRef}
        contentOffsetX={contentOffsetX}
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
            {moveablePageIndex === index ? (
              <CanvasStateOverlay
                state={canvasRenderState}
                onRetry={onRetryRender}
                className={classNames?.emptyState}
              />
            ) : null}
            <StaticSchema
              template={paperTemplate}
              input={placeholderVariables}
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
            {moveablePageIndex !== index ? (
              feature.mask ? (
              <MaskSlot
                  className={shouldHideMaskByInteraction ? ['hidden', classNames?.mask].filter(Boolean).join(' ') : classNames?.mask}
                  width={paperSize.width + RULER_HEIGHT}
                  height={paperSize.height + RULER_HEIGHT}
                  maskColor={styleOverrides?.mask?.color}
                  blur={styleOverrides?.mask?.blur}
                />
              ) : null
            ) : (
              !editing && feature.moveable && !externalSchemaDragActive && canvasInteractive && (
                <MoveableSlot
                  ref={moveable}
                  className={`${classNames?.moveable || ''} ${externalSchemaDragActive ? 'opacity-0 pointer-events-none' : ''}`.trim()}
                  useDefaultStyles={useDefaultStyles}
                  moveableColor={styleOverrides?.moveable?.color}
                  target={moveableTargets}
                  bounds={{
                    left: 0,
                    top: 0,
                    bottom: mmToPxCanvas(paperSize.height),
                    right: mmToPxCanvas(paperSize.width),
                  }}
                  horizontalGuidelines={getGuideLines(horizontalGuides.current, index)}
                  verticalGuidelines={getGuideLines(verticalGuides.current, index)}
                  keepRatio={modifierKeys.shift}
                  rotatable={rotatable}
                  zoom={scale}
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
        renderSchema={({ schema, pageIndex }) => {
          const isActive = activeElementIdSet.has(schema.id);
          const isHovering = hoveringSchemaId === schema.id;
          // Grouping schemas expose design-time affordances (the "+" add-option
          // button) that must be reachable on selection, not only during inline
          // text editing. Render them in designer mode whenever they are active.
          const isGroupAffordanceType =
            schema.type === 'checkbox' ||
            schema.type === 'radioGroup' ||
            schema.type === 'checkboxGroup';
          const mode =
            (editing && isActive) || (isActive && isGroupAffordanceType)
              ? 'designer'
              : 'viewer';

          const content = schema.content || '';
          let value = content;

          if (mode !== 'designer' && schema.readOnly) {
            const variables = {
              ...placeholderVariables,
              totalPages: schemasList.length,
              currentPage: pageIndex + 1,
            };

            value = replacePlaceholders({ content, variables, schemas: schemasList });
          }

          return (
            <Renderer
              key={schema.id}
              schema={schema}
              basePdf={basePdf}
              value={value}
              documentId={activeDocumentId}
              pageIndex={pageIndex}
              pageNumber={pageIndex + 1}
              onChangeHoveringSchemaId={onChangeHoveringSchemaId}
              mode={mode}
              onChange={
                isActive
                  ? (arg) => {
                    type ChangeArg = { key: string; value: unknown };
                    const args = Array.isArray(arg) ? (arg as ChangeArg[]) : [arg as ChangeArg];
                    changeSchemas(
                      args.map(({ key, value }) => ({ key, value, schemaId: schema.id })),
                    );
                  }
                : undefined
              }
              collaborationContext={safeCollaborationContext}
              onMouseDownCapture={
                !editing
                  ? (event) => {
                    if (event.button !== 0) return;

                    // In-schema interactive controls (grouping "+" buttons, radio/
                    // checkbox option toggles) and internal options must receive
                    // their own clicks instead of starting a Moveable drag. Hit-test
                    // via the central policy, not inline selectors.
                    if (isCanvasSelectionExcludedTarget(event.target)) {
                      return;
                    }

                    const targetPageIndex = toNumber(event.currentTarget.dataset.pageIndex);
                    const targetDocumentId = event.currentTarget.dataset.documentId || undefined;
                    const scope = {
                      pageIndex: targetPageIndex,
                      documentId: targetDocumentId,
                      allowCrossPage: false,
                    };
                    const selectionIntent = resolveSelectionIntent({
                      platform,
                      event: event.nativeEvent,
                      pointerKind: 'click',
                      isTargetSelected: isActive,
                    });
                    const isAdditive = isAdditiveSelectionIntent(selectionIntent);

                    if (isAdditive) {
                      const currentTargets = normalizeActiveTargets(activeElements, scope);
                      const alreadySelected = activeElementIdSet.has(event.currentTarget.id);
                      const nextTargets = alreadySelected
                        ? currentTargets.filter((element) => element.id !== event.currentTarget.id)
                        : normalizeActiveTargets([...currentTargets, event.currentTarget], scope);
                      onEdit(nextTargets);
                      closeContextMenu();
                      event.preventDefault();
                      event.stopPropagation();
                      return;
                    }

                    if (!isActive) {
                      onEdit([event.currentTarget]);
                      closeContextMenu();
                      return;
                    }

                    if (event.detail > 1) return;
                    moveable.current?.dragStart(event.nativeEvent, event.currentTarget);
                    event.preventDefault();
                    event.stopPropagation();
                  }
                  : undefined
              }
              onDoubleClick={(event) => {
                if (isDragging || isResizing || isRotating || !canvasInteractive) return;
                if (schema.readOnly) return;
                const editableTypes = new Set(['text', 'multivariabletext']);
                if (!editableTypes.has(String(schema.type || '').toLowerCase())) return;
                const target = event.currentTarget as HTMLElement;
                if (isEditableTarget(event.target) || isAntDPopupTarget(event.target)) return;
                startInlineEdit(schema.id, target, 'content');
              }}
              stopEditing={() => setEditing(false)}
              isActive={isActive}
              isHovering={isHovering}
              isEditing={editing && isActive}
              outline={
                // When selected, let CSS outline (sisad-pdfme.css) handle
                // the visual frame — avoid double-border from both inline border + CSS outline.
                isActive
                  ? '1px solid transparent'
                  : `1px ${hoveringSchemaId === schema.id ? 'solid' : 'dashed'} ${
                      // Un campo de solo lectura baja de intensidad, pero no
                      // pierde el color: en transparente dejaba de decir a qué
                      // destinatario pertenece, y las formas —que nacen
                      // `readOnly`— nunca lo mostraban.
                      schema.readOnly && hoveringSchemaId !== schema.id
                        ? mixHexColor(resolveSchemaTone(schema, token.colorPrimary), 45)
                        : resolveSchemaTone(schema, token.colorPrimary)
                    }`
              }
              scale={scale}
            />
          );
        }}
      />
        <CanvasOverlayManager
          activeElements={activeElements}
          schemasList={renderedPageSchemasList}
          topLevelComments={topLevelComments}
          pageCursor={pageCursor}
        pageSize={pageSizes[pageCursor] ?? { width: 0, height: 0 }}
        paperRefs={paperRefs}
        scale={scale}
        snapLines={snapLines}
        SnapLinesSlot={SnapLinesSlot}
        selectionCommands={selectionCommands}
          interactionState={interactionState}
          featureSnapLines={feature.snapLines}
          externalSchemaDragActive={externalSchemaDragActive}
          contextMenuOpen={Boolean(contextMenu)}
          // Mismas acciones y mismo estado de portapapeles que el menú de clic
          // derecho: ambos son el mismo componente sobre la misma selección.
          contextMenuExternalActions={canvasContextMenuExternalActions}
          hasClipboardData={hasClipboardData}
          collaborationContext={safeCollaborationContext}
        />
      {!externalSchemaDragActive ? (
        <InlineEditOverlay
        session={inlineEditSession}
        canvasSize={size}
        onCommit={finishInlineEdit}
        onCancel={cancelInlineEdit}
        />
      ) : null}
      <CanvasContextMenu
        open={Boolean(contextMenu) && !editing}
        mode={contextMenu?.mode || 'empty'}
        position={contextMenu ? { x: contextMenu.x, y: contextMenu.y } : null}
        commands={selectionCommands}
        externalActions={canvasContextMenuExternalActions}
        hasClipboardData={hasClipboardData}
        selectionCount={contextMenu?.targetIds.length}
        activeReadOnly={contextMenuSelectionReadOnly}
        activeRequired={contextMenuSelectionRequired}
        activeHidden={contextMenuSelectionHidden}
        selectionSchemas={contextMenuSelectionSchemas}
        collaborationContext={safeCollaborationContext}
        canEditStructure={selectionCommands?.canEditStructure !== false}
        onClose={closeContextMenu}
      />
    </div>
  );
};

const ForwardedCanvas = forwardRef<HTMLDivElement | null, CanvasProps>(Canvas);
ForwardedCanvas.displayName = 'Canvas';

export default ForwardedCanvas;
