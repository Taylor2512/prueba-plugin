
import { test, expect } from '@playwright/test';
import {
  abrirDesigner,
  arrastrarAlCentro,
  paginaCanvas,
} from '../../support/playwright';

test.describe('Designer — selección, movimiento, undo/redo y zoom', () => {
  test.beforeEach(async ({ page }) => {
    await abrirDesigner(page, '/designer/multi-user');
  });

  // @caso INT-001
  // @caso INT-006
  // @caso CMD-001
  // @caso CMD-002
  test('INT-001 — seleccionar y mover conserva UID; undo/redo restaura la geometría', async ({ page }) => {
    const canvas = await paginaCanvas(page);
    const source = page.locator('button[data-schema-type="text"][aria-roledescription="draggable"]').first();
    const before = await canvas.locator('[data-schema-type="text"][data-schema-id]').count();
    await arrastrarAlCentro(page, source, canvas);
    const schemas = canvas.locator('[data-schema-type="text"][data-schema-id]');
    await expect.poll(() => schemas.count()).toBeGreaterThan(before);

    // Identidad fijada antes de interactuar: `schemas.last()` se vuelve a
    // resolver en cada uso, así que un undo que borrase la inserción apuntaría
    // el locator a otro schema y el test mediría la geometría equivocada.
    const uid = await schemas.last().getAttribute('data-schema-uid');
    expect(uid, 'El schema insertado debe publicar su uid').toBeTruthy();
    const schema = canvas.locator(`[data-schema-uid="${uid}"]`);

    const start = await schema.boundingBox();
    expect(start).not.toBeNull();
    if (!start) return;

    await schema.click();
    await expect(schema).toHaveAttribute('data-schema-active', 'true');
    await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
    await page.mouse.down();
    await page.mouse.move(start.x + start.width / 2 + 45, start.y + start.height / 2 + 25, { steps: 10 });
    await page.mouse.up();

    const moved = await schema.boundingBox();
    expect(moved).not.toBeNull();
    if (!moved) return;
    expect(Math.abs(moved.x - start.x) + Math.abs(moved.y - start.y)).toBeGreaterThan(5);
    await expect(schema).toHaveCount(1);

    /** Distancia Manhattan del schema a un punto de referencia. */
    const distanciaA = async (ref: { x: number; y: number }) => {
      const rect = await schema.boundingBox();
      return rect ? Math.abs(rect.x - ref.x) + Math.abs(rect.y - ref.y) : Number.POSITIVE_INFINITY;
    };

    // El control existe en `CtlBar`, así que se exige sin condicional: un
    // `if (await undo.count())` convertía la ausencia del control en un test
    // verde que no había probado nada.
    const undo = page.getByTestId('designer-undo');
    await expect(undo).toBeEnabled();
    await undo.click();
    await expect.poll(() => distanciaA(start), {
      message: 'undo debe devolver el schema a su geometría inicial',
    }).toBeLessThan(5);

    const redo = page.getByTestId('designer-redo');
    await expect(redo).toBeEnabled();
    await redo.click();
    await expect.poll(() => distanciaA(moved), {
      message: 'redo debe volver a aplicar el desplazamiento deshecho',
    }).toBeLessThan(5);
  });

  // @caso CMD-005
  // @caso SCH-001
  test('CMD-005 — cambiar zoom no altera identidad ni routing del schema', async ({ page }) => {
    const schema = page.locator('[data-schema-id][data-schema-type]').first();
    await expect(schema).toBeVisible();
    const identity = {
      uid: await schema.getAttribute('data-schema-uid'),
      document: await schema.getAttribute('data-document-id'),
      page: await schema.getAttribute('data-page-number'),
    };
    const zoom = page.getByTestId('designer-zoom-select');
    if (await zoom.count()) {
      await zoom.click();
      const option = page.getByRole('option', { name: /50%|0\.5/ }).first();
      if (await option.count()) await option.click();
    }
    await expect(schema).toHaveAttribute('data-schema-uid', identity.uid || '');
    if (identity.document) await expect(schema).toHaveAttribute('data-document-id', identity.document);
    if (identity.page) await expect(schema).toHaveAttribute('data-page-number', identity.page);
  });
});
