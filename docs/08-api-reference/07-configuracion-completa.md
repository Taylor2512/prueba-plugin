# Referencia completa de configuración — SISAD PDFME

Este documento describe las rutas observadas en `SisadPdfmeGlobalConfig`, sus valores por defecto y su nivel de implementación.

## Convención de estado

| Estado | Significado |
|---|---|
| Implementado | consumido por la implementación actual |
| Parcial | existe lógica, pero no cubre todo el contrato |
| Declarativo | tipado/default, sin consumidor directo confirmado |
| No soportado | ruta histórica fuera del contrato actual; debe rechazarse |

---

# 1. Config raíz

```ts
type SisadPdfmeGlobalConfig = {
  configVersion?: 2;
  app?: AppConfig;
  runtime?: RuntimeConfig;
  theme?: ThemeConfig;
  canvas?: CanvasConfig;
  sidebars?: SidebarsConfig;
  schemas?: SchemasConfig;
  recipients?: SisadPdfmeRecipientsConfig;
  collaboration?: CollaborationConfig;
  assignment?: AssignmentConfig;
  documents?: DocumentsConfig;
  signatures?: SignaturesConfig;
  persistence?: PersistenceConfig;
  events?: SisadPdfmeEventHandlers;
  debug?: DebugConfig;
  visibility?: SisadPdfmeVisibilityConfig;
  ui?: SisadPdfmeUiConfig;
};
```

---

# 2. `configVersion`

| Ruta | Tipo | Default | Estado | Uso |
|---|---|---:|---|---|
| `configVersion` | `2` | `2` | Implementado | versión del contrato actual |

La normalización actual sólo acepta la representación de versión 2.

---

# 3. `app`

| Flag | Tipo | Default | Estado | Descripción |
|---|---|---:|---|---|
| `app.id` | string | valor interno | Parcial | identificador del montaje/aplicación |
| `app.name` | string | valor interno | Parcial | nombre descriptivo |
| `app.locale` | string | `es` | Implementado/parcial | locale base |
| `app.environment` | string | entorno | Parcial | development/test/production |

Ejemplo:

```ts
app: {
  id: 'contracts-designer',
  name: 'Diseñador de contratos',
  locale: 'es',
  environment: 'production',
}
```

---

# 4. `runtime`

| Flag | Tipo | Default | Estado | Descripción |
|---|---|---:|---|---|
| `runtime.mode` | `designer \| form \| viewer` | `designer` | Implementado | modo lógico; usar además el wrapper correspondiente |
| `runtime.readonly` | boolean | `false` | Implementado | bloquea edición/mutaciones |
| `runtime.isolateDomEvents` | boolean | `true` | Implementado/parcial | evita propagación hacia el host |
| `runtime.preserveSelectionOnModalClose` | boolean | `true` | Implementado | conserva selección al cerrar modales |

Activar readonly:

```ts
runtime: {
  readonly: true,
}
```

---

# 5. `theme`

| Flag | Tipo | Default | Estado | Descripción |
|---|---|---:|---|---|
| `theme.cssEntry` | string | `sisad-pdfme.css` | Declarativo | nombre del entrypoint CSS |
| `theme.strategy` | string | `tailwind` | Declarativo | estrategia visual |
| `theme.density` | `comfortable \| compact \| minimal` | `comfortable` | Implementado | densidad base |
| `theme.classNamePrefix` | string | `sisad-pdfme` | Declarativo | prefijo nominal |
| `theme.tokens` | record | `{}` | Parcial | tokens custom |

La ruta canónica de densidad es:

```txt
theme.density
```

No usar `ui.density`.

---

# 6. `canvas`

| Flag | Tipo | Default | Estado | Activación/desactivación |
|---|---|---:|---|---|
| `canvas.enabled` | boolean | true | Implementado | false desactiva capacidad Canvas |
| `canvas.selecto` | boolean | true | Implementado | false desactiva selección regional |
| `canvas.moveable` | boolean | true | Implementado | false desactiva drag/resize/rotate |
| `canvas.snapLines` | boolean | true | Implementado | false desactiva líneas de snap |
| `canvas.guides` | boolean | true | Implementado | false desactiva guías |
| `canvas.emptyClickClearsSelection` | boolean | true | Implementado | false conserva selección al click vacío |
| `canvas.multiSelect` | boolean | true | Implementado | false limita selección múltiple |
| `canvas.platformSelection` | auto/mac/windows/linux | auto | Declarativo/parcial | política de modificadores |
| `canvas.suspendWhenModalOpen` | boolean | true | Implementado | suspende interacción con modal |
| `canvas.resetInteractionOnModalClose` | boolean | true | Implementado | limpia estado transitorio |

