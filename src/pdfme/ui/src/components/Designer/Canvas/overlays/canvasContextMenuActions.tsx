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
} from 'lucide-react';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';

export type CanvasContextMenuMode = 'empty' | 'single' | 'multi';

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
  danger?: boolean;
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
  danger?: boolean;
  onSelect?: () => void;
};

type BuildContextMenuGroupsArgs = {
  mode: CanvasContextMenuMode;
  commands?: SelectionCommandSet;
  externalActions?: CanvasContextMenuExternalActions;
  hasClipboardData?: boolean;
};

const commandItem = (
  id: string,
  label: string,
  icon: React.ReactNode,
  command?: () => void,
  extra?: Partial<CanvasContextMenuItem>,
): CanvasContextMenuItem => ({
  id,
  label,
  icon,
  disabled: !command || extra?.disabled,
  onSelect: command,
  ...extra,
});

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
  const { mode, commands, externalActions, hasClipboardData = false } = args;

  if (mode === 'empty') {
    return [
      {
        id: 'canvas-create',
        label: 'Inserción',
        items: [
          commandItem('insert-field', 'Insertar campo', <Plus size={14} />, externalActions?.onInsertField),
          commandItem(
            'paste',
            'Pegar',
            <ClipboardPaste size={14} />,
            externalActions?.onPaste,
            { disabled: !hasClipboardData || !externalActions?.onPaste },
          ),
          commandItem('add-page', 'Añadir página', <FilePlus2 size={14} />, externalActions?.onAddPage),
        ],
      },
      {
        id: 'canvas-assets',
        label: 'Documento',
        items: [
          commandItem('open-catalog', 'Abrir catálogo', <PanelLeftOpen size={14} />, externalActions?.onOpenCatalog),
          commandItem(
            'upload-pdf',
            'Reemplazar PDF',
            <Upload size={14} />,
            externalActions?.onUploadOrReplacePdf,
          ),
        ],
      },
    ];
  }

  if (mode === 'single') {
    return [
      {
        id: 'single-main',
        label: 'Edición',
        items: [
          commandItem('duplicate', 'Duplicar', <Copy size={14} />, commands?.duplicateSelection),
          commandItem('delete', 'Eliminar', <Trash2 size={14} />, commands?.deleteSelection, { danger: true }),
        ],
      },
      {
        id: 'single-order',
        label: 'Orden',
        items: [
          commandItem('lock', 'Bloquear / desbloquear', <Lock size={14} />, commands?.toggleReadOnly),
          commandItem('bring-forward', 'Traer al frente', <ArrowUpToLine size={14} />, commands?.bringForward),
          commandItem('send-backward', 'Enviar atrás', <ArrowDownToLine size={14} />, commands?.sendBackward),
          commandItem('required', 'Activar requerido', <Asterisk size={14} />, commands?.toggleRequired),
        ],
      },
      {
        id: 'single-inspector',
        label: 'Inspector',
        items: [
          commandItem('open-properties', 'Abrir propiedades', <SlidersHorizontal size={14} />, commands?.openProperties),
        ],
      },
    ];
  }

  return [
    {
      id: 'multi-align',
      label: 'Alinear',
      items: [
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
      ],
    },
    {
      id: 'multi-distribute',
      label: 'Distribuir',
      items: [
        commandItem(
          'distribute-horizontal',
          'Distribuir horizontal',
          <AlignHorizontalSpaceAround size={14} />,
          commands ? () => commands.distributeSelection('horizontal') : undefined,
        ),
        commandItem(
          'distribute-vertical',
          'Distribuir vertical',
          <AlignVerticalSpaceAround size={14} />,
          commands ? () => commands.distributeSelection('vertical') : undefined,
        ),
      ],
    },
    {
      id: 'multi-main',
      label: 'Selección',
      items: [
        commandItem('lock-multi', 'Bloquear / desbloquear', <Lock size={14} />, commands?.toggleReadOnly),
        commandItem('delete-multi', 'Eliminar selección', <Trash2 size={14} />, commands?.deleteSelection, {
          danger: true,
        }),
      ],
    },
    {
      id: 'multi-inspector',
      label: 'Inspector',
      items: [
        commandItem(
          'open-group-properties',
          'Abrir propiedades',
          <SlidersHorizontal size={14} />,
          externalActions?.onOpenGroupProperties || commands?.openProperties,
        ),
      ],
    },
  ];
};
