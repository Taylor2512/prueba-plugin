# Laboratorio de ejemplos — SISAD-PDFME

Host de demostración del runtime reusable (`src/sisad-pdfme`). Todo lo que se
ve en pantalla se deriva de datos: el manifest declara las rutas y sus paneles,
el archivo de datos declara familias y fixtures, y el registry de schemas del
paquete aporta los tipos descubiertos en tiempo de ejecución.

## Estructura

| Archivo | Responsabilidad |
| --- | --- |
| `index.jsx` | API pública. `getLab()` entrega las rutas resueltas al router del host. |
| `catalog.js` | Deriva familias, rutas, recipients, documentos y perfiles de config. |
| `builders.js` | Constructores de templates (puros, sin conocer manifest ni catálogo). |
| `runtime.js` | Fábrica de instancias y hooks compartidos del runtime. |
| `pages.jsx` | Página universal de runtime, páginas de documentación y `buildRouteDefinitions()`. |
| `ui.jsx` | Componentes Tailwind-only y `DynamicInfoPanel`. |
| `config/examplesManifest.json` | Rutas, paneles, handlers y descriptores de instancia. |
| `config/examplesData.json` | Layout de página, sample values, recipients, familias y documentos demo. |
| `config/sisad-pdfme.s.json` | Perfiles de configuración del runtime. |

Flujo de dependencias, sin ciclos:

```text
config/*.json → builders.js → catalog.js → ui.jsx → pages.jsx → index.jsx
                                        ↘ runtime.js ↗
```

## Agregar un ejemplo nuevo

No hace falta crear archivos: basta una entrada en `primaryRoutes` de
`config/examplesManifest.json`.

```json
{
  "id": "runtime-viewer-compacto",
  "path": "/runtime/viewer/compacto",
  "title": "Runtime · Viewer compacto",
  "description": "Solo lectura con un subconjunto reducido de familias.",
  "shell": "immersive",
  "instanceId": "runtime-viewer",
  "mode": "viewer",
  "viewportName": "runtime-viewer-compacto",
  "modeBadge": "viewer",
  "template": {
    "builder": "showcaseTemplate",
    "options": { "familyKeys": ["text", "table"] }
  },
  "infoPanels": [
    { "key": "events", "title": "Eventos", "description": "Acciones del viewer", "type": "events" }
  ]
}
```

Registra además la ruta en el bloque `routes` si no declaras `path`.

### Campos del manifest

- `mode`: `designer` | `form` | `viewer`. Define el descriptor de la instancia.
- `collaboration`: `true` añade estado de recipient activo al designer.
- `page`: usa una página de documentación (`catalog`, `schemas`) en lugar de la
  página universal de runtime.
- `template.builder` / `values.builder`: `showcaseTemplate`, `multiUserShowcase`
  o `snapshotForm`. Los registries viven en `pages.jsx`.
- `template.options`: `familyKeys` (lista explícita) o `familySource` (clave de
  `familySources` en `examplesData.json`).
- `formSnapshot`: snapshot declarativo del host que consume `snapshotForm`.
- `handlers`: `setState`, `setTemplate` o `increment`, con `field`, `format`
  (`nameValue`, `recipientId`), `valuePath` y `record`.
- `infoPanels`: paneles `metrics`, `controller`, `events` o `families`. Los
  `path` de las métricas se resuelven sobre el contexto de la página y soportan
  acceso anidado más `flat()`.

## Agregar una familia de schema

Añade la entrada a `families` en `config/examplesData.json`. La ruta
`/schemas/<slug>`, la tarjeta del catálogo y la página de familia se generan
solas. Los tipos declarados ahí son la semilla del orden; los que el registry
del paquete descubra se agregan automáticamente.

## Frontera

Este directorio es host-land: puede conocer el runtime reusable, nunca al revés.
El estilo externo es Tailwind-only; el runtime aporta su propia superficie
mediante `SISAD_PDFME_HOST_SURFACE_CLASS`.

<!-- project-tools:navigation:start -->
## Navegación generada
<!-- project-tools:navigation:end -->
