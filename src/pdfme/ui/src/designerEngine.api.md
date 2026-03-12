# Designer Engine APIs

## Objetivo
Desacoplar el diseñador en piezas reutilizables para poder usar solo lo necesario:
- sidebars reemplazables
- canvas por slots
- feature flags
- estilos por `className`/`styleOverrides`
- metadata de schema (identidad, prefill e integraciones)

## Builder

```ts
import { DesignerEngineBuilder } from '@pdfme/ui';

const engine = new DesignerEngineBuilder()
  .withLeftSidebar(MyLeftSidebar)
  .withRightSidebar(MyRightSidebar)
  .withCanvasFeatureToggles({
    guides: true,
    selecto: true,
    moveable: true,
    snapLines: true,
    padding: false,
    mask: true,
  })
  .withCanvasClassNames({
    canvasContainer: 'my-canvas',
    moveable: 'my-moveable',
    guides: 'my-guides',
  })
  .withCanvasStyleOverrides({
    canvasContainer: { background: '#f8fafc' },
    moveable: { color: '#7c3aed' },
    snapLines: { lineColor: '#0ea5e9', centerColor: '#ef4444' },
  })
  .withSchemaConfigStorageKey('__designer')
  .withAutoAttachIdentity(true)
  .build();

const options = new DesignerEngineBuilder().buildOptions({
  themePreset: 'sisad',
  designerEngine: engine,
});
```

## Runtime API adicional

`Designer` expone:
- `getSchemaConfig(schemaIdOrName, matcher?)`
- `setSchemaConfig(schemaIdOrName, patch, matcher?)`
- `applyExternalPrefill(payload, matcher?)`

Matchers soportados:
- `id`
- `name`
- `identity`
- `prefill-source`

## Metadata de schema

Cada schema puede guardar config en `__designer` (o la key que definas):

```ts
{
  __designer: {
    identity: { id, key, namespace, version, tags },
    prefill: { enabled, strategy, sourceKey, resolverId, endpoint, method, mapping, headers },
    integrations: [{ provider, operation, endpoint, authRef, params, enabled }],
    metadata: { className, style }
  }
}
```
