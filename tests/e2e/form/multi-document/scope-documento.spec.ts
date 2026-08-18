import { expect, test } from '@playwright/test';
import {
  abrirForm,
  cambiarDocumento,
  cambiarUsuario,
  desenfocar,
  escribirCampo,
  selectorDocumento,
  selectorUsuario,
} from '../../../support/playwright';

/**
 * RTP-510.A — scope User × Document en el Form real.
 *
 * Los contratos unitarios ya fijan la proyección por scope. Lo que este spec
 * añade es que el renderer imperativo la respeta cuando el usuario conmuta
 * desde la interfaz. La ruta monta la MISMA estructura de schemas en dos
 * documentos: sin eso no se puede afirmar que un campo vale una cosa en D1 y
 * otra en D2.
 */
const CAMPO = '#text-text-0';

const fijar = async (page: import('@playwright/test').Page, valor: string) => {
  await escribirCampo(page.locator(CAMPO), valor);
  await desenfocar(page);
};

test.beforeEach(async ({ page }) => {
  await abrirForm(page, '/runtime/form/multi-document');
  await expect(page.locator(CAMPO)).toBeVisible();
});

test.describe('Form multi-document — scope de documento', () => {
  // @caso DOC-002
  test('los dos conmutadores están disponibles', async ({ page }) => {
    await expect(selectorDocumento(page)).toHaveCount(1);
    await expect(selectorDocumento(page).locator('option')).toHaveCount(2);
    await expect(selectorUsuario(page)).toHaveCount(1);
  });

  // @caso DOC-002
  // @caso UC-09
  test('el cambio de documento conserva valores independientes', async ({ page }) => {
    await cambiarDocumento(page, 'doc-uno');
    await fijar(page, 'valor D1');
    await expect(page.locator(CAMPO)).toHaveText('valor D1');

    await cambiarDocumento(page, 'doc-dos');
    await expect(page.locator(CAMPO), 'D2 no puede heredar lo de D1').not.toHaveText('valor D1');

    await fijar(page, 'valor D2');
    await expect(page.locator(CAMPO)).toHaveText('valor D2');

    await cambiarDocumento(page, 'doc-uno');
    await expect(page.locator(CAMPO)).toHaveText('valor D1');

    await cambiarDocumento(page, 'doc-dos');
    await expect(page.locator(CAMPO)).toHaveText('valor D2');
  });

  // @caso DOC-002
  // @caso UC-10
  test('la matriz Usuario × Documento mantiene celdas independientes', async ({ page }) => {
    const matriz = [
      ['alice', 'doc-uno'],
      ['alice', 'doc-dos'],
      ['bob', 'doc-uno'],
      ['bob', 'doc-dos'],
    ] as const;

    for (const [userId, documentId] of matriz) {
      await cambiarUsuario(page, userId);
      await cambiarDocumento(page, documentId);
      await fijar(page, `${userId}-${documentId}`);
    }

    for (const [userId, documentId] of matriz) {
      await cambiarUsuario(page, userId);
      await cambiarDocumento(page, documentId);
      await expect(page.locator(CAMPO), `celda ${userId}/${documentId}`).toHaveText(
        `${userId}-${documentId}`,
      );
    }
  });

  // @caso DOC-015
  test('conmutar rápido entre documentos no pierde valores', async ({ page }) => {
    await cambiarDocumento(page, 'doc-uno');
    await fijar(page, 'estable');

    for (let i = 0; i < 4; i += 1) {
      await selectorDocumento(page).selectOption('doc-dos');
      await selectorDocumento(page).selectOption('doc-uno');
    }
    await expect(page.locator(CAMPO)).toHaveText('estable');
  });
});
