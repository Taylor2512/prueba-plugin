# SISAD PDFME — README integral y acumulativo

> **Repositorio objetivo:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin`
>
> **Ruta funcional de referencia:** `http://localhost:5174/lab/multi-document-routing`
>
> Este documento es la entrada general del proyecto. Integra producto, arquitectura,
> componentes, contratos, asistentes IA, memoria, Scrum, calidad y workstreams.
>
> **Este README no pertenece únicamente al saneamiento de nombres ni a una entrega
> concreta. Ningún paquete parcial debe sustituirlo por un README reducido.**

---

## 1. Regla de conservación documental

La documentación del proyecto es acumulativa.

### 1.1 Responsabilidad de cada README

| Archivo | Responsabilidad |
|---|---|
| `README.md` | Visión integral y punto de entrada del repositorio. |
| `README-AI-ARCHITECTURE-V7.md` | Arquitectura de asistentes IA. |
| `README-COREUX.md` | Programa de UX, eventos, efectos y comportamiento del core. |
| `README-DECLARATIVE-INSTANCES.md` | Instancias declarativas y ejemplos basados en definición. |
| `README-MANUAL-PORTABILIDAD.md` | Portabilidad y frontera host/core. |
| `README-EJEMPLOS-UX-UI.md` | UX/UI de laboratorios y ejemplos. |
| `README-RESTORE-SISAD-PDFME.md` | Restauración de capacidades eliminadas o degradadas. |
| `README-DEDUP-*.md` | Olas y evidencia de reducción de duplicidad. |
| `README-PAQUETE-TAILWIND.md` | Migración y reglas Tailwind. |
| `README-SANEAMIENTO-NOMENCLATURA.md` | Saneamiento de nombres y compatibilidad versionada. |
| `README_ENTREGA.md` | Resumen de una entrega concreta, nunca reemplazo del README raíz. |

### 1.2 Regla para paquetes ZIP

Un paquete parcial debe:

1. fusionarse con la estructura existente;
2. añadir su README especializado;
3. actualizar este README solo mediante una sección acumulativa;
4. preservar `SPRINT-CURRENT.md`, memoria, decisiones y task-cards existentes;
5. no eliminar archivos por ausencia dentro del ZIP;
6. no reemplazar documentación raíz por una explicación de 10 o 20 líneas;
7. registrar archivos agregados o modificados en un manifest.

### 1.3 Fuentes operativas

```text
README.md
→ visión general

AGENTS.md
→ reglas obligatorias del repositorio

.ai/START.md
→ entrada operativa para agentes

.ai/scrum/SPRINT-CURRENT.md
→ estado de ejecución

.ai/scrum/CLAIMS.md
→ propietario, lease y worktree

.ai/memory/HANDOFF.md
→ continuidad inmediata

.ai/memory/DECISIONS.md
→ decisiones durables

task-card
→ alcance concreto
```

Los reportes históricos, diffs consolidados y backups sirven como evidencia, pero
no son autoridad operativa.

---

## 2. Qué es SISAD PDFME

SISAD PDFME es un componente frontend reutilizable para diseñar, completar,
visualizar y generar documentos PDF interactivos.

Capacidades principales:

- Designer visual;
- Form interactivo;
- Viewer de solo lectura;
- Generator de PDF;
- uno o varios documentos;
- múltiples páginas;
- plugins de schemas;
- destinatarios y asignaciones;
- ownership y color por destinatario;
- selección simple, múltiple y regional;
- drag, resize y rotate;
- copiar, pegar, duplicar y eliminar;
- reglas, guías, snap lines y zoom;
- catálogo de campos;
- lista de campos;
- inspector de propiedades;
- documentos y comentarios;
- colaboración y locks;
- snapshots versionados;
- persistencia mediante adapters;
- firma manual o mediante provider;
- configuración global y dinámica;
- eventos internos y callbacks del host;
- integración declarativa;
- ejemplos y laboratorios;
- responsive, accesibilidad y touch;
- pruebas unitarias, integración y Playwright.

El componente se desarrolla dentro de `prueba-plugin`, pero debe mantenerse
portable y desacoplado de una aplicación host concreta.

---

## 3. Frontera absoluta entre core y host

```text
Aplicación host
  ├── datos de negocio
  ├── endpoints
  ├── navegación
  ├── autenticación
  ├── persistencia remota
  ├── permisos
  ├── callbacks
  └── adapters
          │
          ▼
API pública SISAD PDFME
          │
          ▼
Designer / Form / Viewer / Generator / Snapshot
```

### 3.1 El core puede conocer

- documentos;
- páginas;
- schemas;
- recipients genéricos;
- assignments;
- permisos normalizados;
- providers mediante contratos;
- snapshots;
- eventos;
- configuración;
- plugins;
- callbacks genéricos.

### 3.2 El core no puede conocer

- `DigitalAgreements`;
- `ContentCustomForm`;
- `StepOne` o `StepTwo`;
- endpoints SISAD;
- nombres de workflows del host;
- Uanataca como dependencia directa del core;
- rutas privadas de una aplicación;
- stores del host;
- componentes visuales del host;
- reglas de negocio de ExternalForms;
- clientes HTTP específicos.

### 3.3 Regla de imports

```text
host → importa SISAD PDFME
SISAD PDFME → no importa host
```

Las integraciones específicas viven fuera del core o entran mediante adapters.

---

## 4. Stack y entorno

Tecnologías principales observadas en el proyecto:

```text
React
TypeScript
JavaScript
Vite
Tailwind CSS v3
Ant Design
Vitest
Playwright
pdf-lib fork/vendorizado
PDF.js
Moveable
Selecto
```

El proyecto conserva JavaScript y JSX en zonas existentes, pero las APIs nuevas
del core deben priorizar TypeScript y contratos explícitos.

### 4.1 Reglas del stack

