# Plan de ejecución detallado con MCP, skills y subagentes

> Estado: **plan operativo**, no implementación cerrada.  
> Fecha de corte: **23 de abril de 2026**.  
> Fuente de verdad usada: `.ai/*`, `docs/90-indice-verdad-actual.md`, `docs/96-sisad-pdfme-overview.md`, `codigo-formularios-dinamicos.txt`.

## 0) Contexto y enfoque de orquestación

Este plan aterriza las 10 líneas estratégicas propuestas para transformar el diseñador PDF en una plataforma coherente, intuitiva y robusta. Se organiza por:

- **olas incrementales** (sin big-bang);
- **subagentes especializados** por dominio;
- **skills operativas** (react-doctor);
- **gates de validación** (unitarias, e2e, documentación);
- **trazabilidad contractual** para `Schema`, `Assignments` y `PdfComment`.

### Estado MCP en este workspace

En esta ejecución se verificó el entorno MCP y actualmente:

- no hay `resources` disponibles;
- no hay `resourceTemplates` disponibles.

Por lo tanto, el plan usa como base el workspace local (`.ai/`, `docs/`, `src/`, `tests/`) y deja preparado un carril para activar MCP cuando existan servidores conectados.

---

## 1) Mapa de subagentes por frente

## 1.1 Núcleo de contratos y engine
- **designer-engine-architect**: cambios en `DesignerEngineBuilder`, identidad y configuración.
- **schema-registry-architect**: contratos/versionado de schema y familias.
- **schema-rendering-architect**: impacto de nuevos contratos en `uiRender/pdfRender`.

## 1.2 UX del editor
- **right-sidebar-inspector-architect**: secciones colapsables, pestañas, flujo de configuración.
- **detail-view-forms-architect**: formularios del inspector y validación en tiempo real.
- **canvas-overlays-architect**: menú contextual universal, anclas visuales de comentarios.
- **left-sidebar-catalog-architect**: familias de campos y descubrimiento progresivo.

## 1.3 Colaboración y concurrencia
- **collaboration-sync-architect**: lock/unlock, ownership, historial y reconexión.

## 1.4 Calidad y adopción
- **testing-regression-guardian**: matriz de regresión + cobertura unit/e2e.
- **docs-migration-steward**: actualización documental y guías de uso.
- **platform-pdf-architect**: coherencia transversal de roadmap y surface pública.

---

## 2) Skill operativa obligatoria en cambios React

### Skill: `react-doctor`
Aplicar al cierre de cada PR que toque React/UI:

```bash
npx -y react-doctor@latest . --verbose --diff
```

Uso recomendado:
1. Ejecutar tras cambios de UI/canvas/sidebar.
2. Corregir issues críticos (correctness/performance/security).
3. Re-ejecutar y registrar score en la PR.

> Si una fase no toca React (p. ej. sólo contratos/documentación), la skill puede omitirse explícitamente.

---

## 3) Backlog priorizado en 6 olas (12 semanas)

## Ola 1 (Semanas 1-2): contratos base y compatibilidad

### Objetivo
Estabilizar el modelo de datos sin romper consumidores existentes.

### Entregables
1. Extensión de `Schema` con:
   - `schemaUid`;
   - `createdBy`, `createdAt`, `lastModifiedBy`, `lastModifiedAt`;
   - `userColor`;
   - `comments?: PdfComment[]`.
2. Nuevo tipo `PdfComment`:
   - `{ id, fileId, pageNumber, anchor: { x, y }, fieldId, authorId, text, createdAt, resolved, replies }`.
3. Rediseño de `Assignments` a jerarquía:
   - `assignments[userId][recipientId][fileId][pageNumber]`.
4. Adaptadores backward-compatible (lectura legacy + escritura nueva).

### Subagentes
- principal: `schema-registry-architect`;
- apoyo: `designer-engine-architect`, `collaboration-sync-architect`.

### Riesgos
- ruptura de serialización existente;
- migraciones incompletas de templates viejos.

### Gate de salida
- tests unitarios de migración y serialización;
- documentación contractual actualizada.

---

## Ola 2 (Semanas 3-4): familias y naming único de variables

### Objetivo
Estandarizar creación y edición de campos por familias y garantizar unicidad semántica.

### Entregables
1. Catálogo por familias:
   - texto;
   - media/visual;
   - booleano/choice;
   - formas/códigos;
   - tablas.
2. Matriz `familia -> secciones inspector`:
   - General, Layout, Data, Style, Validation, Persistencia, Connections, Collaboration.
3. Generador de variable única por defecto:
   - `texto_01`, `imagen_02`, etc.
4. Validación dura:
   - no vacío;
   - no duplicado;
   - feedback en tiempo real + bloqueo de guardado.

### Subagentes
- principal: `schema-registry-architect`;
- apoyo: `detail-view-forms-architect`, `right-sidebar-inspector-architect`.

### Gate de salida
- tests unitarios del generador de nombres;
- tests UI de validación en inspector.

---

## Ola 3 (Semanas 5-6): flujo unificado de creación/edición + command bus

### Objetivo
Reducir pasos redundantes y consolidar undo/redo.

### Entregables
1. DnD unificado:
   - drag desde catálogo;
   - drop en canvas;
   - modal/popover inmediato con nombre/destinatario/tamaño.
