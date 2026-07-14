# Plan maestro de implementación — Portabilidad, configuración global y agentes para `src/sisad-pdfme`

## 0. Decisión arquitectónica

`src/sisad-pdfme` debe tratarse como una librería portable. El proyecto base `prueba-plugin` no debe conocer ningún host concreto. Cualquier proyecto consumidor debe integrarlo mediante configuración, adaptadores y eventos.

**Regla absoluta**

```txt
src/sisad-pdfme no importa nada del host.
El host importa src/sisad-pdfme y le entrega datos/adaptadores/configuración.
```

Dentro del componente deben vivir únicamente contratos genéricos, configuración global, adapters base, wrappers React públicos, Designer/Form/Viewer, schema registry, command bus, snapshot, runtime options, generator, documentos y estilos aislados.

---

## 1. Objetivo final

Un host externo debe poder integrar el diseñador con una API de alto nivel:

```tsx
import {
  SisadPdfmeDesigner,
  createSisadPdfmeConfig,
} from './sisad-pdfme';

const config = createSisadPdfmeConfig({
  runtime: { mode: 'designer', locale: 'es' },
  collaboration: { enabled: true, activeRecipientId: 'recipient-1' },
  assignment: { enabled: true, allowBulk: true },
  documents: { mode: 'multi' },
});

<SisadPdfmeDesigner
  config={config}
  template={template}
  documents={documents}
  recipients={recipients}
  onTemplateChange={setTemplate}
  onSave={handleSave}
/>
```

El host no debe importar `Canvas`, `RightSidebar`, `DetailView`, `ListView`, `SchemaAssignmentDialog`, `selectionPolicy`, `Moveable`, `Selecto`, `schemaAssignmentService` ni internals de runtime.

---

## 2. Investigación y hallazgos

### 2.1 Base existente aprovechable

El proyecto ya contiene una fachada inicial en `src/sisad-pdfme/integration`, un `DesignerEngine` configurable y módulos separados para assignments, collaboration, commands, contracts, documents, runtime, schemas, generator, converter, UI y snapshot. Esto confirma que la dirección correcta es construir una capa de configuración global sobre lo existente, no crear wrappers por host.

### 2.2 Dolor actual

La integración hoy exige que el host conozca demasiados detalles internos:

```txt
recipients
activeRecipient
collaborationContext
canEditStructure
ownerRecipientId
recipientId
ownerColor
selected schemas
assignment dialog
runtime options
designerEngine
sidebars
canvas feature toggles
signature providers
documents
snapshot
commands
```

Eso causa integraciones frágiles: el laboratorio funciona, pero al copiar a otro proyecto se rompen reasignación, selección, estilos, runtime, sidebars y permisos.

### 2.3 Riesgos visuales

Los estilos ya fueron consolidados hacia `src/sisad-pdfme/ui/styles/sisad-pdfme.css` y `tokens.css`. Aun así, Moveable, Selecto, zoom, geometría de paper/canvas, z-index crítico, scroll y print/PDF deben seguir protegidos. No se debe migrar ciegamente todo a JSX/Tailwind si toca geometría.

---

## 3. Arquitectura objetivo

```txt
src/sisad-pdfme
├── adapters
│   ├── documentsAdapter.ts
│   ├── eventsAdapter.ts
│   ├── permissionsAdapter.ts
│   ├── persistenceAdapter.ts
│   ├── recipientsAdapter.ts
│   ├── signatureProviderAdapter.ts
│   └── index.ts
├── config
│   ├── SisadPdfmeConfig.ts
│   ├── createSisadPdfmeConfig.ts
│   ├── defaultSisadPdfmeConfig.ts
│   ├── resolveSisadPdfmeConfig.ts
│   └── index.ts
├── react
│   ├── SisadPdfmeDesigner.tsx
│   ├── SisadPdfmeForm.tsx
│   ├── SisadPdfmeProvider.tsx
│   ├── SisadPdfmeViewer.tsx
│   ├── useSisadPdfmeConfig.ts
│   ├── useSisadPdfmeController.ts
│   └── index.ts
├── integration
│   ├── index.ts
│   └── schemaController.ts
└── ui / schemas / runtime / documents / generator / commands / collaboration
```

---

## 4. Contrato global propuesto

Crear `src/sisad-pdfme/config/SisadPdfmeConfig.ts`.

