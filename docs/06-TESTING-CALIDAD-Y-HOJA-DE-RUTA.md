# Testing, calidad y hoja de ruta

## 1. Estado actual de pruebas

El proyecto ya cuenta con pruebas en dos niveles:

### 1.1 Unit tests
- `designerEngine.test.ts`
- `detailSectionCard.test.tsx`
- `inlineEditOverlay.test.tsx`
- `selectionCommands.test.ts`
- `changeSchemas.test.ts`
- `collaboration.test.ts`
- `collaborationSync.test.ts`
- `staticSchema.test.tsx`

### 1.2 Playwright
- shell del editor
- apertura del catálogo
- toolbar contextual
- edición inline
- alineación de sidebars

Esto es una base muy buena para seguir evolucionando con confianza.

## 2. Qué ya está bien cubierto

- engine base
- edición inline
- acciones de selección
- piezas del inspector
- colaboración
- shell visual del editor

## 3. Qué conviene cubrir más

### 3.1 SchemaConnectionsWidget
Casos mínimos:
- persistencia enabled/disabled
- validación de key faltante
- API enabled con endpoint faltante
- auth manual incompleta
- form JSON summary

### 3.2 RightSidebar en modos
- list
- detail
- docs

### 3.3 Toolbar por modo
- micro
- compact
- expanded

### 3.4 geometry del toolbar
- selección simple
- selección múltiple
- canvas pequeño
- canvas con sidebars abiertos

## 4. Buen criterio para elegir tipo de prueba

### Unit test
Cuando validas:
- funciones puras
- builders
- contratos
- reducers/helpers
- widgets con branching claro

### Playwright
Cuando validas:
- flujo completo
- sidebars
- focus/blur
- toolbar
- inline edit
- interacciones canvas + inspector

## 5. Checklist de calidad por PR

1. ¿Qué capa toca?
2. ¿Hay test nuevo o test ajustado?
3. ¿Se validó visualmente en el demo?
4. ¿La documentación pública cambió?
5. ¿Se rompió una API interna o externa?
6. ¿El cambio toca runtime persistido o solo UI?

## 6. Hoja de ruta técnica sugerida

### Fase 1: estabilización
- terminar documentación modular
- cubrir conexiones y colaboración con más tests
- limpiar naming heredado en capas visibles

### Fase 2: plataforma
- separar core/editor/platform
- reducir nombres heredados del fork
- estabilizar exports públicos

### Fase 3: extensibilidad
- contracts versionados de widgets
- registry más robusto
- documentación de plugins propios

### Fase 4: producto vendible
- branding neutral de plataforma
- ejemplos de integración externos
- guía de adopción
- changelog de breaking changes

## 7. Documentación como parte de calidad

No basta con pruebas. En este proyecto, una buena parte de la calidad está en tener documentación por capas:

- arquitectura
- canvas
- inspector
- runtime
- colaboración
- testing

## 8. Ejemplo de caso de prueba recomendado

### Unit test de validación de config

```ts
it('marca warning cuando persistence.enabled=true y falta key', () => {
  const config = {
    persistence: { enabled: true },
    api: { enabled: false },
  };

  const missing = getMissingFields(config.persistence, config.api, null);
  expect(missing).toContain('storageKey');
});
```

### Playwright de edición inline

```ts
test('abre overlay de edición y confirma con Enter', async ({ page }) => {
  await page.goto('/');
  await page.locator('button[data-schema-type="text"]').first().click();
  await page.locator('[data-schema-type="text"]').first().click();
  await page.getByRole('button', { name: 'Editar texto' }).click();
  await page.getByPlaceholder('Escribe el contenido').fill('Nuevo texto');
  await page.keyboard.press('Enter');
});
```

## 9. Riesgos de calidad actuales

### 9.1 Demasiado conocimiento distribuido
Hay mucha lógica importante repartida entre docs, widgets y engine.

### 9.2 Nombre del producto todavía inestable
Si habrá una migración hacia plataforma más neutral, eso debe acompañarse con pruebas.

### 9.3 Crecimiento del inspector
Más configuración implica más puntos de fallo visual y lógico.

## 10. Métricas recomendadas para seguimiento

- tiempo medio de inserción y edición de un schema
- número de errores por config inválida de conexiones
- cobertura mínima de engine y runtime
- estabilidad de flujos Playwright básicos
- cantidad de breaking changes por release

## 11. Acciones recomendadas inmediatas

1. documentar mejor `designerEngine` y runtime adapter
2. añadir tests a `SchemaConnectionsWidget`
3. añadir tests al modo `docs`
4. documentar colaboración como subsistema formal
5. preparar guía de plataforma reusable

## 12. Conclusión

El proyecto ya tiene una base de calidad superior a la de un fork improvisado. La clave ahora es sostener la evolución con:
- pruebas enfocadas por subsistema
- documentación técnica modular
- naming estable
- una hoja de ruta explícita hacia plataforma reusable
