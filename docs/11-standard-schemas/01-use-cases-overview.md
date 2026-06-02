# Casos de uso — SISAD PDFME standard fields

## Catálogo

| Caso | Resultado esperado | Prueba |
|---|---|---|
| Ver catálogo compacto | Icono + título, sin tipo técnico | Playwright |
| Cambiar destinatario activo | Iconos toman color activo | Playwright |
| Crear campo desde catálogo | Schema obtiene owner/color actual | Playwright |
| Buscar campo | Filtra por nombre visible | Playwright |
| Ocultar metadata | No muestra familia/tags/capabilities en modo compacto | Playwright |

## Text

| Caso | Resultado esperado | Prueba |
|---|---|---|
| Crear texto | Campo aparece en canvas | Playwright |
| Editar contenido | Canvas y DetailView sincronizados | Playwright |
| Renombrar | Cambia name sin perder schemaUid | Unit + Playwright |
| Required | Form bloquea si vacío | Unit/Form |
| Readonly/locked | No permite edición/transform | Unit + Playwright |
| Snapshot | Preserva content/style/owner | Unit |
| PDF | Imprime valor final | Unit/Generator |

## Number

| Caso | Resultado esperado | Prueba |
|---|---|---|
| Crear número | Campo numérico visible | Playwright |
| Validar min/max | Error si valor sale de rango | Unit/Form |
| Decimales/formato | Normaliza salida | Unit |
| Required/readonly | Respeta validación | Unit |
| Snapshot/PDF | Preserva formato y valor | Unit |

## Checkbox

| Caso | Resultado esperado | Prueba |
|---|---|---|
| Crear casilla | Renderiza caja compacta | Playwright |
| Check/uncheck | Cambia estado | Unit/Form |
| Botón + | Convierte a checkboxGroup | Playwright |
| Required | Requiere marcado si aplica | Unit/Form |
| Snapshot/PDF | Preserva estado y renderiza check | Unit |

## CheckboxGroup

| Caso | Resultado esperado | Prueba |
|---|---|---|
| Crear grupo | Renderiza borde punteado + opciones | Playwright |
| Convertir desde checkbox | Preserva identidad y estado | Unit + Playwright |
| Agregar opción | Nueva opción sin solape | Unit + Playwright |
| Eliminar opción | selectedOptionIds se normaliza | Unit |
| Selección múltiple | Permite varias seleccionadas | Playwright/Form |
| minSelected/maxSelected | Valida límites | Unit/Form |
| Mover grupo | Mueve bounding box completo | Playwright |
| Duplicar grupo | Nuevo groupId/optionIds | Unit |
| Snapshot/PDF | Preserva opciones y checks | Unit |

## RadioGroup

| Caso | Resultado esperado | Prueba |
|---|---|---|
| Crear opción | Crea radioGroup | Playwright |
| Agregar opción | Botón + agrega opción | Playwright |
| Exclusividad | Solo una seleccionada | Unit/Form |
| Duplicar | Nuevo groupId/optionIds | Unit |
| Snapshot/PDF | Preserva opción seleccionada | Unit |

## Dropdown/select

| Caso | Resultado esperado | Prueba |
|---|---|---|
| Crear dropdown | Render compacto con chevron | Playwright |
| Editar opciones | DetailView actualiza options | Unit + Playwright |
| Seleccionar valor | Form guarda value | Form |
| Required | Bloquea si vacío | Unit/Form |
| Snapshot/PDF | Preserva options y valor | Unit |

## Canvas/overlays

| Caso | Resultado esperado | Prueba |
|---|---|---|
| Drag schema | No máscara oscura | Playwright |
| Resize/rotate | Mantiene canvas legible | Playwright |
| Zoom/scroll | Coordenadas correctas | Playwright |
| Grid toggle | data attributes sincronizados | Playwright |
| Floating toolbar | No tapa innecesariamente PDF | Playwright |

## Multiusuario/multidocumento

| Caso | Resultado esperado | Prueba |
|---|---|---|
| Documento A/B | Schemas separados | Playwright |
| Página 1/2 | Campos no se mezclan | Playwright |
| Destinatario A/B | Visibilidad por assignment | Unit + Playwright |
| Campos globales | Visibles para todos | Unit |
| Snapshot | assignments sobreviven | Unit |
