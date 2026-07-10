# Documentación técnica — Runtime SISAD PDFME

## Propósito del paquete

Este bloque de archivos centraliza la capa de runtime entre hosts React y los runtimes PDFME:

```txt
Host React
  ├─ buildRuntimeOptions / buildDesignerRuntimeOptions / buildRuntimeFormOptions / buildRuntimeViewerOptions
  ├─ usePdfmeRuntimeInstance
  └─ usePdfmeArtifacts
       ├─ generate
       ├─ pdf2size
       ├─ pdf2img
       └─ img2pdf
```

La idea correcta es que el host configure y observe, pero el runtime siga controlando `Designer`, `Form` y `Viewer`.

---

## Archivo: options.ts

Responsabilidad:

```txt
- definir token visual por defecto;
- fusionar theme token sin mutar opciones originales;
- construir opciones base para runtime;
- construir opciones específicas para designer/form/viewer.
```

Funciones principales:

- `buildRuntimeOptions`: base común para todos los modos.
- `buildDesignerRuntimeOptions`: agrega `themePreset` y `designerEngine`.
- `buildRuntimeFormOptions`: agrega `zoomLevel`, `signatureModalFlow`, `signatureSessionKey` y `signatureSigner`.
- `buildRuntimeViewerOptions`: base para viewer.

Riesgo técnico:

```txt
runtimeOptions se clona superficialmente. Si el host muta objetos internos luego de construir options, puede provocar cambios no controlados.
```

---

## Archivo: runtimeModes.ts

Responsabilidad:

```txt
- declarar modos válidos: designer, form, viewer;
- validar modo runtime;
- normalizar mensajes de error;
- formatear estado de página;
- resolver modo UX inicial desde query/stored/fallback.
```

Observación:

El storage key no vive aquí. Eso es correcto porque el almacenamiento es responsabilidad del host/lab.

---

## Archivo: usePdfmeArtifacts.ts

Responsabilidad:

```txt
- ejecutar generación de PDF;
- ejecutar conversión PDF → tamaños;
- ejecutar conversión PDF → imágenes;
- reconstruir PDF desde imágenes;
- manejar object URLs y revocarlos correctamente;
- reportar estados mediante onStatus.
```

Decisión arquitectónica importante:

```txt
generate, pdf2size, pdf2img e img2pdf se inyectan.
```

Esto evita acoplar el hook directamente a paquetes pesados y facilita pruebas unitarias.

Riesgos técnicos:

```txt
1. busy es boolean único. Si dos acciones se disparan al mismo tiempo, una puede limpiar busy mientras otra sigue ejecutándose.
2. runImg2Pdf usa fetch sobre object URLs. Funciona en browser, pero no es portable a SSR/test sin mock.
3. pdfSizes está tipado como any[]. Conviene reemplazarlo por Size[] si el contrato está disponible.
4. inputs/template/plugins usan any. En una fase futura se puede tipar con Template, Plugins e Inputs.
```

---

## Archivo: usePdfmeRuntimeInstance.ts

Responsabilidad:

```txt
- montar Designer/Form/Viewer en un contenedor;
- remount por cambio de mode;
- actualizar options/template/inputs sin recrear instancia innecesariamente;
- evitar echo loops entre runtime y host;
- destruir instancia de forma segura;
- exponer instanceRef.
```

Decisiones importantes:

```txt
- Designer/Form/Viewer se inyectan como constructors.
- template se clona con cloneDeep antes de entrar al runtime.
- inputs se sincronizan solo en form/viewer.
- onChangeTemplate marca templateSyncFromDesignerRef para saltar el eco inmediato.
- onChangeInput marca inputsSyncFromRuntimeRef para saltar el eco inmediato.
```

Riesgos técnicos:

```txt
1. scheduleDestroyInstance usa setTimeout(0). Está justificado para evitar carreras de nodo desmontado, pero no debe usarse para geometría/canvas.
2. getTemplateSignature usa JSON.stringify sobre basePdf + schemas. En templates muy grandes puede costar; si crece, conviene hash estable incremental.
3. El hook remonta solo por mode. Cambios profundos en runtime constructors/plugins no remountan salvo que host cambie mode o fuerce recreación.
4. options se compara por referencia. Si el host crea options nuevas en cada render, se llamará updateOptions frecuentemente.
```

---

## Reglas de uso

```txt
[ ] No poner reglas SISAD dentro de estos hooks.
[ ] No manipular Moveable/Selecto/canvas desde aquí.
[ ] No duplicar renderers de schemas.
[ ] No usar estos hooks para resolver lógica de firma real.
[ ] No introducir CSS ni z-index aquí.
[ ] Mantener generación/conversión por inyección de dependencias.
```

## Mejoras futuras recomendadas

```txt
1. Reemplazar any por tipos reales: Template, Plugins, Inputs, Size.
2. Cambiar busy boolean por contador o estado discriminado si se permiten operaciones paralelas.
3. Agregar action guards para evitar doble click simultáneo.
4. Extraer status event type a union tipada.
5. Considerar hash estable para getTemplateSignature en templates grandes.
```