Ejemplo sin transforms:

```ts
canvas: {
  selecto: false,
  moveable: false,
}
```

---

# 7. `sidebars.left`

| Flag | Tipo | Default | Estado | Descripción |
|---|---|---:|---|---|
| `enabled` | boolean | true | Implementado | monta/desmonta capacidad |
| `defaultOpen` | boolean | true | Implementado | estado inicial |
| `catalogLayout` | list/tiles/icons | list | Implementado | presentación del catálogo |
| `allowCustomFields` | boolean | false | Declarativo/parcial | permiso para custom fields |

Ejemplo:

```ts
sidebars: {
  left: {
    enabled: true,
    defaultOpen: true,
    catalogLayout: 'icons',
  },
}
```

---

# 8. `sidebars.right`

| Flag | Tipo | Default | Estado | Descripción |
|---|---|---:|---|---|
| `enabled` | boolean | true | Implementado |
| `defaultOpen` | boolean | true | Implementado |
| `defaultPanel` | fields/detail/comments/documents | fields | Implementado |
| `panels` | array | todos | Implementado | paneles registrados en navegación |
| `density` | comfortable/compact/minimal | comfortable | Implementado |
| `showCollapsedButton` | boolean | false | Declarativo/parcial |

Ejemplo:

```ts
sidebars: {
  right: {
    enabled: true,
    defaultOpen: true,
    defaultPanel: 'detail',
    panels: ['fields', 'detail', 'documents'],
    density: 'compact',
  },
}
```

Para que un panel sea utilizable deben coincidir:

```txt
sidebars.right.panels incluye el panel
visibility.sidebars.right.panels.<panel> !== false
```

---

# 9. `schemas`

| Flag | Tipo | Default | Estado | Descripción |
|---|---|---:|---|---|
| `enabledTypes` | string[] | `[]` | Parcial | resolver existe; consumo completo no confirmado |
| `autoAttachIdentity` | boolean | true | Implementado/parcial | añade identidad técnica |
| `validateUniqueNames` | boolean | true | Declarativo/parcial | helper existe; config no totalmente conectada |
| `defaultOwnerStrategy` | none/activerecipient/firstrecipient | activerecipient | Implementado |
| `plugins` | unknown[] | `[]` | Parcial | se valida, pero no se registra automáticamente |

Ocultar tipos del catálogo mediante visibilidad:

```ts
visibility: {
  schemas: {
    catalog: {
      attachment: false,
      signature: false,
    },
  },
}
```

Plugin custom actual:

```ts
registerPlugins([plugin]);
```

---

# 10. `recipients`

| Flag | Tipo | Default | Estado | Descripción |
|---|---|---:|---|---|
| `enabled` | boolean | true | Implementado |
| `activeRecipientId` | string/null | null | Implementado | fuente canónica |
| `allowUnassigned` | boolean | true | Implementado/parcial |
| `allowShared` | boolean | true | Implementado/parcial |
| `allowMultipleOwners` | boolean | false | Declarativo/parcial |
| `defaultOwnerStrategy` | none/activerecipient/firstrecipient | activerecipient | Implementado |
| `colorStrategy` | recipient/schema/theme/auto | recipient | Implementado/parcial |
| `missingRecipientBehavior` | keep-id/fallback-active/mark-unassigned | keep-id | Declarativo/parcial |

No usar como ruta principal:

```txt
collaboration.activeRecipientId
```

---

# 11. `collaboration`

| Flag | Tipo | Default | Estado | Descripción |
|---|---|---:|---|---|
| `enabled` | boolean | false | Implementado |
| `activeRecipientId` | string/null | null | No soportado | usar `recipients.activeRecipientId` |
| `isGlobalView` | boolean | false | Implementado |
| `canEditStructure` | boolean | true | Implementado | afecta assignment/mutaciones |
| `ownerColorStrategy` | recipient/schema/theme | recipient | Declarativo/parcial |

Ejemplo:

```ts
collaboration: {
  enabled: true,
  isGlobalView: false,
  canEditStructure: true,
}
```

---

# 12. `assignment`

| Flag | Tipo | Default | Estado | Descripción |
|---|---|---:|---|---|
| `enabled` | boolean | true | Implementado |
| `allowSingle` | boolean | true | Declarativo/parcial |
| `allowBulk` | boolean | true | Declarativo/parcial |
| `preserveLockState` | boolean | true | Declarativo/parcial |
| `showCurrentRecipient` | boolean | true | Declarativo/parcial |
| `searchable` | boolean | true | Declarativo/parcial |
| `closeOnCancel` | boolean | true | Declarativo/parcial |
| `closeOnConfirm` | boolean | true | Declarativo/parcial |

