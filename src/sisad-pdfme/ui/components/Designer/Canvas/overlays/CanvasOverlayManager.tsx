import React, { useContext, useEffect, useMemo, useState } from 'react';
import type { SchemaForUI, Size } from '@sisad-pdfme/common';
import type { SnapLine } from '@sisad-pdfme/ui/components/Designer/Canvas/SnapLines';

import SelectionContextToolbar from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar';
import InlineMetricsOverlay from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineMetricsOverlay';
import SnapFeedbackOverlay from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/SnapFeedbackOverlay';
import GroupOptionFloatingAction from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/GroupOptionFloatingAction';
import { useFloatingToolbarPosition } from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/useFloatingToolbarPosition';

import type { SelectionCommandSet } from '@sisad-pdfme/ui/components/Designer/shared/selectionCommands';
import type {
  CanvasContextMenuExternalActions,
  SelectionToolbarMode,
} from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions';
import type { InteractionState } from '@sisad-pdfme/ui/components/Designer/shared/interactionState';

import {
  resolveActiveSchemasFromElements,
  resolveSelectionPageIndex,
} from '@sisad-pdfme/ui/components/Designer/shared/selectionIdentityResolver';

import CommentsOverlay from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/CommentsOverlay';
import ShortcutHelpPanel from '@sisad-pdfme/ui/components/Designer/Shortcuts/ShortcutHelpPanel';
import type { EffectiveCollaborationContext } from '@sisad-pdfme/ui/collaborationContext';
import { buildRecipientNameMap } from '@sisad-pdfme/ui/collaborationContext';
import { OptionsContext } from '@sisad-pdfme/ui/contexts';
import { asRecord } from '@sisad-pdfme/shared/objectGuards';

/**
 * Slot visual para renderizar snap lines.
 *
 * Permite inyectar el componente real de líneas guía sin acoplar
 * `CanvasOverlayManager` a una implementación concreta.
 */
export type SnapLinesSlot = React.ComponentType<{
  /**
   * Líneas guía activas calculadas durante drag/resize/alineación.
   */
  lines: SnapLine[];

  /**
   * Clase CSS opcional para customización visual.
   */
  className?: string;

  /**
   * Estilos inline opcionales.
   */
  style?: React.CSSProperties;

  /**
   * Indica si el slot debe aplicar estilos por defecto.
   */
  useDefaultStyles?: boolean;
}>;

/**
 * Props del orquestador de overlays del canvas.
 *
 * Este componente no calcula comandos ni modifica schemas directamente.
 * Su responsabilidad es montar/desmontar overlays visuales según el estado
 * actual de selección, interacción, snap lines, comentarios y ayudas.
 */
type CanvasOverlayManagerProps = {
  /**
   * Elementos DOM actualmente seleccionados en el canvas.
   *
   * Normalmente corresponden a nodos de schemas renderizados.
   */
  activeElements: HTMLElement[];

  /**
   * Lista de schemas agrupados por página.
   *
   * Se usa para resolver qué schemas corresponden a los elementos DOM activos.
   */
  schemasList: SchemaForUI[][];

  /**
   * Comentarios top-level del template/snapshot.
   *
   * Son comentarios globales o desacoplados del schema embebido.
   */
  topLevelComments?: Array<{
    /**
     * Anchor visual/lógico del comentario.
     */
    anchor?: Record<string, unknown>;

    /**
     * Datos del comentario.
     */
    comment?: Record<string, unknown>;
  }>;

  /**
   * Página actual del canvas.
   */
  pageCursor: number;

  /**
   * Tamaño de página actual.
   *
   * Se usa para calcular posición segura del toolbar flotante.
   */
  pageSize: Size;

  /**
   * Referencias DOM de los papers/páginas renderizadas.
   *
   * CommentsOverlay las usa para ubicar pins en su página correspondiente.
   */
  paperRefs: React.MutableRefObject<HTMLDivElement[]>;

  /**
   * Escala actual del canvas.
   *
   * Se usa principalmente para posicionar overlays de comentarios.
   */
  scale?: number;

  /**
   * Líneas snap activas.
   */
  snapLines: SnapLine[];

  /**
   * Componente inyectado para renderizar líneas snap.
   */
  SnapLinesSlot: SnapLinesSlot;

  /**
   * Comandos disponibles para operar sobre la selección.
   *
   * Se pasan al toolbar contextual y a acciones flotantes.
   */
  selectionCommands?: SelectionCommandSet;

  /**
   * Estado de interacción actual del canvas.
   *
   * Incluye selección, fase de interacción, conteo y flags relevantes
   * para decidir qué overlays mostrar.
   */
  interactionState: InteractionState;

  /**
   * Feature flag para mostrar u ocultar snap lines.
   */
  featureSnapLines: boolean;

  /**
   * Indica si hay un drag externo de schema activo.
   *
   * Cuando está activo, se ocultan overlays de selección para evitar
   * interferencias visuales y de puntero durante drop externo.
   */
  externalSchemaDragActive?: boolean;

  /**
   * Indica si el menú contextual del canvas está abierto.
   *
   * Permite que el toolbar contextual adapte comportamiento visual
   * mientras el menú contextual está activo.
   */
  contextMenuOpen?: boolean;

  /**
   * Acciones inyectadas por capas superiores (comentarios, páginas, pegado).
   *
   * El menú de «Más» del toolbar y el de clic derecho son el mismo componente:
   * si estas no llegan, el primero se queda sin las acciones que el segundo sí
   * ofrece.
   */
  contextMenuExternalActions?: CanvasContextMenuExternalActions;

  /** Habilita «Pegar» en el menú de «Más», igual que en el de clic derecho. */
  hasClipboardData?: boolean;

  /**
   * Subconjunto de contexto colaborativo necesario para permisos,
   * labels y estado de toolbar. Acepta cualquier subconjunto de la forma
   * de `EffectiveCollaborationContext` para evitar rupturas entre callers.
   */
  collaborationContext?: Partial<EffectiveCollaborationContext>;

  /**
   * Clase CSS adicional para el contenedor raíz.
   */
  className?: string;
};

