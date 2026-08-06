# Arquitectura Declarativa: /src/examples

## Visión General (Post-Refactorización)

Antes de esta refactorización, `/src/examples` tenía 800+ líneas de código duplicado. Ahora funciona 100% declarativamente desde JSON, con **una sola página universal y componentes reutilizables**.

```
┌─ USUARIO ──────────────────────────────────────────────────────────┐
│                    pagesConfig.json                                │
│  Define: title, badges, handlers, panels, template, state         │
└─────────────────────────┬────────────────────────────────────────┘
                          │
                    ┌─────▼─────┐
                    │   index   │
                    │.jsx (9 ℓ) │
                    └─────┬─────┘
                          │
            ┌─────────────┴──────────────┐
            │                            │
      ┌─────▼──────┐            ┌────────▼────────┐
      │generatePages│            │generatePages    │
      │.js (50 ℓ)  │            │ Returns exports │
      └─────┬──────┘            └────────┬────────┘
            │                            │
      ┌─────▼──────────┐         ┌───────▼──────────┐
      │ Universal Page │◄────────┤ UniversalPage.jsx│
      │  Component     │         │  (100 ℓ generic)│
      └─────┬──────────┘         └───────┬──────────┘
            │                            │
      ┌─────▼────────┐    ┌─────────────┬──────────────┐
      │  Handlers    │    │             │              │
      │  Library     │    │             │              │
      │ (80 ℓ)       │    │             │              │
      └──────────────┘    │      ┌──────▼───┐    ┌────▼─────┐
                          │      │ Dynamic  │    │ SISAD    │
                          │      │InfoPanel │    │Instance  │
                          │      │(80 ℓ)   │    │builders  │
                          └──────┴──────────┴────┴──────────┘
```

## Arquitectura en Capas

