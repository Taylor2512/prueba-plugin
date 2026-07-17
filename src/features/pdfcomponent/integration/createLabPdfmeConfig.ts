import { createSisadPdfmeConfig } from '@/sisad-pdfme/config'
import type { SisadPdfmeGlobalConfig, SisadPdfmeUiConfig } from '@/sisad-pdfme/config'
import type { SisadPdfmeSignatureProvider } from '@/sisad-pdfme/config'
import type { LabHostExample, NormalizedLabHostData } from './normalizeLabHostData'

export type CreateLabPdfmeConfigArgs = {
  example: LabHostExample
  normalized: NormalizedLabHostData
  activeRecipientId?: string | null
  isGlobalView?: boolean
}

export const createLabPdfmeConfig = ({
  example,
  normalized,
  activeRecipientId,
  isGlobalView,
}: CreateLabPdfmeConfigArgs) => {
  const runtimeOptions = example?.runtimeOptions || {}
  const documentsMode = normalized.documents.length > 1 ? 'multi' : 'single'
  const runtimeUi = (runtimeOptions.ui as SisadPdfmeUiConfig | undefined) || {}
  const isOverlayShellExample = example?.id === 'multi-document-routing'
  const resolvedActiveRecipientId =
    activeRecipientId !== undefined ? activeRecipientId : normalized.activeRecipientId || null
  const resolvedIsGlobalView =
    isGlobalView !== undefined ? isGlobalView : Boolean(example?.collaboration?.isGlobalView)
  const ui: SisadPdfmeUiConfig = {
    visualPreset: runtimeUi.visualPreset || 'classic-designer',
    layoutPreset: isOverlayShellExample ? 'canvas-first' : runtimeUi.layoutPreset || 'three-panel',
    density: runtimeUi.density || 'comfortable',
    gap: runtimeUi.gap,
    padding: runtimeUi.padding,
    baseWidth: runtimeUi.baseWidth,
    baseHeight: runtimeUi.baseHeight,
    sidebars: {
      left: {
        defaultOpen: runtimeUi.sidebars?.left?.defaultOpen ?? true,
        catalogLayout: runtimeUi.sidebars?.left?.catalogLayout || 'list',
      },
      right: {
        defaultOpen: runtimeUi.sidebars?.right?.defaultOpen ?? true,
        defaultPanel:
          runtimeUi.sidebars?.right?.defaultPanel ||
          (documentsMode === 'multi' ? 'documents' : 'fields'),
      },
    },
    visibility: (runtimeUi.visibility as SisadPdfmeGlobalConfig['visibility']) || runtimeOptions.visibility || undefined,
    classNames: {
      ...runtimeUi.classNames,
      leftSidebar: {
        ...runtimeUi.classNames?.leftSidebar,
        container: isOverlayShellExample
          ? [runtimeUi.classNames?.leftSidebar?.container, '!absolute !left-0 !top-0 !bottom-0 !z-30'].filter(Boolean).join(' ')
          : runtimeUi.classNames?.leftSidebar?.container,
      },
      rightSidebar: {
        ...runtimeUi.classNames?.rightSidebar,
        root: isOverlayShellExample
          ? [runtimeUi.classNames?.rightSidebar?.root, '!absolute !right-0 !top-0 !bottom-0 !z-30'].filter(Boolean).join(' ')
          : runtimeUi.classNames?.rightSidebar?.root,
      },
    },
  }

  const config: SisadPdfmeGlobalConfig = {
    runtime: {
      mode: (example?.defaultMode as 'designer' | 'form' | 'viewer' | undefined) || 'designer',
    },
    // Contrato visual explícito (TASK-LAB-026): el lab no depende de defaults
    // implícitos para armar el layout clásico de 3 paneles. Densidad alineada
    // con el preset `classic-designer` (ui.density = comfortable).
    theme: {
      cssEntry: 'sisad-pdfme.css',
      strategy: 'tailwind',
      density: ui.density || 'comfortable',
    },
    sidebars: {
      left: {
        enabled: true,
        defaultOpen: ui.sidebars?.left?.defaultOpen ?? true,
        catalogLayout: ui.sidebars?.left?.catalogLayout || 'list',
        allowCustomFields: false,
      },
      right: {
        enabled: true,
        defaultPanel: ui.sidebars?.right?.defaultPanel || (documentsMode === 'multi' ? 'documents' : 'fields'),
        panels: ['fields', 'detail', 'comments', 'documents'],
        density: ui.density || 'comfortable',
        showCollapsedButton: false,
      },
    },
    canvas: {
      enabled: true,
      selecto: true,
      moveable: true,
      snapLines: true,
      guides: true,
      emptyClickClearsSelection: true,
      multiSelect: true,
      suspendWhenModalOpen: true,
      resetInteractionOnModalClose: true,
    },
    collaboration: {
      enabled: Boolean(example?.collaboration?.enabled ?? normalized.recipients.length > 0),
      activeRecipientId: resolvedActiveRecipientId,
      isGlobalView: resolvedIsGlobalView,
      canEditStructure: true,
    },
    assignment: {
      enabled: true,
      allowBulk: true,
      searchable: true,
      showCurrentRecipient: true,
      preserveLockState: true,
    },
    documents: {
      mode: documentsMode,
      preserveDocumentSchemaRouting: true,
      activeDocumentStrategy: 'internal',
    },
    signatures: {
      enabled: true,
      defaultMode: 'draw',
      providers: normalized.signatureProviders as SisadPdfmeSignatureProvider[],
    },
    visibility: ui.visibility || (runtimeOptions.visibility as SisadPdfmeGlobalConfig['visibility']) || undefined,
    ui,
  }

  const resolved = createSisadPdfmeConfig(config)

  return {
    ...resolved,
    runtimeOptions: {
      ...resolved.runtimeOptions,
      rightSidebarViewMode: documentsMode === 'multi' ? 'docs' : resolved.runtimeOptions.rightSidebarViewMode,
    },
  }
}
