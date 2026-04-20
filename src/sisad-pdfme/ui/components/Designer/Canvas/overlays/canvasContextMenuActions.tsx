import React from 'react';
import {
  Plus,
  ClipboardPaste,
  FilePlus2,
  PanelLeftOpen,
  Upload,
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
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';

export type CanvasContextMenuMode = 'empty' | 'single' | 'multi';

export type SelectionToolbarSelectionKind =
  | 'text'
  | 'field'
  | 'image'
  | 'signature'
  | 'choice'
  | 'table'
  | 'group'
  | 'mixed';

export type SelectionToolbarMode = 'micro' | 'compact' | 'expanded';

export type CanvasContextMenuExternalActions = {
  onInsertField?: () => void;
  onPaste?: () => void;
  onAddPage?: () => void;
  onOpenCatalog?: () => void;
  onUploadOrReplacePdf?: () => void;
  onOpenGroupProperties?: () => void;
};

export type CanvasContextMenuItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  disabledReason?: string;
  danger?: boolean;
  hidden?: boolean;
  onSelect?: () => void;
};

export type CanvasContextMenuGroup = {
  id: string;
  label?: string;
  items: CanvasContextMenuItem[];
};

export type CanvasSelectionQuickAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  loading?: boolean;
  danger?: boolean;
  onSelect?: () => void;
};

export type SelectionToolbarSection = {
  id: string;
  label: string;
  items: CanvasSelectionQuickAction[];
};

export type SelectionToolbarModel = {
  kind: SelectionToolbarSelectionKind;
  mode: SelectionToolbarMode;
  primaryActions: CanvasSelectionQuickAction[];
  secondarySections: SelectionToolbarSection[];
  summaryChips: string[];
  stateChips: string[];
};

type BuildContextMenuGroupsArgs = {
  mode: CanvasContextMenuMode;
  commands?: SelectionCommandSet;
  externalActions?: CanvasContextMenuExternalActions;
  hasClipboardData?: boolean;
  selectionCount?: number;
  activeReadOnly?: boolean;
  activeRequired?: boolean;
  activeHidden?: boolean;
};

const compactItems = <T,>(items: Array<T | null | undefined>) => items.filter(Boolean) as T[];

const resolveToggleLabel = (active: boolean | undefined, activeLabel: string, inactiveLabel: string) =>
  (active ? activeLabel : inactiveLabel).trim();

function formatSchemaType(value?: string | null) {
  if (!value) return null;
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

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

const normalizeTypeKey = (value: unknown) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const TEXT_TYPES = new Set(['text', 'multivariabletext']);
const IMAGE_TYPES = new Set(['image', 'svg']);
const SIGNATURE_TYPES = new Set(['signature']);
const CHOICE_TYPES = new Set(['checkbox', 'radiogroup', 'select']);
const TABLE_TYPES = new Set(['table']);

const isFormFieldType = (type: string) =>
  TEXT_TYPES.has(type) ||
  SIGNATURE_TYPES.has(type) ||
  CHOICE_TYPES.has(type) ||
  ['date', 'datetime', 'time'].includes(type);

export const resolveSelectionToolbarKind = (activeSchemas: SchemaForUI[]): SelectionToolbarSelectionKind => {
  if (activeSchemas.length > 1) {
    const uniqueTypes = [...new Set(activeSchemas.map((schema) => normalizeTypeKey(schema.type)))].filter(Boolean);
    return uniqueTypes.length > 1 ? 'mixed' : 'group';
  }

  const type = normalizeTypeKey(activeSchemas[0]?.type);
  if (!type) return 'mixed';
  if (TEXT_TYPES.has(type)) return 'text';
  if (IMAGE_TYPES.has(type)) return 'image';
  if (SIGNATURE_TYPES.has(type)) return 'signature';
  if (CHOICE_TYPES.has(type)) return 'choice';
  if (TABLE_TYPES.has(type)) return 'table';
  return ['date', 'datetime', 'time'].includes(type) ? 'field' : 'mixed';
};

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
  onSelect: command,
});

