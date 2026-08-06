# Pages Consolidation: De 17 a 8 Archivos

## Situación Actual

**Total de archivos en /pages: 17**

```
pages/
├─ CatalogPage.jsx ✅ NECESARIO (página especial)
├─ SchemaFamilyPage.jsx ✅ NECESARIO (página especial)
├─ SchemasCatalogPage.jsx ✅ NECESARIO (página especial)
├─ RuntimePageShell.jsx ✅ NECESARIO (shared component)
├─ PageFactory.jsx ⚠️ DEPRECADO (reemplazado por UniversalPage + DynamicRouter)
├─ UniversalPage.jsx ✅ NECESARIO (todas las páginas generadas)
├─ pageGenerator.js ✅ NECESARIO (orchestrator)
├─ generatePages.js ✅ NECESARIO (factory auto)
├─ DynamicRouter.jsx ✅ NUEVO (routing sin recarga)
├─ AppShell.jsx ✅ NUEVO (main entry point)
│
├─ DesignerSingleUserPage.jsx ❌ ELIMINABLE (reemplazado por generatePages)
├─ DesignerMultiUserPage.jsx ❌ ELIMINABLE (reemplazado por generatePages)
├─ RuntimeFormPage.jsx ❌ ELIMINABLE (reemplazado por generatePages)
├─ RuntimeViewerPage.jsx ❌ ELIMINABLE (reemplazado por generatePages)
│
├─ DesignerSingleUserInfo.jsx ❌ ELIMINABLE (reemplazado por DynamicInfoPanel)
├─ DesignerMultiUserInfo.jsx ❌ ELIMINABLE (reemplazado por DynamicInfoPanel)
├─ RuntimeFormInfo.jsx ❌ ELIMINABLE (reemplazado por DynamicInfoPanel)
├─ RuntimeViewerInfo.jsx ❌ ELIMINABLE (reemplazado por DynamicInfoPanel)
├─ SchemaFamilyInfo.jsx ❌ ELIMINABLE (reemplazado por DynamicInfoPanel)
```

## Plan de Consolidación

### Fase 1: Migración a Archivos Nuevos ✅ (HECHO)

Nuevos archivos creados:
- `DynamicRouter.jsx` — Router dinámico (sin recarga de página)
- `AppShell.jsx` — Entry point único

### Fase 2: Verificación de Que Pages Generadas No Usan Info Antiguos

Las páginas generadas automáticamente desde `generatePages.js` usan:
```javascript
// ✅ CORRECTO: UniversalPage usa DynamicInfoPanel
import { DynamicInfoPanel } from '../components/DynamicInfoPanel.jsx';
```

**NO usan:**
```javascript
// ❌ INCORRECTO: Info components viejos (DesignerSingleUserInfo, etc.)
```

### Fase 3: Archivos que Pueden Ser Eliminados

**Página components (reemplazados por generatePages):**
- `DesignerSingleUserPage.jsx` — Reemplazado por generatePages['designer-single-user']
- `DesignerMultiUserPage.jsx` — Reemplazado por generatePages['designer-multi-user']
- `RuntimeFormPage.jsx` — Reemplazado por generatePages['runtime-form']
- `RuntimeViewerPage.jsx` — Reemplazado por generatePages['runtime-viewer']

**Info components (reemplazados por DynamicInfoPanel):**
- `DesignerSingleUserInfo.jsx` — Consolidado en DynamicInfoPanel (type: metrics/controller/events)
- `DesignerMultiUserInfo.jsx` — Consolidado en DynamicInfoPanel (type: metrics/controller/events)
- `RuntimeFormInfo.jsx` — Consolidado en DynamicInfoPanel (type: metrics/events)
- `RuntimeViewerInfo.jsx` — Consolidado en DynamicInfoPanel (type: metrics/events)
- `SchemaFamilyInfo.jsx` — Consolidado en DynamicInfoPanel (type: metrics/events)

**Deprecated:**
- `PageFactory.jsx` — Reemplazado por DynamicRouter + UniversalPage

### Fase 4: Archivos Necesarios (8 archivos)

```
pages/
├─ CatalogPage.jsx ✅ (página especial)
├─ SchemaFamilyPage.jsx ✅ (página especial)
├─ SchemasCatalogPage.jsx ✅ (página especial)
├─ RuntimePageShell.jsx ✅ (shared layout)
├─ UniversalPage.jsx ✅ (todas las páginas generadas)
├─ DynamicRouter.jsx ✅ (routing sin recarga)
├─ AppShell.jsx ✅ (entry point)
├─ pageGenerator.js ✅ (orchestrator)
└─ generatePages.js ✅ (factory)
```

**Reducción: 17 → 9 archivos (-47%)**

## Cómo Usar

