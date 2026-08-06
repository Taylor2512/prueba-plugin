# Quick Start: Sistema Declarativo de Ejemplos

## Agregar nueva página en 3 pasos

### Paso 1: Editar pagesConfig.json
```json
{
  "pages": {
    "mi-nueva-pagina": {
      "title": "Mi Nueva Página",
      "modeBadge": "custom",
      "viewportName": "mi-nueva-pagina",
      "instanceId": "designer-single-user",
      "path": "/mi-pagina",
      "template": {
        "builder": "showcaseTemplate",
        "options": { "familySource": "all" }
      },
      "infoPanels": [
        {
          "key": "summary",
          "title": "Resumen",
          "type": "metrics",
          "metrics": [
            { "label": "Estado", "value": "Activo" }
          ]
        }
      ]
    }
  }
}
```

### Paso 2: Nada más
La página se genera automáticamente.

### Paso 3: Usar
```javascript
import { generatePages } from './examples/pages/generatePages.js';
const pages = generatePages();
const MyNewPage = pages['mi-nueva-pagina'];
```

---

## Cambiar configuración de una página

### Cambiar título
```json
// pagesConfig.json
"designer-single-user": {
  "title": "Nuevo título aquí"
}
```

### Cambiar badge
```json
"designer-multi-user": {
  "modeBadge": "nuevo badge"
}
```

### Cambiar template
```json
"runtime-form": {
  "template": {
    "builder": "multiUserShowcase",
    "options": { "familySource": "multiUser" }
  }
}
```

### Agregar panel de información
```json
"designer-single-user": {
  "infoPanels": [
    { "existing panels..." },
    {
      "key": "nuevo-panel",
      "title": "Mi Panel Nuevo",
      "type": "metrics",
      "metrics": [
        { "label": "Algo", "path": "state.campo" }
      ]
    }
  ]
}
```

---

## Cambiar datos globales (sin recompilación)

### Cambiar layout de página
Editar `config/layoutDefaults.json`:
```json
{
  "pageSize": {"width": 210, "height": 297},
  "pagePadding": [15, 15, 15, 15],        // ← cambiar aquí
  "gaps": {"column": 6, "row": 6},
  "fallbackSize": {"width": 45, "height": 7}
}
```

### Cambiar sample data
Editar `config/sampleData.json`:
```json
{
  "es": {
    "text": "Nuevo texto aquí",
    "fullName": "Nuevo nombre"
  },
  "en": {
    "text": "New text here",
    "fullName": "New name"
  }
}
```

### Cambiar recipients de colaboración
Editar `config/recipients.json`:
```json
{
  "multiUser": [
    {"id": "alice", "name": "Alice", "color": "#2563eb"},
    {"id": "bob", "name": "Bob", "color": "#f59e0b"},
    {"id": "nueva-persona", "name": "Nueva Persona", "color": "#8b5cf6"}
  ]
}
```

---

## Cambiar comportamiento de página

### Cambiar handler de evento
En `pagesConfig.json`:
```json
"designer-multi-user": {
  "handlers": {
    "onAssignmentChange": {
      "type": "increment",
      "field": "assignments",
      "record": true
    }
  }
}
```

### Ver handlers disponibles (commonHandlers)
En `helpers/handlerFactory.js`:
```javascript
export const commonHandlers = {
  onEvent,
  onTemplateChange,
  onRecipientsChange,
  onActiveRecipientChange,
  onAssignmentChange,
  onInputChange,
  onSave,
};
```

---

## Trabajar con perfiles de configuración

### Ver perfiles disponibles
En `config/sisad-pdfme.s.json`:
```json
{
  "profiles": {
    "designer-single-user": {...},
    "designer-multi-user": {...},
    "runtime-form": {...},
    "runtime-viewer": {...}
  }
}
```

### Cambiar comportamiento por profile
```json
{
  "profiles": {
    "designer-single-user": {
      "collaboration": {"enabled": false},
      "sidebars": {"right": {"defaultPanel": "detail"}}
    }
  }
}
```

---

## Extensiones Avanzadas

### Crear nuevo tipo de panel
En `components/DynamicInfoPanel.jsx`:
```javascript
const panelRenderers = {
  // Existentes: metrics, controller, events, families
  
  miPanelCustom: ({ config, context }) => (
    <div>
      {/* Tu contenido aquí */}
    </div>
  )
};
```