/**
 * Tamaño estimado para toolbar en modo micro.
 *
 * Se usa para calcular una posición flotante segura alrededor
 * de la selección activa.
 */
const MICRO_TOOLBAR_SIZE = { width: 288, height: 160 };

/**
 * Tamaño estimado para toolbar en modo compacto.
 */
const COMPACT_TOOLBAR_SIZE = { width: 384, height: 224 };

/**
 * Tamaño estimado para toolbar en modo expandido.
 */
const EXPANDED_TOOLBAR_SIZE = { width: 512, height: 360 };

/**
 * Orquestador de overlays del canvas.
 *
 * Responsabilidades:
 *
 * - resolver schemas activos desde elementos DOM seleccionados;
 * - calcular página activa de la selección;
 * - calcular posición del toolbar flotante;
 * - montar toolbar contextual de selección;
 * - montar acción flotante para option groups;
 * - montar métricas inline;
 * - montar feedback de snap;
 * - montar snap lines si el feature flag está activo;
 * - montar pins/comentarios;
 * - abrir/cerrar panel de atajos.
 *
 * Restricciones:
 *
 * - no manipular geometría de schemas;
 * - no mutar `schemasList`;
 * - no ejecutar comandos directamente;
 * - no tocar Moveable ni Selecto;
 * - no aplicar reglas de negocio del host.
 */