const buildSelectionSummaryChips = (activeSchemas: SchemaForUI[], selectionCount: number) => {
  const primarySchema = activeSchemas[0];
  const summaryChips: string[] = [];

  if (selectionCount > 1) {
    summaryChips.push(`${selectionCount} elementos`);
    summaryChips.push('Selección múltiple');
  } else {
    const name = typeof primarySchema?.name === 'string' ? primarySchema.name.trim() : '';
    const type = formatSchemaType(primarySchema?.type);
    if (name) summaryChips.push(name);
    if (type) summaryChips.push(type);
    if (!summaryChips.length) summaryChips.push('Campo activo');
  }

  return summaryChips;
};

const hasAction = (command?: () => void) => typeof command === 'function';

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
  const someHidden = activeSchemas.some((schema) => (schema as SchemaForUI & { hidden?: boolean }).hidden === true);
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

const getSelectionStyleActions = (commands?: SelectionCommandSet, activeReadOnly = false) => [
  toolbarAction('copy-style', 'Copiar estilo', <Paintbrush size={14} />, commands?.copyStyle, {
    disabled: !hasAction(commands?.copyStyle),
    disabledReason: 'Todavía no está conectado el portapapeles de estilos',
  }),
  toolbarAction('paste-style', 'Pegar estilo', <ClipboardPaste size={14} />, commands?.pasteStyle, {
    disabled: !hasAction(commands?.pasteStyle),
    disabledReason: 'Todavía no está conectado el portapapeles de estilos',
  }),
  toolbarAction(
    'readonly',
    activeReadOnly ? 'Desbloquear' : 'Bloquear',
    <Lock size={14} />,
    commands?.toggleReadOnly,
    { active: activeReadOnly },
  ),
];

const getSelectionVisibilityAction = (commands?: SelectionCommandSet, activeHidden = false) =>
  toolbarAction(
    'hidden',
    activeHidden ? 'Mostrar' : 'Ocultar',
    activeHidden ? <EyeOff size={14} /> : <Eye size={14} />,
    commands?.toggleHidden,
    {
      active: activeHidden,
      disabled: !hasAction(commands?.toggleHidden),
      disabledReason: 'El runtime aún no sincroniza ocultar/mostrar en el lienzo',
    },
  );

const getSelectionInlineAction = (commands?: SelectionCommandSet, kind?: SelectionToolbarSelectionKind) => {
  if (kind === 'text') {
    return toolbarAction('edit-inline', 'Editar texto', <Type size={14} />, commands?.editTextInline, {
      disabled: !hasAction(commands?.editTextInline),
      disabledReason: 'La edición inline todavía depende del runtime del canvas',
    });
  }

  return null;
};

const getSelectionOrderingActions = (commands?: SelectionCommandSet) => [
  toolbarAction('bring-forward', 'Traer al frente', <ArrowUpToLine size={14} />, commands?.bringForward, {
    disabled: !hasAction(commands?.bringForward),
  }),
  toolbarAction('send-backward', 'Enviar atrás', <ArrowDownToLine size={14} />, commands?.sendBackward, {
    disabled: !hasAction(commands?.sendBackward),
  }),
];

const getSelectionAlignmentActions = (commands?: SelectionCommandSet) => [
  toolbarAction('align-left', 'Izquierda', <AlignStartVertical size={14} />, commands ? () => commands.alignSelection('left') : undefined),
  toolbarAction('align-center', 'Centro', <AlignCenterVertical size={14} />, commands ? () => commands.alignSelection('center') : undefined),
  toolbarAction('align-right', 'Derecha', <AlignEndVertical size={14} />, commands ? () => commands.alignSelection('right') : undefined),
  toolbarAction('align-top', 'Arriba', <AlignStartHorizontal size={14} />, commands ? () => commands.alignSelection('top') : undefined),
  toolbarAction('align-middle', 'Medio', <AlignCenterHorizontal size={14} />, commands ? () => commands.alignSelection('middle') : undefined),
  toolbarAction('align-bottom', 'Abajo', <AlignEndHorizontal size={14} />, commands ? () => commands.alignSelection('bottom') : undefined),
];

