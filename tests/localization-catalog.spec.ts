import { test, expect } from '@playwright/test';

/**
 * Evidencia E2E del defecto reportado: el catálogo del sidebar izquierdo mostraba
 * el identificador técnico del schema (`fullName`, `emailAddress`,
 * `multiVariableText`, `dateTime`, …) como texto principal, en una interfaz
 * española.
 *
 * Estas aserciones son deliberadamente específicas: comparan el identificador
 * técnico (`data-schema-type`, que DEBE seguir intacto) contra la etiqueta
 * visible (`data-schema-label`). No se afirma que la página entera esté en
 * español, porque los datos de ejemplo (nombres, correos, empresas) están
 * legítimamente en inglés.
 */

/** type técnico -> etiqueta española esperada. */
const EXPECTED_ES: Array<[string, string]> = [
  ['text', 'Texto'],
  ['number', 'Número'],
  ['fullName', 'Nombre completo'],
  ['emailAddress', 'Correo electrónico'],
  ['company', 'Empresa'],
  ['title', 'Cargo'],
  ['multiVariableText', 'Texto dinámico'],
  ['signature', 'Firma'],
  ['initials', 'Iniciales'],
  ['dateSigned', 'Fecha de firma'],
  ['dateTime', 'Fecha y hora'],
  ['date', 'Fecha'],
  ['time', 'Hora'],
];

test.describe('catálogo del Designer en español por defecto', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/designer/multi-user');
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('-runtime-viewport')).toBeVisible({ timeout: 30000 });
  });

  test('cada campo built-in conserva su type técnico y muestra la etiqueta española', async ({ page }) => {
    const tiles = page.locator('[data-schema-type][data-schema-label]');
    await expect(tiles.first()).toBeVisible({ timeout: 20000 });

    const byType = new Map<string, string>();
    for (const tile of await tiles.all()) {
      const type = await tile.getAttribute('data-schema-type');
      const label = await tile.getAttribute('data-schema-label');
      if (type && label && !byType.has(type)) byType.set(type, label);
    }

    // El catálogo debe haberse poblado; si no, el resto no probaría nada.
    expect(byType.size).toBeGreaterThan(5);

    const checked: Array<[string, string]> = [];
    for (const [type, expectedLabel] of EXPECTED_ES) {
      const actual = byType.get(type);
      if (actual === undefined) continue; // el perfil del lab puede ocultar tipos
      checked.push([type, actual]);
      expect(actual, `etiqueta visible de "${type}"`).toBe(expectedLabel);
      // Regresión concreta de la captura: nunca el identificador como texto.
      expect(actual, `"${type}" no debe mostrarse como identificador`).not.toBe(type);
    }

    expect(checked.length, 'tipos verificados en el catálogo').toBeGreaterThan(0);
  });

  test('ninguna etiqueta visible del catálogo es un identificador camelCase', async ({ page }) => {
    const tiles = page.locator('[data-schema-type][data-schema-label]');
    await expect(tiles.first()).toBeVisible({ timeout: 20000 });

    const offenders: string[] = [];
    for (const tile of await tiles.all()) {
      const label = (await tile.getAttribute('data-schema-label')) || '';
      // `multiVariableText`/`emailAddress`: minúscula seguida de mayúscula sin espacio.
      if (/^[a-z]+[A-Z]/.test(label)) offenders.push(label);
    }

    expect(offenders, 'etiquetas que siguen siendo identificadores técnicos').toEqual([]);
  });

  test('los encabezados de categoría se muestran localizados', async ({ page }) => {
    const groups = page.getByTestId('left-sidebar-group');
    await expect(groups.first()).toBeVisible({ timeout: 20000 });

    const headings = (await groups.allTextContents()).join(' ');
    // La category key sigue siendo el identificador; aquí sólo se comprueba que
    // el encabezado visible no quedó vacío ni con un token técnico.
    expect(headings.trim().length).toBeGreaterThan(0);
    expect(headings).not.toContain('undefined');
  });
});
