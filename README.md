# SISAD PDFME Designer — AI Architecture v3 Complete

Generado: `2026-06-15T15:04:39+00:00`

Arquitectura Markdown completa para continuar el desarrollo del **componente diseñador PDF** de `sisad-pdfme`, optimizada para proveedores de IA como Claude, Codex, Copilot, Gemini u otros.

## Alcance estricto

Este paquete se enfoca únicamente en:

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
CSS del diseñador
Refactor SOLID/OOP del diseñador
```

No se enfoca en:

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
Form/Viewer/Generator como implementación principal
```

Form/Viewer/Generator solo aparecen como **contrato de compatibilidad** para no romper metadata, snapshot ni schema contracts.

## Objetivo

Evitar que los proveedores de IA entren en loops de análisis, consuman tokens sin sentido o vuelvan a auditar todo el proyecto en cada tarea.

La arquitectura está diseñada para trabajar por:

```txt
Router
→ Context budget
→ Task-card cerrada
→ Playbook focalizado
→ Reglas estrictas
→ Archivos candidatos
→ Criterio de parada
→ Reporte final
```

## Principio rector

No corregir por síntoma. Corregir por proceso:

```txt
Proceso
→ Componentes involucrados
→ Fuente de verdad
→ Estados válidos
→ Datos preservados
→ Validación
→ Implementación mínima
```

## Cómo usar

1. Copia este paquete en la raíz del proyecto.
2. Empieza cada tarea con `START_PROMPT.md`.
3. Selecciona una `task-card` en `.ai/task-cards`.
4. Ejecuta solo esa tarea.
5. Si excede presupuesto, detenerse y crear nueva task-card.

## Instalación

```bash
bash scripts/install-architecture.sh /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
```

## Limpieza previa opcional

Incluye scripts seguros para limpiar `.md` anteriores y carpetas vacías:

```bash
node scripts/delete-existing-markdown.mjs /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin --dry-run
node scripts/delete-existing-markdown.mjs /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin --confirm --backup

bash scripts/clean-empty-dirs.sh /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin --dry-run
bash scripts/clean-empty-dirs.sh /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin --confirm
```
