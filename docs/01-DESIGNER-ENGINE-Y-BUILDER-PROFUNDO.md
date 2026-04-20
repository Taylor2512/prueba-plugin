# Designer Engine y Builder: análisis profundo

## 1. Rol del engine en la plataforma

El `designerEngine` es el punto neurálgico del editor. No solo actúa como contenedor de configuración, sino como una **capa de orquestación** entre tres mundos:

- la UI interactiva del diseñador;
- el modelo persistente de schemas;
- el runtime de integraciones, persistencia, HTTP y comportamiento contextual.

En la práctica, el engine define qué puede hacer el editor, cómo se representa la configuración adicional de los schemas y qué políticas globales gobiernan al sistema.

## 2. Por qué es una pieza de plataforma y no solo de UI

En el repositorio actual, la evolución del builder lo aleja del concepto original de un simple helper de inicialización. Su responsabilidad real ya incluye:

- feature flags del canvas;
- configuración de sidebars;
- configuración HTTP global heredable;
- hooks de identidad y creación de schema;
- políticas de almacenamiento de configuración por schema;
- soporte para formularios JSON, API, persistencia y prefill.

Eso lo convierte en una **superficie de plataforma**, no solo de presentación.

## 3. Responsabilidades actuales observables

A nivel de diseño, el builder debería considerarse responsable de estas familias:

### 3.1 Configuración visual global
- layout general del editor;
- width/estado de sidebars;
- visibilidad de paneles;
- feature toggles del canvas.

### 3.2 Configuración semántica de schema
- almacenamiento de config adicional dentro del schema;
- identidad de schema;
- hooks de creación;
- persistencia y merge seguro.

### 3.3 Configuración operativa
- cliente HTTP heredable;
- auth y headers globales;
- políticas de runtime de datos;
- callbacks de form JSON y colaboración.

## 4. Builder fluido: ventajas y riesgos

El patrón builder te da varias ventajas:

- lectura declarativa;
- configuración incremental;
- facilidad para componer entornos distintos;
- encapsulación de defaults.

Pero también tiene riesgos claros:

- crecimiento excesivo de superficie pública;
- ambigüedad entre opciones visuales y opciones de dominio;
- dificultad para versionar contratos si todo entra en el mismo builder;
- tentación de meter lógica de negocio adentro.

## 5. Recomendación de segmentación del builder

La evolución lógica del engine builder es dividir su API por familias. En vez de que todo viva como una lista plana de `withX`, conviene agrupar mental y documentalmente sus responsabilidades.

### 5.1 Grupo de UI
- `withCanvasFeatureToggles`
- `withLeftSidebarConfig`
- `withRightSidebarConfig`
- `withToolbarConfig`

### 5.2 Grupo de schema config
- `withConfigStorageKey`
- `withSchemaIdentityFactory`
- `withSchemaCreationHook`
- `withAutoAttachIdentity`

### 5.3 Grupo de runtime de datos
- `withHttpAxiosConfig`
- `withDataRuntimeAdapter`
- `withFormJsonConfig`
- `withPrefillConfig`

### 5.4 Grupo de colaboración
- `withCollaborationConfig`
- `withPresenceConfig`
- `withCommentaryConfig`

## 6. Contratos internos recomendados

Para seguir creciendo sin desorden, conviene formalizar contratos con nombres propios.

### 6.1 `EditorUiConfig`
Debe concentrar todo lo visual y de layout.

### 6.2 `SchemaConfigStoragePolicy`
Debe definir dónde y cómo se guarda configuración adicional dentro del schema.

### 6.3 `EditorHttpRuntimeConfig`
Debe centralizar baseURL, timeout, auth, herencia y overrides.

### 6.4 `EditorCollaborationConfig`
Debe contener sync, presencia, comentarios, locking y canales.

## 7. Qué mejorar en el engine actual

### 7.1 Separar configuración visual de configuración operativa
Hoy la plataforma ya mezcla UI y runtime. Eso funciona, pero documentar y tipar esa separación ayuda muchísimo.

### 7.2 Aislar la semántica de schema config
La configuración extra de cada schema no debería depender de conocer detalles de UI. Debe sentirse como un contrato del dominio del editor.

### 7.3 Introducir presets de entorno
Sería muy útil tener presets como:

- `createMinimalEditorEngine()`
- `createFormsEditorEngine()`
- `createCollaborativeEditorEngine()`
- `createEnterpriseEditorEngine()`

Eso te permitiría vender o reutilizar la plataforma con paquetes de capacidades.

## 8. Ejemplo de inicialización deseable

```ts
import { PdfEditorEngineBuilder } from '@sisad-pdfme/ui';

const engine = new PdfEditorEngineBuilder()
  .withCanvasFeatureToggles({ guides: true, snapLines: true, padding: true })
  .withConfigStorageKey('__sisadpdfme')
  .withAutoAttachIdentity(true)
  .withHttpAxiosConfig({
    inheritSystem: true,
    timeout: 8000,
  })
  .build();
```

## 9. Riesgos de mantenimiento

- acoplar demasiados módulos al builder;
- volver costosos los cambios de tipos;
- introducir defaults ambiguos;
- usar el builder para resolver cosas que deberían pertenecer a servicios runtime.

## 10. Recomendación de producto

Si quieres vender o reutilizar este sistema, el engine debe convertirse en el **punto oficial de configuración de plataforma**. Debe estar impecablemente documentado, versionado y estable.

## 11. Ejemplo de documentación pública mínima por método

Cada método del builder debería documentar:

- propósito;
- tipo de entrada;
- valor por defecto;
- efectos sobre el runtime;
- interacción con otros métodos;
- riesgos de uso.

## 12. Decisión estratégica

Tu engine ya no es “un helper de pdfme modificado”. Es el núcleo de una plataforma de edición PDF enriquecida. Trátalo como tal en naming, documentación y versionado.