### Opción 1: Usar AppShell (Recomendado)
```javascript
import { AppShell } from '@/examples';

export function App() {
  return <AppShell initialPath="/" />;
}
```

**Beneficios:**
- ✅ Routing dinámico (sin recarga de página)
- ✅ Manejo automático de historia (back/forward)
- ✅ Página se actualiza sin F5
- ✅ Todas las páginas cargadas dinámicamente

### Opción 2: Usar Páginas Individuales (Testing)
```javascript
import { DesignerSingleUserPage } from '@/examples';

export function App() {
  return <DesignerSingleUserPage currentPath="/designer/single-user" />;
}
```

**Nota:** Esto es para tests. En producción usa AppShell.

## Migración Step-by-Step

### Step 1: Reemplazar en index.jsx
```javascript
// ANTES:
import { DesignerSingleUserPage } from './pages/DesignerSingleUserPage.jsx';

// DESPUÉS:
import { AppShell, DesignerSingleUserPage } from './pages/generatePages.js';
```

### Step 2: Usar AppShell
```javascript
// ANTES (cargaba una página estática):
export default DesignerSingleUserPage;

// DESPUÉS (carga dinámicamente):
export default AppShell;
```

### Step 3: Eliminar Archivos Viejos (Después de verificar)
```bash
# DESPUÉS de verificar que generatePages cubre todas las páginas:
rm src/examples/pages/DesignerSingleUserPage.jsx
rm src/examples/pages/DesignerMultiUserPage.jsx
rm src/examples/pages/RuntimeFormPage.jsx
rm src/examples/pages/RuntimeViewerPage.jsx
rm src/examples/pages/*Info.jsx
rm src/examples/pages/PageFactory.jsx
```

## Beneficios de Consolidación

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Archivos en /pages | 17 | 9 | 47% ↓ |
| Info components | 5 | 0 | 100% ↓ |
| Page component files | 4 | 0 | 100% ↓ |
| Routing | Con recarga | Sin recarga | ✅ |
| Navigation code | Duplicado | Centralizado | ✅ |

## Navegación Dinámica sin Recarga

### Cómo Funciona

1. **DynamicRouter** mantiene estado de `currentPath`
2. **generatePages** crea ComponenteWrappers para cada página
3. **navigateTo** actualiza el path y dispara re-render
4. **useRouter hook** permite acceso a navegación desde cualquier componente
5. **History API** (popstate) maneja back/forward del browser

### Ejemplo: Navegar Desde Componente

```javascript
import { useRouter } from '@/examples';

function NavigationMenu() {
  const { navigateTo } = useRouter();

  return (
    <button onClick={() => navigateTo('/designer/single-user')}>
      Designer Single User
    </button>
  );
}
```

### Ejemplo: Navegar Con Helpers

```javascript
import { useNavigation } from '@/examples/helpers/navigation.js';

function NavigationMenu() {
  const nav = useNavigation();

  return (
    <>
      <button onClick={nav.toDesignerSingleUser}>Designer</button>
      <button onClick={nav.toRuntimeForm}>Form</button>
      <button onClick={nav.toCatalog}>Catalog</button>
    </>
  );
}
```

## Testing

### Unit Testing (Páginas Individuales)

```javascript
import { DesignerSingleUserPage } from '@/examples';

describe('DesignerSingleUserPage', () => {
  it('should render', () => {
    const { getByText } = render(<DesignerSingleUserPage />);
    expect(getByText(/Designer · una persona/)).toBeInTheDocument();
  });
});
```

### Integration Testing (Routing)

```javascript
import { AppShell } from '@/examples';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('AppShell Routing', () => {
  it('should navigate without page reload', async () => {
    const user = userEvent.setup();
    const { container } = render(<AppShell initialPath="/" />);

    // Navegar a página
    const nav = screen.getByRole('navigation');
    const designerLink = within(nav).getByText('Designer');
    await user.click(designerLink);

    // Verificar que currentPath cambió (sin recarga)
    expect(window.location.pathname).toBe('/designer/single-user');
    expect(container.querySelector('[data-page-id]')).toBeInTheDocument();
  });
});
```

## Archivo de Consolidación

- **Archivos hoy**: 17 en /pages
- **Archivos mañana**: 9 en /pages
- **Eliminación segura**: Después de verificar equivalencia
- **Beneficio neto**: 47% menos archivos, 0% menos funcionalidad

## Checklist de Migración

- [x] Crear DynamicRouter.jsx
- [x] Crear AppShell.jsx
- [x] Crear navigation helpers
- [x] Exportar AppShell desde index.jsx
- [ ] Verificar que todas las páginas generadas funcionan
- [ ] Verificar que routing sin recarga funciona
- [ ] Actualizar tests
- [ ] Documentar cambios
- [ ] Eliminar archivos viejos
- [ ] Actualizar imports en otros módulos