2. Command pattern para acciones clave:
   - duplicar/eliminar;
   - estilo;
   - persistencia;
   - comentarios;
   - execute/undo/redo.
3. Trazabilidad mínima por comando:
   - actor, timestamp, schemaUid afectado.

### Subagentes
- principal: `canvas-overlays-architect`;
- apoyo: `designer-engine-architect`, `right-sidebar-inspector-architect`.

### Gate de salida
- pruebas de undo/redo multiacción;
- flujo completo de creación en e2e.

---

## Ola 4 (Semanas 7-8): comentarios anclados + panel lateral

### Objetivo
Introducir colaboración contextual en canvas y sidebar.

### Entregables
1. `contextmenu` universal en canvas.
2. Menú contextual por estado:
   - agregar comentario;
   - ver comentarios;
   - anclar;
   - acciones avanzadas.
3. Render de icono/ancla en coordenadas PDF (`x`,`y`).
4. Tab “Comentarios” en sidebar:
   - agrupado por página/campo;
   - contadores abiertos/resueltos;
   - responder/resolver/eliminar.

### Subagentes
- principal: `collaboration-sync-architect`;
- apoyo: `canvas-overlays-architect`, `right-sidebar-inspector-architect`.

### Gate de salida
- unit tests de `upsert/remove` por `id`;
- e2e de clic derecho -> crear comentario -> abrir hilo.

---

## Ola 5 (Semanas 9-10): persistencia/API + generación/descarga/export

### Objetivo
Cerrar loop operativo de configuración, generación y salida de datos.

### Entregables
1. Panel compacto “Conexiones y Persistencia” con resumen de estado.
2. Toggles por bloque + modal de configuración avanzada.
3. CTA destacada:
   - “Descargar plantilla” / “Generar PDF”.
4. Exportador “JSON de datos”:
   - modo `flat` o `nested`;
   - respeta `required/hidden`;
   - usa variable del campo (no `type`).

### Subagentes
- principal: `right-sidebar-inspector-architect`;
- apoyo: `designer-engine-architect`, `schema-rendering-architect`.

### Gate de salida
- tests unit de normalización JSON;
- e2e de generación/descarga con manejo de errores.

---

## Ola 6 (Semanas 11-12): multiusuario robusto + hardening + docs finales

### Objetivo
Consolidar sincronización y dejar release candidate de arquitectura.

### Entregables
1. Eventos:
   - `schema.locked`;
   - `schema.unlocked`;
   - registro de operaciones (crear/editar/eliminar).
2. Reglas visuales por `userColor`:
   - borde del campo;
   - comentarios;
   - badge de autor.
3. Reconexión y re-sync incremental.
4. Batería final de pruebas unit/e2e + documentación de operación.

### Subagentes
- principal: `collaboration-sync-architect`;
- apoyo: `testing-regression-guardian`, `docs-migration-steward`, `platform-pdf-architect`.

### Gate de salida
- suite mínima verde en CI;
- guías funcionales publicadas;
- checklist de release validado.

---

## 4) Aplicación directa a formularios dinámicos

Con base en `codigo-formularios-dinamicos.txt`, el frente de runtime/form debe ejecutarse en paralelo desde Ola 2:

1. Inventario de tipos realmente usados en formularios dinámicos.
2. Tabla de compatibilidad `designer type -> form renderer`.
3. Render condicional garantizado por tipo (incluida firma).
4. Export JSON por `field.variableName` único.
5. Pruebas de regresión para evitar colisiones por nombre.

### Subagentes
- principal: `schema-rendering-architect`;
- apoyo: `designer-engine-architect`, `testing-regression-guardian`.

---

## 5) Definición de Done (DoD) por épica

Una épica se considera completa sólo si cumple todos los puntos:

1. Contrato tipado actualizado (`common`, `ui`, `schemas`).
2. Sin ruptura de API pública sin feature-flag/migración.
3. Pruebas unitarias y e2e del flujo principal.
4. Documentación de verdad actual + guía de uso.
5. Registro de riesgos y rollback plan.
6. Si toca React/UI: ejecución de `react-doctor` registrada.

---

## 6) Plantilla de ejecución por tarea (lista para subagentes)

Para cada ticket, ejecutar este marco corto:

1. **Objetivo** (1-2 líneas)
2. **Archivos a tocar**
3. **Riesgos de regresión**
4. **Plan de cambio incremental**
5. **Implementación**
6. **Validación manual**
7. **Validación automática**
8. **Pendientes/no objetivos**

Esta plantilla está alineada con la estructura exigida por los subagentes en `.ai/agents`.

---

## 7) Próximos pasos inmediatos (sprint 0)

1. Crear ADR corta para contratos `Schema/PdfComment/Assignments`.
2. Añadir feature flags:
   - `collaborationAnchoredComments`;
   - `inspectorSectionCollapsible`;
   - `commandBusV2`.
3. Definir matriz inicial de pruebas por riesgo.
4. Programar primer lote de implementación: Ola 1 + parte de Ola 2 (naming único).

Con esto se inicia el cambio con bajo riesgo, máxima trazabilidad y una ruta clara para converger editor, runtime y colaboración.
