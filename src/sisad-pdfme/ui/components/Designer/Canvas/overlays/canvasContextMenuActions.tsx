import React from 'react';

import {
  Plus,
  ClipboardPaste,
  FilePlus2,
  PanelLeftOpen,
  Upload,
  MessageSquare,
  Copy,
  Trash2,
  Lock,
  Settings2,
  ArrowUpToLine,
  ArrowDownToLine,
  Asterisk,
  SlidersHorizontal,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  AlignVerticalSpaceAround,
  AlignHorizontalSpaceAround,
  Eye,
  EyeOff,
  Type,
  Paintbrush,
  Group,
  Ungroup,
  SquareCheckBig,
} from 'lucide-react';

import type { SchemaForUI } from '@sisad-pdfme/common';
import type { SelectionCommandSet } from '@sisad-pdfme/ui/components/Designer/shared/selectionCommands';
import { INLINE_EDITABLE_TEXT_TYPES } from '@sisad-pdfme/schemas/schemaFamilies';
import { getSchemaTypeLabel } from '@sisad-pdfme/ui/components/Designer/shared/designerLabels';
import { isOptionGroupType } from '@sisad-pdfme/schemas/options/optionGroupLayout';

import {
  resolveSchemaAccessState,
  type SchemaAccessState,
} from '@sisad-pdfme/ui/collaboration/schemaRuntimeAccess';

import type { EffectiveCollaborationContext } from '@sisad-pdfme/ui/collaborationContext';
import type { ResolvedSisadPdfmeConfig, SisadPdfmeVisibilityConfig } from '@sisad-pdfme/config/SisadPdfmeConfig';
import { resolveSisadPdfmeConfig } from '@sisad-pdfme/config/resolveSisadPdfmeConfig';
import { resolveCapabilityState } from '@sisad-pdfme/config/capabilityGraph';

/**
 * Modo del menú contextual del canvas.
 *
 * empty:
 * El usuario abrió el menú sobre un área vacía del canvas.
 *
 * single:
 * El usuario abrió el menú sobre un único schema seleccionado.
 *
 * multi:
 * El usuario abrió el menú con varios schemas seleccionados.
 */
export type CanvasContextMenuMode = 'empty' | 'single' | 'multi';

/**
 * Clasificación semántica de la selección actual.
 *
 * Esta clasificación permite adaptar toolbar, acciones rápidas,
 * grupos secundarios y textos según el tipo de campo seleccionado.
 */
export type SelectionToolbarSelectionKind =
  /**
   * Campos textuales editables inline.
   */
  | 'text'

  /**
   * Campo de formulario genérico.
   */
  | 'field'

  /**
   * Imagen o SVG.
   */
  | 'image'

  /**
   * Campo de firma.
   */
  | 'signature'

  /**
   * Campo de opción/selección.
   */
  | 'choice'

  /**
   * Tabla.
   */
  | 'table'

  /**
   * Grupo o selección homogénea múltiple.
   */
  | 'group'

  /**
   * Selección heterogénea o no clasificable.
   */
  | 'mixed';

/**
 * Densidad visual del toolbar flotante de selección.
 *
 * micro:
 * Muestra pocas acciones críticas.
 *
 * compact:
 * Muestra acciones primarias más frecuentes.
 *
 * expanded:
 * Muestra acciones primarias y secciones secundarias.
 */
export type SelectionToolbarMode = 'micro' | 'compact' | 'expanded';

/**
 * Acciones externas inyectadas por el host o por capas superiores.
 *
 * Permite extender el menú contextual sin que este archivo conozca
 * lógica de negocio, modales, uploads o paneles específicos.
 */
export type CanvasContextMenuExternalActions = {
  /**
   * Inserta un nuevo campo desde el canvas vacío.
   */
  onInsertField?: () => void;

  /**
   * Pega schemas desde clipboard.
   */
  onPaste?: () => void;

  /**
   * Agrega una página al documento/template actual.
   */
  onAddPage?: () => void;

  /**
   * Abre el catálogo/sidebar de campos.
   */
  onOpenCatalog?: () => void;

  /**
   * Sube o reemplaza el PDF base.
   */
  onUploadOrReplacePdf?: () => void;

  /**
   * Abre propiedades de selección múltiple o grupo.
   */
  onOpenGroupProperties?: () => void;

  /**
   * Crea un comentario asociado al canvas o selección.
   */
  onCreateComment?: () => void;
};

/**
 * Item individual del menú contextual del canvas.
 *
 * Es una descripción declarativa de una acción renderizable.
 * El componente visual decide cómo pintarla.
 */
export type CanvasContextMenuItem = {
  /**
   * Identificador estable del item.
   */
  id: string;

  /**
   * Texto visible de la acción.
   */
  label: string;

  /**
   * Icono React mostrado junto al texto.
   */
  icon?: React.ReactNode;

  /**
   * Indica si la acción está deshabilitada.
   */
  disabled?: boolean;

  /**
   * Motivo visible de deshabilitación.
   *
   * Normalmente se usa como `title` o tooltip.
   */
  disabledReason?: string;

  /**
   * Marca una acción destructiva.
   */
  danger?: boolean;

  /**
   * Oculta el item sin eliminarlo del modelo.
   */
  hidden?: boolean;

  /**
   * Marca la acción como activa.
   *
   * Útil para toggles como readonly/hidden.
   */
  active?: boolean;

  /**
   * Callback ejecutado al seleccionar la acción.
   */
  onSelect?: () => void;
};

/**
 * Grupo de acciones del menú contextual.
 *
 * Permite organizar items por bloques:
 *
 * - edición;
 * - visibilidad;
 * - protección;
 * - colaboración;
 * - orden;
 * - inspector.
 */
export type CanvasContextMenuGroup = {
  /**
   * Identificador estable del grupo.
   */
  id: string;

  /**
   * Título opcional del grupo.
   */
  label?: string;

  /**
   * Items del grupo.
   */
  items: CanvasContextMenuItem[];
};

/**
 * Acción rápida para toolbar flotante de selección.
 *
 * Similar a `CanvasContextMenuItem`, pero orientada a toolbar:
 * soporta estados críticos, loading y agrupación primaria/secundaria.
 */
export type CanvasSelectionQuickAction = {
  /**
   * Identificador estable de la acción.
   */
  id: string;

  /**
   * Texto visible.
   */
  label: string;

  /**
   * Icono React.
   */
  icon: React.ReactNode;

  /**
   * Indica si la acción está activa como toggle.
   */
  active?: boolean;

  /**
   * Marca la acción como prioritaria/crítica.
   *
   * Ejemplo: eliminar o duplicar.
   */
  critical?: boolean;

  /**
   * Indica si la acción está deshabilitada.
   */
  disabled?: boolean;

  /**
   * Motivo visible de deshabilitación.
   */
  disabledReason?: string;

  /**
   * Estado de carga.
   */
  loading?: boolean;

  /**
   * Marca una acción destructiva.
   */
  danger?: boolean;

  /**
   * Callback ejecutado al seleccionar la acción.
   */
  onSelect?: () => void;
};

/**
 * Sección secundaria del toolbar flotante.
 *
 * Se usa especialmente en modo expanded para agrupar acciones avanzadas.
 */
export type SelectionToolbarSection = {
  /**
   * Identificador de la sección.
   */
  id: string;

  /**
   * Título visible de la sección.
   */
  label: string;

  /**
   * Acciones disponibles dentro de la sección.
   */
  items: CanvasSelectionQuickAction[];
};

