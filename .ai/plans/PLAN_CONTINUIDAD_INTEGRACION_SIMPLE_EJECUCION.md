# Plan de continuidad — Orden de ejecución, gates y aceptación

Parte 3 de [PLAN_CONTINUIDAD_INTEGRACION_SIMPLE_SISAD_PDFME.md](./PLAN_CONTINUIDAD_INTEGRACION_SIMPLE_SISAD_PDFME.md).
# 6. Orden de ejecución recomendado

## Wave 1 — Contrato de consumo final

### PORT-001 — Instancia registrada

Crear:

```text
src/sisad-pdfme/integration/defineSisadPdfmeInstance.ts
```

Agregar prop `instance` a `SisadPdfmeInstance`.

### PORT-002 — Entry point raíz

Crear:

```text
src/sisad-pdfme/index.ts
```

Eliminar imports profundos de .

### PORT-003 — Estabilidad de configuración

Evitar reconstruir ConfigService, engine, EventHub y adapters por render.

Criterio:

```text
rerender del host
→ mismo ConfigService
→ mismo engine
→ mismo EventHub
→ misma selección
→ mismo zoom
```

### PORT-004 — Semántica de estado

Formalizar:

```text
state
defaultState
id/revision
onStateChange
reset
```

---

## Wave 2 — Default completo y paridad funcional

### PORT-005 — Defaults funcionales completos

Habilitar capacidades built-in por defecto.

Mantener side effects externos condicionados por adapters.

### PORT-006 — Multidocumento uniforme

Cerrar Designer/Form/Viewer.

### PORT-007 — Active recipient y global view

Resolver IDs válidos y permisos.

### PORT-008 — Action/capability states

Usar:

```text
enabled
visible
available
executable
reason
```

Corregir Reasignar:

```text
assignableRecipientCount > 1
```

No `> 2`.

---

## Wave 3 — Migración de 

Orden:

```text
Viewer
Form
SchemaFamily
DesignerSingleUser
DesignerMultiUser
```

Eliminar después:

```text
useRuntimeConfig
useController
builders duplicados
normalización residual
callbacks runtime repetidos
```

No eliminar `EventLog` ni UI de diagnóstico.

---

## Wave 4 — Portabilidad real

### PORT-009 — Estilos autocontenidos

Actualmente el CSS principal está vacío y gran parte del diseño depende de Tailwind compilado por el host.

Para copiar y pegar sin modificar Tailwind del host se necesita:

```text
dist/sisad-pdfme.css
```

precompilado, namespaced y cargado desde el entrypoint.

Los tokens deben quedar bajo el root del componente cuando sea posible.

### PORT-010 — Package/manifest

Entregar junto al componente:

```text
package.json o manifest de dependencias
exports públicos
CSS compilado
README de 5 minutos
consumer test
script de validación
```

### PORT-011 — Consumer test externo

Crear una app mínima de prueba que solo haga:

```tsx
<SisadPdfmeInstance instance={instance} />
```

No debe importar internals ni añadir CSS del core manualmente.

---

## Wave 5 — Bundle y snapshot

### PORT-012 — Bundle serializable seguro

Excluir:

```text
adapters
handlers
plugins con funciones
config resuelta con engine
eventHub
controllers
binary object URLs
```

### PORT-013 — Workspace snapshot

Reutilizar el snapshot oficial ya existente.

### PORT-014 — Package portable

Unir:

```text
definition
data
snapshot
assets
manifest
version
checksums
```

---

# 7. Gates obligatorios

```bash
npm run typecheck
npm run build
npm run lint
npm run test:unit
npx vitest run tests/unit/sisad-pdfme/integration
npx playwright test tests/e2e/-layout.spec.ts
npm run quality:direct-config-readers
npm run quality:-style-boundary
npm run quality:source-language-boundary
```

Agregar pruebas:

```text
registered instance renders
rerender does not replace engine
changing instance id resets internal state
changing revision resets internal state
same id preserves internal state
full defaults expose all built-in features
missing adapter returns reason
Viewer declarative
Form declarative
Designer declarative
multi-document Form/Viewer
recipe duplicate IDs
unknown schema type
bundle with plugin function
bundle snapshot round-trip
copy-paste consumer build
```

---

# 8. Prompt para Codex

