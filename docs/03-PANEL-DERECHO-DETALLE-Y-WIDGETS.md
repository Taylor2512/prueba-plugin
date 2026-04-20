# Panel derecho, detalle y widgets

## 1. Panorama general

El panel derecho concentra tres modos:
- lista/campos
- detalle/inspector
- documentos

Su valor está en permitir edición profunda sin convertir cada click del canvas en una pantalla distinta.

## 2. Submódulos principales

- `RightSidebar`
- `ListView`
- `DocumentsRail`
- `DetailView`
- `DetailViewContent`
- `DetailHeaderCard`
- `DetailSectionCard`
- `DetailFormSection`
- `detailSchemas`
- `detailWidgets`
- `WidgetRenderer`

## 3. Filosofía correcta del inspector

El inspector debe responder tres preguntas:

1. ¿Qué schema tengo seleccionado?
2. ¿Qué cambios básicos puedo hacer sin pensar demasiado?
3. ¿Dónde están las opciones avanzadas cuando las necesito?

Por eso la estrategia adecuada sigue siendo **progressive disclosure**.

## 4. `DetailViewContent`

La estructura actual ya divide el schema en secciones:
- general
- style
- layout
- data
- collaboration
- validation
- advanced

Además calcula tags para configuración activa:
- Guardar
- API
- Form JSON
- Prefill

Eso es una señal de madurez del sistema: el inspector no solo pinta inputs, también comunica estado de configuración.

### Recomendación de visibilidad

#### abiertas por defecto
- general
- layout
- data

#### cerradas por defecto
- style
- collaboration
- validation
- advanced

## 5. `DetailHeaderCard`

Debe funcionar como resumen persistente:
- nombre/tipo
- tags de configuración
- tags colaborativos
- quizás métricas mínimas

No debe competir con la sección layout ni repetir demasiada información.

## 6. `detailSchemas`

El valor de esta capa es que convierte el inspector en una superficie declarativa. En lugar de hardcodear formularios enormes, define esquemas de panel.

### Beneficios
- reuso
- orden
- posibilidad de filtrar por tipo
- evolución sin reescribir todo

### Riesgo
Si `detailSchemas` crece sin taxonomía, se vuelve una lista caótica de widgets. Conviene mantener categorías claras.

## 7. `detailWidgets`

Esta capa ya integra widgets base y widgets de plugins:
- color
- botones de alineación
- divisores
- groups
- `SchemaConnectionsWidget`
- `SchemaCollaborationWidget`

### Buena práctica
Separar:
- widgets genéricos
- widgets por plugin
- widgets de runtime/configuración

## 8. `WidgetRenderer`

Es la pieza de compatibilidad que permite ejecutar widgets declarativos sin acoplarlos al inspector entero. Conviene mantenerlo pequeño y estable.

## 9. `ListView`

La vista de lista o outline sirve para:
- navegar schemas
- reordenar
- ejecutar acciones rápidas
- entender composición del documento

### Reglas de UX recomendadas

- reposo: nombre, tipo, estado mínimo
- hover: acciones rápidas
- selección: más señales
- multi-selección: acciones grupales en toolbar propia o header

## 10. `DocumentsRail`

La pestaña de documentos/páginas ayuda a dar contexto al archivo activo. No debe competir con el inspector detallado cuando el usuario está editando un schema, pero sí debe estar disponible como modo explícito.

## 11. `SchemaConnectionsWidget`

Es uno de los widgets más potentes del inspector, porque concentra:
- persistencia
- API
- Form JSON
- validación de configuración
- resumen de auth

### Recomendación
Tratarlo como un subsistema por sí mismo, no como “un widget más”. Debe seguir agrupando configuración avanzada bajo un solo paraguas.

## 12. `SchemaCollaborationWidget`

Este widget concentra:
- estado colaborativo del schema
- bloqueo
- ownership
- comments y anchors
- auditoría mínima

Es una buena línea de crecimiento para escenarios multiusuario.

## 13. Ejemplo de flujo real del inspector

```tsx
<DetailViewContent
  activeSchema={activeSchema}
  schemaConfig={schemaConfig}
  deselectSchema={deselectSchema}
  form={form}
  sectionSchemas={sectionSchemas}
  widgets={widgets}
  watchHandler={watchHandler}
/>
```

## 14. Mejoras recomendadas

### 14.1 Compactar secciones largas
No exponer demasiados inputs avanzados a la vez.

### 14.2 Hacer sticky el header
El contexto del schema no debe perderse al hacer scroll.

### 14.3 Mantener “Conexiones” dentro de Data o como bloque claramente separado
Sin mezclar persistencia/API/JSON con estilo o layout.

### 14.4 Recordar apertura de secciones
Ayuda a usuarios avanzados sin penalizar novatos.

## 15. Qué documentar mejor

Cada widget crítico debería tener:

- propósito
- props relevantes
- dependencia del engine
- dependencia del schema config
- riesgos
- ejemplos

## 16. Checklist de cambios en panel derecho

- ¿La nueva sección es realmente frecuente?
- ¿Debe abrirse por defecto?
- ¿Debe ir en Data o en Advanced?
- ¿Rompe layout del sidebar estrecho?
- ¿Aumenta el scroll demasiado?
- ¿Necesita badge/resumen en header?

## 17. Resumen operativo

El panel derecho ya es mucho más que un prop panel básico. Hoy funciona como un **inspector declarativo contextual**. El objetivo siguiente no es llenarlo de nuevos bloques, sino mantenerlo comprensible a medida que crece la configuración del producto.
