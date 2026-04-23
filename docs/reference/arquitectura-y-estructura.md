# Documentación de SISAD PDFME — Estructura del proyecto y módulos

## Propósito

SISAD PDFME es una plataforma de edición, visualización, generación y conversión de documentos PDF con soporte para diseñador visual, formularios dinámicos, configuración persistente por schema, integración HTTP configurable y colaboración multiusuario. El código actual ya no es un simple consumo de pdfme; conserva una base modular inspirada en ese runtime, pero introduce extensiones significativas en el motor, el catálogo de campos, el inspector de detalle, la colaboración y la experiencia de edición en canvas.

## Resumen arquitectónico

La solución se organiza alrededor de un núcleo modular:

- `src/sisad-pdfme/common`: tipos, helpers, constantes, registro de plugins, manipulación de templates y utilidades compartidas.
- `src/sisad-pdfme/converter`: roundtrip PDF ↔ imágenes y cálculo de tamaños.
- `src/sisad-pdfme/generator`: generación final de PDFs a partir de template e inputs.
- `src/sisad-pdfme/schemas`: catálogo de plugins/bloques para texto, tablas, códigos, gráficos, fechas, selección y más.
- `src/sisad-pdfme/ui`: diseñador, visor, runtime de formulario, engine configurable, componentes de canvas y sidebars.
- `src/features/pdfcomponent`: página demo/laboratorio y estado de aplicación del producto.
- `tests/unit` y `tests/playwright`: pruebas unitarias y E2E que validan el shell del editor, el engine, inline editing, colaboración y estabilidad de sidebars.

## Mapa de carpetas recomendado

```text
src/
  features/
    pdfcomponent/
      SisadPdfmeExample.jsx
      template.js
      domain/
      utils/
  sisad-pdfme/
    common/
    converter/
    generator/
    pdf-lib/
    schemas/
    ui/
      components/
      styles/
      types/
tests/
  unit/
  playwright/
docs/
```

> Nota de ruta histórica: la ruta `src/features/sisad-pdfme` se mantiene solo en referencias antiguas; el estado actual usa `src/features/pdfcomponent`.


## Flujo de responsabilidades

### 1. Common

`common` es la base de la plataforma. Aquí viven constantes, helpers, tipos compartidos y el `pluginRegistry`. Esta capa define contratos que consumen `schemas`, `generator` y `ui`. Se debe considerar la fuente de verdad del modelo.

Responsabilidades principales:

- definir `Template`, `Schema`, `SchemaForUI`, `Plugin`, props de render y props de panel de propiedades;
- proveer utilidades para transformar listas de schemas y plantillas;
- centralizar reglas generales para render de plugins;
- contener piezas del dominio reutilizables por editor y viewer.

### 2. Schemas

Cada plugin vive en `schemas/`. El patrón observable es consistente:

- `index.ts`: registra el plugin.
- `types.ts`: define el schema especializado.
- `uiRender.ts`: pinta el elemento en el canvas/runtime UI.
- `pdfRender.ts`: pinta el elemento final en el PDF.
- `propPanel.ts`: expone widgets para panel de propiedades.
- `helper.ts`: reglas auxiliares o de validación.

Este patrón permite encapsular el comportamiento por tipo sin acoplarlo al núcleo del editor.

### 3. UI

La capa `ui` orquesta el runtime visual. El corazón es `Designer.tsx`, que usa:

- catálogo izquierdo,
- canvas con overlays,
- inspector/lista/docs a la derecha,
- `designerEngine` para inyectar configuración y componentes,
- `selectionCommands` para centralizar acciones sobre selección.

También exporta `Form.tsx` y `Viewer.tsx`, con lo cual la misma plataforma sirve para edición, captura y visualización.

### 4. Generator y converter

`generator` transforma template + datos en PDF final. `converter` permite convertir PDF a imágenes, imágenes a PDF y medir PDFs. Son módulos transversales importantes para previsualización, roundtrip y automatizaciones.

### 5. PDF-lib fork

`pdf-lib` está integrado localmente como dependencia editable. El proyecto no solo consume el editor, también controla el pipeline de generación y manipulación del documento. Esto es estratégico porque evita bloqueos por limitaciones externas.

## Arquitectura del editor

El editor combina varias capas:

1. **Root / shell**: `Root`, `CtlBar`, `ErrorScreen`, `Preview`, `Renderer`.
2. **Designer**: organiza stage, sidebars, zoom, páginas, drag-and-drop y runtime API.
3. **Canvas**: `Canvas`, `Guides`, `Moveable`, `Selecto`, `Padding`, `SnapLines`, `Mask`.
4. **Overlays**: `CanvasOverlayManager`, `SelectionContextToolbar`, `InlineEditOverlay`, `InlineMetricsOverlay`, `SnapFeedbackOverlay`, `CanvasContextMenu`.
5. **Inspector derecho**: `RightSidebar`, `DetailView`, `ListView`, `DocumentsRail`.
6. **Catálogo izquierdo**: `LeftSidebar`, grupos, tabs, búsqueda y paneles personalizados.
7. **Engine**: configuración de sidebars, canvas, HTTP, hooks de schema y metadata.