```text
Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, Tailwind, pdfme y diseño de librerías portables.

Proyecto:
~/Documents/Taylor/frontend/prueba-plugin

Objetivo:
Cerrar la integración declarativa de src/sisad-pdfme para que un host solo registre:
1. datos,
2. configuración,
3. instancia.

La página final debe montar:
<SisadPdfmeInstance instance={registeredInstance} />

Estado actual:
- Existe SisadPdfmeInstance.
- Existe estado interno por campo.
- Existe state/defaultState.
- Existen activeDocumentId, plugins y signatureProviders.
- Existe validación básica.
- Existe bundle JSON.
- Los  aún usan wrappers bajos y orquestación propia.
- defaultSisadPdfmeConfig todavía deshabilita varias funciones.
- resolveSisadPdfmeConfig crea engine/EventHub/adapters.
- La instancia puede recrear config por render.

Prioridades:
P0:
1. Crear defineSisadPdfmeInstance.
2. Agregar soporte instance={...} a SisadPdfmeInstance.
3. Crear src/sisad-pdfme/index.ts.
4. Evitar reconstruir ConfigService/DesignerEngine/EventHub en rerenders.
5. Formalizar id/revision/reset/onStateChange.
6. Habilitar por defecto todas las capacidades built-in seguras.
7. Mantener side effects externos condicionados por adapters.
8. Migrar primero RuntimeViewerPage y RuntimeFormPage.

Contrato de archivos del host:
data/*.data.ts
config/*.config.ts
instances/*.instance.ts
handlers/*.handlers.ts

Reglas estrictas:
- No importar internals desde .
- No mover lógica de negocio del host al core.
- No crear otro sistema de configuración.
- Reutilizar SisadPdfmeConfigService.
- No crear otro snapshot.
- No crear otro event bus.
- No crear otro RecipientRegistry.
- No tocar Moveable/Selecto en esta tarea.
- No tocar geometría del canvas.
- No usar setTimeout.
- No resolver con z-index.
- No añadir nombres “canonical”, “legacy” o “manager” salvo compatibilidad técnica existente.
- Usar nombres directos: instance, data, config, state, defaultState, resources, handlers.
- No borrar APIs bajas Designer/Form/Viewer.
- Mantener compatibilidad con definition/resources/handlers.
- Máximo 8 archivos abiertos inicialmente.
- Máximo 6 archivos modificados por task-card.
- Máximo 2 rondas de búsqueda sin nueva evidencia.
- Si el alcance crece, detenerse y crear una nueva task-card.

Semántica de defaults:
- Canvas, sidebars, schemas built-in, recipients, collaboration, assignment,
  documents, signatures, comments, custom fields, favorites y recent deben
  estar habilitados por defecto.
- Debug permanece apagado.
- Autosave remoto, providers externos y persistencia host solo son ejecutables
  cuando exista adapter/handler.
- Una función habilitada sin recursos debe quedar disabled con reason, no fallar
  ni ejecutar un no-op silencioso.

Primera task-card:
PORT-001 — Instancia registrada y estabilidad de recursos.

Archivos foco:
src/sisad-pdfme/integration/SisadPdfmeInstance.tsx
src/sisad-pdfme/integration/resolveSisadPdfmeInstance.ts
src/sisad-pdfme/integration/index.ts
src/sisad-pdfme/integration/defineSisadPdfmeInstance.ts
src/sisad-pdfme/index.ts
tests/unit/sisad-pdfme/integration/SisadPdfmeInstance.test.ts

Criterios:
- defineSisadPdfmeInstance devuelve un objeto estable y tipado.
- SisadPdfmeInstance acepta instance.
- La API anterior continúa funcionando.
- Rerender con la misma instancia conserva ConfigService, engine y EventHub.
- Cambio de instance.id reinicia internal state.
- Cambio de revision reinicia internal state.
- Mismo id/revision conserva template, inputs y documents internos.
- No se recrea engine por cambios de inputs o activeRecipientId.
- Pruebas focales y typecheck pasan.

Después de PORT-001:
- detenerse;
- reportar archivos;
- reportar pruebas;
- reportar riesgos;
- no iniciar PORT-002 automáticamente.
```

---

# 9. Criterio final de aceptación

La integración estará lista cuando un proyecto nuevo pueda hacer esto:

```text
copiar paquete/carpeta
instalar dependencias
registrar data
registrar config
registrar instance
renderizar componente
```

y no necesite:

```text
crear RecipientRegistry
crear DesignerEngine
crear EventHub
normalizar documentos manualmente
normalizar recipients manualmente
construir collaborationContext
abrir modales internos
gestionar sidebars
gestionar selección
gestionar controller
importar CSS interno manualmente
modificar Tailwind content
importar rutas profundas
```

La demostración final debe ser una app consumidora mínima y los  migrados a la misma API que usará cualquier proyecto real.

---

> Este plan se partió en tres por presupuesto de contexto: 1113 líneas no
> caben en el máximo que exige `.ai/CONTEXT-BUDGET.md`. El contenido no se
> tocó; sólo se cortó en fronteras de sección de nivel 1.
>
> - Estado, veredicto y bloqueantes: [PLAN_CONTINUIDAD_INTEGRACION_SIMPLE_SISAD_PDFME.md](./PLAN_CONTINUIDAD_INTEGRACION_SIMPLE_SISAD_PDFME.md)
> - Problemas funcionales y arquitectura objetivo: [PLAN_CONTINUIDAD_INTEGRACION_SIMPLE_PROBLEMAS.md](./PLAN_CONTINUIDAD_INTEGRACION_SIMPLE_PROBLEMAS.md)