- no introducir `any` para acelerar refactors;
- no duplicar utilidades entre JS y TS;
- no crear un segundo runtime para ejemplos;
- no mezclar CSS de host con internals del Designer;
- no cargar Tailwind dos veces;
- no usar hacks de `z-index` para esconder fallos de arquitectura;
- no utilizar `setTimeout` para estabilizar geometría o coordinación;
- no depender de efectos laterales de imports internos para montar la API pública.

---

## 5. Estructura general del repositorio

```text
prueba-plugin/
├── src/
│   ├── App.jsx
│   ├── examples/
│   ├── features/
│   └── sisad-pdfme/
│       ├── adapters/
│       ├── assignments/
│       ├── browser/
│       ├── canvas/
│       ├── collaboration/
│       ├── commands/
│       ├── comments/
│       ├── common/
│       ├── config/
│       ├── context/
│       ├── contracts/
│       ├── converter/
│       ├── devtools/
│       ├── documents/
│       ├── editor/
│       ├── externalForms/
│       ├── generator/
│       ├── integration/
│       ├── labs/
│       ├── react/
│       ├── runtime/
│       ├── schemas/
│       ├── shared/
│       └── ui/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── playwright/
├── docs/
├── .ai/
├── .agents/
├── .codex/
├── .claude/
├── .github/
├── configs/
├── scripts/
├── reports/
├── vendors/
├── AGENTS.md
├── CLAUDE.md
├── CODEX.md
└── README.md
```

### 5.1 Estructuras que no deben duplicarse

No crear carpetas paralelas como:

```text
ai-new/
ai-v8-copy/
docs-new/
src/sisad-pdfme-v2/
src/new-pdfme/
tasks-copy/
memory-final/
```

La evolución se realiza dentro de las carpetas existentes, con migraciones,
manifests y task-cards.

---

## 6. Flujo de datos del componente

```text
Host data
→ adapters
→ normalizeHostData
→ config resolver
→ recipient/document/plugin registries
→ runtime controller
→ Designer | Form | Viewer
→ domain events
→ host callback adapter
→ snapshot
→ persistence adapter
→ host
```

### 6.1 Flujo de un schema

```text
plugin registrado
→ factory/defaults
→ schema creado
→ documentId + pageNumber
→ ownership
→ Canvas renderer
→ ListView
→ DetailView
→ Form/Viewer
→ Generator
→ snapshot
```

Todas las superficies deben leer el mismo contrato. No es válido que Canvas,
ListView, DetailView y Generator infieran estados diferentes.

---

## 7. API pública

### 7.1 Wrappers React

Superficies públicas esperadas:

```text
SisadPdfmeProvider
SisadPdfmeDesigner
SisadPdfmeForm
SisadPdfmeViewer
SisadPdfmeInstance
useSisadPdfmeConfig
useSisadPdfmeController
```

Uso conceptual:

```tsx
<SisadPdfmeDesigner
  config={config}
  template={template}
  documents={documents}
  recipients={recipients}
  onTemplateChange={setTemplate}
  onSave={handleSave}
/>
```

### 7.2 Reglas de los wrappers

- no exigir que el host construya el engine;
- no exigir imports profundos;
- resolver recipients una sola vez;
- cargar estilos base de forma controlada;
- aceptar `className` y `style` de forma aditiva;
- ocupar `h-full min-h-0 w-full min-w-0`;
- no fijar el viewport del host;
- no crear sidebars externos;
- no abrir manualmente modales internos desde el host;
- no duplicar callbacks en varias capas.

### 7.3 Compatibilidad de exports

Un cambio de nombre público requiere:

- inventario de consumidores;
- alias temporal cuando corresponda;
- etiqueta `@deprecated`;
- guía de migración;
- test de paridad;
- versión de retiro;
- cambio mayor cuando sea incompatible.

---

## 8. Configuración global unificada

`src/sisad-pdfme/config` debe ser la única capa que resuelva configuración.

Áreas:

```text
runtime
theme
canvas
sidebars
schemas
collaboration
assignment
documents
comments
signatures
persistence
events
visibility
debug
```

### 8.1 Flujo de resolución

```text
defaults
→ preset
→ aliases de entrada migrados
→ configuración actual del host
→ overrides runtime
→ permisos
→ contexto
→ configuración resuelta
```

### 8.2 Componentes relacionados

```text
SisadPdfmeConfig.ts
defaultSisadPdfmeConfig.ts
createSisadPdfmeConfig.ts
resolveSisadPdfmeConfig.ts
SisadPdfmeConfigService.ts
configMigration.ts
configValidation.ts
configSelectors.ts
configChangeImpact.ts
featureDependencies.ts
featureRegistry.ts
componentRegistry.ts
actionConfigRegistry.ts
schemaCapabilityResolver.ts
InspectorConfigurationResolver.ts
```

### 8.3 Reglas

- no leer config directamente desde múltiples componentes;
- no repetir condiciones de visibilidad;
- no copiar configuración dentro de schemas;
- no mantener dos rutas funcionales equivalentes;
- migrar aliases solo en el borde;
- distinguir hot update, rebuild y remount;
- exponer el motivo por el que una acción está deshabilitada.

### 8.4 Programa CONFIG

El plan de configuración contiene 20 task-cards.

Estado documentado al crear el paquete:

```text
CONFIG-001 → review
CONFIG-002 → Ready
CONFIG-003..020 → Backlog
```

El estado real siempre debe confirmarse en `SPRINT-CURRENT.md`.

---

## 9. Adapters, integración y portabilidad

### 9.1 Adapters principales

```text
documentsAdapter
recipientsAdapter
persistenceAdapter
signatureProviderAdapter
permissionsAdapter
eventsAdapter
```

### 9.2 Integration

Responsabilidades:

- normalizar datos del host;
- crear una fachada simple;
- exponer controller;
- preparar recursos;
- resolver eventos;
- crear bundles portables;
- evitar imports internos desde consumidores.

### 9.3 Criterio de portabilidad

Un proyecto externo debe poder integrar SISAD PDFME sin conocer:

```text
Canvas
Moveable
Selecto
RightSidebar
ListView
DetailView
SchemaAssignmentDialog
OptionsContext
designerUiConfig
visibilityConfig
schemaAssignmentService
DesignerEngineBuilder
```

### 9.4 Laboratorio como host de referencia

`src/examples` y el lab deben demostrar:

- API pública;
- montaje inmersivo;
- configuración;
- recipients;
- documentos;
- handlers;
- providers;
- snapshots;
- Form y Viewer.

No deben usar CSS para alcanzar internals del componente.

---

## 10. Instancias declarativas

Separación obligatoria:

```text
definition → JSON serializable
resources  → objetos no serializables
handlers   → callbacks
```

Ejemplo:

```tsx
<SisadPdfmeInstance
  definition={definition}
  resources={{
    templates: { contract: contractTemplate },
    plugins: customPlugins,
    signatureProviders,
  }}
  handlers={{
    onSave: saveTemplate,
    onError: reportError,
  }}
/>
```

### 10.1 Programa DECL

El paquete de instancias declarativas incluye:

- 36 task-cards;
- 66 casos de uso;
- ADR;
- mapa de migración;
- borrador de API;
- riesgos;
- route;
- playbook;
- skill;
- prompts;
- documentación.

Estado inicial documentado:

```text
DECL-001 → Ready
DECL-002..036 → Backlog
```

Confirmar el estado real antes de ejecutar.

---

## 11. Designer

El Designer orquesta:

```text
config
documents
pages
schemas
selection
Canvas
sidebars
overlays
commands
events
snapshot
```

Debe mantenerse como composición de módulos, no como componente monolítico.

### 11.1 Componentes principales

```text
Designer
├── LeftSidebar
├── Canvas
│   ├── Paper
│   ├── Renderer
│   ├── Moveable
│   ├── Selecto
│   ├── Guides
│   ├── SnapLines
│   ├── Mask
│   └── overlays
├── RightSidebar
│   ├── ListView
│   ├── DetailView
│   ├── DocumentsRail
│   └── CommentsRail
├── control bar
├── context menu
├── command system
└── modal/dialog layer
```

---

## 12. Canvas, Paper y coordenadas

### 12.1 Responsabilidad del Canvas

- renderizar páginas;
- seleccionar;
- transformar;
- hacer drop;
- navegar entre páginas;
- mostrar overlays;
- coordinar Moveable y Selecto;
- mantener scroll y zoom.

### 12.2 Invariantes de un schema

```text
schemaUid
documentId
pageNumber
x
y
width
height
rotation
ownerRecipientId
ownerRecipientIds
ownerColor
groupId
optionId
__designer
```

### 12.3 Reglas de geometría

- distinguir viewport, workspace, paper y PDF units;
- no usar la primera página como fallback silencioso;
- no alterar posiciones al abrir sidebars;
- preservar centro visual al colapsar paneles;
- no perder scroll, zoom o selección;
- no resolver drops con offsets arbitrarios;
- no usar `setTimeout`;
- no arreglar geometría mediante CSS;
- probar página 2 o superior;
- probar multidocumento;
- mantener una única fuente matemática.

### 12.4 Zonas protegidas

No tocar sin task-card explícita y pruebas de caracterización:

```text
Moveable.tsx
Selecto.tsx
designerCoordinateService.ts
coordinateMath.ts
schemaCollision.ts
smartPlacement.ts
snapshotAdapter.ts
generator/pdf-lib
```

Una tarea de UI, nombres o documentación no puede modificar estas áreas.

---

## 13. Selección, transformación y comandos

### 13.1 Conceptos separados

```text
seleccionado ≠ editable
seleccionado ≠ movible
seleccionado ≠ redimensionable
seleccionado ≠ eliminable
seleccionado ≠ propietario activo
```

### 13.2 Modelo de acceso efectivo

```ts
type SchemaAccessState = {
  selectable: boolean;
  inspectable: boolean;
  editable: boolean;
  movable: boolean;
  resizable: boolean;
  rotatable: boolean;
  deletable: boolean;
  duplicable: boolean;
  lockState: 'unlocked' | 'locked-by-me' | 'locked-by-other';
  readonlyState: 'editable' | 'readonly' | 'runtime-readonly';
  reason?: string;
};
```

Canvas, Moveable, ListView, toolbar, menú contextual y DetailView deben consumir
el mismo resultado.

### 13.3 Command pattern

Acciones recomendadas:

```text
select
select all
clear selection
move
resize
rotate
duplicate
delete
copy
paste
assign recipient
lock
unlock
add option
undo
redo
```

Las acciones no deben implementarse nuevamente en cada botón.

---

## 14. LeftSidebar

Responsabilidades:

- catálogo;
- búsqueda;
- familias;
- filtros;
- favoritos;
- recientes;
- campos custom;
- drag preview;
- layout;
- densidad.

Separar:

```text
CatalogLayout: list | tiles | icons
SidebarDensity: comfortable | compact | narrow
```

### 14.1 Reglas visuales

- una sola superficie por campo;
- no card dentro de card;
- tooltips controlados;
- objetivos de clic accesibles;
- categorías plegables;
- preview durante drag;
- no mover el scroll accidentalmente;
- no mostrar labels técnicos innecesarios;
- no cambiar el layout elegido por un resize.

---

## 15. RightSidebar

Modos:

```text
fields
detail
documents
comments
```

Reglas:

- un propietario de scroll por modo;
- expanded/collapsed consistente;
- rail persistente cuando aplique;
- Canvas y ListView sincronizados;
- acciones según access state;
- títulos y metadata sin duplicidad;
- context headers compactos;
- responsive docked/overlay sin remount del runtime.

### 15.1 ListView

Fila recomendada:

```text
[drag] [icon] nombre                    [estado]
              tipo · recipient · página
```

Debe soportar:

- localizar;
- renombrar;
- duplicar;
- reasignar;
- bloquear;
- eliminar;
- agrupar por página, recipient, tipo o documento.

### 15.2 DetailView

Taxonomía recomendada:

```text
information
content/options
fill rules
interaction
geometry
data connections
appearance
assignment and lock
comments
advanced
```

Cada widget declara:

```text
propertyPath
read
write
visibleWhen
disabledWhen
validate
layout
```

Reglas:

- el header resume;
- `required` vive en fill rules;
- `readOnly` vive en interaction;
- ownership y lock viven juntos;
- geometry usa máximo uno o dos decimales visuales;
- firma muestra provider solo si aplica;
- cada familia ve únicamente secciones pertinentes;
- no existe control visible sin persistencia real.

### 15.3 DocumentsRail

- documento activo;
- página activa;
- carga;
- eliminación;
- reordenamiento;
- routing;
- acciones autorizadas.

### 15.4 CommentsRail

- hilos;
- respuestas;
- resolver/reabrir;
- navegación a anchor;
- filtros;
- sincronización con overlay.

---

## 16. Schemas y plugins

### 16.1 Familias

```text
text-like
option-based
signing-based
action-based
media
codes
shapes
tables
custom
shared
```

### 16.2 Ejemplos

```text
text
number
date
checkbox
checkboxGroup
radioGroup
select
signature
initials
dateSigned
attachment
note
approve
decline
image
svg
qrcode
barcode
table
rectangle
line
ellipse
```

### 16.3 Contrato de cobertura

Cada schema debe cubrir cuando corresponda:

```text
Designer
DetailView
ListView
Form
Viewer
Generator/PDF
Snapshot round-trip
ownership/color
required/readOnly/lock
document/page routing
validation
accessibility
unit tests
Playwright
```

### 16.4 Factory + Registry

```text
type
→ registry
→ defaults
→ capabilities
→ renderer
→ inspector
→ runtime
→ PDF
```

Evitar `switch` gigantes, plugins duplicados y defaults diferentes por superficie.

---

## 17. Grupos de opciones

Contrato DOM:

```text
root del grupo → data-schema-id
opción interna → data-option-id
botón agregar  → data-role="group-add-option"
```

Reglas:

- las opciones internas no son schemas;
- el root es seleccionable;
- el botón `+` queda fuera de Moveable;
- el botón no entra en selección múltiple;
- Designer: click selecciona;
- Designer: doble click puede cambiar el valor;
- Form: click cambia el valor;
- Viewer/PDF: solo representación;
- checkboxGroup permite varias opciones;
- radioGroup permite una;
- el contenido interno no cambia de diseño por estar seleccionado;
- el chrome del editor es externo.

---

## 18. Firma

La familia de firma separa:

```text
signatureMode
providerKey
providerConfig
capabilities
display
status
metadata
```

Modos posibles dependen del contrato real del proyecto:

```text
draw
image
provider
p12
initials
dateSigned
```

Reglas:

- provider solo visible en modo provider;
- status de provider no aparece en modo draw;
- capabilities se derivan cuando sea posible;
- overrides manuales quedan en advanced;
- el schema no importa directamente Uanataca;
- los providers se registran mediante adapter.

---

## 19. Recipients, ownership y assignments

### 19.1 Recipient registry

Datos generales:

```text
id
label
role
email
color
enabled
assignment capability
metadata
```

Registrar una vez y proyectar donde se necesite.

### 19.2 Ownership

```text
ownerRecipientId
ownerRecipientIds
ownerMode
ownerColor
```

Reglas:

- schemas existentes conservan color;
- el recipient activo afecta nuevos schemas;
- reasignar usa un servicio;
- Canvas, ListView y DetailHeader coinciden;
- color semántico y owner color son conceptos diferentes.

### 19.3 Reasignar responsable

Visibilidad recomendada:

```text
0 recipients asignables   → oculto
1 recipient asignable     → oculto
2+ sin selección          → oculto
2+ con selección          → visible
2+ sin permiso            → visible deshabilitado con motivo
```

La reasignación debe preservar locks según la política configurada.

---

## 20. Colaboración

Providers nombrados por implementación:

```text
websocket
yjs
local
```

Responsabilidades:

- conexión;
- reconexión;
- publicación;
- recepción;
- locks;
- usuarios activos;
- eventos;
- teardown.

Las entradas históricas se migran en la frontera y el runtime usa un solo nombre.

---

## 21. Comentarios

Scopes:

```text
document
page
schema
```

Contrato:

```text
id
scope
fileId
pageNumber
schemaUid
author
text
resolved
anchor
replies
```

Reglas:

- operaciones inmutables;
- una representación runtime;
- compatibilidad anterior solo en migración;
- attach y detach reales;
- mover anchor conserva metadata;
- no inflar contadores;
- CommentsRail y CommentsOverlay comparten estado.

---

## 22. Snapshot, migración y persistencia

### 22.1 Datos preservados

```text
version
documents
pages
schemas
recipients
assignments
ownership
colors
comments
anchors
locks
configuration
signature
connectivity
values
project metadata
```

### 22.2 Versionado

Nombrar por versión:

```text
SnapshotV1
SchemaPageArrayV1
DesignerMetaV2
isPreV2Snapshot
migrateV1ToV2
migrateDesignerMetaToV3
```

Evitar nombres que solo indiquen “antiguo” o “nuevo”.

### 22.3 Persistencia

```text
runtime
→ snapshot actual
→ persistence adapter
→ host
```

Carga:

```text
host data
→ parse
→ migrate
→ validate
→ runtime
```

---

## 23. Form, Viewer, Preview y Generator

### 23.1 Base compartida

El runtime de preview relaciona:

```text
AppContextProvider
CtlBar
Preview
Paper
Renderer
StaticSchema
usePreviewRuntime
```

### 23.2 Form

- captura inputs;
- respeta permisos y required;
- filtra por recipient cuando aplica;
- usa plugins compartidos;
- emite eventos;
- expone Form JSON si el contrato lo requiere.

