import { expect, test } from '@playwright/test';

test.describe('detail-view alignment', () => {
  test('alignment buttons move x/y and disable distribution for single selection', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await page.getByRole('button', { name: 'contract_name' }).click();

    const xInput = page.getByRole('spinbutton', { name: '* X' });
    const yInput = page.getByRole('spinbutton', { name: '* Y' });
    const initialX = Number(await xInput.inputValue());
    const initialY = Number(await yInput.inputValue());

    await page.getByRole('button', { name: 'Alinear a la izquierda' }).click();
    await expect.poll(async () => Number(await xInput.inputValue())).not.toBe(initialX);

    await page.getByRole('button', { name: 'Alinear a la derecha' }).click();
    await expect.poll(async () => Number(await xInput.inputValue())).not.toBe(initialX);

    await page.getByRole('button', { name: 'Alinear arriba' }).click();
    await expect.poll(async () => Number(await yInput.inputValue())).not.toBe(initialY);

    await page.getByRole('button', { name: 'Alinear abajo' }).click();
    await expect.poll(async () => Number(await yInput.inputValue())).not.toBe(initialY);

    await expect(page.getByRole('button', { name: 'Distribuir verticalmente' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Distribuir horizontalmente' })).toBeDisabled();
  });
});