/**
 * Modelo completo del toolbar flotante de selección.
 *
 * Este modelo es consumido por la UI del toolbar para renderizar:
 *
 * - tipo de selección;
 * - modo visual;
 * - acciones primarias;
 * - secciones secundarias;
 * - chips de resumen;
 * - chips de estado.
 */
export type SelectionToolbarModel = {
  /**
   * Tipo semántico de selección.
   */
  kind: SelectionToolbarSelectionKind;

  /**
   * Densidad visual del toolbar.
   */
  mode: SelectionToolbarMode;

  /**
   * Acciones principales visibles rápidamente.
   */
  primaryActions: CanvasSelectionQuickAction[];

  /**
   * Secciones secundarias, normalmente visibles en modo expanded.
   */
  secondarySections: SelectionToolbarSection[];

  /**
   * Chips de resumen: nombre, tipo, cantidad, etc.
   */
  summaryChips: string[];

  /**
   * Chips de estado: obligatorio, readonly, oculto, fase de interacción, etc.
   */
  stateChips: string[];
};

/**
 * Argumentos internos para construir grupos del menú contextual.
 *
 * Centraliza selección, comandos, estado visual y permisos colaborativos.
 */
type BuildContextMenuGroupsArgs = {
  /**
   * Modo del menú contextual.
   */
  mode: CanvasContextMenuMode;

  /**
   * Set de comandos de selección.
   */
  commands?: SelectionCommandSet;

  /**
   * Acciones externas inyectadas por host/runtime.
   */
  externalActions?: CanvasContextMenuExternalActions;

  /**
   * Indica si hay datos pegables en clipboard.
   */
  hasClipboardData?: boolean;

  /**
   * Cantidad de schemas seleccionados.
   */
  selectionCount?: number;

  /**
   * Schemas seleccionados.
   */
  selectionSchemas: SchemaForUI[];

  /**
   * Subconjunto de contexto colaborativo necesario para permisos/labels.
   */
  collaborationContext?: Pick<
    EffectiveCollaborationContext,
    'actorId' | 'activeRecipientId' | 'activeRecipient' | 'recipientNameMap' | 'canEditStructure'
  >;

  /**
   * Estado readonly del schema activo.
   */
  activeReadOnly?: boolean;

  /**
   * Estado required del schema activo.
   */
  activeRequired?: boolean;

  /**
   * Estado hidden del schema activo.
   */
  activeHidden?: boolean;

  /**
   * Permiso final para editar estructura.
   */
  canEditStructure?: boolean;

  /**
   * Configuración global de visibilidad.
   */
  visibility?: SisadPdfmeVisibilityConfig;
};

/**
 * Elimina valores null/undefined de una lista y conserva tipado fuerte.
 *
 * Se usa para construir arrays declarativos sin múltiples filtros manuales.
 */
const compactItems = <T,>(items: Array<T | null | undefined>) =>
  items.filter(Boolean) as T[];

/**
 * Resuelve el texto de un toggle según si está activo o inactivo.
 */
const resolveToggleLabel = (
  active: boolean | undefined,
  activeLabel: string,
  inactiveLabel: string,
) => (active ? activeLabel : inactiveLabel).trim();

/**
 * Traduce una fase técnica de interacción a una etiqueta visible.
 */
const formatSelectionStateLabel = (phase: string) => {
  switch (phase) {
    case 'selected-multi':
      return 'Selección múltiple';
    case 'selected-single':
      return 'Elemento activo';
    case 'editing':
      return 'Editando';
    case 'dragging':
      return 'Moviendo';
    case 'resizing':
      return 'Redimensionando';
    case 'rotating':
      return 'Rotando';
    case 'hover':
      return 'Preselección';
    default:
      return 'Listo';
  }
};

/**
 * Normaliza un tipo de schema a key comparable.
 */
const normalizeTypeKey = (value: unknown) =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

/**
 * Tipos considerados imagen/asset visual.
 */
const IMAGE_TYPES = new Set(['image', 'svg']);

/**
 * Tipos considerados firma.
 */
const SIGNATURE_TYPES = new Set(['signature']);

/**
 * Tipos considerados campos de elección.
 */
const CHOICE_TYPES = new Set([
  'checkbox',
  'radiogroup',
  'checkboxgroup',
  'select',
  'dropdown',
]);

/**
 * Construye la acción estilo DocuSign para grupos de opciones.
 *
 * Casos:
 *
 * - optionGroup/radioGroup/checkboxGroup: muestra "Agregar opción";
 * - checkbox individual: muestra "Convertir a grupo";
 * - otros schemas: no devuelve acción.
 *
 * @param commands Comandos disponibles de selección.
 * @param activeSchema Schema activo.
 * @param canEditStructure Permiso de edición estructural.
 * @returns Acción rápida o null si no aplica.
 */
const getGroupAffordanceAction = (
  commands: SelectionCommandSet | undefined,
  activeSchema: SchemaForUI | undefined,
  canEditStructure: boolean,
): CanvasSelectionQuickAction | null => {
  const type = String((activeSchema as SchemaForUI & { type?: string })?.type || '').toLowerCase();

  if (isOptionGroupType(type)) {
    return toolbarAction(
      'add-group-option',
      'Agregar opción',
      <Plus size={14} />,
      commands?.addGroupOption,
      {
        disabled: !canEditStructure || !hasAction(commands?.addGroupOption),
      },
    );
  }

  if (type === 'checkbox') {
    return toolbarAction(
      'convert-checkbox-group',
      'Convertir a grupo',
      <Plus size={14} />,
      commands?.convertCheckboxToGroup,
      {
        disabled: !canEditStructure || !hasAction(commands?.convertCheckboxToGroup),
      },
    );
  }

  return null;
};

/**
 * Tipos numéricos.
 */
const NUMBER_TYPES = new Set(['number']);

/**
 * Tipos tabulares.
 */
const TABLE_TYPES = new Set(['table']);

/**
 * Determina si un tipo de schema se comporta como campo de formulario.
 */
const isFormFieldType = (type: string) =>
  INLINE_EDITABLE_TEXT_TYPES.has(type) ||
  NUMBER_TYPES.has(type) ||
  SIGNATURE_TYPES.has(type) ||
  CHOICE_TYPES.has(type) ||
  ['date', 'datetime', 'time'].includes(type);

/**
 * Indica si toda la selección corresponde a campos de formulario.
 */
const hasFormFieldSelection = (activeSchemas: SchemaForUI[]) =>
  activeSchemas.length > 0 &&
  activeSchemas.every((schema) => isFormFieldType(normalizeTypeKey(schema.type)));

/**
 * Clasifica la selección activa para adaptar toolbar y acciones.
 *
 * @param activeSchemas Schemas actualmente seleccionados.
 * @returns Tipo semántico de selección.
 */
export const resolveSelectionToolbarKind = (
  activeSchemas: SchemaForUI[],
): SelectionToolbarSelectionKind => {
  if (activeSchemas.length > 1) {
    const uniqueTypes = [
      ...new Set(activeSchemas.map((schema) => normalizeTypeKey(schema.type))),
    ].filter(Boolean);

    return uniqueTypes.length > 1 ? 'mixed' : 'group';
  }

  const type = normalizeTypeKey(activeSchemas[0]?.type);

  if (!type) return 'mixed';
  if (INLINE_EDITABLE_TEXT_TYPES.has(type)) return 'text';
  if (IMAGE_TYPES.has(type)) return 'image';
  if (SIGNATURE_TYPES.has(type)) return 'signature';
  if (CHOICE_TYPES.has(type)) return 'choice';
  if (TABLE_TYPES.has(type)) return 'table';

  return ['date', 'datetime', 'time'].includes(type) || NUMBER_TYPES.has(type)
    ? 'field'
    : 'mixed';
};