```
┌────────────────────────────────────────────────────────────────┐
│ 1. CONFIG LAYER (JSON)                                         │
│    pagesConfig.json ← Define todo lo que una página necesita  │
│    layoutDefaults.json, sampleData.json, recipients.json       │
│    sisad-pdfme.s.json (profiles)                              │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ 2. GENERATION LAYER (automático)                               │
│    pageGenerator.js ← Lee config y genera metadata             │
│    generatePages.js ← Crea todas las páginas                   │
│    handlerFactory.js ← Crea handlers desde spec                │
│    UniversalPage.jsx ← Componente único para cualquier config │
│    DynamicInfoPanel.jsx ← Renderiza paneles desde config      │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ 3. RUNTIME LAYER (ejecuta)                                     │
│    generated pages (designer / form / viewer)                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Ejecución

### Agregar nueva página (3 líneas)

**Antes: 80+ líneas de JSX + handlers + state**
```javascript
// 80+ líneas en NewPage.jsx
export function NewPageComponent({ currentPath }) {
  const [state, setState] = useState(...);
  const config = useRuntimeConfig(...);
  // ... 70+ más líneas
}
```

**Después: 1 línea en pagesConfig.json**
```json
{
  "pages": {
    "my-new-page": {
      "title": "Mi página nueva",
      "modeBadge": "custom",
      "instanceId": "designer-single-user",
      "template": { "builder": "showcaseTemplate" },
      "infoPanels": [
        { "key": "summary", "type": "metrics", "metrics": [...] }
      ]
    }
  }
}
```

Eso es todo. Automáticamente:
- Se genera `MyNewPage` component
- Se crea con handlers, state, config
- Se integra en el router

### Cambiar un handler (actualizar JSON)

**Antes: Edit archivo JSX**
```javascript
// Generated runtime page
const handleInputChange = useCallback(
  (payload) => {
    setLastInput(`${payload.name} = ${String(payload.value)}`);
    record('onInputChange', { campo: payload.name, índice: payload.index });
  },
  [record],
);
```

**Después: Edit pagesConfig.json**
```json
"handlers": {
  "onInputChange": {
    "type": "custom",
    "record": true,
    "fn": "customInputHandler"  // define en commonHandlers si es genérico
  }
}
```

---

## Componentes Clave

### 1. pageGenerator.js
Lee configuración JSON y devuelve funciones para construir páginas.

```javascript
export const getPageConfig = (pageKey) → PageConfig
export const buildPageTemplate = (config, builders, FAMILY) → Template
export const createPageHandlers = (config, context) → Handlers
export const getPageInfo = (config, state, computed) → InfoData
```

### 2. UniversalPage.jsx
Componente único que funciona para TODAS las páginas.

```javascript
export function createUniversalPage(pageKey, dependencies) {
  return function UniversalPageComponent({ currentPath }) {
    // 1. Load config
    // 2. Create state from config.state
    // 3. Create handlers from config.handlers
    // 4. Create instance using handlers
    // 5. Render with DynamicInfoPanel
  }
}
```

### 3. DynamicInfoPanel.jsx
Renderiza paneles de información según configuración.

```javascript
const panelRenderers = {
  metrics: ({ config, context }) => <MetricGrid ... />,
  controller: ({ context }) => <ControllerPanel ... />,
  events: ({ context }) => <EventLog ... />,
  families: () => <FamilyBadgeList ... />,
};
```

### 4. handlerFactory.js
Crea handlers desde especificación declarativa.

```javascript
export const createHandlers = (spec, context) → Handlers
export const commonHandlers = {
  onEvent, onTemplateChange, onRecipientsChange, ...
}
```

---

## Flujo de Datos en Página

```
pagesConfig.json
   │
   ├─→ pageGenerator.getPageConfig('designer-multi-user')
   │
   ├─→ buildPageTemplate(config, templateBuilders, FAMILY)
   │   └─→ buildShowcaseTemplate() or buildMultiUserShowcaseTemplate()
   │
   ├─→ createPageHandlers(config, { record, setTemplate, setState })
   │   ├─→ config.handlers: { onTemplateChange, onAssignmentChange, ... }
   │   └─→ commonHandlers: factory de funciones comunes
   │
   ├─→ createDesignerMultiUserInstance({
   │     template,
   │     config,
   │     ...handlers
   │   })
   │
   └─→ DynamicInfoPanel(
        config.infoPanels → renderiza paneles dinámicamente
      )
