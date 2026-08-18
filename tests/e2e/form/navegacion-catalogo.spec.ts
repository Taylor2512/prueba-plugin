import { expect, test } from '@playwright/test';

/**
 * Navegación del laboratorio: catálogo → Form → catálogo de schemas.
 *
 * Antes vivía en `test-form-navigation.spec.ts` junto con la edición de
 * schemas y el modo lectura del Viewer. Se separó porque lo que aquí se prueba
 * es el enrutado del host, no el runtime: un fallo de navegación y un fallo de
 * edición piden diagnósticos distintos.
 *
 * Las URLs son relativas a `baseURL`; el original las tenía absolutas a
 * `localhost:5174`, lo que rompía cualquier ejecución en otro puerto.
 */
test.describe('Lab — navegación entre superficies', () => {
  // @caso UC-34
  test('el catálogo enlaza al Form y el selector de rutas cambia de superficie', async ({ page }) => {
    await page.goto('/');

    const enlaceForm = page.getByRole('link', {
      name: 'Runtime · Form DigitalAgreements',
      exact: true,
    });
    await expect(enlaceForm).toHaveCount(1);
    await enlaceForm.click();
    await expect(page).toHaveURL(/\/runtime\/form\/digital-agreements$/);

    await expect(page.getByTestId('-topbar')).toBeVisible();
    await expect(page.getByTestId('-route-nav')).toHaveValue('/runtime/form/digital-agreements');

    const viewport = page.getByTestId('-runtime-viewport');
    await expect(viewport).toBeVisible();
    await expect(viewport.locator('input, textarea, select, button').first()).toBeVisible();
  });

  // @caso UC-35
  test('el catálogo de familias de schemas es navegable', async ({ page }) => {
    await page.goto('/runtime/form/digital-agreements');

    await page.getByTestId('-route-nav').selectOption('/schemas');
    await expect(page).toHaveURL(/\/schemas$/);
    await expect(page.getByRole('heading', { name: /Catálogo de familias/i })).toBeVisible();

    await page.getByRole('link', { name: /Texto y campos simples/i }).first().click();
    await expect(page).toHaveURL(/\/schemas\/text$/);
    await expect(page.getByRole('heading', { name: /Texto y campos simples/i })).toBeVisible();
  });
});
