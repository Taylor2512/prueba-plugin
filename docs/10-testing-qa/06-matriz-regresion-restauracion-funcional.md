# Matriz de regresión — restauración funcional

La restauración se valida contra los casos históricos y portables del componente.

# Matriz de casos de uso

| ID | Caso | Dominio | Contrato esperado | Prioridad | Tareas |
|---|---|---|---|---|---|
| UC-01 | Diseñador de pantalla completa o embebido | Designer | El host controla el viewport; el core conserva layout interno y dimensiones aditivas. | P0 | RESTORE-020, 022 |
| UC-02 | Diseñador de un usuario | Designer | Edición, selección, CRUD de schemas, páginas, zoom, guardado y snapshot. | P0 | 002–005 |
| UC-03 | Diseñador multiusuario | Collaboration | RecipientRegistry único, actor activo, colores, ownership, permisos y vista global. | P0 | 011, 014, 020 |
| UC-04 | Reasignación individual y masiva | Assignments | Cambiar responsable desde propiedades o selección múltiple, preservando locks y geometría. | P0 | 004, 014 |
| UC-05 | Color por destinatario | Collaboration | Color estable en canvas, catálogo, lista, inspector, badges y exportación. | P0 | 014 |
| UC-06 | Usuarios internos y externos | Recipients | Roles genéricos, usuario externo por defecto cuando el host así lo configure. | P1 | 011, 014 |
| UC-07 | Bloqueos y edición concurrente | Collaboration | locked/readOnly/objectLocked/lockedByOther, auditoría y razones de denegación. | P0 | 014 |
| UC-08 | Comentarios y anclajes | Comments | Comentarios por schema, anchors legacy/canónicos, panel y eventos. | P1 | 013, 014 |
| UC-09 | Múltiples documentos | Documents | Registro, orden, documento activo, archivos sin schemas, cambio de documento sin perder estado. | P0 | 006, 013 |
| UC-10 | Ruteo schema-documento-página | Documents | fileId/fileTemplateId/pageNumber y preservación al cambiar de archivo. | P0 | 007 |
| UC-11 | Carga y sustitución de PDF | Documents | Agregar, reemplazar, eliminar y reconciliar PDFs con páginas y schemas. | P1 | 006 |
| UC-12 | Orden y posición de archivos | Documents | Reordenar documentos y mantener selección/documento activo. | P1 | 006 |
| UC-13 | Páginas del template | Editor | Agregar, duplicar, eliminar, reordenar y navegar páginas. | P0 | 005 |
| UC-14 | Copiar y pegar schemas entre páginas | Editor | Clipboard con offset, orden, selección posterior y no solapamiento. | P0 | 004, 007 |
| UC-15 | Grupos checkbox/radio | Schemas | Grupo raíz seleccionable, opciones internas, botón +, layout vertical y edición en inspector. | P0 | 016 |
| UC-16 | Select/dropdown y placeholder | Schemas | Placeholder configurable, por defecto «Seleccionar», valores/opciones compatibles. | P1 | 016 |
| UC-17 | Campos requeridos | Validation | Firma requerida por defecto y required markers configurables. | P0 | 008, 015 |
| UC-18 | Fecha de firma/autorrelleno | Schemas | dateSigned y campos derivados con estrategia configurable. | P1 | 016 |
| UC-19 | Firma e iniciales | Signatures | Modal/placeholder en Designer, captura en Form y proveedor externo por adapter. | P0 | 015, 017 |
| UC-20 | Proveedores de firma | Signatures | Registry, capacidades, validación y eventos sin hardcode Uanataca/OneShot. | P0 | 015, 021 |
| UC-21 | Form runtime | Runtime | Inputs controlados, validación, filtrado por recipient y eventos de cambio. | P0 | 017 |
| UC-22 | Viewer runtime | Runtime | Solo lectura, vista global/recipient, documentos y todos los plugins. | P0 | 017 |
| UC-23 | Generación de PDF | Generator | Preflight, generate, descarga/preview y estado de operación. | P0 | 008, 009 |
| UC-24 | Conversión PDF↔imágenes | Converter | pdf2size, pdf2img, img2pdf y limpieza de object URLs. | P1 | 009 |
| UC-25 | Snapshot portable | Snapshot | Template, recipients, documents, assignments, comments, firma, config y versión. | P0 | 013 |
| UC-26 | Importar/exportar paquete autocontenido | Integration | Inline basePdf, datos, config y snapshot para copiar entre proyectos. | P1 | 018 |
| UC-27 | Datos externos asíncronos | Integration | Hidratación/reinyección sin recrear arbitrariamente el runtime ni perder selección. | P1 | 011, 019 |
| UC-28 | Configuración dinámica | Config | Actualizar flags con impacto none/ui/runtime-options/engine-rebuild/remount. | P0 | 003, 019 |
| UC-29 | Acciones con estado explicable | Actions | visible/enabled/permitted/available/executable/reason/sources. | P0 | 010 |
| UC-30 | Enviar desde la primera página | Host contract | El core expone validación y snapshot; el host decide cuándo enviar. | P1 | 008, 021 |
| UC-31 | Validación template vs solicitud | Validation | Perfiles separados para diseño, runtime, generación y envío. | P0 | 008 |
| UC-32 | Formulario externo SISAD | ExternalForms | Consumir snapshot mediante Form/Viewer; endpoints y reglas permanecen en el host. | P1 | 017, 021 |
| UC-33 | Móvil/tablet/escritorio | Responsive | Sidebars adaptativas, touch, scroll correcto y controles compactos. | P0 | 022 |
| UC-34 | Accesibilidad | UX | Teclado, foco, tooltips, aria labels y targets táctiles. | P1 | 022 |
| UC-35 | No regresión de Canvas | Canvas | Moveable, Selecto, coordenadas, zoom y page 2+ con pruebas focales. | P0 | 002, 004, 022 |