### 23.3 Viewer

- no edita;
- representa valores;
- respeta routing;
- no monta controles interactivos.

### 23.4 Generator

- usa template y values;
- no imprime chrome del Designer;
- preserva páginas y documentos;
- consume plugins PDF;
- no depende de la UI;
- requiere pruebas cuando cambian schemas o snapshot.

---

## 24. Eventos y efectos

Arquitectura:

```text
UI intent
→ command
→ domain event
→ reducer/service/effect
→ state update
→ host callback adapter
```

Distinguir:

- evento interno serializable;
- efecto;
- callback del host;
- diagnóstico;
- telemetría.

Los callbacks públicos `onX` no son una arquitectura paralela: son la salida de
un adapter.

### 24.1 Programa COREUX

El paquete COREUX documentó:

- 56 task-cards;
- 150 casos de uso;
- 45 eventos propuestos;
- arquitectura de efectos;
- matriz de patrones;
- gap analysis;
- riesgos;
- auditoría visual;
- ADRs.

El estado real se determina por Scrum, no por el README del paquete.

---

## 25. CSS, Tailwind y aislamiento visual

### 25.1 Regla Tailwind-first

Usar Tailwind en JSX/TSX para:

- layout;
- spacing;
- tipografía;
- colores;
- estados;
- responsive;
- componentes de aplicación.

Conservar CSS técnico cuando sea necesario para:

- variables/tokens;
- internals de librerías;
- geometría que no puede expresarse estáticamente;
- pseudo-elementos complejos;
- impresión;
- PDF;
- Moveable/Selecto;
- contenido generado.

### 25.2 Archivos activos observados

```text
src/styles/tailwind.css
src/style.css
src/styles/sisad-tailwind-bridge.css
src/sisad-pdfme/ui/styles/tokens.css
src/sisad-pdfme/ui/styles/sisad-pdfme.css
```

Los archivos bajo `.tailwind-migration-backups/**` son evidencia y no fuente activa.

### 25.3 Reglas

- Tailwind se importa una vez;
- preflight se mantiene según decisión del runtime;
- el host no apunta a `.sisad-pdfme-*`;
- ejemplos no apuntan a `.moveable-*` o `.selecto-*`;
- no usar `!important` para vencer el core;
- no duplicar tokens en CSS y config;
- los owner colors usan variables o contratos compartidos;
- validar escritorio, tablet y móvil;
- validar sidebars abiertos y colapsados.

---

## 26. UX/UI

Objetivos:

- PDF protagonista;
- header compacto;
- sidebars simétricos;
- rails persistentes;
- menos cards anidadas;
- acciones por icono con tooltip cuando el significado sea evidente;
- labels visibles cuando la accesibilidad o ambigüedad lo exija;
- densidad profesional;
- scroll predecible;
- selección visible;
- owner color consistente;
- estados vacíos útiles;
- responsive sin remount;
- modo enfoque;
- navegación clara por documento y página.

No sacrificar tamaño mínimo de interacción por compacidad.

---

## 27. Accesibilidad

Requisitos:

- navegación por teclado;
- focus visible;
- nombres accesibles;
- `aria-expanded`, `aria-selected`, `aria-disabled`;
- tooltips no dependientes de `title`;
- contraste suficiente;
- alternativas a drag;
- lectura de estados;
- controles táctiles;
- no depender solo del color;
- Dialog con focus trap y restauración;
- no capturar atajos en inputs editables.

---

## 28. Rendimiento

Vigilar:

- rerenders del Canvas;
- reconstrucción de plugins;
- listeners acumulados;
- DOM imperativo no limpiado;
- listas grandes;
- documentos múltiples;
- imágenes y object URLs;
- PDF workers;
- comentarios;
- registries;
- deep merge repetido;
- selectores inestables;
- memoización prematura o incorrecta.

Optimizar después de medir. No introducir caches duplicados.

---

## 29. Seguridad

Áreas sensibles:

- archivos;
- object URLs;
- firma;
- callbacks;
- providers;
- datos externos;
- expresiones;
- HTML;
- plugins;
- MCP/herramientas de agentes;
- hooks de shell.

Reglas:

- mínimo privilegio;
- validar entradas;
- sanitizar contenido;
- no registrar secretos;
- confirmar acciones destructivas;
- timeouts;
- auditoría;
- hooks seguros desactivados hasta revisión;
- no ejecutar `git reset --hard` o `git clean -fdx` mediante automatismos.

---

## 30. Calidad y reducción de duplicidad

### 30.1 Tipos de duplicidad

```text
texto
lógica
contratos
estado
mappings
UI
CSS
tests
fixtures
documentación
prompts
memoria
task-cards
registries
wrappers
```

### 30.2 Clasificación de jscpd

Separar:

```text
owned
vendor
generated/docs
```

No modificar un fork vendorizado solo para bajar una métrica global.

### 30.3 Baseline revisado del reporte estricto

El reporte compartido registró:

```text
103 clones totales
61 asociados al fork interno de pdf-lib
26 en documentación Markdown consolidada
16 bloques accionables del código propio
```

Este baseline es histórico; debe regenerarse antes de una nueva ola.

### 30.4 Patrones para reducir duplicidad

| Problema | Patrón |
|---|---|
| lógica repetida entre componentes | custom hook o servicio |
| muchos `if` por comportamiento | Strategy |
| creación por tipo | Factory |
| plugins y acciones | Registry |
| mapeos del host | Adapter |
| flujo complejo | Facade |
| estados incompatibles | Reducer o State Machine |
| acciones del editor | Command |
| UI repetida | Composition / Presentational |
| reglas efectivas | Resolver / Policy |
| variantes pequeñas | configuración sobre factory compartida |

### 30.5 No abstraer prematuramente

No extraer por coincidencia textual si:

- las invariantes son distintas;
- pertenece a vendor;
- el bloque es incidental;
- la abstracción necesita más flags que el código original;
- reduce claridad;
- mezcla dominios.