```ts
export type SisadPdfmeGlobalConfig = {
  app?: {
    id?: string;
    name?: string;
    locale?: string;
    environment?: 'development' | 'test' | 'production' | string;
  };

  runtime?: {
    mode?: 'designer' | 'form' | 'viewer';
    readonly?: boolean;
    isolateDomEvents?: boolean;
    preserveSelectionOnModalClose?: boolean;
  };

  theme?: {
    strategy?: 'tailwind';
    cssEntry?: 'sisad-pdfme.css';
    density?: 'comfortable' | 'compact' | 'mini';
    classNamePrefix?: string;
    tokens?: Record<string, string | number>;
  };

  canvas?: {
    enabled?: boolean;
    selecto?: boolean;
    moveable?: boolean;
    snapLines?: boolean;
    guides?: boolean;
    emptyClickClearsSelection?: boolean;
    multiSelect?: boolean;
    platformSelection?: 'auto' | 'mac' | 'windows' | 'linux';
    suspendWhenModalOpen?: boolean;
    resetInteractionOnModalClose?: boolean;
  };

  sidebars?: {
    left?: {
      enabled?: boolean;
      defaultOpen?: boolean;
      catalogLayout?: 'list' | 'tiles' | 'icons';
      allowCustomFields?: boolean;
    };
    right?: {
      enabled?: boolean;
      defaultPanel?: 'fields' | 'detail' | 'comments' | 'documents';
      panels?: Array<'fields' | 'detail' | 'comments' | 'documents'>;
      density?: 'comfortable' | 'compact' | 'mini';
      showCollapsedButton?: boolean;
    };
  };

  schemas?: {
    enabledTypes?: string[];
    autoAttachIdentity?: boolean;
    validateUniqueNames?: boolean;
    defaultOwnerStrategy?: 'none' | 'active-recipient' | 'first-recipient';
    plugins?: unknown[];
  };

  collaboration?: {
    enabled?: boolean;
    activeRecipientId?: string | null;
    canEditStructure?: boolean;
    ownerColorStrategy?: 'recipient' | 'schema' | 'theme';
  };

  assignment?: {
    enabled?: boolean;
    allowSingle?: boolean;
    allowBulk?: boolean;
    preserveLockState?: boolean;
    showCurrentRecipient?: boolean;
    searchable?: boolean;
    closeOnCancel?: boolean;
    closeOnConfirm?: boolean;
  };

  documents?: {
    mode?: 'single' | 'multi';
    preserveDocumentSchemaRouting?: boolean;
    activeDocumentStrategy?: 'internal' | 'host';
  };

  signatures?: {
    enabled?: boolean;
    defaultMode?: 'draw' | 'image' | 'p12' | 'provider';
    providers?: Array<{
      key: string;
      label: string;
      capabilities?: Record<string, boolean>;
      metadata?: Record<string, unknown>;
    }>;
  };

  persistence?: {
    mode?: 'none' | 'local' | 'host';
    autosave?: boolean;
    serializeSnapshot?: boolean;
  };

  events?: {
    onReady?: 'host' | false;
    onChange?: 'host' | false;
    onSave?: 'host' | false;
    onError?: 'host' | false;
    onSelectionChange?: 'host' | false;
    onAssignmentChange?: 'host' | false;
    onDocumentChange?: 'host' | false;
  };

  debug?: {
    enabled?: boolean;
    showTechnicalInspector?: boolean;
    logEvents?: boolean;
  };
};
```

---

## 5. Cambios por fases

### Fase 0 — Auditoría de frontera y baseline

**Agente responsable:** `docs-architecture-agent`  
**Subagentes:** `anti-hallucination-reviewer`, `code-docs-writer`

Tareas:

```txt
[ ] Ejecutar git status --short.
[ ] Mapear imports dentro de src/sisad-pdfme.
[ ] Detectar cualquier import hacia src/features, src/modules, APIs o rutas de host.
[ ] Confirmar que sisad-pdfme compila dentro del laboratorio sin depender de host.
[ ] Registrar baseline visual de Designer, Form y Viewer.
[ ] Crear reports/portability-boundary-audit.md.
```

Comandos sugeridos:

```bash
rg "from ['\"](\.\./)*features|from ['\"](\.\./)*modules|DigitalAgreements|Uanataca|Workflow|Documentary|axiosClient|/private/" src/sisad-pdfme
rg "SchemaAssignmentDialog|onBulkAssignRecipient|collaborationContext|activeRecipient|recipientOptions" src/sisad-pdfme
rg "DesignerEngine|runtimeOptions|buildDesignerRuntimeOptions|createSchemaController" src/sisad-pdfme
```

Criterio de cierre:

```txt
No hay dependencia del host dentro de src/sisad-pdfme.
El reporte enumera todos los puntos de integración actuales.
```

---

### Fase 1 — Contrato de configuración global

**Agente responsable:** `designer-runtime-agent`  
**Subagentes:** `api-contract-agent`, `anti-hallucination-reviewer`

Crear:

```txt
src/sisad-pdfme/config/SisadPdfmeConfig.ts
src/sisad-pdfme/config/defaultSisadPdfmeConfig.ts
src/sisad-pdfme/config/resolveSisadPdfmeConfig.ts
src/sisad-pdfme/config/createSisadPdfmeConfig.ts
src/sisad-pdfme/config/index.ts
```

Tareas:

```txt
[ ] Definir SisadPdfmeGlobalConfig.
[ ] Definir ResolvedSisadPdfmeConfig.
[ ] Crear defaultSisadPdfmeConfig con modo designer funcional sin config.
[ ] Crear merge seguro con defaults.
[ ] Mapear config a runtimeOptions.
[ ] Mapear config a DesignerEngine.
[ ] Exportar desde integration/index.ts.
[ ] Agregar pruebas unitarias del resolver.
```

Criterios:

```txt
createSisadPdfmeConfig() sin argumentos devuelve config funcional.
No rompe props legacy de Designer/Form/Viewer.
No importa nada del host.
```

---

### Fase 2 — Adapters genéricos

**Agente responsable:** `api-contract-agent`  
**Subagentes:** `schema-agent`, `snapshot-agent`

Crear:

```txt
src/sisad-pdfme/adapters/recipientsAdapter.ts
src/sisad-pdfme/adapters/documentsAdapter.ts
src/sisad-pdfme/adapters/persistenceAdapter.ts
src/sisad-pdfme/adapters/signatureProviderAdapter.ts
src/sisad-pdfme/adapters/permissionsAdapter.ts
src/sisad-pdfme/adapters/eventsAdapter.ts
src/sisad-pdfme/adapters/index.ts
```

Contratos mínimos:

```ts
export type SisadPdfmeRecipient = {
  id: string;
  label: string;
  role?: string;
  email?: string;
  color?: string;
  metadata?: Record<string, unknown>;
};

export type SisadPdfmeRecipientsAdapter<THostUser = unknown> = {
  toRecipient(input: THostUser): SisadPdfmeRecipient;
  toRecipients(input: THostUser[]): SisadPdfmeRecipient[];
};
```

Tareas:

```txt
[ ] Adaptador de recipients.
[ ] Adaptador de documents.
[ ] Adaptador de persistence.
[ ] Adaptador de signature providers.
[ ] Adaptador de permissions.
[ ] Adaptador de event bus.
[ ] Tests con datos genéricos, no SISAD-WEB.
```

Criterio:

```txt
Cualquier host puede mapear sus usuarios/documentos/firmas sin modificar el core.
```

---

### Fase 3 — React Provider y wrappers públicos

**Agente responsable:** `designer-runtime-agent`  
**Subagentes:** `interaction-agent`, `inspector-agent`

Crear:

```txt
src/sisad-pdfme/react/SisadPdfmeProvider.tsx
src/sisad-pdfme/react/SisadPdfmeDesigner.tsx
src/sisad-pdfme/react/SisadPdfmeForm.tsx
src/sisad-pdfme/react/SisadPdfmeViewer.tsx
src/sisad-pdfme/react/useSisadPdfmeConfig.ts
src/sisad-pdfme/react/useSisadPdfmeController.ts
src/sisad-pdfme/react/index.ts
```

Tareas:

```txt
[ ] Provider resuelve config, adapters, runtimeOptions y designerEngine.
[ ] SisadPdfmeDesigner envuelve Designer actual.
[ ] SisadPdfmeForm envuelve Form actual.
[ ] SisadPdfmeViewer envuelve Viewer actual.
[ ] Mantener compatibilidad con props legacy.
[ ] El host no abre manualmente SchemaAssignmentDialog.
[ ] El host no importa RightSidebar/ListView/Canvas.
```

Criterios:

```txt
<SisadPdfmeDesigner template={template} documents={documents} />
funciona sin config.
```

---

### Fase 4 — Reasignación responsable autoconfigurable

**Agente responsable:** `interaction-agent`  
**Subagentes:** `canvas-agent`, `inspector-agent`, `regression-tester`

Tareas:

```txt
[ ] Mover orquestación de SchemaAssignmentDialog al wrapper público.
[ ] Activar botón por config.assignment.enabled.
[ ] Reasignar desde selección simple o múltiple.
[ ] Preservar locked/readOnly/objectLocked/collaborationLock.
[ ] Actualizar ownerRecipientId, recipientId, ownerColor, recipientColor, userColor.
[ ] Emitir onAssignmentChange.
[ ] Resetear interacción transitoria al cerrar modal.
[ ] No borrar selección al cancelar.
```

Pruebas:

```txt
[ ] Abrir modal con 1 schema.
[ ] Abrir modal con N schemas.
[ ] Cancelar y seguir seleccionando.
[ ] Confirmar y actualizar owner/color.
[ ] Reasignar no cambia lock/readOnly.
```

---

### Fase 5 — Interacción canvas/sidebar/modal centralizada

**Agente responsable:** `interaction-agent`  
**Subagentes:** `canvas-agent`, `moveable-selecto-skill`, `regression-tester`

Tareas:

```txt
[ ] Crear/usar DesignerInteractionController.
[ ] Centralizar modos: idle, selecting, regionSelecting, draggingSchema, resizingSchema, modalOpen, editingField.
[ ] Garantizar que modales/toolbars/dropdowns usan data-interaction-exclusion.
[ ] Reemplazar decisiones sueltas por selectionPolicy.
[ ] Cmd en Mac y Ctrl en Windows/Linux para selección aditiva.
[ ] Shift no debe romper resize/keepRatio.
[ ] Click vacío limpia selección si no hay modal.
```

Pruebas:

```txt
[ ] Cancelar modal no rompe selección.
[ ] Doble click en Reasignar no abre dos veces.
[ ] Modal no dispara Selecto debajo.
[ ] Toolbar contextual no inicia drag.
```

---

### Fase 6 — Schema registry, DetailView e inspector por contrato

**Agente responsable:** `inspector-agent`  
**Subagentes:** `schema-agent`, `option-groups-skill`, `anti-hallucination-reviewer`

Tareas:

```txt
[ ] Consolidar InspectorWidgetContract.
[ ] Cada widget visible tiene read/write/visibleWhen/disabledWhen/validate.
[ ] Cada schema define inspector profile.
[ ] Firma muestra provider solo cuando signatureMode === provider.
[ ] Capacidades de firma son derivadas o avanzadas.
[ ] Opciones select/radio/checkboxGroup usan editor común.
[ ] Ubicación/tamaño no corta inputs.
[ ] Formato muestra solo controles aplicables.
```

Criterio:

```txt
No existe control visible sin persistencia real.
```

---

### Fase 7 — Documentos, snapshot y runtime portable

**Agente responsable:** `snapshot-agent`  
**Subagentes:** `designer-runtime-agent`, `schema-agent`

Tareas:

```txt
[ ] DocumentsAdapter soporta single/multi.
[ ] Preservar documentId/fileId/pageNumber/pageIndex.
[ ] Snapshot incluye template, docs, recipients, active document y config version.
[ ] Restore snapshot no pierde owner/colors/groups/options.
[ ] Form runtime filtra campos por activeRecipient si config lo pide.
[ ] Viewer readonly no carga sidebars ni Moveable/Selecto.
```

Pruebas:

```txt
[ ] Snapshot roundtrip.
[ ] Multi-document routing.
[ ] Form con activeRecipient.
[ ] Viewer readonly.
```

---

### Fase 8 — Firma y providers genéricos

**Agente responsable:** `schema-agent`  
**Subagentes:** `api-contract-agent`, `inspector-agent`

Tareas:

```txt
[ ] Mover providers a config.signatures.providers.
[ ] El core no llama APIs reales de firma.
[ ] Provider externo se solicita por evento/adaptador.
[ ] Modes: draw, image, p12, provider.
[ ] DetailView cambia campos visibles por mode.
[ ] Validar signature schema antes de export/save.
```

Criterio:

```txt
Cualquier host registra sus proveedores sin tocar schemas/signature internals.
```

---

### Fase 9 — CSS, Tailwind y aislamiento visual

**Agente responsable:** `css-tailwind-agent`  
**Subagentes:** `css-auditor`, `legacy-css-guardian`, `visual-baseline-critic`

Tareas:

```txt
[ ] Mantener único entrypoint src/sisad-pdfme/ui/styles/sisad-pdfme.css.
[ ] Mantener tokens.css separado.
[ ] Prohibir doble emisión de Tailwind.
[ ] No tocar Moveable/Selecto/geometría/zoom con migración agresiva.
[ ] Permitir className Tailwind en wrappers públicos.
[ ] Crear smoke test visual de Designer/Form/Viewer.
```