Desactivar asignación:

```ts
assignment: {
  enabled: false,
},
visibility: {
  actions: {
    reassign: false,
  },
  modals: {
    assignment: false,
  },
}
```

---

# 13. `documents`

| Flag | Tipo | Default | Estado | Descripción |
|---|---|---:|---|---|
| `mode` | single/multi | single | Implementado |
| `preserveDocumentSchemaRouting` | boolean | true | Implementado |
| `activeDocumentStrategy` | internal/host | internal | Implementado/parcial |

Multi-documento:

```ts
documents: {
  mode: 'multi',
  preserveDocumentSchemaRouting: true,
  activeDocumentStrategy: 'internal',
}
```

Cada documento debe preservar `template`.

---

# 14. `signatures`

| Flag | Tipo | Default | Estado | Descripción |
|---|---|---:|---|---|
| `enabled` | boolean | true | Implementado |
| `defaultMode` | draw/image/p12/provider | draw | Implementado |
| `providers` | provider[] | `[]` | Implementado |

Validación:

```txt
defaultMode='provider' + providers=[] → error de configuración
```

Ejemplo:

```ts
signatures: {
  enabled: true,
  defaultMode: 'provider',
  providers: [
    {
      key: 'provider-x',
      label: 'Firma corporativa',
      capabilities: ['request', 'status'],
    },
  ],
}
```

---

# 15. `persistence`

| Flag | Tipo | Default | Estado | Descripción |
|---|---|---:|---|---|
| `mode` | none/local/host | none | Parcial |
| `autosave` | boolean | false | Parcial |
| `serializeSnapshot` | boolean | true | Implementado |

Advertencia:

```txt
autosave=true + mode=none → warning
```

La implementación actual no implementa por sí sola un storage local/remoto completo.

---

# 16. `events`

Nombres tipados:

```txt
onReady
onChange
onSave
onError
onSelectionChange
onRecipientsChange
onActiveRecipientChange
onAssignmentChange
onDocumentChange
onSignatureRequest
```

Valor permitido:

```ts
'host' | false | ((payload: unknown) => void)
```

Estado actual:

- recipients, active recipient y assignment sí tienen conexión directa visible en el wrapper;
- `onSave` también existe como prop directa;
- no asumir que todos los nombres de `config.events` están conectados en todas las superficies.

---

# 17. `debug`

| Flag | Tipo | Default | Estado | Descripción |
|---|---|---:|---|---|
| `enabled` | boolean | false | Implementado/parcial |
| `showTechnicalInspector` | boolean | false | Implementado |
| `logEvents` | boolean | false | Declarativo/parcial |

---

# 18. `visibility.shell`

| Flag | Default | Uso |
|---|---:|---|
| header | true | shell/header |
| footer | false | footer |
| statusBar | true | barra de estado |
| resultsPanel | false | resultados |
| debugPanel | false | panel debug |

Algunos flags del shell son declarativos o dependen del host/superficie.

---

# 19. `visibility.canvas`

| Flag | Default | Estado |
|---|---:|---|
| toolbar | true | Implementado |
| floatingToolbar | true | Implementado |
| contextMenu | true | Implementado |
| pageNavigator | true | Parcial |
| zoomControls | true | Parcial |
| grid | false | Implementado |
| rulers | false | Implementado |
| guides | true | Implementado |
| snapLines | true | Implementado |
| selectionBox | true | Parcial |
| ownerBadges | true | Implementado |
| requiredMarkers | true | Implementado |
| lockBadges | true | Implementado |

Ejemplo:

```ts
visibility: {
  canvas: {
    grid: true,
    rulers: true,
    guides: true,
  },
}
```

---

# 20. `visibility.sidebars.left`

| Flag | Default | Estado |
|---|---:|---|
| visible | true | Implementado |
| collapseButton | true | Implementado |
| search | true | Implementado |
| tabs | true | Parcial |
| catalog | true | Parcial |
| customFields | false | Declarativo/parcial |
| favorites | false | Declarativo/parcial |
| recent | false | Declarativo/parcial |
| recipients | false | Declarativo/parcial |

Diferencia:

```txt
sidebars.left.enabled=false → no montar capacidad
visibility.sidebars.left.visible=false → ocultar superficie
```

---

# 21. `visibility.sidebars.right`

| Flag | Default |
|---|---:|
| visible | true |
| collapseButton | true |
| tabs | true |
| contextHeader | true |

Paneles:

| Flag | Default |
|---|---:|
| fields | true |
| detail | true |
| comments | false |
| documents | false |

Ejemplo:

```ts
visibility: {
  sidebars: {
    right: {
      visible: true,
      panels: {
        fields: true,
        detail: true,
        comments: true,
        documents: true,
      },
    },
  },
}
```

---

# 22. `visibility.actions`

| Acción | Default | Condición contextual adicional |
|---|---:|---|
| reassign | true | assignment + permisos + selección + recipients |
| rename | false | selección |
| duplicate | true | selección + editable |
| delete | true | selección + editable |
| copy | true | selección |
| paste | true | clipboard + editable |
| lock | true | selección + editable |
| unlock | true | selección |
| hide | false | selección |
| show | false | selección |
| align | true | selección suficiente |
| distribute | true | selección suficiente |
| matchSize | true | selección suficiente |

Ocultar acción:

```ts
visibility: {
  actions: {
    delete: false,
  },
}
```

---

# 23. `visibility.inspector`

| Flag | Default |
|---|---:|
| visible | true |
| showEmptySections | false |
| showAdvanced | false |
| showTechnical | false |
| showCollaboration | true |
| showComments | false |
| sections | `{}` |
| fields | `{}` |
| fieldsBySchemaType | `{}` |

Ejemplo:

```ts
visibility: {
  inspector: {
    showAdvanced: true,
    showTechnical: false,
    sections: {
      format: false,
    },
    fieldsBySchemaType: {
      signature: {
        signatureProviderKey: true,
      },
    },
  },
}
```

La resolución final depende además del perfil/capacidad del schema.

---

# 24. `visibility.schemas`

Mapas:

```ts
schemas: {
  catalog?: Record<string, boolean>;
  canvas?: Record<string, boolean>;
  inspector?: Record<string, boolean>;
  runtime?: Record<string, boolean>;
}
```

Ejemplo:

```ts
visibility: {
  schemas: {
    catalog: {
      image: false,
      svg: false,
    },
    runtime: {
      note: true,
    },
  },
}
```

---

# 25. `visibility.modals`

| Modal | Default | Estado |
|---|---:|---|
| assignment | true | Implementado |
| schemaDropSetup | true | Parcial |
| customField | false | Declarativo/parcial |
| comments | false | Implementado/parcial |
| shortcutHelp | true | Implementado |

---

# 26. `visibility.runtime`

| Flag | Default | Estado |
|---|---:|---|
| fieldChrome | true | Parcial |
| readonlyChrome | true | Parcial |
| ownerColor | true | Implementado |
| recipientFilter | true | Implementado |

---

# 27. `ui`

La ruta `ui` debe usarse para presentación:

| Flag | Default | Estado |
|---|---:|---|
| visualPreset | classic-designer | Implementado/parcial |
| layoutPreset | three-panel | Implementado/parcial |
| density | comfortable | Declarativo/parcial; la ruta canónica es `theme.density` |
| gap | .5rem | Implementado/parcial |
| padding | .5rem | Implementado/parcial |
| baseWidth | 100% | Implementado/parcial |
| baseHeight | 100% | Implementado/parcial |
| classNames | vacío | Implementado |

No usar en config nueva:

```txt
ui.visibility
ui.density
ui.sidebars
```

Usar:

```txt
visibility
theme.density
sidebars
```

## 27.1 classNames públicos

```ts
ui: {
  classNames: {
    leftSidebar: {
      container?: string;
      content?: string;
      searchInput?: string;
    },
    rightSidebar: {
      root?: string;
      content?: string;
      listView?: string;
      detailView?: string;
    },
  },
}
```

No apuntar desde el host a clases internas no públicas.

---

# 28. Rutas no soportadas

Las rutas históricas no forman parte del contrato actual y no se migran en
runtime. El host debe enviar únicamente la representación canónica:

```txt
visibility
theme.density
sidebars.left
sidebars.right
recipients.activeRecipientId
```

Una entrada histórica inválida debe producir un error explícito; no se convierte
silenciosamente en defaults.

---

# 29. Validaciones incorporadas

La validación reporta:

```txt
error:
signature defaultMode=provider sin providers

warning:
persistence.autosave=true con mode=none

warning:
sidebars.right.defaultPanel no está en sidebars.right.panels

warning:
plugins con id duplicado

warning:
documents.mode=single y preserveDocumentSchemaRouting=false
```

---

# 30. Precedencia recomendada

```txt
1. defaults
2. preset
3. config canónica del host
4. overrides del runtime
5. permisos/contexto
6. estado de interacción
```

No construyas una segunda precedencia en el host.