---

## 31. Gates de calidad

Comandos comunes; confirmar siempre en `package.json`:

```bash
npm run lint
npm run build
npm run quality:duplicates:strict
npm run quality:dead-code:ci
npm run quality:architecture
npm test
```

Pruebas focales:

```bash
npx vitest run <ruta>
npx playwright test <spec>
```

Arquitectura IA:

```bash
node tools/ai-quality/validate-ai-architecture.mjs
node tools/ai-quality/check-markdown-duplicates.mjs
node .ai/scripts/validate-context-manifests.mjs
node .ai/scripts/validate-skill-budget.mjs
node .ai/scripts/validate-provider-adapters.mjs
node .ai/scripts/validate-traceability.mjs
```

No todos los scripts pueden coexistir en todas las versiones del checkout.
La task-card debe verificar disponibilidad antes de ejecutarlos.

---

## 32. Saneamiento de nomenclatura y compatibilidad

Este workstream no reemplaza la arquitectura anterior. Se añade al proyecto.

### 32.1 Objetivo

- eliminar nombres ambiguos;
- nombrar formatos anteriores por versión;
- nombrar bridges por origen y destino;
- retirar código realmente obsoleto;
- conservar compatibilidad necesaria en fronteras;
- impedir nuevas apariciones artificiales.

### 32.2 Baseline del consolidado revisado

```text
166 apariciones en 41 archivos
153 del término histórico a retirar
13 del término de “fuente única” usado artificialmente
```

Concentración:

```text
shared/snapshotAdapter.ts
shared/schemaMigration.ts
runtime/instanceEventDispatcher.ts
common/comments.ts
shared/snapshot.ts
```

### 32.3 Nombres recomendados

```text
V1 / V2 / V3 / preV2
sourcePath / targetPath
resolvedConfig
domainEvent
hostCallback
websocket
detailSection
pluginSection
normalizedOrder
primarySource
durableProjectState
compatibilityAlias
deprecated
```

### 32.4 Excepción externa

Las rutas oficiales de PDF.js que contienen el nombre histórico del paquete se
mantienen mientras sean requeridas:

```text
pdfjs-dist/legacy/build/pdf
pdfjs-dist/legacy/build/pdf.worker.min.js?url
pdfjs-dist/legacy/build/pdf.worker.js
```

Se renombra el wrapper propio, no una ruta controlada por terceros.

### 32.5 Programa NAME

```text
NAME-001 inventario
NAME-002 política y gate
NAME-003 inspector
NAME-004 configuración
NAME-005 eventos/callbacks
NAME-006 snapshots/metadata
NAME-007 provider WebSocket
NAME-008 comentarios
NAME-009 firma/familias
NAME-010 documentación/IA
NAME-011 aliases públicos
NAME-012 retiro final
```

### 32.6 Archivos del paquete de saneamiento

```text
.ai/plans/PLAN_SANEAMIENTO_NOMENCLATURA_COMPATIBILIDAD.md
.ai/prompts/PROMPT_CODEX_SANEAMIENTO_NOMENCLATURA.md
.ai/governance/NAMING-COMPATIBILITY-POLICY.md
.ai/scrum/task-cards/NAME-001..012
reports/naming-sanitization/RENAMING-MATRIX.md
scripts/quality/audit-compatibility-language.mjs
configs/compatibility-language-allowlist.json
CHECKLIST-ACEPTACION.md
```

Este paquete agrega un workstream; no sustituye README, Scrum, memoria ni planes.

---

## 33. Arquitectura de asistentes IA

La arquitectura actual es acumulativa y llega a V7.

### 33.1 Evolución

- **V3/V4:** router, contexts, rules, playbooks y tareas focales.
- **V5:** separación owned/vendor/docs, seguridad, Scrum y adapters de proveedores.
- **V6:** evidencia, control de contexto, evaluación de prompts y memoria.
- **V7:** trazabilidad, manifests de contexto, skills por demanda, budgets, provider drift y registro de símbolos.

Los documentos históricos se mantienen como migración y evidencia; el punto de
entrada actual es `.ai/START.md`.

### 33.2 Resultado documentado de V7

- 30 task-cards `AIARCH`;
- 211 casos de uso;
- 211 comportamientos;
- 45 eventos;
- 20 efectos;
- 319 métodos o símbolos heurísticos;
- 20 skills nuevas;
- registro de skills existentes;
- adapters Codex, Claude y Copilot;
- validadores de presupuesto, memoria, trazabilidad, skills y drift.

### 33.3 Cadena de trabajo

```text
adapter corto
→ task-card
→ route
→ context manifest
→ skill
→ symbols/evidence
→ patch/test
→ traceability
→ memory delta
```

### 33.4 Principios de consumo

- cargar instrucciones mínimas;
- cargar skills bajo demanda;
- no abrir todos los Markdown;
- no repetir investigación ya documentada;
- usar el nivel de razonamiento mínimo suficiente;
- reservar subagentes para tareas independientes;
- un escritor, lectores auxiliares;
- resumir logs;
- detenerse por presupuesto;
- actualizar memoria con deltas, no reescrituras.

---

## 34. Agentes y responsabilidades

Roles comunes:

| Agente | Responsabilidad |
|---|---|
| Coordinator | routing, scope, claims y cierre |
| Architect | contratos y decisiones |
| Explorer | evidencia read-only |
| Implementer | parche focal |
| Reviewer | revisión independiente |
| QA | tests y regresión |
| Canvas Specialist | geometría e interacción |
| Schema Specialist | plugins y familias |
| Inspector Specialist | DetailView |
| Runtime Architect | config, events y state |
| UX Designer | visual, responsive y accesibilidad |
| Adapter Steward | Codex/Claude/Copilot/host |
| Memory Steward | memoria y handoff |
| Token Steward | presupuesto de contexto |
| Traceability Steward | requisito → símbolo → test |
| Security Reviewer | archivos, providers y shell |
| Dedup Analyst | clones, dead code y patrones |

