# Colaboración, sincronización y comentarios

## 1. Evolución del producto

La presencia de módulos de colaboración y pruebas de sync indica que el producto ya superó la etapa de editor individual. Eso es importante para posicionamiento comercial.

## 2. Familias de colaboración

### 2.1 Sincronización de cambios
Debe resolver cambios simultáneos sobre template, fields y estado de selección.

### 2.2 Presencia
Debe permitir saber quién está activo y posiblemente qué está editando.

### 2.3 Comentarios / anotaciones
Aporta revisión colaborativa y ciclos de aprobación.

## 3. `common/collaboration.ts` y `ui/collaboration.ts`

La separación entre common y ui sugiere correctamente dos capas:

- contrato/base operacional;
- adaptación a experiencia visual.

Eso está bien alineado con una plataforma reutilizable.

## 4. Tipos de conflictos a resolver

- dos usuarios editan el mismo field;
- uno reordena mientras otro renombra;
- uno borra mientras otro cambia propiedades;
- presencia desactualizada;
- comentarios sobre fields ya eliminados.

## 5. Estrategias posibles

### 5.1 Last write wins
Simple, pero riesgoso para UX compleja.

### 5.2 Lock explícito
Útil para operaciones críticas.

### 5.3 Patch merge semántico
Más potente, más costoso.

## 6. Recomendación práctica

Adoptar una estrategia híbrida:

- cambios simples: patch merge;
- operaciones destructivas: confirmación/lock;
- comentarios: persistencia independiente del layout cuando sea posible.

## 7. SchemaCollaborationWidget

Este widget puede evolucionar hacia un centro de estado colaborativo por field:

- quién lo está editando;
- lock activo;
- comentarios asociados;
- historial corto.

## 8. Comentarios

Los comentarios deben poder anclarse a:

- schema;
- página;
- zona del canvas;
- documento completo.

## 9. Casos comerciales

Esta capacidad abre escenarios fuertes:

- revisión legal;
- aprobación documental;
- trabajo equipo diseño/operaciones;
- auditoría de cambios.

## 10. Documentación recomendada por contrato

Cada capacidad colaborativa debería documentar:

- emisor;
- evento;
- payload;
- política de merge;
- garantías;
- fallback offline.

## 11. Testing colaborativo

Tienes tests de colaboración y sync; eso es clave para no degradar integridad. A futuro conviene añadir escenarios de conflicto, latencia y reconexión.

## 12. Conclusión

La colaboración debe tratarse como producto de plataforma: observable, documentada y tipada, no como plugin accesorio.
