import { expect, test } from './runtime-guard.js';
import type { Page } from '@playwright/test';

const ROUTE = '/lab/multiuser-collaboration';

const openRoute = async (page: Page) => {
  await page.goto(ROUTE);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.sisad-pdfme-lab-page')).toBeVisible();
};

const openCollaborationDisclosure = async (page: Page) => {
  const contextDetails = page.locator('.sisad-pdfme-lab-page-details');
  if ((await contextDetails.getAttribute('open')) === null) {
    await contextDetails.locator(':scope > summary').click();
  }
  const collaboration = page.locator('.sisad-pdfme-lab-collaboration-disclosure');
  await expect(collaboration).toContainText('Participantes');
  if ((await collaboration.getAttribute('open')) === null) {
    await collaboration.locator(':scope > summary').click();
  }
  return collaboration;
};

const getVisibleSchemaUids = async (page: Page): Promise<string[]> => {
  const schemas = page.locator('.sisad-pdfme-designer-canvas [data-schema-uid]:visible');
  const total = await schemas.count();
  const uids: string[] = [];
  for (let i = 0; i < total; i += 1) {
    const uid = await schemas.nth(i).getAttribute('data-schema-uid');
    if (uid) uids.push(uid);
  }
  return uids;
};

test.describe('multiuser collaboration - domain suite', () => {
  test('switching view user/global updates visible schema set and keeps uid uniqueness', async ({ page }) => {
    await openRoute(page);
    await openCollaborationDisclosure(page);

    const view = page.getByRole('combobox', { name: 'Seleccionar vista activa' });
    await view.selectOption('user');
    await expect(view).toHaveValue('user');
    const userViewUids = await getVisibleSchemaUids(page);
    expect(userViewUids.length).toBeGreaterThan(0);
    expect(new Set(userViewUids).size).toBe(userViewUids.length);

    await view.selectOption('global');
    await expect(view).toHaveValue('global');
    const globalViewUids = await getVisibleSchemaUids(page);
    expect(globalViewUids.length).toBeGreaterThanOrEqual(userViewUids.length);
    expect(new Set(globalViewUids).size).toBe(globalViewUids.length);
  });

  test('changing active user updates collaboration state and preserves canvas render', async ({ page }) => {
    await openRoute(page);
    const collaboration = await openCollaborationDisclosure(page);
    const userSelect = page.getByRole('combobox', { name: 'Seleccionar usuario activo' });

    await expect(userSelect).toHaveValue('sales-user-1');
    await userSelect.selectOption('legal-user-1');
    await expect(userSelect).toHaveValue('legal-user-1');
    await expect(collaboration.locator('.sisad-pdfme-lab-collaboration-chips .sisad-pdfme-lab-chip')).toHaveCount(3);

    const paper = page.locator('[data-paper-page="true"]').first();
    await expect(paper).toBeVisible();
    const box = await paper.boundingBox();
    expect((box?.width ?? 0) * (box?.height ?? 0)).toBeGreaterThan(1000);
  });

  test('selection is cleared when switching from global to user view', async ({ page }) => {
    await openRoute(page);
    await openCollaborationDisclosure(page);
    const view = page.getByRole('combobox', { name: 'Seleccionar vista activa' });
    const contextHeader = page.getByLabel('Contexto activo del editor');

    await view.selectOption('global');
    const paper = page.locator('[data-paper-page="true"]').first();
    await expect(paper).toBeVisible();
    await paper.click();
    const mod = process.platform === 'darwin' ? 'Meta' : 'Control';
    await page.keyboard.press(`${mod}+a`);
    await expect
      .poll(async () => (await contextHeader.textContent()) ?? '')
      .toMatch(/Selección(:\s*)?[2-9]\d*|Selección múltiple/i);

    await view.selectOption('user');
    await expect(view).toHaveValue('user');
    await expect(contextHeader).not.toContainText(/Selección(:\s*)?[2-9]\d*|Selección múltiple/i);
  });
});