Criterios:

```txt
El host solo importa sisad-pdfme.css.
No hay dependencia del CSS global del host.
```

---

### Fase 10 — Documentación, task-cards y ejemplos

**Agente responsable:** `docs-architecture-agent`  
**Subagentes:** `code-docs-writer`, `prompt-engineer`, `memory-curator`

Crear documentación:

```txt
docs/07-integraciones/05-global-config.md
docs/07-integraciones/06-host-adapters.md
docs/13-ejemplos/04-basic-host-config.md
docs/13-ejemplos/05-host-with-recipients.md
docs/13-ejemplos/06-host-multi-document.md
docs/13-ejemplos/07-form-viewer-host.md
docs/08-api-reference/06-global-config-api.md
docs/12-troubleshooting/05-integration-portability.md
```

Crear task-cards:

```txt
ai/task-cards/active/TASK-PORT-001-global-config.md
ai/task-cards/active/TASK-PORT-002-adapters.md
ai/task-cards/active/TASK-PORT-003-react-wrappers.md
ai/task-cards/active/TASK-ASSIGN-001-reassignment-autoconfig.md
ai/task-cards/active/TASK-INTERACTION-001-modal-lifecycle.md
ai/task-cards/active/TASK-SCHEMA-002-inspector-contract.md
ai/task-cards/active/TASK-SNAPSHOT-002-portable-runtime.md
ai/task-cards/active/TASK-CSS-002-portable-entrypoint.md
```

---

## 6. Orquestación por agentes paralelos

### Oleada A — Contratos y frontera

Puede ejecutarse en paralelo:

```txt
Agent A1 — Boundary Auditor
  Produce reports/portability-boundary-audit.md.

Agent A2 — Config Architect
  Crea config types, defaults y resolver.

Agent A3 — Adapter Architect
  Crea adapters genéricos.

Agent A4 — Docs Architect
  Crea docs y task-cards base.
```

Bloqueos: A2 y A3 no deben editar Designer internals todavía.

### Oleada B — Wrappers y runtime

```txt
Agent B1 — React Public API
  Crea Provider/Designer/Form/Viewer públicos.

Agent B2 — Runtime Mapper
  Conecta config a runtimeOptions y DesignerEngine.

Agent B3 — Assignment Flow
  Mueve reasignación al wrapper público.

Agent B4 — Event Hub
  Centraliza onReady/onSave/onError/onAssignmentChange.
```

Bloqueos: B3 depende de A2/A3; B1 depende de A2.

### Oleada C — Interacción y schema behavior

```txt
Agent C1 — Interaction Controller
  Modal lifecycle, selectionPolicy, transient reset.

Agent C2 — Inspector Contracts
  Widget contract, visibility, signature mode, options.

Agent C3 — Snapshot Runtime
  Snapshot roundtrip, multi-document, form/viewer.

Agent C4 — Visual/CSS
  Entry CSS único y baseline.
```

Bloqueos: C1 debe coordinar con B3; C2 coordina con B2.

### Oleada D — Validación y release

```txt
Agent D1 — Regression Tester
  Playwright/Vitest.

Agent D2 — Anti-Hallucination Reviewer
  Verifica que no se inventaron APIs.

Agent D3 — Boundary Reviewer
  Verifica que no hay host imports.

Agent D4 — Documentation Finalizer
  Actualiza README, ejemplos y troubleshooting.
```

---

## 7. Prompts por agente

### Prompt maestro

```txt
Actúa como arquitecto frontend senior. El objetivo es convertir src/sisad-pdfme en una librería portable, aislada y configurable para React/Vite.

Reglas:
- src/sisad-pdfme no conoce ningún host concreto.
- Prohibido importar desde src/features, src/modules, APIs de host, rutas privadas o lógica de negocio externa.
- Mantener compatibilidad con Designer/Form/Viewer existentes.
- No modificar pdf-lib/generator salvo exports públicos necesarios.
- No modificar Moveable/Selecto ni geometría crítica salvo tarea explícita.
- Usar src/sisad-pdfme/ui/styles/sisad-pdfme.css como único entrypoint visual.
- Crear cambios pequeños, testeables y documentados.
```

### Prompt para Config Architect