/**
 * Factory de acción rápida para toolbar.
 *
 * Normaliza disabled/loading/onSelect para que todas las acciones tengan
 * un contrato consistente.
 */
const toolbarAction = (
  id: string,
  label: string,
  icon: React.ReactNode,
  command?: () => void,
  extra?: Partial<CanvasSelectionQuickAction> & { disabledReason?: string },
): CanvasSelectionQuickAction => ({
  id,
  label,
  icon,
  disabled: Boolean(extra?.disabled) || !command || Boolean(extra?.loading),
  disabledReason: extra?.disabledReason,
  loading: extra?.loading,
  danger: extra?.danger,
  active: extra?.active,
  critical: extra?.critical,
  onSelect: command,
});

/**
 * Construye chips de resumen para la selección.
 *
 * Para selección múltiple muestra cantidad y tipo.
 * Para selección única prioriza nombre y tipo de schema.
 */
const buildSelectionSummaryChips = (
  activeSchemas: SchemaForUI[],
  selectionCount: number,
) => {
  const primarySchema = activeSchemas[0];
  const summaryChips: string[] = [];

  if (selectionCount > 1) {
    summaryChips.push(`${selectionCount} elementos`);
    summaryChips.push('Selección múltiple');
  } else {
    const name = typeof primarySchema?.name === 'string' ? primarySchema.name.trim() : '';
    const type = getSchemaTypeLabel(primarySchema?.type);

    if (name) summaryChips.push(name);
    if (type) summaryChips.push(type);
    if (!summaryChips.length) summaryChips.push('Campo activo');
  }

  return summaryChips;
};

/**
 * Indica si un comando existe y es ejecutable.
 */
const hasAction = (command?: () => void) => typeof command === 'function';

/**
 * Resuelve permisos/estado colaborativo de la selección principal.
 *
 * Actualmente toma como referencia el primer schema seleccionado.
 */
const resolveSelectionAccessState = (
  selectionSchemas: SchemaForUI[],
  collaborationContext?: BuildContextMenuGroupsArgs['collaborationContext'],
): SchemaAccessState | null => {
  const activeSchema = selectionSchemas[0];
  if (!activeSchema) return null;

  return resolveSchemaAccessState(
    activeSchema,
    collaborationContext as never,
    collaborationContext?.activeRecipient ?? null,
  );
};

/**
 * Reordena acciones para que acciones críticas salgan primero.
 *
 * Prioridad actual:
 *
 * 1. delete;
 * 2. duplicate;
 * 3. resto.
 */
const prioritizeCriticalActions = (actions: CanvasSelectionQuickAction[]) => {
  const deleteAction = actions.find((action) => action.id === 'delete');
  const duplicateAction = actions.find((action) => action.id === 'duplicate');
  const rest = actions.filter(
    (action) => action.id !== 'delete' && action.id !== 'duplicate',
  );

  return [...compactItems([deleteAction, duplicateAction]), ...rest];
};

/**
 * Devuelve un subconjunto limitado de acciones críticas/prioritarias.
 */
const buildCriticalPrimaryActions = (
  actions: CanvasSelectionQuickAction[],
  maxItems: number,
) => prioritizeCriticalActions(actions).slice(0, maxItems);

/**
 * Determina si una acción contextual debe mostrarse según la visibilidad global.
 */
/**
 * Ids del menú contextual → capability canónica de configuración.
 *
 * El menú tiene ids propios (`delete-multi`, `copy-style`, `align-left`…) que
 * no existen en `actionConfigRegistry`. Antes se resolvían con un `switch` que
 * volvía a mapear cada uno a su rama de `visibility.actions`: una TERCERA
 * tabla con la misma información que el registry de configuración y que el
 * mapa del Designer, con las tres libres de desincronizarse (RTP-465).
 *
 * Ahora sólo se declara la correspondencia; la política la resuelve el grafo.
 * Un id ausente de este mapa no tiene política propia y permanece visible: es
 * chrome del menú, no una acción configurable.
 */
export const CONTEXT_ACTION_CAPABILITY: Record<string, string[]> = {
  delete: ['action:delete-schema'],
  'delete-multi': ['action:delete-schema'],
  duplicate: ['action:duplicate-schema'],
  'copy-style': ['action:copy'],
  'paste-style': ['action:paste'],
  readonly: ['action:lock-position', 'action:unlock-position'],
  lock: ['action:lock-position', 'action:unlock-position'],
  'lock-multi': ['action:lock-position', 'action:unlock-position'],
  'collaboration-lock': ['action:lock-position', 'action:unlock-position'],
  'collaboration-lock-multi': ['action:lock-position', 'action:unlock-position'],
  hidden: ['action:hide-schema', 'action:show-schema'],
  show: ['action:hide-schema', 'action:show-schema'],
  'show-multi': ['action:hide-schema', 'action:show-schema'],
  hide: ['action:hide-schema', 'action:show-schema'],
  'hide-multi': ['action:hide-schema', 'action:show-schema'],
  'align-left': ['action:align'],
  'align-center': ['action:align'],
  'align-right': ['action:align'],
  'align-top': ['action:align'],
  'align-middle': ['action:align'],
  'align-bottom': ['action:align'],
  'distribute-horizontal': ['action:distribute'],
  'distribute-vertical': ['action:distribute'],
};

/**
 * El menú sólo recibe la rama `visibility.actions`, así que se resuelve una
 * configuración canónica alrededor de ella. Es la misma información que
 * consultaba el `switch` anterior; lo que cambia es que ahora la interpreta el
 * grafo y no una tabla local.
 *
 * Se memoiza por identidad del objeto de visibilidad: el menú se reconstruye a
 * cada apertura y la configuración resuelta no cambia entre ellas.
 */
const contextSourceCache = new WeakMap<object, Pick<ResolvedSisadPdfmeConfig, 'config' | 'visibility'>>();

const resolveContextSource = (actionsVisibility: SisadPdfmeVisibilityConfig['actions']) => {
  const key = actionsVisibility as unknown as object;
  const cached = contextSourceCache.get(key);
  if (cached) return cached;
  const resolved = resolveSisadPdfmeConfig({ visibility: { actions: actionsVisibility } });
  const source = { config: resolved.config, visibility: resolved.visibility };
  contextSourceCache.set(key, source);
  return source;
};

/**
 * `rename-label` no tiene acción propia en la configuración pero sí bandera de
 * visibilidad, así que conserva su lectura directa.
 */
const isContextActionVisible = (
  actionId: string,
  visibility?: SisadPdfmeVisibilityConfig['actions'],
) => {
  if (!visibility) return true;
  if (actionId === 'rename-label') return visibility.rename !== false;

  const capabilities = CONTEXT_ACTION_CAPABILITY[actionId];
  if (!capabilities) return true;
  const source = resolveContextSource(visibility);
  // Una entrada con varias capabilities es un par simétrico (bloquear /
  // desbloquear): basta con que una siga permitida para que el ítem exista.
  return capabilities.some((capabilityId) => resolveCapabilityState(source, capabilityId).visible);
};

/**
 * Filtra grupos de acciones según la visibilidad global.
 */
