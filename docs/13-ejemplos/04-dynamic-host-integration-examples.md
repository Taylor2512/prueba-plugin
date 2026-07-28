# Ejemplos dinámicos con datos externos

## Contrato mínimo

```ts
type HostExampleInput = {
  template: Template
  recipients?: unknown[]
  documents?: unknown[]
  activeRecipientId?: string | null
  config?: SisadPdfmeGlobalConfig
}
```

Estos ejemplos asumen que el host ya normalizó aliases legacy y entrega una sola config canónica al provider o al controller. Si todavía recibes `ui.visibility`, resuélvelo antes de entrar a este nivel.

## Reglas

- Los recipients no se duplican en `collaboration.users` y `runtimeOptions.collaboration.recipients`.
- Los documents no se duplican en `uploadedDocuments` y `documents` si el wrapper ya soporta `documents`.
- El host no crea contextos internos del diseñador.
- `enabled`, `visible`, `allowed` y `executable` no significan lo mismo.
- La visualización sale de `config.visibility`, no de reglas dispersas en cada wrapper.
- Las acciones visibles deben venir del action registry o del controller público.

## Mapa de ejemplos

| Ejemplo | Intención | Señal de QA |
|---|---|---|
| `minimal` | host base con la mínima config canónica | arranca sin extras y mantiene defaults previsibles |
| `full` | host con todas las capacidades activas | valida combinaciones densas sin perder consistencia |
| `reviewer` | lectura y revisión sin edición estructural | muestra comentarios/documentos pero bloquea mutación |
| `form` | experiencia orientada a formulario | prioriza campos y firma por encima del chrome general |
| `multi` | varios documentos con routing estable | conserva el documento activo y su enrutado |
| `no-collab` | experiencia local sin colaboración | no registra usuarios ni estados compartidos |
| `provider` | provider propio con scope aislado | verifica que el provider controla su propia config |
| `dynamic` | actualizaciones en caliente por controller | distingue cambios de presentación y rebuilds controlados |

## `minimal`

```ts
const minimalConfig: SisadPdfmeGlobalConfig = {
  runtime: { mode: 'designer' },
  documents: { mode: 'single' },
  comments: { enabled: false },
  signatures: { enabled: false },
};
```

Uso: hosts simples que solo necesitan un template, guardar cambios y conservar los defaults del sistema.

## `full`

```ts
const fullConfig: SisadPdfmeGlobalConfig = {
  runtime: { mode: 'designer' },
  assignment: { enabled: true },
  collaboration: { canEditStructure: true, isGlobalView: true },
  comments: { enabled: true },
  documents: {
    mode: 'multi',
    preserveDocumentSchemaRouting: true,
    activeDocumentStrategy: 'selected',
  },
  signatures: {
    enabled: true,
    defaultMode: 'provider',
    providers: ['provider-a', 'provider-b'],
  },
  visibility: {
    actions: {
      reassign: true,
      duplicate: true,
      delete: true,
    },
    modals: {
      assignment: true,
      comments: true,
    },
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
  },
};
```

Uso: host de máxima capacidad para validar que la config canónica sigue siendo consistente cuando todo está encendido.

## `reviewer`

```ts
const reviewerConfig: SisadPdfmeGlobalConfig = {
  runtime: { mode: 'viewer', readonly: true },
  collaboration: { canEditStructure: false, isGlobalView: true },
  comments: { enabled: true },
  documents: { mode: 'single' },
  visibility: {
    actions: {
      reassign: false,
      duplicate: false,
      delete: false,
    },
    modals: {
      comments: true,
    },
    sidebars: {
      right: {
        panels: {
          fields: false,
          detail: true,
          comments: true,
          documents: true,
        },
      },
    },
  },
};
```

Uso: perfiles de revisión donde el usuario inspecciona, comenta y navega, pero no muta la estructura.

## `form`

```ts
const formConfig: SisadPdfmeGlobalConfig = {
  runtime: { mode: 'designer' },
  assignment: { enabled: true },
  collaboration: { canEditStructure: true },
  comments: { enabled: false },
  documents: {
    mode: 'single',
    preserveDocumentSchemaRouting: true,
    activeDocumentStrategy: 'selected',
  },
  signatures: {
    enabled: true,
    defaultMode: 'draw',
    providers: ['local'],
  },
  visibility: {
    sidebars: {
      right: {
        panels: {
          fields: true,
          detail: true,
          comments: false,
          documents: true,
        },
      },
    },
  },
};
```

Uso: formularios con foco en campos y firma, sin ruido de colaboración o comentarios si el flujo no los necesita.

## `multi`

```ts
const multiConfig: SisadPdfmeGlobalConfig = {
  runtime: { mode: 'designer' },
  documents: {
    mode: 'multi',
    preserveDocumentSchemaRouting: true,
    activeDocumentStrategy: 'selected',
  },
  collaboration: { canEditStructure: true },
  visibility: {
    sidebars: {
      right: {
        panels: {
          fields: true,
          detail: true,
          comments: false,
          documents: true,
        },
      },
    },
  },
};
```

Uso: escenarios con varios documentos donde el documento activo, el routing y el panel de documentos deben permanecer estables.

## `no-collab`

```ts
const noCollabConfig: SisadPdfmeGlobalConfig = {
  runtime: { mode: 'designer' },
  assignment: { enabled: false },
  collaboration: { canEditStructure: false, isGlobalView: false },
  comments: { enabled: false },
  visibility: {
    actions: {
      reassign: false,
      duplicate: true,
      delete: false,
    },
    sidebars: {
      right: {
        panels: {
          fields: true,
          detail: true,
          comments: false,
          documents: true,
        },
      },
    },
  },
};
```

Uso: hosts locales o aislados donde no hay coedición, pero sí hace falta mantener edición individual y navegación de la plantilla.

## `provider`

```tsx
const providerConfig: SisadPdfmeGlobalConfig = {
  runtime: { mode: 'designer' },
  comments: { enabled: true },
  signatures: {
    enabled: true,
    defaultMode: 'provider',
    providers: ['provider-x'],
  },
};

<SisadPdfmeProvider config={providerConfig}>
  <SisadPdfmeDesigner
    template={template}
    documents={documents}
    onTemplateChange={setTemplate}
  />
</SisadPdfmeProvider>
```

Uso: el provider encierra una sola instancia de configuración, una sola capa de recursos y un solo scope de recipients por host.

## `dynamic`

```ts
const service = createSisadPdfmeConfigService(minimalConfig);
const controller = useSisadPdfmeController(instanceRef, { configService: service });

controller.updateConfig({
  visibility: {
    sidebars: {
      right: {
        panels: {
          documents: false,
        },
      },
    },
  },
});

controller.updateConfig({
  runtime: { mode: 'viewer' },
});

controller.explainConfiguration();
controller.resetConfig();
```

Uso: cambios en caliente. Lo que solo toca presentación no debe reconstruir recursos; los cambios de runtime sí deben hacerlo de forma controlada.
