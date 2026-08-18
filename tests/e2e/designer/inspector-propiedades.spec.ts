import { expect, test } from '@playwright/test';
import { abrirDesigner, paginaCanvas } from '../../support/playwright';

/**
 * Antes se llamaba `test-1-direct-route.spec.ts`.
 *
 * Además del nombre, se corrigieron tres defectos del harness: URL absoluta a
 * `localhost:5174` (ignoraba `baseURL`), espera por `networkidle` (inestable
 * con polling) y timeouts artificiales de 10-30 s que enmascaraban la ausencia
 * de un contrato de superficie. Lo que el caso demuestra —el inspector aparece
 * al seleccionar un schema y su conmutador refleja el estado— no ha cambiado.
 */
test.describe('Designer — inspector de propiedades', () => {
  test.beforeEach(async ({ page }) => {
    await abrirDesigner(page, '/designer/multi-user');
  });

  // @caso INT-001
  // @caso SID-003
  test('la ruta directa monta el runtime con sus acciones principales', async ({ page }) => {
    const runtime = page.getByTestId('-runtime-viewport');
    await expect(runtime).toBeVisible();
    await expect(runtime.getByText(/Texto de ejemplo/)).toBeVisible();

    // Se busca dentro de la PÁGINA del canvas, no del viewport completo: el
    // catálogo del sidebar también publica tiles «Aprobar»/«Rechazar» con rol
    // de botón, así que buscar en el viewport resuelve a dos elementos.
    const pagina = await paginaCanvas(page);
    await expect(pagina.getByRole('button', { name: /Aprobar/ })).toBeVisible();
    await expect(pagina.getByRole('button', { name: /Rechazar/ })).toBeVisible();
  });

  // @caso INT-001
  // @caso SCH-001
  test('seleccionar un campo abre el inspector y su conmutador alterna', async ({ page }) => {
    const runtime = page.getByTestId('-runtime-viewport');
    const campo = runtime.locator('#text-0');
    await expect(campo).toBeVisible();
    await campo.click();

    const requerido = page.getByTestId('inspector-required-switch');
    await expect(requerido).toBeVisible();

    const inicial = await requerido.getAttribute('aria-checked');
    await requerido.click();
    await expect(requerido).not.toHaveAttribute('aria-checked', inicial ?? '');

    await requerido.click();
    await expect(requerido).toHaveAttribute('aria-checked', inicial ?? '');

    // El runtime sigue montado tras editar propiedades.
    await expect(runtime).toBeVisible();
  });
});
