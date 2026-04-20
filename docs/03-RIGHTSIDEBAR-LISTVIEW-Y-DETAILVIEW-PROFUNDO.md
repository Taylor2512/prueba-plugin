# RightSidebar, ListView y DetailView

## 1. Rol del panel derecho

El panel derecho cumple una función triple:

- outline/listado de campos;
- inspector de detalle del elemento seleccionado;
- rail/documentos.

Esa combinación es poderosa, pero exige una jerarquía visual muy cuidada.

## 2. Tres modos del panel

### 2.1 `fields`
Vista orientada a estructura y orden.

### 2.2 `detail`
Vista orientada a configuración.

### 2.3 `docs`
Vista orientada a soporte documental y páginas.

## 3. `ListView` como outline estructural

`ListView` no debe verse como otra lista cualquiera. Debe funcionar como outline operacional del documento.

### Debe permitir
- seleccionar;
- reordenar;
- entender jerarquía;
- identificar tipo de campo;
- detectar estados especiales.

### Estados que deberían verse claramente
- required;
- hidden;
- locked;
- readOnly;
- con API;
- con persistencia;
- con form JSON.

## 4. `ListViewToolbar`

Es una pieza pequeña pero crítica. Debe coordinar:

- título;
- contador;
- búsqueda;
- acciones bulk o auxiliares.

En sidebars estrechos, aquí suelen romperse primero los layouts. Conviene diseñarlo con fallback responsive desde el principio.

## 5. `DetailView`

Es el inspector real del producto.

### Meta principal
Hacer visible lo importante sin exponer lo raro demasiado pronto.

## 6. Secciones ideales

### Abiertas por defecto
- General
- Layout
- Data

### Cerradas por defecto
- Style
- Validation
- Connections
- Advanced

## 7. `DetailHeaderCard`

Debe ser compacto y sticky.

### Debe mostrar
- nombre del field;
- tipo;
- badges de estado;
- mini acciones.

### No debe hacer
- repetir todo lo que luego muestra Layout;
- convertirse en una card demasiado alta.

## 8. `DetailSectionCard`

Debe soportar colapso claro, buen título, descripción corta opcional y body consistente.

### Regla recomendable
máximo 2 o 3 secciones abiertas a la vez.

## 9. `DetailViewContent`

Aquí ocurre la composición real. Debe ser el sitio donde se decida:

- orden de secciones;
- qué se abre por tipo de field;
- qué se oculta por defecto;
- cómo se inyectan widgets complejos.

## 10. Riesgo principal del inspector

Si todo entra al mismo nivel visual, el inspector se vuelve fatigante.

### Solución
- grouping fuerte;
- disclosure progresivo;
- badges resumen;
- subbloques colapsables en configuraciones técnicas.

## 11. `docs`

La pestaña documental no debe competir con `detail` en prioridad cuando hay edición activa, pero sí debe estar lista para gestión de PDFs/páginas y estados vacíos útiles.

## 12. Recomendación de plataforma

Si lo quieres vender o reutilizar, el panel derecho debería evolucionar hacia un paquete configurable:

- outline mode;
- inspector mode;
- document rail mode;
- y layouts configurables (`stacked`, `split`, `auto`).
