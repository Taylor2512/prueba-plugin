# Filas para Product Backlog — VISUX

Fusionar en `.ai/scrum/PRODUCT-BACKLOG.md`; no reemplazarlo.

| ID | Estado | Wave | Prioridad | Riesgo | Owner | Título | Dependencias | Refina |
|---|---|---|---|---|---|---|---|---|
| VISUX-001 | Backlog | W0 | P0 | high | qa-reviewer | Congelar baseline visual y estados reproducibles | — | COREUX-001, COREUX-054 |
| VISUX-002 | Backlog | W0 | P0 | high | runtime-architect | Inventariar componentes visuales, scroll owners y fuentes de estado | VISUX-001 | COREUX-002, COREUX-004, COREUX-020, COREUX-024 |
| VISUX-003 | Backlog | W0 | P0 | medium | ux-designer | Auditar tokens, contraste, densidad y lenguaje visual | VISUX-001 | COREUX-013, COREUX-014, COREUX-051 |
| VISUX-004 | Backlog | W0 | P0 | very-high | runtime-architect | Unificar auditoría de acciones, acceso y motivos de deshabilitación | VISUX-002 | COREUX-010, COREUX-011, COREUX-012 |
| VISUX-005 | Backlog | W1 | P0 | very-high | runtime-architect | Crear un estado responsive único del workspace | VISUX-002 | COREUX-020 |
| VISUX-006 | Backlog | W1 | P0 | high | ux-designer | Unificar rails y colapso de ambos sidebars | VISUX-005, VISUX-003 | COREUX-021 |
| VISUX-007 | Backlog | W1 | P0 | very-high | canvas-specialist | Preservar ancla visual, zoom y scroll al cambiar layout | VISUX-005, VISUX-006 | COREUX-022 |
| VISUX-008 | Backlog | W1 | P0 | high | implementer | Corregir header de guardar, navegación de páginas y estado de selección | VISUX-003, VISUX-004 | COREUX-013, COREUX-016, COREUX-018 |
| VISUX-009 | Backlog | W1 | P1 | medium | implementer | Cerrar contrato de zoom, fit, undo y redo | VISUX-005, VISUX-008 | COREUX-017 |
| VISUX-010 | Backlog | W1 | P1 | medium | accessibility | Reemplazar tooltips nativos y cerrar foco de controles | VISUX-003 | COREUX-014, COREUX-051 |
| VISUX-011 | Backlog | W1 | P0 | high | implementer | Unificar toolbar contextual y menú Más | VISUX-004, VISUX-010 | COREUX-041, COREUX-045 |
| VISUX-012 | Backlog | W1 | P0 | very-high | canvas-specialist | Hacer overlays collision-aware y coordinar stack visual | VISUX-007, VISUX-011 | COREUX-009, COREUX-031, COREUX-044 |
| VISUX-013 | Backlog | W2 | P1 | medium | ux-designer | Compactar shell, tabs y colapso del LeftSidebar | VISUX-005, VISUX-006 | COREUX-021, COREUX-023 |
| VISUX-014 | Backlog | W2 | P1 | medium | implementer | Cerrar búsqueda, filtros y selector de layout del catálogo | VISUX-013 | COREUX-023 |
| VISUX-015 | Backlog | W2 | P1 | medium | ux-designer | Compactar grupos, cards, favoritos y owner tone del catálogo | VISUX-014, VISUX-003 | COREUX-023, COREUX-041 |
| VISUX-016 | Backlog | W2 | P1 | high | schema-specialist | Cerrar custom fields, auto fields y catálogo de recipients | VISUX-013, VISUX-015 | COREUX-023, COREUX-036 |
| VISUX-017 | Backlog | W2 | P0 | very-high | canvas-specialist | Cerrar drag preview, drop setup y feedback de colocación | VISUX-015, VISUX-012 | COREUX-043 |
| VISUX-018 | Backlog | W3 | P0 | high | ux-designer | Hacer responsive la navegación del RightSidebar | VISUX-005, VISUX-006 | COREUX-024 |
| VISUX-019 | Backlog | W3 | P0 | very-high | runtime-architect | Formalizar panel registry, header contextual y scroll owner | VISUX-018, VISUX-002 | COREUX-024 |
| VISUX-020 | Backlog | W3 | P0 | high | implementer | Compactar ListView y separar identidad, estados y acciones | VISUX-019, VISUX-003, VISUX-004 | COREUX-025 |
| VISUX-021 | Backlog | W3 | P0 | high | implementer | Cerrar selección, reorder, localizar y menú por fila | VISUX-020, VISUX-004 | COREUX-025, COREUX-042, COREUX-045 |
| VISUX-022 | Backlog | W3 | P0 | very-high | runtime-architect | Corregir disponibilidad y lifecycle de Reasignar responsable | VISUX-004, VISUX-020 | COREUX-026 |
| VISUX-023 | Backlog | W3 | P0 | high | schema-specialist | Corregir header e identidad del DetailView | VISUX-019, VISUX-004 | COREUX-029, COREUX-030 |
| VISUX-024 | Backlog | W3 | P0 | very-high | schema-specialist | Reorganizar taxonomía, disclosure y widgets del DetailView | VISUX-023 | COREUX-029, COREUX-030, COREUX-032, COREUX-033 |
| VISUX-025 | Backlog | W3 | P0 | high | runtime-architect | Cerrar alcance y lifecycle del CommentsRail | VISUX-019, VISUX-004 | COREUX-028 |
| VISUX-026 | Backlog | W3 | P0 | very-high | runtime-architect | Separar documento, página y acciones del DocumentsRail | VISUX-019 | COREUX-027, COREUX-046 |
| VISUX-027 | Backlog | W3 | P1 | medium | ux-designer | Unificar estados empty, loading, error y disabled del RightSidebar | VISUX-019, VISUX-025, VISUX-026 | COREUX-024, COREUX-027, COREUX-028, COREUX-030 |
| VISUX-028 | Backlog | W4 | P0 | very-high | schema-specialist | Unificar field chrome, owner tone y estados visuales | VISUX-003, VISUX-004 | COREUX-010, COREUX-041 |
| VISUX-029 | Backlog | W4 | P0 | high | schema-specialist | Cerrar perfiles text-like, number y date/time | VISUX-024, VISUX-028 | COREUX-037 |
| VISUX-030 | Backlog | W4 | P0 | very-high | schema-specialist | Cerrar select, checkbox, radio y option groups | VISUX-024, VISUX-028 | COREUX-034, COREUX-038 |
| VISUX-031 | Backlog | W4 | P0 | very-high | schema-specialist | Hacer el inspector de firma dependiente del modo | VISUX-023, VISUX-024, VISUX-028 | COREUX-035, COREUX-039 |
| VISUX-032 | Backlog | W4 | P0 | high | schema-specialist | Cerrar action schemas: attachment, note, approve y decline | VISUX-024, VISUX-028 | COREUX-040 |
| VISUX-033 | Backlog | W4 | P1 | high | schema-specialist | Cerrar media, barcode, table y shapes | VISUX-024, VISUX-028 | COREUX-040 |
| VISUX-034 | Backlog | W4 | P1 | medium | ux-designer | Normalizar i18n, labels técnicos y modo avanzado | VISUX-003, VISUX-023, VISUX-024 | COREUX-029, COREUX-030, COREUX-056 |
| VISUX-035 | Backlog | W4 | P0 | very-high | qa-reviewer | Probar paridad propiedad→runtimes→PDF→snapshot | VISUX-029, VISUX-030, VISUX-031, VISUX-032, VISUX-033 | COREUX-049, COREUX-050 |
| VISUX-036 | Backlog | W4 | P0 | high | canvas-specialist | Cerrar selección y edición de grupos de opciones | VISUX-030, VISUX-004 | COREUX-034, COREUX-038, COREUX-042 |
| VISUX-037 | Backlog | W5 | P0 | very-high | runtime-architect | Unificar asignación, reserva de edición, readonly y posición fija | VISUX-004, VISUX-022, VISUX-028 | COREUX-010, COREUX-026, COREUX-033 |
| VISUX-038 | Backlog | W5 | P0 | very-high | runtime-architect | Cerrar routing multidocumento y navegación por página | VISUX-026, VISUX-007 | COREUX-046, COREUX-047 |
| VISUX-039 | Backlog | W5 | P0 | very-high | runtime-architect | Cerrar paridad visual de Designer, Form y Viewer | VISUX-035, VISUX-038 | COREUX-049, COREUX-051 |
| VISUX-040 | Backlog | W5 | P0 | high | accessibility | Cerrar responsive, touch, teclado y accesibilidad integral | VISUX-006, VISUX-010, VISUX-018, VISUX-039 | COREUX-051 |
| VISUX-041 | Backlog | W5 | P0 | very-high | performance | Estabilizar rendimiento y evitar remounts presentacionales | VISUX-005, VISUX-038, VISUX-039 | COREUX-052 |
| VISUX-042 | Backlog | W6 | P0 | high | qa-reviewer | Crear suite visual, gates, documentación y release | VISUX-035, VISUX-040, VISUX-041 | COREUX-053, COREUX-054, COREUX-055, COREUX-056 |
