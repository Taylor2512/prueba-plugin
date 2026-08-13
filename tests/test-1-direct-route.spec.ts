import { test, expect } from '@playwright/test';

test('direct route - designer runtime loads and inspector toggles', async ({ page }) => {
  // Navigate directly to the designer example to avoid ambiguous catalog links
  await page.goto('http://localhost:5174/designer/multi-user');
  await page.waitForLoadState('networkidle');

  const runtime = page.getByTestId('-runtime-viewport');
  await expect(runtime).toBeVisible({ timeout: 30000 });
  await expect(runtime.getByText(/Texto de ejemplo/)).toBeVisible({ timeout: 15000 });

  // Ensure primary action buttons are present in the runtime
  const approve = runtime.locator('button.sisad-pdfme-action-button:has-text("Aprobar")');
  await expect(approve).toBeVisible({ timeout: 10000 });
  const reject = runtime.locator('button.sisad-pdfme-action-button:has-text("Rechazar")');
  await expect(reject).toBeVisible({ timeout: 10000 });

  // Click a text field to reveal the inspector and toggle the 'required' switch
  const textField = runtime.locator('#text-0');
  await expect(textField).toBeVisible({ timeout: 10000 });
  await textField.click();

  const requiredSwitch = page.getByTestId('inspector-required-switch');
  await expect(requiredSwitch).toBeVisible({ timeout: 15000 });
  await requiredSwitch.click();
  await requiredSwitch.click();

  // Sanity: runtime still visible
  await expect(runtime).toBeVisible();
});
