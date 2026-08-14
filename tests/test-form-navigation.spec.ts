import { test, expect } from '@playwright/test';

test('catalog, runtime form and schemas navigation work', async ({ page }) => {
  await page.goto('http://localhost:5174/');

  const formLink = page.getByRole('link', { name: 'Runtime · Form DigitalAgreements', exact: true });
  await expect(formLink).toHaveCount(1);
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

test('Form mutates editable text and choice schemas while Viewer stays readonly', async ({ page }) => {
  await page.goto('http://localhost:5174/runtime/form/digital-agreements');
  const viewport = page.getByTestId('-runtime-viewport');

  const editableText = viewport.locator('[contenteditable="true"], [contenteditable="plaintext-only"]').first();
  await expect(editableText).toBeVisible();
  await editableText.fill('Form interaction');
  await expect(editableText).toHaveText('Form interaction');

  const editableSelect = viewport.locator('select').first();
  await editableSelect.selectOption({ index: 1 });
  await expect(editableSelect).toHaveValue('option1');

  const radio = viewport.getByRole('radio', { name: 'Opción 2' });
  await radio.click();
  await expect(radio).toHaveAttribute('aria-checked', 'true');

  const checkbox = viewport.getByRole('checkbox', { name: 'Casilla 1' });
  await checkbox.click();
  await expect(checkbox).toHaveAttribute('aria-checked', 'true');

  await page.goto('http://localhost:5174/runtime/viewer');
  const viewer = page.getByTestId('-runtime-viewport');
  await expect(viewer.locator('[contenteditable="true"], [contenteditable="plaintext-only"]')).toHaveCount(0);
  const viewerChoices = viewer.locator('button[role="radio"], button[role="checkbox"]');
  await expect(viewerChoices).toHaveCount(4);
  for (let index = 0; index < await viewerChoices.count(); index += 1) {
    await expect(viewerChoices.nth(index)).toBeDisabled();
  }
});