```txt
Tarea:
Crear la capa src/sisad-pdfme/config con SisadPdfmeGlobalConfig, defaults, resolver y createSisadPdfmeConfig.

Debes mapear config hacia runtimeOptions y DesignerEngine sin cambiar internals pesados.

Archivos permitidos:
- src/sisad-pdfme/config/**
- src/sisad-pdfme/integration/index.ts
- tests unitarios nuevos

No tocar Canvas, Moveable, Selecto, generator, pdf-lib.
```

### Prompt para Adapter Architect

```txt
Tarea:
Crear adapters genéricos para recipients, documents, persistence, signatures, permissions y events.

Los adapters solo declaran contratos y helpers puros. No deben llamar APIs reales.

Archivos permitidos:
- src/sisad-pdfme/adapters/**
- src/sisad-pdfme/integration/index.ts
- docs/07-integraciones/06-host-adapters.md
```

### Prompt para Assignment Flow

```txt
Tarea:
Hacer que la reasignación de responsable funcione con config.assignment.enabled y recipients genéricos, sin que el host importe SchemaAssignmentDialog.

Reglas:
- Reasignar no cambia locked/readOnly/objectLocked/collaborationLock.
- Cancelar modal conserva selección y limpia estado transitorio.
- Confirmar emite onAssignmentChange.
- Doble click no abre dos modales.

Archivos probables:
- src/sisad-pdfme/react/SisadPdfmeDesigner.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SchemaAssignmentDialog.tsx
- src/sisad-pdfme/ui/components/Designer/shared/schemaAssignmentService.ts
- src/sisad-pdfme/ui/components/Designer/shared/designerInteractionReset.ts
```

### Prompt para Interaction Controller

```txt
Tarea:
Centralizar lifecycle de interacción canvas/sidebar/modal.

Reglas:
- Modal abierto suspende Selecto/Moveable/shortcuts.
- Modal cerrado restablece interacción transitoria sin borrar selección.
- Cmd/Ctrl click agrega/quita selección según plataforma.
- Shift no reemplaza al policy de selección.

Archivos probables:
- src/sisad-pdfme/ui/components/Designer/shared/interactionState.ts
- src/sisad-pdfme/ui/components/Designer/shared/interactionExclusions.ts
- src/sisad-pdfme/ui/components/Designer/shared/selectionPolicy.ts
- src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx
- src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx
```

---

## 8. Tests obligatorios

### Unitarios

```txt
[ ] createSisadPdfmeConfig merges defaults.
[ ] resolve config to DesignerEngine.
[ ] recipientsAdapter maps host users.
[ ] documentsAdapter maps host docs.
[ ] assignment preserves lock/readOnly.
[ ] signature providers from config.
```

### Playwright

```txt
[ ] Designer sin config renderiza.
[ ] Designer con recipients muestra Reasignar al seleccionar.
[ ] Reasignar abre modal interno.
[ ] Cancelar modal no rompe selección.
[ ] Confirmar cambia owner/color.
[ ] Multi-document mantiene documentId/pageNumber.
[ ] Form no muestra Moveable/Selecto.
[ ] Viewer readonly no muestra sidebars.
```

### Boundary tests

```bash
rg "DigitalAgreements|StepOne|StepTwo|Uanataca|Workflow|Documentary|axiosClient|src/features|src/modules" src/sisad-pdfme && exit 1 || exit 0
```

---

## 9. Criterios de aceptación finales

```txt
[ ] src/sisad-pdfme se puede copiar a otro React/Vite project.
[ ] Solo se importa sisad-pdfme.css.
[ ] Designer funciona sin config.
[ ] Designer funciona con config mínima.
[ ] Reasignar funciona con config + recipients sin código custom.
[ ] Form y Viewer funcionan sin Designer.
[ ] El host no importa internals.
[ ] No hay imports hacia host.
[ ] Signature providers se registran por config.
[ ] Schemas custom se registran por config/registry.
[ ] Snapshot roundtrip preserva metadata crítica.
[ ] Multi-document preserva documentId/fileId/pageNumber.
[ ] Cancelar modal no rompe canvas.
[ ] Tests unitarios y Playwright pasan.
```

---

## 10. Entrega esperada

1. Código:
   - `src/sisad-pdfme/config/**`
   - `src/sisad-pdfme/adapters/**`
   - `src/sisad-pdfme/react/**`
   - exports en `src/sisad-pdfme/integration/index.ts`

2. Docs:
   - integración por configuración global;
   - adapters de host;
   - ejemplos básicos;
   - troubleshooting de portabilidad.

3. QA:
   - reportes de frontera;
   - pruebas unitarias;
   - pruebas e2e;
   - baseline visual.

