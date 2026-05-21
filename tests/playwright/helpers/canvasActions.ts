import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function clickCanvas(page: Page, target: Locator | string) {
  if (typeof target === 'string') {
    await page.locator(target).click();
    return;
  }
  await target.click();
}

export async function pressEscape(page: Page) {
  await page.keyboard.press('Escape');
}

export async function selectByText(page: Page, text: string) {
  const locator = page.getByText(text, { exact: false });
  await expect(locator).toBeVisible();
  await locator.click();
}

export async function dragBetween(page: Page, from: Locator, to: Locator) {
  const fromBox = await from.boundingBox();
  const toBox = await to.boundingBox();
  if (!fromBox || !toBox) {
    throw new Error('No se pudo resolver la geometría para drag-and-drop');
  }
  await page.mouse.move(fromBox.x + fromBox.width / 2, fromBox.y + fromBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(toBox.x + toBox.width / 2, toBox.y + toBox.height / 2);
  await page.mouse.up();
}