## Principios del diseño de código

### Modularidad por responsabilidad

Cada zona del producto tiene carpetas y componentes dedicados. El objetivo correcto para futuras mejoras es conservar esta separación, no colapsarla en archivos monolíticos.

### Extensibilidad por engine

El `DesignerEngineBuilder` permite:

- reemplazar sidebars;
- ajustar feature toggles del canvas;
- definir style overrides y classNames;
- agregar componentes del canvas;
- configurar HTTP global;
- cambiar la clave de persistencia;
- personalizar identidad de schema;
- ejecutar hooks al crear schemas;
- auto-adjuntar identidad.

Este enfoque convierte al editor en una plataforma integrable.

### Extensibilidad por plugin

Cada schema se comporta como plugin reusable y puede renderizar tanto en UI como en PDF.

### Escalabilidad de UI

El uso de sidebars, secciones colapsables, toolbar contextual, overlays y `designerEngine` demuestra una intención clara de progressive disclosure y desacople visual.

## Recomendaciones de mejora estructural

### A. Renombrado final de plataforma

Aunque ya existe `sisad-pdfme`, la estructura todavía conserva conceptos heredados como `SisadPdfmeExample` y algunos nombres históricos en pruebas y docs. Conviene evolucionar a una marca y namespace de plataforma definitiva si el objetivo es vender o reutilizar.

Sugerencia:

- `src/sisad-pdfme` → `src/platform/pdf` o `src/sisad-pdf`
- `SisadPdfmeExample` → `PdfStudioPage`
- `Designer` → `PdfEditor`
- `Form` → `PdfFormRuntime`
- `Viewer` → `PdfViewer`

### B. Segregación de documentación

Hay mucha documentación existente, pero parte de ella es redundante o se superpone. Conviene consolidarla por dominios:

- arquitectura general;
- engine y configuración;
- runtime de datos y colaboración;
- editor UI/canvas;
- schemas/plugins;
- testing;
- migración y branding.

### C. Separar API pública y detalles internos

La documentación debería distinguir claramente entre:

- **API pública**: Builder, componentes principales, runtime API, contratos de configuración.
- **Internals**: helpers, layout interno de sidebars, detalles de render y optimización.

Esto reduce acoplamiento para consumidores externos.

## Ejemplo de integración mínima

```tsx
import React, { useMemo } from 'react';
import { Designer, DesignerEngineBuilder } from '@sisad-pdfme/ui';
import { builtInSchemaDefinitions } from '@sisad-pdfme/schemas';

export default function ContractEditor() {
  const engine = useMemo(
    () =>
      new DesignerEngineBuilder()
        .withCanvasFeatureToggles({
          guides: true,
          selecto: true,
          moveable: true,
          snapLines: true,
          padding: true,
          mask: false,
        })
        .withSchemaConfigStorageKey('__contractDesigner')
        .build(),
    [],
  );

  return (
    <Designer
      options={{ designerEngine: engine }}
      plugins={builtInSchemaDefinitions}
      template={{
        basePdf: '',
        schemas: [[]],
      }}
    />
  );
}
```

## Checklist de lectura del código

Cuando un desarrollador nuevo entra al proyecto, el orden recomendado es:

1. `src/sisad-pdfme/ui/Designer.tsx`
2. `src/sisad-pdfme/ui/designerEngine.ts`
3. `src/sisad-pdfme/ui/components/Designer/index.tsx`
4. `src/sisad-pdfme/ui/components/Designer/Canvas/*`
5. `src/sisad-pdfme/ui/components/Designer/RightSidebar/*`
6. `src/sisad-pdfme/common/*`
7. `src/sisad-pdfme/schemas/*`
8. `src/sisad-pdfme/generator/*`
9. `tests/unit/designerEngine.test.ts`
10. `tests/playwright/pdfme-editor.spec.ts`

## Riesgos actuales

- coexistencia de nombres históricos y nuevos;
- documentación parcialmente desactualizada frente al código real;
- superficie grande de CSS con prefijos heredados;
- duplicidad parcial entre documentación unificada, docs/ y documentación API localizada.

## Recomendación final

El proyecto ya debe tratarse como plataforma propia. Cualquier nueva mejora debería entrar con:

- documentación por módulo;
- ejemplos de uso reales;
- pruebas unitarias;
- migración de nombres públicos;
- ADRs para cambios estructurales.
