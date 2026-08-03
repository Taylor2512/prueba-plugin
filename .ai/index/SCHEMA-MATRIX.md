# Matriz compacta de schemas

| Tipo | Familia | DetailView | Designer | Form | Color |
|---|---|---|---|---|---|
| `text` | text-like | identity, content, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Preview/placeholder; click selecciona; inline edit controlado. | Entrada de texto con required/readOnly/maxLength/regex. | Owner chrome; contenido conserva color de texto. |
| `multiVariableText` | text-like | identity, content, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Muestra template y preview sin perder variables. | Resuelve variables según adapter/policy. | Owner chrome; no modifica variables. |
| `number` | number | identity, content, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Preview numérico. | Valida min/max/step/decimales/formato. | Owner chrome. |
| `fullName` | text-preset | identity, content, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Preset text-like. | Texto personal. | Owner chrome. |
| `emailAddress` | text-preset | identity, content, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Preset text-like. | Validación email por defecto. | Owner chrome. |
| `company` | text-preset | identity, content, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Preset text-like. | Texto de organización. | Owner chrome. |
| `title` | text-preset | identity, content, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Preset text-like. | Texto de cargo. | Owner chrome. |
| `date` | date-time | identity, content, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Preview representativo. | Control date y normalización. | Owner chrome. |
| `dateTime` | date-time | identity, content, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Preview fecha-hora. | Control datetime y normalización. | Owner chrome. |
| `time` | date-time | identity, content, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Preview hora. | Control time. | Owner chrome. |
| `select` | choice | identity, options, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Click selecciona; no abre; doble click opcional para preview. | Abre opciones y elige una. | Owner chrome. |
| `dropdown` | choice | identity, options, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Mismo contrato de select. | Selección única. | Owner chrome. |
| `checkbox` | boolean | identity, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Click selecciona; doble click alterna preview. | Click alterna booleano. | Owner chrome; checked state conserva semántica. |
| `checkboxGroup` | choice-group | identity, options, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Root seleccionable; options no son schemas; doble click alterna opció… | Selección múltiple. | Owner chrome externo. |
| `radioGroup` | choice-group | identity, options, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Root seleccionable; una opción; botón + aislado. | Selección única. | Owner chrome externo. |
| `signature` | signature | identity, signature, behavior, box, appearance, dataBindings, comments, collaboration, advanced | Placeholder; no ejecuta ceremonia. | draw/image/provider/p12 según capabilities. | Owner chrome; contenido de firma intacto. |
| `initials` | signature | identity, signature, behavior, box, appearance, dataBindings, comments, collaboration, advanced | Placeholder compacto. | Mismo provider contract con kind initials. | Owner chrome. |
| `dateSigned` | signature-derived | identity, content, box, appearance, dataBindings, collaboration, advanced | Campo automático asociado a firma. | ReadOnly y autocompletado. | Owner chrome; no se presenta como lock ajeno. |
| `attachment` | action-input | identity, fileRules, validation, behavior, box, appearance, dataBindings, comments, collaboration, advanced | Placeholder; seleccionar no abre file picker. | Selector de archivo con reglas. | Owner chrome. |
| `approve` | action | identity, action, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Botón representativo; no ejecuta. | Command/Event con confirmación/motivo. | Verde semántico interno + owner chrome. |
| `decline` | action | identity, action, validation, behavior, box, appearance, dataBindings, collaboration, advanced | Botón representativo. | Command/Event con confirmación/motivo. | Rojo semántico interno + owner chrome. |
| `note` | informational | identity, content, behavior, box, appearance, dataBindings, collaboration, advanced | Contenido informativo; no comentario colaborativo. | ReadOnly o informativo. | Amarillo semántico opcional + owner chrome. |
| `image` | media | identity, content, box, appearance, collaboration, advanced | Visual editable. | Generalmente estático. | Owner chrome no recolorea contenido. |
| `svg` | media | identity, content, box, appearance, collaboration, advanced | Visual editable. | Estático. | Owner chrome no recolorea contenido. |
| `table` | table | identity, content, box, appearance, dataBindings, collaboration, advanced | Filas/columnas/celdas. | Editable solo si capability lo declara. | Owner chrome no reemplaza estilos internos. |
| `barcode` | barcode | identity, content, box, appearance, dataBindings, collaboration, advanced | Preview de symbology. | Generalmente valor/binding. | Owner chrome no reemplaza color de barras. |
| `shape` | shape | identity, box, appearance, collaboration, advanced | Rectangle/line/ellipse. | Estático. | Owner chrome no reemplaza fill/stroke. |
| `custom` | custom | capability-driven | Plugin declara renderer y interactions. | Plugin declara renderer. | Plugin declara semantic policy; owner chrome sigue canónico. |
