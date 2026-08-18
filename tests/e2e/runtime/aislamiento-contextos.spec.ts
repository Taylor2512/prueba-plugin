import { test, expect } from '@playwright/test';
import {
  abrirForm,
  escribirCampo,
  leerCampo,
  raiz,
  selectores,
} from '../../support/playwright';

test.describe('Runtime — aislamiento multiusuario y multidocumento', () => {
  /**
   * Contrato de identidad de los schemas montados en el Form.
   *
   * La versión anterior exigía además `data-document-id` en cada nodo. El Form
   * no lo publica: el documento activo es una selección de runtime —el
   * conmutador `lab-active-document-select`— y no un atributo por schema. Sólo
   * el Designer lo estampa. El aislamiento POR documento queda demostrado por
   * el test siguiente, que es donde de verdad se puede observar.
   */
  // @caso DOC-002
  // @caso UC-09
  // @caso UC-10
  test('DOC-002 — cada schema montado publica identidad y página únicas', async ({ page }) => {
    await abrirForm(page, '/runtime/form/multi-document');
    const schemas = page.locator('[data-schema-id][data-schema-type]');
    await expect(schemas.first()).toBeVisible();

    const filas = await schemas.evaluateAll((els) =>
      els.map((el) => ({
        id: el.getAttribute('data-schema-id'),
        uid: el.getAttribute('data-schema-uid'),
        page: el.getAttribute('data-page-number'),
      })),
    );

    expect(filas.length).toBeGreaterThan(0);
    expect(filas.filter((x) => !x.id || !x.uid || !x.page)).toEqual([]);
    // Sin uids únicos, cualquier aserción posterior podría apuntar a otro nodo.
    expect(new Set(filas.map((x) => x.uid)).size).toBe(filas.length);
  });

  // @caso DOC-002
  // @caso RUN-004
  test('DOC-002 — cambiar documento conserva inputs independientes por documentId', async ({ page }) => {
    await abrirForm(page, '/runtime/form/multi-document');
    const documentSelect = page.getByTestId('lab-active-document-select');
    await expect(documentSelect).toBeVisible();

    const documentIds = await documentSelect.locator('option').evaluateAll((els) =>
      els.map((el) => (el as HTMLOptionElement).value).filter(Boolean),
    );
    expect(documentIds.length).toBeGreaterThan(1);

    await documentSelect.selectOption(documentIds[0]);
    const firstA = page.locator('[data-schema-type="text"][data-schema-id]').first();
    await expect(firstA).toBeVisible();
    await escribirCampo(firstA, 'VALOR-DOCUMENTO-A');

    await documentSelect.selectOption(documentIds[1]);
    const firstB = page.locator('[data-schema-type="text"][data-schema-id]').first();
    await expect(firstB).toBeVisible();
    await escribirCampo(firstB, 'VALOR-DOCUMENTO-B');

    await documentSelect.selectOption(documentIds[0]);
    const restoredA = page.locator('[data-schema-type="text"][data-schema-id]').first();
    await expect.poll(() => leerCampo(restoredA)).toBe('VALOR-DOCUMENTO-A');

    await documentSelect.selectOption(documentIds[1]);
    const restoredB = page.locator('[data-schema-type="text"][data-schema-id]').first();
    await expect.poll(() => leerCampo(restoredB)).toBe('VALOR-DOCUMENTO-B');
  });

  // @caso DECL-UC-008
  // @caso UC-07
  test('DECL-UC-008 — cambiar usuario proyecta sus schemas asignados y aísla valores', async ({ page }) => {
    await abrirForm(page, '/runtime/form/multi-user');
    const userSelect = page.getByTestId('lab-active-user-select');
    await expect(userSelect).toBeVisible();
    const userIds = await userSelect.locator('option').evaluateAll((els) =>
      els.map((el) => (el as HTMLOptionElement).value).filter(Boolean),
    );
    expect(userIds.length).toBeGreaterThan(1);

    const visibleUids = async () =>
      page.locator('[data-schema-id][data-schema-type]').evaluateAll((els) =>
        els.map((el) => el.getAttribute('data-schema-uid')).filter(Boolean),
      );

    await userSelect.selectOption(userIds[0]);
    const before = await visibleUids();
    expect(before.length).toBeGreaterThan(0);
    const editableA = page.locator('[data-schema-type="text"][data-schema-id][data-schema-readonly="false"]').first();
    await expect(editableA).toBeVisible();
    await escribirCampo(editableA, 'VALOR-USUARIO-A');

    await userSelect.selectOption(userIds[1]);
    const afterSwitch = await visibleUids();
    expect(afterSwitch.length).toBeGreaterThan(0);
    expect(afterSwitch).not.toEqual(before);
    expect(afterSwitch.filter((uid) => before.includes(uid))).toEqual([]);

    await expect(page.locator('[data-schema-uid="text-0"]')).toHaveCount(0);

    await userSelect.selectOption(userIds[0]);
    const restoredA = page.locator('[data-schema-type="text"][data-schema-id][data-schema-readonly="false"]').first();
    await expect.poll(() => leerCampo(restoredA)).toBe('VALOR-USUARIO-A');
  });

  // @caso QLT-006
  test('QLT-006 — navegar y recargar no produce errores JavaScript no controlados', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await abrirForm(page, '/runtime/form/multi-document');
    await page.reload({ waitUntil: 'domcontentloaded' });
    // Tras recargar debe volver a montar la MISMA superficie, no una cualquiera.
    await expect(page.locator(raiz.form).first()).toBeVisible();
    await expect(page.locator(selectores.hostRuntime).first()).toBeVisible();
    expect(errors).toEqual([]);
  });
});
