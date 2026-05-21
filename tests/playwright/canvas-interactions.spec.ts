import { expect, test } from './runtime-guard.js';
import type { Page } from '@playwright/test';

const openRoute = async (page: Page, route = '/lab/multiuser-collaboration') => {
  await page.goto(route);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.sisad-pdfme-lab-page')).toBeVisible();
};

const openCollaborationDisclosure = async (page: Page) => {
  const details = page.locator('.sisad-pdfme-lab-page-details');
  if ((await details.getAttribute('open')) === null) {
    await details.locator(':scope > summary').click();
  }
  const collaboration = page.locator('.sisad-pdfme-lab-collaboration-disclosure');
  if ((await collaboration.getAttribute('open')) === null) {
    await collaboration.locator(':scope > summary').click();
  }
};

test.describe('canvas interactions - domain suite', () => {
  test('canvas remains rendered and geometrically stable while scrolling viewer', async ({ page }) => {
    await openRoute(page, '/lab/generator-runtime');
    await page.getByRole('button', { name: 'Controles' }).click();
    await page.getByRole('button', { name: 'Visor' }).click();

    const paper = page.locator('[data-paper-page="true"]').first();
    await expect(paper).toBeVisible();
    const before = await paper.boundingBox();
    expect((before?.width ?? 0) * (before?.height ?? 0)).toBeGreaterThan(1000);

    await page.mouse.wheel(0, 700);
    await expect
      .poll(async () => {
        const next = await paper.boundingBox();
        return { w: Math.round(next?.width ?? 0), h: Math.round(next?.height ?? 0) };
      })
      .toEqual({ w: Math.round(before?.width ?? 0), h: Math.round(before?.height ?? 0) });
  });

  test('switching user/global view keeps canvas non-blank and sidebar interactive', async ({ page }) => {
    await openRoute(page, '/lab/multiuser-collaboration');
    await openCollaborationDisclosure(page);

    const paper = page.locator('[data-paper-page="true"]').first();
    await expect(paper).toBeVisible();
    const area = await paper.boundingBox();
    expect((area?.width ?? 0) * (area?.height ?? 0)).toBeGreaterThan(1000);

    const view = page.getByRole('combobox', { name: 'Seleccionar vista activa' });
    await view.selectOption('global');
    await expect(view).toHaveValue('global');
    await view.selectOption('user');
    await expect(view).toHaveValue('user');

    await expect(page.locator('.sisad-pdfme-designer-right-sidebar')).toBeVisible();
    await expect(page.locator('.sisad-pdfme-designer-left-sidebar')).toBeVisible();
    await expect(paper).toBeVisible();
  });
});