const getSelectionDistributionActions = (commands?: SelectionCommandSet, selectionCount = 0) => {
  const canDistribute = selectionCount >= 3;
  return [
    toolbarAction('distribute-horizontal', 'Horizontal', <AlignHorizontalSpaceAround size={14} />, commands ? () => commands.distributeSelection('horizontal') : undefined, {
      disabled: !canDistribute,
      disabledReason: canDistribute ? undefined : 'Selecciona al menos 3 elementos',
    }),
    toolbarAction('distribute-vertical', 'Vertical', <AlignVerticalSpaceAround size={14} />, commands ? () => commands.distributeSelection('vertical') : undefined, {
      disabled: !canDistribute,
      disabledReason: canDistribute ? undefined : 'Selecciona al menos 3 elementos',
    }),
  ];
};

const getSelectionGroupingActions = (
  commands?: SelectionCommandSet,
  selectionKind?: SelectionToolbarSelectionKind,
  selectionCount = 0,
) => {
  const canGroup = selectionCount > 1;
  const groupSupported = Boolean(commands?.groupSelection);
  const ungroupSupported = Boolean(commands?.ungroupSelection);

  return [
    toolbarAction('group', 'Agrupar', <Group size={14} />, commands?.groupSelection, {
      disabled: !canGroup || !groupSupported,
      disabledReason: !canGroup ? 'Selecciona al menos 2 elementos' : 'Agrupar todavía no está implementado',
    }),
    toolbarAction('ungroup', 'Desagrupar', <Ungroup size={14} />, commands?.ungroupSelection, {
      disabled: selectionKind !== 'group' || !ungroupSupported,
      disabledReason: selectionKind !== 'group' ? 'Solo aplica sobre un grupo' : 'Desagrupar todavía no está implementado',
    }),
  ];
};

const getSelectionDataActions = (commands?: SelectionCommandSet, activeSchemas: SchemaForUI[] = []) => {
  const activeSchema = activeSchemas[0];
  const isFormField = Boolean(activeSchema && isFormFieldType(normalizeTypeKey(activeSchema.type)));
  return [
    toolbarAction('required', resolveToggleLabel(activeSchema?.required, 'Quitar obligatorio', 'Marcar obligatorio'), <SquareCheckBig size={14} />, commands?.toggleRequired, {
      active: Boolean(activeSchema?.required),
      disabled: !isFormField,
      disabledReason: isFormField ? undefined : 'Solo aplica a campos de formulario',
    }),
    toolbarAction('rename-label', 'Renombrar etiqueta', <Type size={14} />, commands?.renameLabel, {
      disabled: !isFormField || !hasAction(commands?.renameLabel),
      disabledReason: isFormField ? 'El renombrado debe conectarse al inspector' : 'Solo aplica a campos de formulario',
    }),
  ];
};

