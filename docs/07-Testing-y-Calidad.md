# Testing, calidad y ejemplos de validación

## Capas de pruebas observadas

### Unit tests
La carpeta `tests/unit` cubre:

- `designerEngine`
- `detailSectionCard`
- `inlineEditOverlay`
- `selectionCommands`
- `collaboration`
- `collaborationSync`
- `changeSchemas`
- `staticSchema`

### E2E
`tests/playwright/pdfme-editor.spec.ts` valida flujos reales del editor.

## Lo que ya se comprueba

### Inline editing
Las pruebas E2E muestran que:
- se abre el toolbar contextual;
- se pulsa “Editar texto”;
- aparece `InlineEditOverlay`;
- se escribe contenido;
- Enter confirma;
- el overlay desaparece.

### Sidebars y toolbar
También se validan:
- expansión del catálogo;
- alineación de sidebars;
- cambios de modo del toolbar;
- navegación entre tabs del panel derecho;
- apertura/cierre de secciones;
- resumen de validación de configuración API.

### DetailSectionCard
Se comprueba que el colapso se reinicia al cambiar el token de reset.

### Engine
Las pruebas del engine cubren merge de `persistence`, `api` y `form`, además de resolución HTTP y runtime adapter.

### Colaboración
Las pruebas verifican updates y agrupación de assignments.

## Qué falta documentar

- cobertura por módulo;
- guías para escribir nuevos tests;
- qué va en unit vs Playwright;
- cómo mockear storage y fetch;
- pruebas de plugins nuevos;
- pruebas de performance visual.

## Criterios propuestos

### Unit tests
Deben cubrir:
- helpers puros;
- engine config;
- merge y normalización;
- widgets con reglas específicas;
- sincronización colaborativa.

### Integration tests
Deben cubrir:
- interacción entre `DetailView`, widgets y `mergeSchemaDesignerConfig`;
- cambios de selectionCommands;
- runtime adapter con mocks.

### Playwright
Debe cubrir:
- inserción de fields;
- edición inline;
- sidebars;
- docs rail;
- config API básica;
- persistencia;
- flujos multi-documento.

## Ejemplo de prueba unitaria

```ts
import { describe, expect, it } from 'vitest';
import { mergeSchemaDesignerConfig } from '../../src/sisad-pdfme/ui/designerEngine.js';

describe('mergeSchemaDesignerConfig', () => {
  it('preserva campos anidados al aplicar parches parciales', () => {
    const schema = { id: '1', name: 'test', type: 'text' };
    const next = mergeSchemaDesignerConfig(schema, {
      api: {
        enabled: true,
        endpoint: '/fields/options',
      },
    });

    expect(next).toBeDefined();
  });
});
```

## Ejemplo Playwright

```ts
test('abre el overlay inline y confirma con Enter', async ({ page }) => {
  await page.goto('/');
  await page.locator('button[data-schema-type="text"]').first().click();
  await page.getByRole('button', { name: 'Editar texto' }).click();
  await page.getByPlaceholder('Escribe el contenido').fill('Nuevo texto');
  await page.keyboard.press('Enter');
});
```

## Recomendaciones de calidad

1. todo nuevo widget complejo debe venir con al menos una prueba unitaria;
2. todo cambio de shell debe revisar Playwright;
3. agregar snapshots solo si aportan valor real;
4. documentar por qué una prueba existe;
5. priorizar tests sobre contratos, no sobre implementación incidental.

## Checklist de QA manual

- insertar cada tipo de schema;
- mover y redimensionar;
- abrir toolbar contextual;
- editar inline;
- abrir detalle;
- validar API;
- cambiar a docs;
- cambiar de página;
- generar PDF;
- probar viewer y form.