const filterVisibleGroups = (
  groups: CanvasContextMenuGroup[],
  visibility?: SisadPdfmeVisibilityConfig['actions'],
) =>
  groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => isContextActionVisible(item.id, visibility)),
    }))
    .filter((group) => group.items.length > 0);

/**
 * Construye chips de estado para toolbar de selección.
 *
 * Incluye fase de interacción y estados mixtos o globales:
 *
 * - obligatorio;
 * - solo lectura;
 * - oculto;
 * - sin nombre.
 */
const buildSelectionToolbarStateChips = (
  interactionPhase: string,
  activeSchemas: SchemaForUI[],
  selectionCount: number,
  allReadOnly: boolean,
  allRequired: boolean,
  allHidden: boolean,
) => {
  const someReadOnly = activeSchemas.some((schema) => schema.readOnly);
  const someRequired = activeSchemas.some((schema) => schema.required);
  const someHidden = activeSchemas.some(
    (schema) => (schema as SchemaForUI & { hidden?: boolean }).hidden === true,
  );
  const someNameless = activeSchemas.some((schema) => !schema.name?.trim());

  return [
    formatSelectionStateLabel(interactionPhase),
    selectionCount > 1 ? 'Múltiple' : null,
    allRequired ? 'Obligatorio' : someRequired ? 'Mixto: obligatorio' : null,
    allReadOnly ? 'Solo lectura' : someReadOnly ? 'Mixto: bloqueo' : null,
    allHidden ? 'Oculto' : someHidden ? 'Mixto: visible' : null,
    someNameless ? 'Sin nombre' : null,
  ].filter((chip): chip is string => Boolean(chip));
};

/**
 * Acciones relacionadas con estilos y bloqueo visual.
 */
const getSelectionStyleActions = (
  commands?: SelectionCommandSet,
  activeReadOnly = false,
  canEditStructure = true,
) => [
  toolbarAction(
    'copy-style',
    'Copiar estilo',
    <Paintbrush size={14} />,
    commands?.copyStyle,
    {
      disabled: !hasAction(commands?.copyStyle),
      disabledReason: 'Todavía no está conectado el portapapeles de estilos',
    },
  ),
  toolbarAction(
    'paste-style',
    'Pegar estilo',
    <ClipboardPaste size={14} />,
    commands?.pasteStyle,
    {
      disabled: !canEditStructure || !hasAction(commands?.pasteStyle),
      disabledReason: !canEditStructure
        ? 'El rol actual solo permite revisar y comentar'
        : 'Todavía no está conectado el portapapeles de estilos',
    },
  ),
  toolbarAction(
    'readonly',
    activeReadOnly ? 'Desbloquear posición' : 'Bloquear posición',
    <Lock size={14} />,
    commands?.toggleReadOnly,
    {
      active: activeReadOnly,
      disabled: !canEditStructure || !hasAction(commands?.toggleReadOnly),
      disabledReason: !canEditStructure
        ? 'El rol actual solo permite revisar y comentar'
        : undefined,
    },
  ),
];

/**
 * Construye la acción de ocultar/mostrar selección.
 */
const getSelectionVisibilityAction = (
  commands?: SelectionCommandSet,
  activeHidden = false,
  canEditStructure = true,
) =>
  toolbarAction(
    'hidden',
    activeHidden ? 'Mostrar' : 'Ocultar',
    activeHidden ? <EyeOff size={14} /> : <Eye size={14} />,
    commands?.toggleHidden,
    {
      active: activeHidden,
      disabled: !canEditStructure || !hasAction(commands?.toggleHidden),
      disabledReason: !canEditStructure
        ? 'El rol actual solo permite revisar y comentar'
        : 'El runtime aún no sincroniza ocultar/mostrar en el lienzo',
    },
  );

/**
 * Construye acción de edición inline cuando el tipo seleccionado lo permite.
 */
const getSelectionInlineAction = (
  commands?: SelectionCommandSet,
  kind?: SelectionToolbarSelectionKind,
  canEditStructure = true,
) => {
  if (kind === 'text') {
    return toolbarAction(
      'edit-inline',
      'Editar texto',
      <Type size={14} />,
      commands?.editTextInline,
      {
        disabled: !canEditStructure || !hasAction(commands?.editTextInline),
        disabledReason: !canEditStructure
          ? 'El rol actual solo permite revisar y comentar'
          : 'La edición inline todavía depende del runtime del canvas',
      },
    );
  }

  return null;
};

/**
 * Construye acciones de orden visual/z-index relativo.
 */
const getSelectionOrderingActions = (
  commands?: SelectionCommandSet,
  canEditStructure = true,
) => [
  toolbarAction(
    'bring-forward',
    'Traer al frente',
    <ArrowUpToLine size={14} />,
    commands?.bringForward,
    { disabled: !canEditStructure || !hasAction(commands?.bringForward) },
  ),
  toolbarAction(
    'send-backward',
    'Enviar atrás',
    <ArrowDownToLine size={14} />,
    commands?.sendBackward,
    { disabled: !canEditStructure || !hasAction(commands?.sendBackward) },
  ),
];

/**
 * Construye acciones de alineación para selección múltiple.
 */
const getSelectionAlignmentActions = (
  commands?: SelectionCommandSet,
  canEditStructure = true,
) => [
  toolbarAction(
    'align-left',
    'Izquierda',
    <AlignStartVertical size={14} />,
    commands ? () => commands.alignSelection('left') : undefined,
    { disabled: !canEditStructure },
  ),
  toolbarAction(
    'align-center',
    'Centro',
    <AlignCenterVertical size={14} />,
    commands ? () => commands.alignSelection('center') : undefined,
    { disabled: !canEditStructure },
  ),
  toolbarAction(
    'align-right',
    'Derecha',
    <AlignEndVertical size={14} />,
    commands ? () => commands.alignSelection('right') : undefined,
    { disabled: !canEditStructure },
  ),
  toolbarAction(
    'align-top',
    'Arriba',
    <AlignStartHorizontal size={14} />,
    commands ? () => commands.alignSelection('top') : undefined,
    { disabled: !canEditStructure },
  ),
  toolbarAction(
    'align-middle',
    'Medio',
    <AlignCenterHorizontal size={14} />,
    commands ? () => commands.alignSelection('middle') : undefined,
    { disabled: !canEditStructure },
  ),
  toolbarAction(
    'align-bottom',
    'Abajo',
    <AlignEndHorizontal size={14} />,
    commands ? () => commands.alignSelection('bottom') : undefined,
    { disabled: !canEditStructure },
  ),
];

/**
 * Construye acciones de distribución.
 *
 * La distribución requiere al menos 3 elementos seleccionados.
 */
const getSelectionDistributionActions = (
  commands?: SelectionCommandSet,
  selectionCount = 0,
  canEditStructure = true,
) => {
  const canDistribute = selectionCount >= 3;

  return [
    toolbarAction(
      'distribute-horizontal',
      'Horizontal',
      <AlignHorizontalSpaceAround size={14} />,
      commands ? () => commands.distributeSelection('horizontal') : undefined,
      {
        disabled: !canEditStructure || !canDistribute,
        disabledReason: !canEditStructure
          ? 'El rol actual solo permite revisar y comentar'
          : canDistribute
            ? undefined
            : 'Selecciona al menos 3 elementos',
      },
    ),
    toolbarAction(
      'distribute-vertical',
      'Vertical',
      <AlignVerticalSpaceAround size={14} />,
      commands ? () => commands.distributeSelection('vertical') : undefined,
      {
        disabled: !canEditStructure || !canDistribute,
        disabledReason: !canEditStructure
          ? 'El rol actual solo permite revisar y comentar'
          : canDistribute
            ? undefined
            : 'Selecciona al menos 3 elementos',
      },
    ),
  ];
};