```

---

## Checklist de Configuración de Página

Para agregar una nueva página, completar estos campos en `pagesConfig.json`:

```json
{
  "pages": {
    "my-page": {
      "title": "string",                    // ✓ requerido
      "modeBadge": "string",                // ✓ requerido
      "viewportName": "string",             // ✓ requerido
      "instanceId": "string",               // ✓ requerido (key en instanceBuilders)
      "path": "/ruta/relativa",            // ✓ requerido
      
      "template": {                         // ✓ requerido
        "builder": "showcaseTemplate|multiUserShowcase",
        "options": { "familyKeys": [...] }
      },
      
      "state": {                            // opcional
        "field1": "initialValue",
        "field2": 0
      },
      
      "actions": {                          // opcional
        "recipientSelect": { "type": "select" }
      },
      
      "infoPanels": [                       // ✓ requerido
        {
          "key": "string",
          "title": "string",
          "description": "string",
          "type": "metrics|controller|events|families",
          "metrics": [                      // solo si type=metrics
            { "label": "string", "path": "state.field|template.path", "value": "static", "fallback": "default" }
          ]
        }
      ],
      
      "handlers": {                         // opcional
        "onEvent": { "type": "custom" },
        "onTemplateChange": { "type": "setTemplate", "record": true }
      }
    }
  }
}
```

---

## Patrones de Handler

```json
"handlers": {
  // Tipo: setState
  "onAssignmentChange": {
    "type": "increment",
    "field": "assignments",
    "record": true
  },
  
  // Tipo: setTemplate
  "onTemplateChange": {
    "type": "setTemplate",
    "record": true
  },
  
  // Tipo: custom (define en commonHandlers)
  "onInputChange": {
    "type": "custom",
    "record": true
  }
}
```

---

## Extender Panel Types

Para agregar nuevo tipo de panel, editar `DynamicInfoPanel.jsx`:

```javascript
const panelRenderers = {
  // Existentes: metrics, controller, events, families
  
  // Nuevo:
  myCustomPanel: ({ config, context }) => (
    <div>
      {/* render custom content */}
    </div>
  ),
};
```

Luego usar en `pagesConfig.json`:
```json
{
  "key": "custom",
  "type": "myCustomPanel",
  "title": "Mi Panel"
}
```

---

## Performance & Caching

- ✅ Config JSON se carga una sola vez
- ✅ pageGenerator crea factories (no re-renders)
- ✅ UniversalPage usa useMemo para handlers e instance
- ✅ No overhead comparado con páginas hardcodeadas

---

## Testing

### Unit: pageGenerator
```javascript
describe('pageGenerator', () => {
  it('should load page config', () => {
    const config = getPageConfig('designer-single-user');
    expect(config.title).toBe('Designer · una persona...');
  });
  
  it('should build template with familyKeys', () => {
    const template = buildPageTemplate(config, builders, FAMILY);
    expect(template.schemas.length).toBeGreaterThan(0);
  });
});
```

### Integration: UniversalPage
```javascript
describe('UniversalPage', () => {
  it('should render page from config', () => {
    const DesignerPage = createUniversalPage('designer-single-user', deps);
    const { getByText } = render(<DesignerPage />);
    expect(getByText('Designer · una persona...')).toBeInTheDocument();
  });
});
```

---

## Debugging

1. **Ver qué config carga una página:**
   ```javascript
   import { getPageConfig } from './pages/pageGenerator.js';
   const config = getPageConfig('designer-multi-user');
   console.log(JSON.stringify(config, null, 2));
   ```

2. **Ver qué template genera:**
   ```javascript
   import { buildPageTemplate } from './pages/pageGenerator.js';
   const template = buildPageTemplate(config, builders, FAMILY);
   console.log('Pages:', template.schemas.length);
   console.log('Schemas:', template.schemas.flat().length);
   ```

3. **Ver qué handlers crea:**
   ```javascript
   import { createPageHandlers } from './pages/pageGenerator.js';
   const handlers = createPageHandlers(config, context);
   console.log('Handlers:', Object.keys(handlers));
   ```

---

## FAQ

**P: ¿Cómo cambio el título de una página?**
A: Edita `pagesConfig.json` → `pages[pageKey].title`

**P: ¿Cómo agrego un nuevo panel a una página?**
A: Agrega objeto a `pages[pageKey].infoPanels` array

**P: ¿Cómo creo un handler personalizado?**
A: Agrégalo a `commonHandlers` en `handlerFactory.js`, luego referencia en config:
```json
"handlers": {
  "myHandler": { "type": "custom" }
}
```

**P: ¿Puedo mezclar declarativo + imperativo?**
A: Sí, UniversalPage acepta sobrescrituras:
```javascript
const MyPage = createUniversalPage('pageKey', dependencies);
// Luego wrappear con lógica imperativa si necesario
```

**P: ¿Cómo testeo un cambio en pagesConfig.json?**
A: Unit test en pageGenerator, integration test en UniversalPage:
```javascript
it('should reflect config change', () => {
  const config = getPageConfig('designer-single-user');
  expect(config.title).toMatch(/nuevo título/);
});
```

---

## Roadmap

- [ ] Auto-generate routes desde `pagesConfig.json`
- [ ] Strategy pattern para layouts alternativos
- [ ] CLI tool para validar `pagesConfig.json`
- [ ] Migrador automático de páginas viejas
- [ ] Schema validation para JSON config
