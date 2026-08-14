import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5174/');
  await page.getByRole('link', { name: 'Runtime · Form DigitalAgreements Form configurado desde un snapshot declarativo' }).click();
  const textA = page.locator('#text-text-0');
  const numberB = page.locator('#text-number-1');
  const fullNameC = page.locator('#text-fullName-2');
  const companyD = page.locator('#text-company-4');
  const titleE = page.locator('#text-title-5');

  await textA.fill('11');
  await expect(textA).toHaveText('11');

  await numberB.fill('11');
  await expect(numberB).toHaveText('11');
  await expect(textA).toHaveText('11');

  await fullNameC.fill('111111111');
  await expect(fullNameC).toHaveText('111111111');
  await expect(textA).toHaveText('11');
  await expect(numberB).toHaveText('11');

  await companyD.fill('111111');
  await expect(companyD).toHaveText('111111');
  await expect(fullNameC).toHaveText('111111111');

  await titleE.fill('111111');
  await expect(titleE).toHaveText('111111');
  await expect(companyD).toHaveText('111111');
  await expect(textA).toHaveText('11');
});