/**
 * Construye acciones de agrupar/desagrupar.
 */
const getSelectionGroupingActions = (
  commands?: SelectionCommandSet,
  selectionKind?: SelectionToolbarSelectionKind,
  selectionCount = 0,
  canEditStructure = true,
) => {
  const canGroup = selectionCount > 1;
  const groupSupported = Boolean(commands?.groupSelection);
  const ungroupSupported = Boolean(commands?.ungroupSelection);

  return [
    toolbarAction(
      'group',
      'Agrupar',
      <Group size={14} />,
      commands?.groupSelection,
      {
        disabled: !canEditStructure || !canGroup || !groupSupported,
        disabledReason: !canEditStructure
          ? 'El rol actual solo permite revisar y comentar'
          : !canGroup
            ? 'Selecciona al menos 2 elementos'
            : 'Agrupar todavía no está implementado',
      },
    ),
    toolbarAction(
      'ungroup',
      'Desagrupar',
      <Ungroup size={14} />,
      commands?.ungroupSelection,
      {
        disabled: !canEditStructure || selectionKind !== 'group' || !ungroupSupported,
        disabledReason: !canEditStructure
          ? 'El rol actual solo permite revisar y comentar'
          : selectionKind !== 'group'
            ? 'Solo aplica sobre un grupo'
            : 'Desagrupar todavía no está implementado',
      },
    ),
  ];
};

/**
 * Construye acciones de datos para campos de formulario.
 */
const getSelectionDataActions = (
  commands?: SelectionCommandSet,
  activeSchemas: SchemaForUI[] = [],
  canEditStructure = true,
) => {
  const activeSchema = activeSchemas[0];
  const isFormField = Boolean(
    activeSchema && isFormFieldType(normalizeTypeKey(activeSchema.type)),
  );

  return [
    toolbarAction(
      'required',
      resolveToggleLabel(
        activeSchema?.required,
        'Quitar obligatorio',
        'Marcar obligatorio',
      ),
      <SquareCheckBig size={14} />,
      commands?.toggleRequired,
      {
        active: Boolean(activeSchema?.required),
        disabled: !canEditStructure || !isFormField,
        disabledReason: !canEditStructure
          ? 'El rol actual solo permite revisar y comentar'
          : isFormField
            ? undefined
            : 'Solo aplica a campos de formulario',
      },
    ),
    toolbarAction(
      'rename-label',
      'Renombrar etiqueta',
      <Type size={14} />,
      commands?.renameLabel,
      {
        disabled: !canEditStructure || !isFormField || !hasAction(commands?.renameLabel),
        disabledReason: !canEditStructure
          ? 'El rol actual solo permite revisar y comentar'
          : isFormField
            ? 'El renombrado debe conectarse al inspector'
            : 'Solo aplica a campos de formulario',
      },
    ),
  ];
};

/**
 * Construye el modelo completo para el toolbar flotante de selección.
 *
 * Este modelo permite que el componente visual no tenga que conocer:
 *
 * - reglas de selección múltiple;
 * - permisos colaborativos;
 * - clasificación de tipos;
 * - prioridad de acciones;
 * - secciones secundarias;
 * - chips de estado/resumen.
 *
 * @param args Contexto de selección y comandos disponibles.
 * @returns Modelo declarativo listo para renderizar.
 */
