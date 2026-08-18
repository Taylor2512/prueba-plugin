
import { test, expect } from '@playwright/test';
import {
  abrirDesigner,
  arrastrarAlCentro,
  paginaCanvas,
  selectores,
} from '../../support/playwright';

test.describe('Designer — arrastre real de schemas', () => {
  test.beforeEach(async ({ page }) => {
    await abrirDesigner(page, '/designer/multi-user');
  });

  // @caso INT-006
  // @caso UC-35
  test('INT-006 — el catálogo expone contratos semánticos de drag y tipos únicos', async ({ page }) => {
    const buttons = page.locator(selectores.catalogoArrastrable);
    await expect(buttons.first()).toBeVisible();
    const data = await buttons.evaluateAll((els) =>
      els.map((el) => ({
        type: el.getAttribute('data-schema-type'),
        label: el.getAttribute('data-schema-label'),
        kind: el.getAttribute('data-schema-kind'),
        roleDescription: el.getAttribute('aria-roledescription'),
      })),
    );
    expect(data.length).toBeGreaterThan(10);
    expect(data.every((x) => x.type && x.label && x.kind && x.roleDescription === 'draggable')).toBe(true);
    expect(new Set(data.map((x) => x.type)).size).toBeGreaterThan(10);
  });

  // @caso INT-006
  // @caso SCH-001
  // @caso SCH-002
  test('INT-006 — arrastrar schemas representativos crea identidad, documento y página estables', async ({ page }) => {
    // Siete gestos de arrastre reales con su polling de inserción. En Chromium
    // entra en los 30 s por defecto; en Firefox no, y no por un fallo: con
    // `--timeout=150000` el spec completo pasa en ~49 s. `test.slow()` triplica
    // el presupuesto para este caso concreto en vez de relajar el timeout
    // global, que taparía fallos reales en el resto de la suite.
    test.slow();

    const target = await paginaCanvas(page, 0);
    const requested = ['text', 'number', 'checkbox', 'select', 'rectangle', 'ellipse', 'line'];

    for (let index = 0; index < requested.length; index += 1) {
      const type = requested[index];
      const source = page.locator(`button[data-schema-type="${type}"][aria-roledescription="draggable"]`).first();
      if (await source.count() === 0) {
        expect.soft(false, `El catálogo debe exponer ${type}`).toBe(true);
        continue;
      }
      const before = await target.locator(`[data-schema-type="${type}"][data-schema-id]`).count();
      await arrastrarAlCentro(page, source, target, (index % 3 - 1) * 70, Math.floor(index / 3) * 45 - 60);
      const items = target.locator(`[data-schema-type="${type}"][data-schema-id]`);
      await expect.poll(() => items.count(), { message: `Debe insertar ${type}` }).toBeGreaterThan(before);

      // Se fija la identidad ANTES de seguir: `items.last()` es un locator
      // perezoso que vuelve a resolverse en cada uso, así que cualquier
      // inserción o borrado posterior lo apuntaría a otro schema y el test
      // afirmaría cosas sobre un elemento distinto del que acaba de crear.
      const uid = await items.last().getAttribute('data-schema-uid');
      expect(uid, `El schema ${type} recién creado debe publicar su uid`).toBeTruthy();
      const created = target.locator(`[data-schema-uid="${uid}"]`);

      await expect(created).toHaveAttribute('data-page-number', '1');
      await expect(created).toHaveAttribute('data-document-id', /.+/);

      // Algunos tipos (`line`, por ejemplo) quedan seleccionados al soltarse.
      // En ese caso su propio control-box de Moveable cubre el schema e
      // intercepta el clic: insistir con `force` atravesaría el overlay y
      // dejaría de reproducir lo que puede hacer un usuario. Se pulsa sólo si
      // aún no está seleccionado; la aserción final es incondicional.
      if ((await created.getAttribute('data-schema-active')) !== 'true') {
        await created.click();
      }
      await expect(created).toHaveAttribute('data-schema-active', 'true');
      // La identidad sobrevive a la selección: sigue siendo el mismo nodo.
      await expect(created).toHaveCount(1);
    }
  });

  // @caso INT-006
  // @caso INT-015
  test('INT-006 — soltar fuera de una página no debe insertar un schema fantasma', async ({ page }) => {
    const source = page.locator('button[data-schema-type="text"][aria-roledescription="draggable"]').first();
    await expect(source).toBeVisible();
    const countBefore = await page.locator(`${selectores.paginaCanvas} [data-schema-type="text"][data-schema-id]`).count();
    const box = await source.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(5, 5, { steps: 12 });
    await page.mouse.up();
    await expect(page.locator(`${selectores.paginaCanvas} [data-schema-type="text"][data-schema-id]`))
      .toHaveCount(countBefore);
  });
});
