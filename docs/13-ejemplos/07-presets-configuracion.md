# Presets de configuración SISAD PDFME

## 1. Editor completo empresarial

```ts
export const fullDesignerConfig = createSisadPdfmeConfig({
  runtime: {
    mode: 'designer',
    readonly: false,
    isolateDomEvents: true,
    preserveSelectionOnModalClose: true,
  },
  theme: {
    density: 'comfortable',
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
  sidebars: {
    left: {
      enabled: true,
      defaultOpen: true,
      catalogLayout: 'list',
    },
    right: {
      enabled: true,
      defaultOpen: true,
      defaultPanel: 'fields',
      panels: ['fields', 'detail', 'comments', 'documents'],
      density: 'comfortable',
    },
  },
  collaboration: {
    enabled: true,
    isGlobalView: false,
    canEditStructure: true,
  },
  assignment: {
    enabled: true,
  },
  documents: {
    mode: 'multi',
    preserveDocumentSchemaRouting: true,
  },
  visibility: {
    sidebars: {
      right: {
        panels: {
          fields: true,
          detail: true,
          comments: true,
          documents: true,
        },
      },
    },
    modals: {
      assignment: true,
      comments: true,
    },
  },
});
```

## 2. Editor compacto

```ts
export const compactDesignerConfig = createSisadPdfmeConfig({
  theme: {
    density: 'compact',
  },
  sidebars: {
    left: {
      catalogLayout: 'icons',
    },
    right: {
      density: 'compact',
    },
  },
  visibility: {
    canvas: {
      rulers: false,
      grid: false,
    },
    inspector: {
      showAdvanced: false,
      showTechnical: false,
      showEmptySections: false,
    },
  },
});
```

## 3. Editor sin colaboración

```ts
export const singleUserDesignerConfig = createSisadPdfmeConfig({
  collaboration: {
    enabled: false,
  },
  assignment: {
    enabled: false,
  },
  visibility: {
    actions: {
      reassign: false,
      lock: false,
      unlock: false,
    },
    inspector: {
      showCollaboration: false,
    },
    modals: {
      assignment: false,
    },
  },
});
```

## 4. Catálogo limitado

```ts
export const limitedCatalogConfig = createSisadPdfmeConfig({
  visibility: {
    schemas: {
      catalog: {
        image: false,
        svg: false,
        table: false,
        qrcode: false,
        ean13: false,
        ean8: false,
        code39: false,
        code128: false,
        pdf417: false,
      },
    },
  },
});
```

## 5. Solo campos de firma

```ts
export const signingDesignerConfig = createSisadPdfmeConfig({
  visibility: {
    schemas: {
      catalog: {
        text: false,
        number: false,
        image: false,
        svg: false,
        table: false,
        checkbox: false,
        checkboxGroup: false,
        radioGroup: false,
        select: false,
        attachment: false,
        note: false,
        approve: false,
        decline: false,
      },
    },
  },
  signatures: {
    enabled: true,
    defaultMode: 'draw',
  },
});
```

Nota: para una allowlist estricta conviene resolver explícitamente todos los tipos o cerrar el consumo de `schemas.enabledTypes`.

## 6. Form de destinatario

```ts
export const recipientFormConfig = createSisadPdfmeConfig({
  runtime: {
    mode: 'form',
    readonly: false,
  },
  recipients: {
    enabled: true,
  },
  visibility: {
    runtime: {
      fieldChrome: true,
      readonlyChrome: true,
      ownerColor: true,
      recipientFilter: true,
    },
  },
});
```

## 7. Viewer limpio

```ts
export const cleanViewerConfig = createSisadPdfmeConfig({
  runtime: {
    mode: 'viewer',
    readonly: true,
  },
  sidebars: {
    left: {
      enabled: false,
    },
    right: {
      enabled: false,
    },
  },
  visibility: {
    shell: {
      header: false,
      footer: false,
      statusBar: false,
      resultsPanel: false,
      debugPanel: false,
    },
    canvas: {
      toolbar: false,
      floatingToolbar: false,
      contextMenu: false,
      grid: false,
      rulers: false,
      guides: false,
      snapLines: false,
      ownerBadges: false,
      requiredMarkers: false,
      lockBadges: false,
    },
  },
});
```

## 8. Firma por proveedor externo

```ts
export const providerSignatureConfig = createSisadPdfmeConfig({
  signatures: {
    enabled: true,
    defaultMode: 'provider',
    providers: [
      {
        key: 'corporate-sign',
        label: 'Firma corporativa',
        description: 'Proveedor externo del host',
        capabilities: ['request', 'status', 'preview'],
      },
    ],
  },
  events: {
    onSignatureRequest: 'host',
  },
});
```

El host debe implementar el request real.

## 9. Revisión readonly con inspector

```ts
export const readonlyReviewConfig = createSisadPdfmeConfig({
  runtime: {
    mode: 'designer',
    readonly: true,
  },
  sidebars: {
    left: {
      enabled: false,
    },
    right: {
      enabled: true,
      defaultPanel: 'detail',
      panels: ['fields', 'detail', 'comments'],
    },
  },
  visibility: {
    actions: {
      reassign: false,
      duplicate: false,
      delete: false,
      paste: false,
      lock: false,
      unlock: false,
      align: false,
      distribute: false,
      matchSize: false,
    },
    inspector: {
      visible: true,
      showCollaboration: true,
    },
  },
});
```