export const buildSelectionToolbarModel = (args: {
  /**
   * Comandos disponibles para operar sobre la selección.
   */
  commands?: SelectionCommandSet;

  /**
   * Schemas activos seleccionados.
   */
  activeSchemas: SchemaForUI[];

  /**
   * Cantidad total seleccionada.
   */
  selectionCount: number;

  /**
   * Fase actual de interacción.
   */
  interactionPhase: string;

  /**
   * Modo visual deseado del toolbar.
   */
  mode?: SelectionToolbarMode;

  /**
   * Contexto colaborativo parcial.
   */
  collaborationContext?: BuildContextMenuGroupsArgs['collaborationContext'];
}): SelectionToolbarModel => {
  const {
    commands,
    activeSchemas,
    selectionCount,
    interactionPhase,
    mode = selectionCount > 1 ? 'expanded' : 'compact',
    collaborationContext,
  } = args;

  const canEditStructure = commands?.canEditStructure !== false;
  const accessState = collaborationContext
    ? resolveSelectionAccessState(activeSchemas, collaborationContext)
    : null;

  const kind = resolveSelectionToolbarKind(activeSchemas);
  const allReadOnly =
    activeSchemas.length > 0 && activeSchemas.every((schema) => schema.readOnly);
  const allRequired =
    activeSchemas.length > 0 && activeSchemas.every((schema) => schema.required);
  const allHidden =
    activeSchemas.length > 0 &&
    activeSchemas.every(
      (schema) => (schema as SchemaForUI & { hidden?: boolean }).hidden === true,
    );

  const summaryChips = buildSelectionSummaryChips(activeSchemas, selectionCount);
  const stateChips =
    mode === 'micro'
      ? []
      : buildSelectionToolbarStateChips(
          interactionPhase,
          activeSchemas,
          selectionCount,
          allReadOnly,
          allRequired,
          allHidden,
        );

  const quickActions: CanvasSelectionQuickAction[] = [];
  const secondarySections: SelectionToolbarSection[] = [];
  const activeSchema = activeSchemas[0];
  const hasFieldSelection = hasFormFieldSelection(activeSchemas);

  /**
   * Selección múltiple:
   * prioriza duplicar/eliminar/readonly/visibilidad/propiedades y expone
   * alineación/distribución/grupo/orden en modo expanded.
   */
  if (selectionCount > 1) {
    quickActions.push(
      ...compactItems([
        toolbarAction(
          'duplicate',
          'Duplicar',
          <Copy size={14} />,
          commands?.duplicateSelection,
          {
            disabled: !canEditStructure || !hasAction(commands?.duplicateSelection),
          },
        ),
        toolbarAction(
          'delete',
          'Eliminar',
          <Trash2 size={14} />,
          commands?.deleteSelection,
          {
            danger: true,
            critical: true,
            disabled: !canEditStructure || !hasAction(commands?.deleteSelection),
          },
        ),
        toolbarAction(
          'readonly',
          allReadOnly ? 'Desbloquear posición' : 'Bloquear posición',
          <Lock size={14} />,
          commands?.toggleReadOnly,
          {
            active: allReadOnly,
            disabled:
              !canEditStructure ||
              !hasAction(commands?.toggleReadOnly) ||
              Boolean(accessState?.isLockedByOther),
            disabledReason: accessState?.isLockedByOther
              ? `Bloqueado por ${accessState.lockedByLabel || 'otro usuario'}`
              : undefined,
          },
        ),
        getSelectionVisibilityAction(commands, allHidden, canEditStructure),
        toolbarAction(
          'properties',
          'Propiedades',
          <Settings2 size={14} />,
          commands?.openProperties,
          {
            disabled: !canEditStructure || !hasAction(commands?.openProperties),
          },
        ),
      ]),
    );

    if (mode === 'expanded') {
      secondarySections.push(
        {
          id: 'align',
          label: 'Alineación',
          items: getSelectionAlignmentActions(commands, canEditStructure),
        },
        {
          id: 'distribute',
          label: 'Distribuir',
          items: getSelectionDistributionActions(
            commands,
            selectionCount,
            canEditStructure,
          ),
        },
        {
          id: 'grouping',
          label: 'Grupo',
          items: getSelectionGroupingActions(
            commands,
            kind,
            selectionCount,
            canEditStructure,
          ),
        },
        {
          id: 'ordering',
          label: 'Orden',
          items: getSelectionOrderingActions(commands, canEditStructure),
        },
      );
    }
  } else {
    /**
     * Selección única:
     * adapta acciones según tipo, permitiendo affordances de option groups,
     * edición inline en textos, required en campos y acciones generales.
     */
    const groupAffordance = getGroupAffordanceAction(
      commands,
      activeSchema,
      canEditStructure,
    );

    const microPrimary = prioritizeCriticalActions(
      compactItems([
        toolbarAction(
          'delete',
          'Eliminar',
          <Trash2 size={14} />,
          commands?.deleteSelection,
          {
            danger: true,
            critical: true,
            disabled: !canEditStructure || !hasAction(commands?.deleteSelection),
          },
        ),
        toolbarAction(
          'duplicate',
          'Duplicar',
          <Copy size={14} />,
          commands?.duplicateSelection,
          {
            disabled: !canEditStructure || !hasAction(commands?.duplicateSelection),
          },
        ),
        groupAffordance ?? getSelectionInlineAction(commands, kind, canEditStructure),
        toolbarAction(
          'properties',
          'Propiedades',
          <Settings2 size={14} />,
          commands?.openProperties,
          {
            disabled: !canEditStructure || !hasAction(commands?.openProperties),
          },
        ),
      ]),
    );

    const compactPrimary = compactItems([
      groupAffordance,
      getSelectionInlineAction(commands, kind, canEditStructure),
      hasFieldSelection
        ? toolbarAction(
            'required',
            activeSchema?.required ? 'Quitar obligatorio' : 'Marcar obligatorio',
            <SquareCheckBig size={14} />,
            commands?.toggleRequired,
            {
              active: Boolean(activeSchema?.required),
              disabled: !canEditStructure || !hasAction(commands?.toggleRequired),
            },
          )
        : null,
      toolbarAction(
        'duplicate',
        'Duplicar',
        <Copy size={14} />,
        commands?.duplicateSelection,
        {
          disabled: !canEditStructure || !hasAction(commands?.duplicateSelection),
        },
      ),
      toolbarAction(
        'delete',
        'Eliminar',
        <Trash2 size={14} />,
        commands?.deleteSelection,
        {
          danger: true,
          critical: true,
          disabled: !canEditStructure || !hasAction(commands?.deleteSelection),
        },
      ),
      toolbarAction(
        'properties',
        'Propiedades',
        <Settings2 size={14} />,
        commands?.openProperties,
        {
          disabled: !canEditStructure || !hasAction(commands?.openProperties),
        },
      ),
      toolbarAction(
        'readonly',
        allReadOnly ? 'Desbloquear posición' : 'Bloquear posición',
        <Lock size={14} />,
        commands?.toggleReadOnly,
        {
          active: allReadOnly,
          disabled:
            !canEditStructure ||
            !hasAction(commands?.toggleReadOnly) ||
            Boolean(accessState?.isLockedByOther),
          disabledReason: accessState?.isLockedByOther
            ? `Bloqueado por ${accessState.lockedByLabel || 'otro usuario'}`
            : undefined,
        },
      ),
      getSelectionVisibilityAction(commands, allHidden, canEditStructure),
    ]);

    quickActions.push(
      ...(mode === 'micro'
        ? buildCriticalPrimaryActions(microPrimary, 2)
        : prioritizeCriticalActions(compactPrimary).slice(0, 5)),
    );

    if (mode === 'expanded') {
      secondarySections.push(
        ...compactItems([
          {
            id: 'state',
            label: 'Estado',
            items: compactItems([
              getSelectionVisibilityAction(commands, allHidden, canEditStructure),
              toolbarAction(
                'readonly',
                allReadOnly ? 'Desbloquear posición' : 'Bloquear posición',
                <Lock size={14} />,
                commands?.toggleReadOnly,
                {
                  active: allReadOnly,
                  disabled: !canEditStructure || !hasAction(commands?.toggleReadOnly),
                },
              ),
              hasFieldSelection
                ? toolbarAction(
                    'required',
                    allRequired ? 'Quitar obligatorio' : 'Marcar obligatorio',
                    <SquareCheckBig size={14} />,
                    commands?.toggleRequired,
                    {
                      active: allRequired,
                      disabled:
                        !canEditStructure || !hasAction(commands?.toggleRequired),
                    },
                  )
                : null,
            ]),
          },
          {
            id: 'style',
            label: 'Estilo',
            items: getSelectionStyleActions(commands, allReadOnly, canEditStructure),
          },
          hasFieldSelection
            ? {
                id: 'data',
                label: 'Datos',
                items: getSelectionDataActions(
                  commands,
                  activeSchemas,
                  canEditStructure,
                ),
              }
            : null,
          {
            id: 'ordering',
            label: 'Orden',
            items: getSelectionOrderingActions(commands, canEditStructure),
          },
        ]),
      );

      if (kind === 'text') {
        secondarySections.unshift({
          id: 'editing',
          label: 'Edición',
          items: compactItems([
            getSelectionInlineAction(commands, kind, canEditStructure),
          ]),
        });
      }

      if (kind === 'image' || kind === 'signature' || kind === 'table') {
        secondarySections.unshift({
          id: 'asset',
          label: 'Activos',
          items: compactItems([
            toolbarAction(
              'copy-style',
              'Copiar estilo',
              <Paintbrush size={14} />,
              commands?.copyStyle,
              {
                disabled: !hasAction(commands?.copyStyle),
                disabledReason: 'No hay un portapapeles de estilo conectado',
              },
            ),
            toolbarAction(
              'paste-style',
              'Pegar estilo',
              <ClipboardPaste size={14} />,
              commands?.pasteStyle,
              {
                disabled: !canEditStructure || !hasAction(commands?.pasteStyle),
                disabledReason: 'No hay un portapapeles de estilo conectado',
              },
            ),
          ]),
        });
      }
    }
  }

  const cappedPrimaryActions = buildCriticalPrimaryActions(
    quickActions,
    mode === 'micro' ? 2 : mode === 'compact' ? 5 : 6,
  );

  return {
    kind,
    mode,
    primaryActions: cappedPrimaryActions,
    secondarySections: secondarySections.filter(
      (section): section is SelectionToolbarSection =>
        Boolean(section && Array.isArray(section.items) && section.items.length > 0),
    ),
    summaryChips,
    stateChips,
  };
};

/**
 * Factory de item para menú contextual.
 *
 * Si no existe comando y no se fuerza visibilidad, devuelve null.
 * Esto permite construir listas declarativas y compactarlas después.
 */
const commandItem = (
  id: string,
  label: string,
  icon: React.ReactNode,
  command?: () => void,
  extra?: Partial<CanvasContextMenuItem> & { forceVisible?: boolean },
): CanvasContextMenuItem | null => {
  if (!command && !extra?.forceVisible) return null;

  return {
    id,
    label,
    icon,
    disabled: Boolean(extra?.disabled) || !command,
    onSelect: command,
    ...extra,
  };
};

