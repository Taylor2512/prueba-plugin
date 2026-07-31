# Matriz integral de casos de uso — instancias declarativas

| ID | Caso | Resultado esperado | Dominio |
|---|---|---|---|
| UC-001 | Designer declarativo mínimo | Montar Designer con una definición JSON y un template por defecto. | Designer |
| UC-002 | Designer controlado | El host controla template y recibe cambios sin reconstruir el runtime. | Designer |
| UC-003 | Designer no controlado | La instancia conserva internamente el template cuando el host no lo controla. | Designer |
| UC-004 | Form declarativo | Montar Form con definition.mode=form y valores iniciales. | Runtime |
| UC-005 | Viewer declarativo | Montar Viewer readonly con definition.mode=viewer. | Runtime |
| UC-006 | Cambio de modo | Cambiar Designer/Form/Viewer mediante definición, con impacto explícito y sin estado fantasma. | Runtime |
| UC-007 | Un recipient | Registrar un usuario y asignarlo como owner por defecto. | Recipients |
| UC-008 | Múltiples recipients | Registrar dos o más usuarios con selector interno y recipient activo. | Recipients |
| UC-009 | Color explícito | Respetar el color declarado por recipient. | Recipients |
| UC-010 | Color automático | Asignar paleta estable cuando falta color. | Recipients |
| UC-011 | Recipient deshabilitado | Excluir recipients no asignables sin perder su metadata. | Recipients |
| UC-012 | Recipient de copia | Permitir recipient informativo, pero excluirlo de firma y reasignación. | Recipients |
| UC-013 | Recipient activo controlado | El host controla activeRecipientId. | Recipients |
| UC-014 | Recipient activo no controlado | La instancia resuelve y conserva recipient activo. | Recipients |
| UC-015 | Reasignar oculto con 0–1 recipients | No mostrar Reasignar responsable con menos de dos recipients asignables. | Assignment |
| UC-016 | Reasignar visible con 2+ recipients | Mostrar Reasignar al existir selección y más de un recipient asignable. | Assignment |
| UC-017 | Reasignar deshabilitado por permiso | Mostrar estado deshabilitado con razón estable si no puede editar estructura. | Assignment |
| UC-018 | Reasignación masiva | Asignar múltiples schemas y preservar locks/readonly/geometría. | Assignment |
| UC-019 | Owner compartido | Representar ownership multi/shared sin duplicar fuentes. | Assignment |
| UC-020 | Schema sin owner | Permitir unassigned únicamente cuando la configuración lo autoriza. | Assignment |
| UC-021 | Vista global | Mostrar todos los owners sin cambiar ownership. | Collaboration |
| UC-022 | Filtro por recipient | Form/Designer filtran campos según recipient activo. | Collaboration |
| UC-023 | Lock y readOnly | Preservar lock, lockedBy y readOnly en cambios de recipient y snapshot. | Collaboration |
| UC-024 | Comentarios | Comentarios de documento, página y schema con resolve/reopen. | Comments |
| UC-025 | Documento único | Montar un PDF y conservar template/basePdf. | Documents |
| UC-026 | Múltiples documentos | Montar documentos con routing independiente. | Documents |
| UC-027 | Documento activo interno | La instancia administra el documento activo. | Documents |
| UC-028 | Documento activo controlado | El host controla activeDocumentId y recibe cambios. | Documents |
| UC-029 | Documento sin schemas | Mostrar documento válido aunque todavía no tenga schemas. | Documents |
| UC-030 | Routing documento/página | Conservar documentId, pageNumber y schemaUid. | Documents |
| UC-031 | Orden de documentos | Reordenar documentos sin perder routing. | Documents |
| UC-032 | Allowlist de schemas | enabledTypes limita capacidades registradas disponibles. | Schemas |
| UC-033 | Denylist de schemas | disabledTypes excluye tipos después de la allowlist. | Schemas |
| UC-034 | Visibilidad por superficie | Catálogo, Canvas, inspector y runtime pueden ocultar tipos sin desregistrarlos. | Schemas |
| UC-035 | Plugins custom | Registrar plugins TypeScript y referenciarlos desde la definición mediante resources. | Schemas |
| UC-036 | Text-like | Texto, nombre, correo, empresa, cargo y multivariable conservan defaults. | Schemas |
| UC-037 | Número y fechas | Número, fecha, fecha-hora y hora soportan required/readOnly/prefill. | Schemas |
| UC-038 | Select y dropdown | Opciones, placeholder Seleccionar y valores se resuelven de forma única. | Schemas |
| UC-039 | Radio y checkbox groups | Grupos, optionId estable, botón + y selección root funcionan. | Schemas |
| UC-040 | Firma | Firma, iniciales y fecha firmada soportan required y providers. | Schemas |
| UC-041 | Acciones | Attachment, note, approve y decline conservan capacidades y validación. | Schemas |
| UC-042 | Visuales | Imagen, SVG, tabla, formas y barcodes se crean desde recipe sin reglas de captura impropias. | Schemas |
| UC-043 | Recipe de template | Crear template de demostración desde grupos/tipos sin lógica en examples. | Templates |
| UC-044 | Layout multipágina | Distribuir schemas con límites, salto de fila y salto de página. | Templates |
| UC-045 | Inputs iniciales | Derivar values desde template o aceptar values declarados. | Runtime |
| UC-046 | Validación por perfil | Separar validación de diseño, llenado, generación y envío. | Validation |
| UC-047 | Eventos | onReady/onChange/onSave/onError/selection/recipient/assignment/document/signature. | Events |
| UC-048 | Controller opcional | Exponer controller solo cuando el host lo solicita. | Controller |
| UC-049 | Config dinámica | Actualizar presentación sin remount y clasificar cambios estructurales. | Configuration |
| UC-050 | Snapshot completo | Round-trip de template, recipients, documents, assignments, comments y firma. | Persistence |
| UC-051 | Bundle portable | Exportar/importar definición, snapshot y assets sin identidad de laboratorio. | Persistence |
| UC-052 | Autosave host/local | Delegar storage y autosave mediante adapter sin lógica en examples. | Persistence |
| UC-053 | Datos asíncronos | Hidratar recipients/documents/config sin perder edición local. | Integration |
| UC-054 | Generator | Generar PDF con preflight desde la instancia. | Artifacts |
| UC-055 | Converter | PDF→size, PDF→images e images→PDF mediante API pública. | Artifacts |
| UC-056 | DigitalAgreements | Consumir definición declarativa sin internals y conservar snapshot. | Integration |
| UC-057 | ExternalForms | Consumir el mismo template/snapshot en Form y Viewer. | Integration |
| UC-058 | Responsive | Designer ocupa viewport y sidebars se adaptan sin cambiar geometría. | UX |
| UC-059 | Touch y accesibilidad | Targets, foco, Escape, reduced motion y teclado móvil. | UX |
| UC-060 | Aislamiento visual | Examples no modifican internals por CSS. | UX |
| UC-061 | Ejemplo básico ≤30 líneas | La página solo importa definición y monta la instancia. | Examples |
| UC-062 | Examples solo JS/JSX/JSON | No existen TS/TSX ni imports .ts profundos en examples. | Quality |
| UC-063 | Core solo TS/TSX | Nuevas utilidades del componente no se implementan en JS/JSX. | Quality |
| UC-064 | No deep imports | Examples consumen únicamente entrypoints públicos. | Quality |
| UC-065 | No remount | Cambiar recipient, abrir info o actualizar UI no reconstruye engine. | Performance |
| UC-066 | Compatibilidad API baja | Designer/Form/Viewer actuales siguen disponibles. | Compatibility |
