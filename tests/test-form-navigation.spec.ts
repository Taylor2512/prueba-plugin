import { test, expect } from '@playwright/test';

test('catalog, runtime form and schemas navigation work', async ({ page }) => {
  await page.goto('http://localhost:5174/');

  const formLink = page.getByRole('link', { name: /Runtime · Form DigitalAgreements/i }).first();
  await expect(formLink).toBeVisible();
  await formLink.click();
  await expect(page).toHaveURL(/\/runtime\/form\/digital-agreements$/);

  await expect(page.getByTestId('-topbar')).toBeVisible();
  await expect(page.getByTestId('-route-nav')).toBeVisible();
  await expect(page.getByTestId('-route-nav')).toHaveValue('/runtime/form/digital-agreements');

  const viewport = page.getByTestId('-runtime-viewport');
  await expect(viewport).toBeVisible();
  await expect(viewport.locator('input, textarea, select, button').first()).toBeVisible();

  await page.getByTestId('-route-nav').selectOption('/schemas');
  await expect(page).toHaveURL(/\/schemas$/);
  await expect(page.getByRole('heading', { name: /Catálogo de familias/i })).toBeVisible();

  await page.getByRole('link', { name: /Texto y campos simples/i }).first().click();
  await expect(page).toHaveURL(/\/schemas\/text$/);
  await expect(page.getByRole('heading', { name: /Texto y campos simples/i })).toBeVisible();
});