/**
 * Construye los grupos del menú contextual del canvas.
 *
 * Este builder es consumido por `CanvasContextMenu` y separa reglas de:
 *
 * - canvas vacío;
 * - selección única;
 * - selección múltiple;
 * - permisos de edición;
 * - locks colaborativos;
 * - acciones externas;
 * - acciones de comandos internos.
 *
 * @param args Contexto del menú contextual.
 * @returns Grupos de acciones listos para renderizar.
 */
export const buildCanvasContextMenuGroups = (
  args: BuildContextMenuGroupsArgs,
): CanvasContextMenuGroup[] => {
  const {
    mode,
    commands,
    externalActions,
    hasClipboardData = false,
    selectionCount = 0,
    selectionSchemas,
    collaborationContext,
    activeReadOnly = false,
    activeRequired = false,
    activeHidden = false,
    canEditStructure = true,
    visibility,
  } = args;

  const hasFieldSelection = hasFormFieldSelection(selectionSchemas);
  const accessState = resolveSelectionAccessState(selectionSchemas, collaborationContext);
  const contextMenuLockLabel = accessState?.contextMenuLockLabel || 'Bloquear posición';

  /**
   * Grupos de protección y colaboración.
   *
   * El menú de selección única y el de selección múltiple los declaraban
   * literalmente iguales: mismas etiquetas, mismas condiciones de deshabilitado
   * y mismos motivos. Sólo cambian el prefijo del grupo (`single`/`multi`) y el
   * sufijo del comando.
   *
   * Mantenerlos separados significaba que corregir un motivo de bloqueo había
   * que hacerlo dos veces, y que divergieran era cuestión de tiempo.
   */
  const lockedByOtherReason = accessState?.isLockedByOther
    ? `Bloqueado por ${accessState.lockedByLabel || 'otro usuario'}`
    : null;
  const roleReason = canEditStructure ? undefined : 'El rol actual solo permite revisar y comentar';

  const protectionGroup = (scope: 'single' | 'multi'): CanvasContextMenuGroup => ({
    id: `${scope}-protection`,
    label: 'Protección',
    items: compactItems([
      commandItem(
        scope === 'multi' ? 'lock-multi' : 'lock',
        resolveToggleLabel(activeReadOnly, 'Desbloquear posición', 'Bloquear posición'),
        <Lock size={14} />,
        commands?.toggleReadOnly,
        {
          active: activeReadOnly,
          disabled: !canEditStructure || Boolean(accessState?.isLockedByOther),
          disabledReason: lockedByOtherReason ?? roleReason,
        },
      ),
    ]),
  });

  const collaborationGroup = (scope: 'single' | 'multi'): CanvasContextMenuGroup => ({
    id: `${scope}-collaboration`,
    label: 'Colaboración',
    items: compactItems([
      commandItem(
        scope === 'multi' ? 'collaboration-lock-multi' : 'collaboration-lock',
        contextMenuLockLabel,
        <Lock size={14} />,
        accessState?.isLockedByMe ? commands?.clearSelection : undefined,
        {
          active: Boolean(accessState?.isLockedByMe),
          disabled:
            !canEditStructure ||
            Boolean(accessState?.isLockedByOther) ||
            !hasAction(commands?.clearSelection),
          disabledReason:
            lockedByOtherReason ??
            (accessState?.isLockedByMe
              ? 'Libera la edición actual para cambiar de campo'
              : 'La edición se bloquea al seleccionar el campo'),
          forceVisible: true,
        },
      ),
    ]),
  });

  /**
   * Menú sobre canvas vacío:
   * inserción, pegado, páginas, comentarios y acciones de documento.
   */
  if (mode === 'empty') {
    const groups = compactItems<CanvasContextMenuGroup>([
      {
        id: 'canvas-create',
        label: 'Inserción',
        items: compactItems([
          commandItem(
            'insert-field',
            'Insertar campo',
            <Plus size={14} />,
            externalActions?.onInsertField,
            {
              disabled: !canEditStructure,
              disabledReason: canEditStructure
                ? undefined
                : 'El rol actual solo permite revisar y comentar',
            },
          ),
          commandItem(
            'paste',
            'Pegar',
            <ClipboardPaste size={14} />,
            externalActions?.onPaste,
            {
              disabled: !canEditStructure || !hasClipboardData,
              disabledReason: !canEditStructure
                ? 'El rol actual solo permite revisar y comentar'
                : hasClipboardData
                  ? undefined
                  : 'El portapapeles no tiene contenido compatible',
            },
          ),
          commandItem(
            'add-page',
            'Añadir página',
            <FilePlus2 size={14} />,
            externalActions?.onAddPage,
            {
              disabled: !canEditStructure,
              disabledReason: canEditStructure
                ? undefined
                : 'El rol actual solo permite revisar y comentar',
            },
          ),
          commandItem(
            'add-comment',
            'Agregar comentario',
            <MessageSquare size={14} />,
            externalActions?.onCreateComment,
          ),
        ]),
      },
      {
        id: 'canvas-assets',
        label: 'Documento',
        items: compactItems([
          commandItem(
            'open-catalog',
            'Abrir catálogo',
            <PanelLeftOpen size={14} />,
            externalActions?.onOpenCatalog,
          ),
          commandItem(
            'upload-pdf',
            'Reemplazar PDF',
            <Upload size={14} />,
            externalActions?.onUploadOrReplacePdf,
            {
              disabled: !canEditStructure,
              disabledReason: canEditStructure
                ? undefined
                : 'El rol actual solo permite revisar y comentar',
            },
          ),
        ]),
      },
    ]);

    return filterVisibleGroups(groups, visibility?.actions);
  }

  /**
   * Menú para selección única:
   * edición, visibilidad, protección, colaboración, orden e inspector.
   */
  if (mode === 'single') {
    const groups = [
      {
        id: 'single-main',
        label: 'Edición',
        items: compactItems([
          commandItem(
            'duplicate',
            'Duplicar',
            <Copy size={14} />,
            commands?.duplicateSelection,
            {
              disabled: !canEditStructure,
              disabledReason: canEditStructure
                ? undefined
                : 'El rol actual solo permite revisar y comentar',
            },
          ),
          commandItem(
            'add-comment',
            'Agregar comentario',
            <MessageSquare size={14} />,
            externalActions?.onCreateComment,
          ),
          commandItem(
            'delete',
            'Eliminar',
            <Trash2 size={14} />,
            commands?.deleteSelection,
            {
              danger: true,
              disabled: !canEditStructure,
              disabledReason: canEditStructure
                ? undefined
                : 'El rol actual solo permite revisar y comentar',
            },
          ),
        ]),
      },
      {
        id: 'single-visibility',
        label: 'Visibilidad',
        items: compactItems([
          commandItem(
            activeHidden ? 'show' : 'hide',
            activeHidden ? 'Mostrar' : 'Ocultar',
            activeHidden ? <EyeOff size={14} /> : <Eye size={14} />,
            commands?.toggleHidden,
            {
              disabled: !canEditStructure,
              disabledReason: canEditStructure
                ? undefined
                : 'El rol actual solo permite revisar y comentar',
            },
          ),
        ]),
      },
      protectionGroup('single'),
      collaborationGroup('single'),
      {
        id: 'single-order',
        label: 'Orden',
        items: compactItems([
          commandItem(
            'bring-forward',
            'Traer al frente',
            <ArrowUpToLine size={14} />,
            commands?.bringForward,
            {
              disabled: !canEditStructure,
              disabledReason: canEditStructure
                ? undefined
                : 'El rol actual solo permite revisar y comentar',
            },
          ),
          commandItem(
            'send-backward',
            'Enviar atrás',
            <ArrowDownToLine size={14} />,
            commands?.sendBackward,
            {
              disabled: !canEditStructure,
              disabledReason: canEditStructure
                ? undefined
                : 'El rol actual solo permite revisar y comentar',
            },
          ),
          hasFieldSelection
            ? commandItem(
                'required',
                resolveToggleLabel(activeRequired, 'Quitar requerido', 'Activar requerido'),
                <Asterisk size={14} />,
                commands?.toggleRequired,
                {
                  active: activeRequired,
                  disabled: !canEditStructure,
                  disabledReason: canEditStructure
                    ? undefined
                    : 'El rol actual solo permite revisar y comentar',
                },
              )
            : null,
        ]),
      },
      {
        id: 'single-inspector',
        label: 'Inspector',
        items: compactItems([
          commandItem(
            'open-properties',
            'Abrir propiedades',
            <SlidersHorizontal size={14} />,
            commands?.openProperties,
            {
              disabled: !canEditStructure,
              disabledReason: canEditStructure
                ? undefined
                : 'El rol actual solo permite revisar y comentar',
            },
          ),
        ]),
      },
    ];

    return filterVisibleGroups(groups, visibility?.actions);
  }

  /**
   * Menú para selección múltiple:
   * alineación, distribución, selección, visibilidad, protección,
   * colaboración, orden e inspector grupal.
   */
  const canDistribute = selectionCount >= 3;

  const groups = [
    {
      id: 'multi-align',
      label: 'Alinear',
      items: compactItems([
        commandItem(
          'align-left',
          'Alinear izquierda',
          <AlignStartVertical size={14} />,
          commands ? () => commands.alignSelection('left') : undefined,
          {
            disabled: !canEditStructure,
            disabledReason: canEditStructure
              ? undefined
              : 'El rol actual solo permite revisar y comentar',
          },
        ),
        commandItem(
          'align-center',
          'Alinear centro',
          <AlignCenterVertical size={14} />,
          commands ? () => commands.alignSelection('center') : undefined,
          {
            disabled: !canEditStructure,
            disabledReason: canEditStructure
              ? undefined
              : 'El rol actual solo permite revisar y comentar',
          },
        ),
        commandItem(
          'align-right',
          'Alinear derecha',
          <AlignEndVertical size={14} />,
          commands ? () => commands.alignSelection('right') : undefined,
          {
            disabled: !canEditStructure,
            disabledReason: canEditStructure
              ? undefined
              : 'El rol actual solo permite revisar y comentar',
          },
        ),
        commandItem(
          'align-top',
          'Alinear arriba',
          <AlignStartHorizontal size={14} />,
          commands ? () => commands.alignSelection('top') : undefined,
          {
            disabled: !canEditStructure,
            disabledReason: canEditStructure
              ? undefined
              : 'El rol actual solo permite revisar y comentar',
          },
        ),
        commandItem(
          'align-middle',
          'Alinear medio',
          <AlignCenterHorizontal size={14} />,
          commands ? () => commands.alignSelection('middle') : undefined,
          {
            disabled: !canEditStructure,
            disabledReason: canEditStructure
              ? undefined
              : 'El rol actual solo permite revisar y comentar',
          },
        ),
        commandItem(
          'align-bottom',
          'Alinear abajo',
          <AlignEndHorizontal size={14} />,
          commands ? () => commands.alignSelection('bottom') : undefined,
          {
            disabled: !canEditStructure,
            disabledReason: canEditStructure
              ? undefined
              : 'El rol actual solo permite revisar y comentar',
          },
        ),
      ]),
    },
    {
      id: 'multi-distribute',
      label: 'Distribuir',
      items: compactItems([
        commandItem(
          'distribute-horizontal',
          'Distribuir horizontal',
          <AlignHorizontalSpaceAround size={14} />,
          commands ? () => commands.distributeSelection('horizontal') : undefined,
          {
            disabled: !canEditStructure || !canDistribute,
            disabledReason: !canEditStructure
              ? 'El rol actual solo permite revisar y comentar'
              : canDistribute
                ? undefined
                : 'Selecciona al menos 3 elementos',
          },
        ),
        commandItem(
          'distribute-vertical',
          'Distribuir vertical',
          <AlignVerticalSpaceAround size={14} />,
          commands ? () => commands.distributeSelection('vertical') : undefined,
          {
            disabled: !canEditStructure || !canDistribute,
            disabledReason: !canEditStructure
              ? 'El rol actual solo permite revisar y comentar'
              : canDistribute
                ? undefined
                : 'Selecciona al menos 3 elementos',
          },
        ),
      ]),
    },
    {
      id: 'multi-main',
      label: 'Selección',
      items: compactItems([
        hasFieldSelection
          ? commandItem(
              'required-multi',
              resolveToggleLabel(activeRequired, 'Quitar requerido', 'Activar requerido'),
              <Asterisk size={14} />,
              commands?.toggleRequired,
              {
                active: activeRequired,
                disabled: !canEditStructure,
                disabledReason: canEditStructure
                  ? undefined
                  : 'El rol actual solo permite revisar y comentar',
              },
            )
          : null,
        commandItem(
          'delete-multi',
          'Eliminar selección',
          <Trash2 size={14} />,
          commands?.deleteSelection,
          {
            danger: true,
            disabled: !canEditStructure,
            disabledReason: canEditStructure
              ? undefined
              : 'El rol actual solo permite revisar y comentar',
          },
        ),
      ]),
    },
    {
      id: 'multi-visibility',
      label: 'Visibilidad',
      items: compactItems([
        commandItem(
          activeHidden ? 'show-multi' : 'hide-multi',
          activeHidden ? 'Mostrar' : 'Ocultar',
          activeHidden ? <EyeOff size={14} /> : <Eye size={14} />,
          commands?.toggleHidden,
          {
            disabled: !canEditStructure,
            disabledReason: canEditStructure
              ? undefined
              : 'El rol actual solo permite revisar y comentar',
          },
        ),
      ]),
    },
    protectionGroup('multi'),
    collaborationGroup('multi'),
    {
      id: 'multi-order',
      label: 'Orden',
      items: compactItems([
        commandItem(
          'bring-forward',
          'Traer al frente',
          <ArrowUpToLine size={14} />,
          commands?.bringForward,
          {
            disabled: !canEditStructure,
            disabledReason: canEditStructure
              ? undefined
              : 'El rol actual solo permite revisar y comentar',
          },
        ),
        commandItem(
          'send-backward',
          'Enviar atrás',
          <ArrowDownToLine size={14} />,
          commands?.sendBackward,
          {
            disabled: !canEditStructure,
            disabledReason: canEditStructure
              ? undefined
              : 'El rol actual solo permite revisar y comentar',
          },
        ),
      ]),
    },
    {
      id: 'multi-inspector',
      label: 'Inspector',
      items: compactItems([
        commandItem(
          'open-group-properties',
          selectionCount > 1 ? 'Propiedades del grupo' : 'Abrir propiedades',
          <SlidersHorizontal size={14} />,
          externalActions?.onOpenGroupProperties || commands?.openProperties,
          {
            disabled: !canEditStructure,
            disabledReason: canEditStructure
              ? undefined
              : 'El rol actual solo permite revisar y comentar',
          },
        ),
      ]),
    },
  ];

  return filterVisibleGroups(groups, visibility?.actions);
};