const CanvasOverlayManager = (props: CanvasOverlayManagerProps) => {
  const options = useContext(OptionsContext);
  const visibility = asRecord(asRecord(options)?.visibility);
  const canvasVisibility = asRecord(visibility?.canvas);
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
    contextMenuExternalActions,
    hasClipboardData = false,
    collaborationContext,
    className,
  } = props;

  /**
   * Modo visual del toolbar contextual.
   *
   * Por defecto:
   *
   * - selección múltiple: compact;
   * - selección única: micro.
   */
  const [toolbarMode, setToolbarMode] = useState<SelectionToolbarMode>(
    interactionState.selectionCount > 1 ? 'compact' : 'micro',
  );

  /**
   * Controla la visibilidad del panel de ayuda de atajos.
   */
  const [shortcutHelpOpen, setShortcutHelpOpen] = useState(false);

  /**
   * Sincroniza el modo del toolbar cuando cambia el número de seleccionados.
   *
   * La intención es regresar automáticamente a un modo razonable cuando
   * el usuario cambia de selección única a múltiple o viceversa.
   */
  useEffect(() => {
    const nextMode = interactionState.selectionCount > 1 ? 'compact' : 'micro';

    setToolbarMode((prev) => (prev === nextMode ? prev : nextMode));
  }, [interactionState.selectionCount]);

  /**
   * Escucha un evento global para abrir el panel de ayuda de atajos.
   *
   * Este evento permite que otros módulos, como botones o comandos de teclado,
   * soliciten abrir la ayuda sin acoplarse directamente a este componente.
   */
  useEffect(() => {
    const openShortcutPanel = () => setShortcutHelpOpen(true);

    window.addEventListener(
      'sisad-pdfme:shortcut-open-panel',
      openShortcutPanel as EventListener,
    );

    return () => {
      window.removeEventListener(
        'sisad-pdfme:shortcut-open-panel',
        openShortcutPanel as EventListener,
      );
    };
  }, []);

  /**
   * Tamaño estimado del toolbar según el modo visual activo.
   *
   * Este tamaño alimenta el cálculo de posición flotante.
   */
  const toolbarSize =
    toolbarMode === 'expanded'
      ? EXPANDED_TOOLBAR_SIZE
      : toolbarMode === 'compact'
        ? COMPACT_TOOLBAR_SIZE
        : MICRO_TOOLBAR_SIZE;

  /**
   * Posición calculada del toolbar flotante tomando en cuenta:
   *
   * - elementos seleccionados;
   * - tamaño de página;
   * - tamaño estimado del toolbar.
   */
  const selectionBounds = useFloatingToolbarPosition(
    activeElements,
    pageSize,
    toolbarSize,
  );

  /**
   * Schemas activos resueltos desde los elementos DOM seleccionados.
   *
   * Este paso mantiene desacoplada la selección visual del modelo de schemas.
   */
  const activeSchemas = useMemo(
    () => resolveActiveSchemasFromElements(schemasList, activeElements),
    [activeElements, schemasList],
  );

  const safeCollabForToolbar = useMemo(() => {
    if (!collaborationContext) return undefined;
    const recipientOptions = collaborationContext.recipientOptions ?? [];
    const recipientNameMap = collaborationContext.recipientNameMap ?? buildRecipientNameMap(recipientOptions);
    return {
      actorId: (collaborationContext as EffectiveCollaborationContext).actorId ?? null,
      activeRecipientId: (collaborationContext as EffectiveCollaborationContext).activeRecipientId ?? null,
      activeRecipient: (collaborationContext as EffectiveCollaborationContext).activeRecipient ?? null,
      recipientNameMap,
      canEditStructure: collaborationContext.canEditStructure ?? true,
    } as Pick<
      EffectiveCollaborationContext,
      'actorId' | 'activeRecipientId' | 'activeRecipient' | 'recipientNameMap' | 'canEditStructure'
    >;
  }, [collaborationContext]);

  /**
   * Página activa de la selección.
   *
   * Si no puede resolverse desde los elementos seleccionados,
   * usa `pageCursor` como fallback.
   */
  const activePageIndex = useMemo(
    () => resolveSelectionPageIndex(activeElements, pageCursor) ?? pageCursor,
    [activeElements, pageCursor],
  );
  const showSelectionOverlays = canvasVisibility?.toolbar !== false && canvasVisibility?.floatingToolbar !== false;

  return (
    <div className={`sisad-pdfme-ui-canvas-overlay-manager absolute inset-0 pointer-events-none z-[var(--z-overlay)] ${className || ''}`}>
      {!externalSchemaDragActive && showSelectionOverlays ? (
        <>
          {/**
           * Toolbar contextual de selección.
           *
           * Muestra acciones rápidas según selección, comandos disponibles,
           * modo visual, estado de interacción y contexto colaborativo.
           */}
          <SelectionContextToolbar
            position={selectionBounds}
            commands={selectionCommands}
            activeElements={activeElements}
            activeSchemas={activeSchemas}
            interactionState={interactionState}
            contextMenuOpen={contextMenuOpen}
            externalActions={contextMenuExternalActions}
            hasClipboardData={hasClipboardData}
            collaborationContext={safeCollabForToolbar}
          />

          {/**
           * Acción flotante específica para grupos de opciones.
           *
           * Permite mostrar affordances como agregar opción o convertir
           * checkbox individual a grupo, según selección activa.
           */}
          <GroupOptionFloatingAction
            activeElements={activeElements}
            activeSchemas={activeSchemas}
            selectionCommands={selectionCommands}
            interactionState={interactionState}
          />

          {/**
           * Overlay de métricas inline de selección.
           *
           * Usa los mismos bounds del toolbar para mostrar datos visuales
           * como tamaño, posición o indicadores contextuales.
           */}
          <InlineMetricsOverlay bounds={selectionBounds} />

          {/**
           * Feedback visual de snap activo cerca de la selección.
           */}
          <SnapFeedbackOverlay bounds={selectionBounds} snapLines={snapLines} />

          {/**
           * Líneas guía de snap.
           *
           * Se renderizan solo si la feature está activa.
           */}
          {featureSnapLines ? <SnapLinesSlot lines={snapLines} /> : null}
        </>
      ) : null}

      {/**
       * Overlay de comentarios.
       *
       * Recibe schemas de todas las páginas y comentarios top-level.
       * Cada pin debe posicionarse contra el paper correspondiente usando
       * `paperRefs`, no únicamente contra la página activa.
       */}
      <CommentsOverlay
        schemas={schemasList.flat()}
        topLevelComments={topLevelComments}
        scale={props.scale || 1}
        pageIndex={activePageIndex}
        paperRefs={paperRefs}
      />

      {/**
       * Panel de ayuda de atajos.
       *
       * Se abre mediante evento global `sisad-pdfme:shortcut-open-panel`
       * y se cierra con el callback local.
       */}
      <ShortcutHelpPanel
        open={shortcutHelpOpen}
        onClose={() => setShortcutHelpOpen(false)}
      />
    </div>
  );
};

export default React.memo(CanvasOverlayManager);