export const buildSelectionToolbarModel = (args: {
  commands?: SelectionCommandSet;
  activeSchemas: SchemaForUI[];
  selectionCount: number;
  interactionPhase: string;
  mode?: SelectionToolbarMode;
}): SelectionToolbarModel => {
  const {
    commands,
    activeSchemas,
    selectionCount,
    interactionPhase,
    mode = selectionCount > 1 ? 'expanded' : 'compact',
  } = args;

  const kind = resolveSelectionToolbarKind(activeSchemas);
  const allReadOnly = activeSchemas.length > 0 && activeSchemas.every((schema) => schema.readOnly);
  const allRequired = activeSchemas.length > 0 && activeSchemas.every((schema) => schema.required);
  const allHidden = activeSchemas.length > 0
    && activeSchemas.every((schema) => (schema as SchemaForUI & { hidden?: boolean }).hidden === true);

  const summaryChips = buildSelectionSummaryChips(activeSchemas, selectionCount);
  const stateChips = mode === 'micro'
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
  const activeType = normalizeTypeKey(activeSchema?.type);
  const isFormField = Boolean(activeSchema && isFormFieldType(activeType));

  if (selectionCount > 1) {
    quickActions.push(
      ...compactItems([
        toolbarAction('duplicate', 'Duplicar', <Copy size={14} />, commands?.duplicateSelection, {
          disabled: !hasAction(commands?.duplicateSelection),
        }),
        toolbarAction('delete', 'Eliminar', <Trash2 size={14} />, commands?.deleteSelection, {
          danger: true,
          disabled: !hasAction(commands?.deleteSelection),
        }),
        toolbarAction('readonly', allReadOnly ? 'Desbloquear' : 'Bloquear', <Lock size={14} />, commands?.toggleReadOnly, {
          active: allReadOnly,
          disabled: !hasAction(commands?.toggleReadOnly),
        }),
        getSelectionVisibilityAction(commands, allHidden),
        toolbarAction('properties', 'Propiedades', <Settings2 size={14} />, commands?.openProperties, {
          disabled: !hasAction(commands?.openProperties),
        }),
      ]),
    );

    if (mode === 'expanded') {
      secondarySections.push(
        {
          id: 'align',
          label: 'Alineación',
          items: getSelectionAlignmentActions(commands),
        },
        {
          id: 'distribute',
          label: 'Distribuir',
          items: getSelectionDistributionActions(commands, selectionCount),
        },
        {
          id: 'grouping',
          label: 'Grupo',
          items: getSelectionGroupingActions(commands, kind, selectionCount),
        },
        {
          id: 'ordering',
          label: 'Orden',
          items: getSelectionOrderingActions(commands),
        },
      );
    }
  } else {
    const microPrimary = compactItems([
      getSelectionInlineAction(commands, kind),
      toolbarAction('duplicate', 'Duplicar', <Copy size={14} />, commands?.duplicateSelection, {
        disabled: !hasAction(commands?.duplicateSelection),
      }),
      toolbarAction('properties', 'Propiedades', <Settings2 size={14} />, commands?.openProperties, {
        disabled: !hasAction(commands?.openProperties),
      }),
    ]);
    const compactPrimary = compactItems([
      getSelectionInlineAction(commands, kind),
      isFormField
        ? toolbarAction('required', activeSchema?.required ? 'Quitar obligatorio' : 'Marcar obligatorio', <SquareCheckBig size={14} />, commands?.toggleRequired, {
            active: Boolean(activeSchema?.required),
            disabled: !hasAction(commands?.toggleRequired),
          })
        : null,
      toolbarAction('duplicate', 'Duplicar', <Copy size={14} />, commands?.duplicateSelection, {
        disabled: !hasAction(commands?.duplicateSelection),
      }),
      toolbarAction('delete', 'Eliminar', <Trash2 size={14} />, commands?.deleteSelection, {
        danger: true,
        disabled: !hasAction(commands?.deleteSelection),
      }),
      toolbarAction('properties', 'Propiedades', <Settings2 size={14} />, commands?.openProperties, {
        disabled: !hasAction(commands?.openProperties),
      }),
      toolbarAction('readonly', allReadOnly ? 'Desbloquear' : 'Bloquear', <Lock size={14} />, commands?.toggleReadOnly, {
        active: allReadOnly,
        disabled: !hasAction(commands?.toggleReadOnly),
      }),
      getSelectionVisibilityAction(commands, allHidden),
    ]);

    quickActions.push(...(mode === 'micro' ? microPrimary : compactPrimary.slice(0, 5)));

    if (mode === 'expanded') {
      secondarySections.push(
        ...compactItems([
          {
            id: 'state',
            label: 'Estado',
            items: compactItems([
              getSelectionVisibilityAction(commands, allHidden),
              toolbarAction('readonly', allReadOnly ? 'Desbloquear' : 'Bloquear', <Lock size={14} />, commands?.toggleReadOnly, {
                active: allReadOnly,
                disabled: !hasAction(commands?.toggleReadOnly),
              }),
              isFormField
                ? toolbarAction('required', allRequired ? 'Quitar obligatorio' : 'Marcar obligatorio', <SquareCheckBig size={14} />, commands?.toggleRequired, {
                    active: allRequired,
                    disabled: !hasAction(commands?.toggleRequired),
                  })
                : null,
            ]),
          },
          {
            id: 'style',
            label: 'Estilo',
            items: getSelectionStyleActions(commands, allReadOnly),
          },
          isFormField
            ? {
                id: 'data',
                label: 'Datos',
                items: getSelectionDataActions(commands, activeSchemas),
              }
            : null,
          {
            id: 'ordering',
            label: 'Orden',
            items: getSelectionOrderingActions(commands),
          },
        ]),
      );

      if (kind === 'text') {
        secondarySections.unshift({
          id: 'editing',
          label: 'Edición',
          items: compactItems([getSelectionInlineAction(commands, kind)]),
        });
      }

      if (kind === 'image' || kind === 'signature' || kind === 'table') {
        secondarySections.unshift({
          id: 'asset',
          label: 'Activos',
          items: compactItems([
            toolbarAction('copy-style', 'Copiar estilo', <Paintbrush size={14} />, commands?.copyStyle, {
              disabled: !hasAction(commands?.copyStyle),
              disabledReason: 'No hay un portapapeles de estilo conectado',
            }),
            toolbarAction('paste-style', 'Pegar estilo', <ClipboardPaste size={14} />, commands?.pasteStyle, {
              disabled: !hasAction(commands?.pasteStyle),
              disabledReason: 'No hay un portapapeles de estilo conectado',
            }),
          ]),
        });
      }
    }
  }

  const cappedPrimaryActions = quickActions.slice(0, mode === 'micro' ? 3 : mode === 'compact' ? 5 : 6);

  return {
    kind,
    mode,
    primaryActions: cappedPrimaryActions,
    secondarySections: secondarySections.filter(
      (section): section is SelectionToolbarSection => Boolean(section && Array.isArray(section.items) && section.items.length > 0),
    ),
    summaryChips,
    stateChips,
  };
};