Usar en config:
```json
{
  "infoPanels": [
    {
      "key": "custom",
      "type": "miPanelCustom",
      "title": "Mi Panel Personalizado"
    }
  ]
}
```

### Crear nuevo handler personalizado
En `helpers/handlerFactory.js`:
```javascript
export const commonHandlers = {
  // ...
  miHandlerCustomo: (record) => (payload) => {
    // Tu lógica aquí
    record('miHandlerCustomo', payload);
  }
};
```

Usar en config:
```json
{
  "handlers": {
    "miHandlerCustomo": { "type": "custom" }
  }
}
```

---

## Debugging

### Ver configuración de una página
```javascript
import { getPageConfig } from './examples/pages/pageGenerator.js';
const config = getPageConfig('designer-single-user');
console.log(JSON.stringify(config, null, 2));
```

### Ver qué handlers se crean
```javascript
import { createPageHandlers } from './examples/pages/pageGenerator.js';
const handlers = createPageHandlers(config, context);
console.log('Handlers:', Object.keys(handlers));
```

### Validar pagesConfig.json
```javascript
import PagesConfig from './examples/config/pagesConfig.json';
Object.keys(PagesConfig.pages).forEach(key => {
  console.log(`✓ ${key} OK`);
});
```

---

## Checklist para Nueva Página

- [ ] Agregar entrada en `pagesConfig.json`
- [ ] Definir `title`, `modeBadge`, `viewportName`
- [ ] Seleccionar `instanceId` (designer-single-user, designer-multi-user, runtime-form, runtime-viewer)
- [ ] Configurar `template` (builder + options)
- [ ] Agregar `infoPanels` (mínimo 1)
- [ ] (Opcional) Definir `state` inicial
- [ ] (Opcional) Definir `handlers` si necesita eventos
- [ ] (Opcional) Definir `actions` para UI interactiva
- [ ] Testear: verificar que `getPageConfig(pageKey)` retorna datos válidos
- [ ] Listo ✓

---

## Comandos Útiles

### Validar JSON
```bash
node -e "console.log(JSON.stringify(require('./src/examples/config/pagesConfig.json'), null, 2))" | head -50
```

### Lint todos los ejemplos
```bash
npm run lint -- src/examples/
```

### Test de ejemplos
```bash
npm test src/examples/
```

---

## Cambios Frecuentes

| Necesito cambiar... | Archivo | Acción |
|------------|---------|--------|
| Título de página | pagesConfig.json | Editar `title` |
| Handler de evento | pagesConfig.json | Editar `handlers` |
| Panel de info | pagesConfig.json | Editar `infoPanels` |
| Layout de páginas | layoutDefaults.json | Editar valores |
| Datos de ejemplo | sampleData.json | Editar por locale |
| Recipients | recipients.json | Agregar/editar array |
| Profile de SISAD | sisad-pdfme.s.json | Editar `base` o `profiles` |
| Lógica de handler | handlerFactory.js | Editar `commonHandlers` |
| Renderizado de panel | DynamicInfoPanel.jsx | Editar `panelRenderers` |

---

## FAQ Rápido

**P: ¿Cómo agrego un locale nuevo?**
A: En `sampleData.json`, copia el objeto `es` con nombre nuevo (ej: `pt`).

**P: ¿Cómo cambio el template de una página?**
A: Edita `pagesConfig.json` → `pages[key].template.builder` y `options`.

**P: ¿Cómo agrego un recipient nuevo?**
A: En `recipients.json` → `multiUser` array, agrega `{id, name, color}`.

**P: ¿Cómo creo un handler personalizado?**
A: En `handlerFactory.js` → `commonHandlers`, crea función. Luego en config: `"handlers": { "nombre": { "type": "custom" } }`.

**P: ¿Puedo mixear declarativo e imperativo?**
A: Sí, puedes importar `UniversalPage` y wrappearla con lógica.

**P: ¿Dónde está el storage de configuración?**
A: Todo en JSON files bajo `src/examples/config/`.

**P: ¿Cuál es la fuente de verdad para páginas?**
A: `pagesConfig.json`. Si está en sync, todo está en sync.

---

## Próximas Tareas

- [ ] Auto-generar rutas desde `pagesConfig.json`
- [ ] Agregar validación de schema JSON
- [ ] Crear CLI tool para auditar config
- [ ] Migrador automático de páginas viejas
- [ ] Tests para cada página declarativa
