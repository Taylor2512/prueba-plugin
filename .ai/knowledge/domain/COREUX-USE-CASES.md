# Matriz integral — SISAD PDFME Core UX, funcionalidades, eventos y efectos

Alcance de implementación: `src/sisad-pdfme/**`.

| ID | Dominio | Caso | Resultado esperado |
|---|---|---|---|
| VIS-001 | VIS | Workspace de tres zonas | LeftSidebar, Canvas y RightSidebar mantienen jerarquía estable. |
| VIS-002 | VIS | Modo con sidebars colapsados | Los rails siguen visibles y permiten restaurar cada panel. |
| VIS-003 | VIS | Modo enfoque | Cierra ambos paneles sin perder selección, zoom, scroll ni página. |
| VIS-004 | VIS | Toolbar superior central | Página y selección se muestran una sola vez. |
| VIS-005 | VIS | Toolbar superior derecha | Guardar, estado y menú Más no se superponen al panel. |
| VIS-006 | VIS | Toolbar inferior | Undo, redo, fit y zoom permanecen visibles sin recorte. |
| VIS-007 | VIS | Tooltips controlados | No se depende de title nativo para acciones esenciales. |
| VIS-008 | VIS | Menú Más agrupado | Vista, página, documento y ayuda tienen jerarquía consistente. |
| VIS-009 | VIS | Grid y reglas discretas | La precisión no compite visualmente con el PDF. |
| VIS-010 | VIS | Chrome de selección | Selección, owner, required y lock no dependen solo del color. |
| VIS-011 | VIS | Nombres largos | Ellipsis y tooltip preservan el nombre completo. |
| VIS-012 | VIS | Safe areas | El chrome respeta notch, barras móviles y viewport dinámico. |
| VIS-013 | VIS | Reduced motion | Animaciones se desactivan con prefers-reduced-motion. |
| VIS-014 | VIS | Aislamiento visual | El host no altera internals de sisad-pdfme. |
| VIS-015 | VIS | Tema dinámico | Tokens y densidad cambian sin reconstruir el engine. |
| CMD-001 | CMD | Undo | Deshace el último comando ejecutable y actualiza disponibilidad. |
| CMD-002 | CMD | Redo | Rehace el último comando deshecho. |
| CMD-003 | CMD | Fit page | Ajusta toda la página al viewport. |
| CMD-004 | CMD | Fit width | Ajusta el ancho de la página. |
| CMD-005 | CMD | Zoom | Usa decimal interno y porcentaje visible. |
| CMD-006 | CMD | Insertar página | Agrega página después de la actual y es deshacerable. |
| CMD-007 | CMD | Duplicar página | Duplica página, schemas, routing e identidades válidas. |
| CMD-008 | CMD | Eliminar página | Protege página inicial y pide confirmación cuando corresponde. |
| CMD-009 | CMD | Toggle grid | Cambia visibilidad mediante comando y configuración canónica. |
| CMD-010 | CMD | Toggle guides | Cambia guías sin manipulación DOM local. |
| CMD-011 | CMD | Toggle snap | Cambia ajuste magnético y comunica estado. |
| CMD-012 | CMD | Toggle padding | Cambia chrome de padding sin alterar geometría persistida. |
| CMD-013 | CMD | Exportar | Genera artefacto con preflight y estados de progreso. |
| CMD-014 | CMD | Guardar | Ejecuta una sola acción global con estados semánticos. |
| CMD-015 | CMD | Atajos | Cada atajo delega en command/action registry y respeta contexto. |
| EVT-001 | EVT | Designer ready | Emite una vez con controller, capacidades y versión. |
| EVT-002 | EVT | Template changed | Emite revisión y causa sin duplicar onChange. |
| EVT-003 | EVT | Schema changed | Distingue add, update, remove, duplicate y reorder. |
| EVT-004 | EVT | Selection changed | Emite ids, modo, documento y página. |
| EVT-005 | EVT | Interaction phase changed | Emite idle, selecting, dragging, resizing, rotating, editing y modal. |
| EVT-006 | EVT | Page changed | Emite página previa/nueva y documento. |
| EVT-007 | EVT | Zoom changed | Emite valor anterior/nuevo y causa. |
| EVT-008 | EVT | Sidebar changed | Emite lado, modo, abierto/cerrado y causa responsive/usuario. |
| EVT-009 | EVT | View feature changed | Emite grid, guides, snap y padding. |
| EVT-010 | EVT | Recipients changed | Emite registry revision y recipients serializables. |
| EVT-011 | EVT | Active recipient changed | Emite anterior/nuevo y fuente. |
| EVT-012 | EVT | Assignment changed | Emite schemas, owner anterior/nuevo y lock preservado. |
| EVT-013 | EVT | Document changed | Emite documento activo y routing. |
| EVT-014 | EVT | Comment lifecycle | Emite create, reply, resolve, reopen, move y delete. |
| EVT-015 | EVT | Save/export/error lifecycle | Emite requested, started, succeeded y failed con correlationId. |
| INT-001 | INT | Selección simple | Click reemplaza selección. |
| INT-002 | INT | Multiselección macOS | Command alterna y Command+Shift acumula. |
| INT-003 | INT | Multiselección Windows/Linux | Control alterna y Control+Shift acumula. |
| INT-004 | INT | Selección regional | Selecto respeta intención acumulativa. |
| INT-005 | INT | Inspección bloqueada | Un schema bloqueado sigue siendo seleccionable para inspección. |
| INT-006 | INT | Drag | Solo schemas editables se mueven y el evento es deshacerable. |
| INT-007 | INT | Resize | Respeta acceso, límites y ratio por familia. |
| INT-008 | INT | Rotate | Respeta permisos y normaliza valor. |
| INT-009 | INT | Inline edit | No compite con selección, drag ni shortcuts. |
| INT-010 | INT | Doble click en opciones | Designer cambia opción solo mediante doble click. |
| INT-011 | INT | Modal suspend | Moveable, Selecto y shortcuts se suspenden al abrir modal. |
| INT-012 | INT | Modal restore | Cancelar/restaurar conserva selección y foco coherente. |
| INT-013 | INT | Copy/paste | Preserva metadata y aplica offset/routing seguro. |
| INT-014 | INT | Group/ungroup | Opciones internas no se convierten en schemas independientes. |
| INT-015 | INT | No overlap | Drop y duplicación respetan documento, página y owner. |
| SID-001 | SID | Catálogo list | Vista lista compacta con icono, label y favorito. |
| SID-002 | SID | Catálogo tiles | Dos o más columnas sin tarjetas anidadas. |
| SID-003 | SID | Catálogo icons | Grid adaptativo con tooltip accesible. |
| SID-004 | SID | Búsqueda | Filtra por nombre, tipo, familia y aliases. |
| SID-005 | SID | Favoritos y recientes | Persistencia configurable sin duplicar catálogos. |
| SID-006 | SID | Custom fields | Presets y plugins se registran por API. |
| SID-007 | SID | Recipient filter | Selector activo usa registry único. |
| SID-008 | SID | Fields list | Fila estándar con drag, nombre, tipo, owner, página y estado. |
| SID-009 | SID | List/canvas sync | Seleccionar fila localiza y enfoca schema. |
| SID-010 | SID | Rename | Diferencia nombre técnico y label visible. |
| SID-011 | SID | Reorder | Preserva schemas filtrados y snapshot. |
| SID-012 | SID | Delete | Respeta access state y confirmación. |
| SID-013 | SID | Reassign | Solo aparece con más de un recipient asignable y selección. |
| SID-014 | SID | Documents panel | Carga, activa, reordena y elimina documentos. |
| SID-015 | SID | Comments panel | Navega comentarios por documento, página y schema. |
| INS-001 | INS | Header de schema | Resume identidad, tipo, owner, selección y estado. |
| INS-002 | INS | Identity section | Nombre, label, fieldKey y descripción sin duplicar. |
| INS-003 | INS | Content section | Valor, placeholder o acción según familia. |
| INS-004 | INS | Options section | Opciones, default, orden y add/remove. |
| INS-005 | INS | Fill rules | Required y validación viven solo aquí. |
| INS-006 | INS | Interaction section | ReadOnly, orientación, espaciado y visibilidad runtime. |
| INS-007 | INS | Geometry section | X, Y, ancho, alto, rotación y alineación adaptativa. |
| INS-008 | INS | Connections section | Binding, dataLabel, tabLabel y fieldKey sin subtarjeta duplicada. |
| INS-009 | INS | Format section | Solo propiedades visuales aplicables. |
| INS-010 | INS | Assignment section | Owner, lock, reason, reassign y auditoría. |
| INS-011 | INS | Advanced section | UID, documentId, pageNumber y legacy ocultos por defecto. |
| INS-012 | INS | Profile by family | Cada familia muestra solo secciones útiles. |
| INS-013 | INS | Widget read/write | Todo control visible tiene propertyPath y writer real. |
| INS-014 | INS | Widget visibility/access | visibleWhen y disabledWhen usan config/access canónicos. |
| INS-015 | INS | Inspector responsive | No hay inputs cortados ni scroll horizontal. |
| SCH-001 | SCH | Identidad estable | schemaUid no cambia por rename, copy o document switch. |
| SCH-002 | SCH | Routing estable | documentId y pageNumber sobreviven a operaciones. |
| SCH-003 | SCH | Owner estable | ownerRecipientId y owner color se preservan. |
| SCH-004 | SCH | Text-like | Texto y presets comparten contrato sin duplicar plugins. |
| SCH-005 | SCH | Number | Formato, rango y decimales se validan. |
| SCH-006 | SCH | Date/time | Fecha, hora y fecha-hora tienen formato y required/readOnly. |
| SCH-007 | SCH | Checkbox | Designer selecciona con click y alterna con doble click. |
| SCH-008 | SCH | CheckboxGroup | Selección múltiple, optionId y botón + externo. |
| SCH-009 | SCH | RadioGroup | Selección única, optionId y botón + externo. |
| SCH-010 | SCH | Select/dropdown | Placeholder Seleccionar y opciones únicas. |
| SCH-011 | SCH | Signature family | Firma, iniciales y dateSigned usan modos y providers coherentes. |
| SCH-012 | SCH | Action schemas | Attachment, note, approve y decline tienen perfiles propios. |
| SCH-013 | SCH | Visual schemas | Imagen, SVG, tabla, shapes y barcodes no muestran reglas de captura impropias. |
| SCH-014 | SCH | Custom schema | Factory/registry/plugin con Designer/Form/Viewer/Generator. |
| SCH-015 | SCH | Owner chrome | Canvas, catálogo, lista e inspector comparten owner tone. |
| DOC-001 | DOC | Documento único | Template y basePdf se preservan. |
| DOC-002 | DOC | Multidocumento | Cada documento conserva páginas y schemas. |
| DOC-003 | DOC | Documento activo interno | El core controla activeDocumentId. |
| DOC-004 | DOC | Documento activo host | El host controla y recibe cambios. |
| DOC-005 | DOC | Documento sin schemas | Se muestra y permite insertar campos. |
| DOC-006 | DOC | Reordenar documentos | No cambia IDs ni routing. |
| DOC-007 | DOC | Agregar documento | Normaliza metadatos y crea estado válido. |
| DOC-008 | DOC | Eliminar documento | Reasigna documento activo y limpia recursos. |
| DOC-009 | DOC | Página activa | Se conserva por documento cuando la política lo permite. |
| DOC-010 | DOC | Comentarios por documento | Filtra sin perder comentarios globales. |
| DOC-011 | DOC | Assignments por documento | Mantiene owner y página. |
| DOC-012 | DOC | Snapshot documentos | Round-trip de orden, activeDocument y templates. |
| DOC-013 | DOC | Object URLs | Se revocan al reemplazar/eliminar. |
| DOC-014 | DOC | PDF converters | Size/images/pdf usan APIs públicas. |
| DOC-015 | DOC | Export multidocumento | Explicita estrategia merge/separado. |
| RUN-001 | RUN | Designer mode | Edición completa y config dinámica. |
| RUN-002 | RUN | Form mode | Inputs editables y validación. |
| RUN-003 | RUN | Viewer mode | Solo lectura sin handlers mutables. |
| RUN-004 | RUN | Values initial | Derivados o declarados sin lógica host duplicada. |
| RUN-005 | RUN | Required validation | Diferente para diseño, llenado, generación y envío. |
| RUN-006 | RUN | Signature request | Provider genérico y evento público. |
| RUN-007 | RUN | Generator preflight | No genera si faltan requisitos. |
| RUN-008 | RUN | Autosave | Adapter y debounce cancelable. |
| RUN-009 | RUN | Async hydration | No pisa edición local. |
| RUN-010 | RUN | Controller parity | Tipo, wrapper y ejecución coinciden. |
| RUN-011 | RUN | Capability explain | supported/available/reason/methods. |
| RUN-012 | RUN | Config hot update | Cambios presentacionales no remontan. |
| RUN-013 | RUN | Config rebuild | Cambios estructurales reconstruyen de forma controlada. |
| RUN-014 | RUN | Snapshot runtime | Form/Viewer consumen artefacto canónico. |
| RUN-015 | RUN | Error recovery | Errores se exponen sin congelar la instancia. |
| QLT-001 | QLT | Core TypeScript | Código nuevo de sisad-pdfme usa TS/TSX. |
| QLT-002 | QLT | Sin host imports | No importa src/examples/features/modules. |
| QLT-003 | QLT | Sin deep readers | Config se consume por selectors/service. |
| QLT-004 | QLT | Sin acción duplicada | Una definición por actionId. |
| QLT-005 | QLT | Sin evento string libre | Catálogo tipado y versionado. |
| QLT-006 | QLT | Sin listeners huérfanos | Toda suscripción se limpia. |
| QLT-007 | QLT | Sin setTimeout de coordinación | Efectos usan lifecycle explícito. |
| QLT-008 | QLT | Sin z-index arbitrario | Capas usan tokens canónicos. |
| QLT-009 | QLT | Sin CSS global | Tailwind-first y tokens.css. |
| QLT-010 | QLT | Unit contracts | Políticas, reducers, factories y events tienen pruebas. |
| QLT-011 | QLT | Playwright | Desktop/tablet/mobile y estados críticos. |
| QLT-012 | QLT | Visual regression | Screenshots focales estables. |
| QLT-013 | QLT | Performance | No remount y budgets de renders. |
| QLT-014 | QLT | Dead code | Exports públicos justificados. |
| QLT-015 | QLT | Docs/release | Manual, migración y changelog verificables. |