const commandItem = (
  id: string,
  label: string,
  icon: React.ReactNode,
  command?: () => void,
  extra?: Partial<CanvasContextMenuItem>,
): CanvasContextMenuItem | null => {
  if (!command) return null;
  return {
    id,
    label,
    icon,
    disabled: Boolean(extra?.disabled),
    onSelect: command,
    ...extra,
  };
};

export const buildSelectionQuickActions = (
  commands?: SelectionCommandSet,
  activeReadOnly = false,
): CanvasSelectionQuickAction[] => [
  {
    id: 'duplicate',
    label: 'Duplicar',
    icon: <Copy size={14} />,
    onSelect: commands?.duplicateSelection,
  },
  {
    id: 'delete',
    label: 'Eliminar',
    icon: <Trash2 size={14} />,
    danger: true,
    onSelect: commands?.deleteSelection,
  },
  {
    id: 'readonly',
    label: activeReadOnly ? 'Desbloquear' : 'Bloquear',
    icon: <Lock size={14} />,
    active: activeReadOnly,
    onSelect: commands?.toggleReadOnly,
  },
  {
    id: 'properties',
    label: 'Propiedades',
    icon: <Settings2 size={14} />,
    onSelect: commands?.openProperties,
  },
];

export const buildCanvasContextMenuGroups = (
  args: BuildContextMenuGroupsArgs,
): CanvasContextMenuGroup[] => {
  const {
    mode,
    commands,
    externalActions,
    hasClipboardData = false,
    selectionCount = 0,
    activeReadOnly = false,
    activeRequired = false,
    activeHidden = false,
  } = args;

  if (mode === 'empty') {
    return compactItems<CanvasContextMenuGroup>([
      {
        id: 'canvas-create',
        label: 'Inserción',
        items: compactItems([
          commandItem('insert-field', 'Insertar campo', <Plus size={14} />, externalActions?.onInsertField),
          commandItem(
            'paste',
            'Pegar',
            <ClipboardPaste size={14} />,
            externalActions?.onPaste,
            {
              disabled: !hasClipboardData,
              disabledReason: hasClipboardData ? undefined : 'El portapapeles no tiene contenido compatible',
            },
          ),
          commandItem('add-page', 'Añadir página', <FilePlus2 size={14} />, externalActions?.onAddPage),
        ]),
      },
      {
        id: 'canvas-assets',
        label: 'Documento',
        items: compactItems([
          commandItem('open-catalog', 'Abrir catálogo', <PanelLeftOpen size={14} />, externalActions?.onOpenCatalog),
          commandItem(
            'upload-pdf',
            'Reemplazar PDF',
            <Upload size={14} />,
            externalActions?.onUploadOrReplacePdf,
          ),
        ]),
      },
    ]).filter((group) => group.items.length > 0);
  }

  if (mode === 'single') {
    return [
      {
        id: 'single-main',
        label: 'Edición',
        items: compactItems([
          commandItem('duplicate', 'Duplicar', <Copy size={14} />, commands?.duplicateSelection),
          commandItem('delete', 'Eliminar', <Trash2 size={14} />, commands?.deleteSelection, { danger: true }),
        ]),
      },
      {
        id: 'single-order',
        label: 'Orden',
        items: compactItems([
          commandItem(
            activeHidden ? 'show' : 'hide',
            activeHidden ? 'Mostrar' : 'Ocultar',
            activeHidden ? <EyeOff size={14} /> : <Eye size={14} />,
            commands?.toggleHidden,
          ),
          commandItem(
            'lock',
            resolveToggleLabel(activeReadOnly, 'Desbloquear', 'Bloquear'),
            <Lock size={14} />,
            commands?.toggleReadOnly,
            { active: activeReadOnly },
          ),
          commandItem('bring-forward', 'Traer al frente', <ArrowUpToLine size={14} />, commands?.bringForward),
          commandItem('send-backward', 'Enviar atrás', <ArrowDownToLine size={14} />, commands?.sendBackward),
          commandItem(
            'required',
            resolveToggleLabel(activeRequired, 'Quitar requerido', 'Activar requerido'),
            <Asterisk size={14} />,
            commands?.toggleRequired,
            { active: activeRequired },
          ),
        ]),
      },
      {
        id: 'single-inspector',
        label: 'Inspector',
        items: compactItems([
          commandItem('open-properties', 'Abrir propiedades', <SlidersHorizontal size={14} />, commands?.openProperties),
        ]),
      },
    ].filter((group) => group.items.length > 0);
  }

  const canDistribute = selectionCount >= 3;

  return [
    {
      id: 'multi-align',
      label: 'Alinear',
      items: compactItems([
        commandItem(
          'align-left',
          'Alinear izquierda',
          <AlignStartVertical size={14} />,
          commands ? () => commands.alignSelection('left') : undefined,
        ),
        commandItem(
          'align-center',
          'Alinear centro',
          <AlignCenterVertical size={14} />,
          commands ? () => commands.alignSelection('center') : undefined,
        ),
        commandItem(
          'align-right',
          'Alinear derecha',
          <AlignEndVertical size={14} />,
          commands ? () => commands.alignSelection('right') : undefined,
        ),
        commandItem(
          'align-top',
          'Alinear arriba',
          <AlignStartHorizontal size={14} />,
          commands ? () => commands.alignSelection('top') : undefined,
        ),
        commandItem(
          'align-middle',
          'Alinear medio',
          <AlignCenterHorizontal size={14} />,
          commands ? () => commands.alignSelection('middle') : undefined,
        ),
        commandItem(
          'align-bottom',
          'Alinear abajo',
          <AlignEndHorizontal size={14} />,
          commands ? () => commands.alignSelection('bottom') : undefined,
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
            disabled: !canDistribute,
            disabledReason: canDistribute ? undefined : 'Selecciona al menos 3 elementos',
          },
        ),
        commandItem(
          'distribute-vertical',
          'Distribuir vertical',
          <AlignVerticalSpaceAround size={14} />,
          commands ? () => commands.distributeSelection('vertical') : undefined,
          {
            disabled: !canDistribute,
            disabledReason: canDistribute ? undefined : 'Selecciona al menos 3 elementos',
          },
        ),
      ]),
    },
      {
        id: 'multi-main',
        label: 'Selección',
        items: compactItems([
          commandItem(
            activeHidden ? 'show-multi' : 'hide-multi',
            activeHidden ? 'Mostrar' : 'Ocultar',
            activeHidden ? <EyeOff size={14} /> : <Eye size={14} />,
            commands?.toggleHidden,
          ),
          commandItem(
            'lock-multi',
            resolveToggleLabel(activeReadOnly, 'Desbloquear', 'Bloquear'),
            <Lock size={14} />,
            commands?.toggleReadOnly,
          { active: activeReadOnly },
        ),
        commandItem('delete-multi', 'Eliminar selección', <Trash2 size={14} />, commands?.deleteSelection, {
          danger: true,
        }),
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
        ),
      ]),
    },
  ].filter((group) => group.items.length > 0);
};