No todos deben activarse para cada tarea.

---

## 35. Skills

Las skills contienen procedimientos reutilizables. Ejemplos documentados:

```text
sisad-accessibility
sisad-action-state
sisad-ai-architecture
sisad-behavior-traceability
sisad-canvas-interaction
sisad-canvas-safety
sisad-capability-audit
sisad-collaboration-assignments
sisad-command-history
sisad-configuration-service
sisad-context-budget
sisad-context-packet
sisad-context-rot-check
sisad-controller-parity
sisad-css-tailwind
sisad-decision-record
sisad-declarative-instance
sisad-dedup-triage
sisad-designer-core-ux
sisad-designer-safety
sisad-dry-refactor
sisad-event-effect-contract
sisad-evidence-grounding
sisad-form-viewer-parity
sisad-frontend-component-architecture
sisad-incident-recovery
sisad-inspector-contract
sisad-knowledge-gc
sisad-left-sidebar-catalog
sisad-memory-delta
sisad-memory-scrum
sisad-method-registry
sisad-multi-document-routing
sisad-orchestrate-task
sisad-pattern-selection
sisad-prompt-evaluation
sisad-provider-adapter-sync
sisad-public-api-compatibility
sisad-quality-gates
sisad-react-performance
sisad-recipient-assignment-policy
sisad-research-verify
sisad-responsive-ux
sisad-right-sidebar-contract
sisad-schema-behavior-matrix
sisad-schema-family-refactor
sisad-schema-plugin
sisad-security-privacy
sisad-skill-evaluation
sisad-snapshot-compatibility
sisad-tailwind-design-system
sisad-task-execution
sisad-task-orchestration
sisad-test-log-distillation
sisad-testing-pyramid
sisad-visual-regression
sisad-worktree-coordination
```

### 35.1 Regla de skills

- nombre y descripción cortos;
- una responsabilidad;
- no duplicar una policy;
- no contener estado del sprint;
- cargarse solo cuando la tarea coincide;
- evaluarse;
- retirar skills solapadas;
- mantener un registry.

---

## 36. Routing de modelos y proveedores

La selección de modelo no debe codificarse rígidamente en el README raíz.

`.ai/MODEL-ROUTER.md` debe resolver según:

```text
complejidad
riesgo
ambigüedad
volumen
tipo de tarea
necesidad de herramientas
disponibilidad local
coste
```

Clases de trabajo:

```text
mecánico
implementación estándar
refactor transversal
arquitectura
debug ambiguo
revisión
documentación
clasificación
```

Adapters:

```text
AGENTS.md / .codex
CLAUDE.md / .claude
.github/copilot-instructions.md / agents / prompts
```

Los adapters son delgados y apuntan a `.ai`; no copian toda la arquitectura.

---

## 37. Scrum, claims y worktrees

### 37.1 Fuentes

```text
.ai/scrum/PRODUCT-BACKLOG.md
.ai/scrum/SPRINT-CURRENT.md
.ai/scrum/CLAIMS.md
.ai/scrum/task-cards/
.ai/tasks/ACTIVE.md
```

`ACTIVE.md` es un puntero o vista; no debe competir con el sprint.

### 37.2 Task-card

Debe declarar:

```text
objetivo
evidencia
alcance
no alcance
archivos permitidos
invariantes
presupuesto
dependencias
owner
modelo
worktree
criterios de aceptación
tests
rollback
condición de parada
memory delta
```

### 37.3 Worktrees

Usar worktrees separados cuando varios agentes editan.

```text
Codex worktree
Claude worktree
Copilot worktree
integration worktree
```

No permitir escritura concurrente sobre los mismos archivos.

### 37.4 WIP

WIP reducido. Una tarea activa por escritor. Hasta dos revisores read-only cuando
aporte valor.

---

## 38. Memoria

Capas:

```text
CURRENT / project state
DECISIONS
RISKS
METRICS
HANDOFF
MEMORY-DELTA
archive/history
```

Reglas:

- memoria versionada;
- no usar memoria automática como única autoridad;
- no copiar logs completos;
- registrar decisiones y resultados;
- aplicar garbage collection;
- marcar información obsoleta;
- evitar repetir estado en múltiples archivos;
- el handoff contiene continuidad, no historia completa.

---

## 39. Presupuesto anti-loop

Boot packet recomendado:

```text
AGENTS.md
.ai/START.md
SPRINT-CURRENT.md
una task-card
una route
un AGENTS.md local
una skill
```

Límites iniciales típicos:

```text
2 búsquedas
8 archivos abiertos
5 archivos modificados
1 dominio
1 proceso
```

Estos límites pueden ajustarse por task-card, pero nunca ignorarse silenciosamente.

Detenerse si:

- la causa está en otro dominio;
- aparece un contrato público desconocido;
- el scope excede la tarjeta;
- se requiere tocar una zona protegida;
- no existe evidencia;
- el cambio necesita otra fase;
- la suite revela regresión no relacionada.

---

## 40. Trazabilidad

Cadena esperada:

```text
requisito
→ caso de uso
→ comportamiento
→ evento
→ efecto
→ método/símbolo
→ archivo
→ test
→ evidencia
→ task-card
```

Toda funcionalidad visible debe poder rastrearse hasta código y prueba.

---

## 41. Workstreams acumulativos

| Prefix | Programa |
|---|---|
| `AIARCH-*` | Arquitectura IA |
| `COREUX-*` | Core UX, eventos y efectos |
| `DECL-*` | Instancias declarativas |
| `CONFIG-*` | Configuración unificada |
| `NAME-*` | Saneamiento de nombres |
| `DEDUP-*` | Duplicidad y DRY |
| `TASK-LAB-*` | Laboratorio y ejemplos |
| `RESTORE-*` | Restauración |
| `PORT-*` | Portabilidad |
| `TAILWIND-*` | Migración de estilos |
| `QA-*` | Calidad y regresión |
| `DOCS-*` | Documentación |
| `SEC-*` | Seguridad |
| `PERF-*` | Rendimiento |

