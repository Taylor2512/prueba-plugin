# START PROMPT — SISAD PDFME Designer

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas editors, Moveable, Selecto, command bus, snapshot del diseñador, schemas plugins, DetailView, ListView, CSS scoped, SOLID, POO basada en contratos, reducción de `any` y UX funcional tipo DocuSign/Wix.

## Alcance estricto

Trabaja únicamente sobre el componente diseñador PDF:

```txt
Designer
Canvas
Schemas
LeftSidebar / catálogo
RightSidebar / DetailView / ListView
Toolbar contextual
Moveable
Selecto
CommandBus
Snapshot del diseñador
Configuración visual y funcional de campos
Multipágina / multidocumento dentro del diseñador
```

No tocar:

```txt
StepOne
StepTwo host
ContentCustomForm negocio
Uanataca
liveness
APIs SISAD
workflow externo
firma real backend
externalForms como flujo de negocio
Form/Viewer/Generator salvo contrato de compatibilidad
```

## Inicio obligatorio

Antes de analizar o modificar, sigue este orden:

```txt
1. Leer .ai/INDEX.md
2. Leer .ai/ROUTER.md
3. Leer .ai/CONTEXT_BUDGET.md
4. Leer .ai/memory/project-memory.md
5. Leer .ai/context-map.md
6. Seleccionar exactamente 1 task-card en .ai/task-cards
7. Cargar solo:
   - 1 contexto
   - 1 regla principal
   - 1 playbook
   - 1 task-card
8. Inspeccionar código real con rg
```

## Presupuesto máximo

No excedas:

```txt
Máximo 2 comandos rg de búsqueda general.
Máximo 8 archivos abiertos.
Máximo 5 archivos modificados.
Máximo 1 proceso corregido por pasada.
Máximo 1 reporte final.
```

Si necesitas más, detente y reporta:

```txt
SE REQUIERE NUEVA TASK-CARD
```

No continúes investigando.

## Regla anti-loop

No repitas análisis global si la task-card ya define el proceso.

No vuelvas a explicar todo DocuSign.

No abras todos los Markdown.

No hagas auditoría general.

No propongas tocar archivos fuera del scope.

No conviertas un bug puntual en refactor completo.

## Datos que nunca deben perderse

Preservar siempre:

```txt
schemaUid
type
documentId
pageNumber
pageIndex
x
y
width
height
rotation
ownerRecipientId
recipientId
ownerColor
recipientColor
required
readOnly
readonly
locked
hidden
groupId
optionId
selectedOptionIds
selectedOptionId
selectedValue
defaultValue
options
__designer
```

## Entrega final obligatoria

```md
# Resultado

## Task-card ejecutada
## Contexto cargado
## Proceso afectado
## Diagnóstico corto
## Causa raíz
## Archivos modificados
## Cambios realizados
## Contratos preservados
## Validación manual
## Tests ejecutados o no ejecutados
## Errores externos observados pero no tocados
## Riesgos residuales
## Nueva task-card requerida, si aplica
```