Los programas se fusionan en el backlog y sprint existentes. No deben crear
boards paralelos.

---

## 42. Flujo de trabajo para humanos y agentes

### 42.1 Inicio

```bash
git status --short
git branch --show-current
```

Leer:

```text
README.md
AGENTS.md
.ai/START.md
.ai/scrum/SPRINT-CURRENT.md
task-card
route
AGENTS.md local
skill
```

### 42.2 Evidencia

- formular pregunta verificable;
- usar `rg`;
- abrir archivos mínimos;
- confirmar contratos;
- registrar baseline;
- crear test de caracterización cuando aplique.

### 42.3 Implementación

- claim;
- worktree;
- parche pequeño;
- no ampliar scope;
- actualizar tests;
- evitar cambios de formato masivos;
- conservar API.

### 42.4 Validación

- lint focal;
- tests focales;
- typecheck/build;
- quality gates;
- Playwright;
- validación visual si cambia UI;
- diff review.

### 42.5 Cierre

Entregar:

```text
qué cambió
por qué
archivos
tests
baseline antes/después
riesgos
pendientes
rollback
task-card
memory delta
handoff
```

---

## 43. Definition of Done general

Una tarea está completa cuando:

- cumple criterios de aceptación;
- no excedió scope sin aprobación;
- preservó invariantes;
- tiene pruebas;
- lint/build aplicable están verdes;
- no agregó duplicidad injustificada;
- no introdujo `any`;
- no rompió API pública;
- no modificó vendor por métricas;
- documentación necesaria está actualizada;
- Scrum refleja el estado;
- se emitió memory delta;
- riesgos se registraron;
- el diff es revisable.

---

## 44. Instalación y fusión de paquetes

### 44.1 Nunca reemplazar el proyecto completo

Los ZIP generados por asistentes suelen ser overlays.

Aplicación segura:

```bash
unzip PAQUETE.zip -d /tmp/paquete
rsync -av --ignore-existing /tmp/paquete/prueba-plugin/ /ruta/prueba-plugin/
```

Para archivos que deben actualizarse, revisar diff antes de copiar.

### 44.2 Archivos que requieren merge manual

```text
README.md
AGENTS.md
CLAUDE.md
CODEX.md
package.json
SPRINT-CURRENT.md
PRODUCT-BACKLOG.md
CLAIMS.md
CURRENT.md
DECISIONS.md
HANDOFF.md
```

### 44.3 Prohibido

- borrar archivos que no vienen en el ZIP;
- reemplazar Scrum;
- reemplazar memoria;
- resetear branch;
- copiar una carpeta parcial con semántica de espejo destructivo;
- asumir que el ZIP es el proyecto completo.

---

## 45. Inicio rápido

1. Instalar dependencias del checkout real.
2. Leer `AGENTS.md`.
3. Leer `.ai/START.md`.
4. Confirmar el sprint.
5. Elegir una task-card Ready.
6. Crear claim y worktree.
7. Cargar route y skill.
8. Capturar baseline.
9. Implementar y probar.
10. Revisar y actualizar memoria.

Para explorar el runtime:

```text
http://localhost:5174/lab/multi-document-routing
```

---

## 46. Índice documental recomendado

```text
docs/
├── 00-introduccion/
├── 01-instalacion/
├── 02-conceptos/
├── 03-designer/
├── 04-schemas/
├── 05-form-viewer-generator/
├── 06-snapshot-persistencia/
├── 07-integraciones/
├── 08-api-reference/
├── 09-testing/
├── 10-troubleshooting/
├── 11-migraciones/
├── 12-arquitectura/
├── 13-ejemplos/
└── 14-seguridad/
```

Documentación técnica cerca del código puede existir, pero no debe repetir
manuales completos. Debe resumir contratos locales y enlazar a `docs`.

---

## 47. Riesgos conocidos

- fuentes paralelas de configuración;
- selección y permisos resueltos por varias capas;
- ownership color inconsistente;
- CSS del host afectando internals;
- sidebars con contratos diferentes;
- snapshot perdiendo metadata;
- mappings repetidos;
- wrappers de ejemplos creciendo;
- documentación generada incluida en jscpd;
- vendor contabilizado como deuda propia;
- skills solapadas;
- memoria obsoleta;
- task-cards duplicadas;
- cambios masivos sin tests;
- imports públicos que dependían de side effects de CSS;
- controles del inspector sin write real;
- grupos de opciones tratados como schemas individuales;
- providers acoplados al core;
- nombres ambiguos en compatibilidad.

Los riesgos activos pertenecen a `.ai/memory/RISKS.md` o su equivalente actual.

---

## 48. Mantenimiento de este README

Actualizar este archivo cuando cambie:

- propósito;
- frontera host/core;
- estructura principal;
- API pública;
- arquitectura de componentes;
- fuente operativa de Scrum/memoria;
- programas de trabajo;
- workflow obligatorio;
- gates principales.

No actualizarlo por:

- detalles de una sola tarea;
- resultados temporales;
- logs;
- nombres de branch;
- estado diario;
- listas enormes de archivos modificados.

Esos datos pertenecen a task-cards, reportes, sprint y handoff.

---

## 49. Regla final

```text
No reemplazar arquitectura por parches.
No reemplazar el README integral por el README de una entrega.
No duplicar estado.
No corregir por síntoma.
No tocar zonas protegidas sin evidencia.
No sacrificar portabilidad.
No declarar éxito sin pruebas.
```

La evolución correcta es acumulativa:

```text
producto
+ contratos
+ componentes
+ calidad
+ documentación
+ memoria
+ Scrum
+ asistentes IA
+ nuevos workstreams
```

Cada nueva entrega debe integrarse a esta estructura, no reiniciarla.
