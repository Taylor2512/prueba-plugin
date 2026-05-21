import type { Page } from '@playwright/test';

export async function pressModKey(page: Page, key: string) {
  const prefix = process.platform === 'darwin' ? 'Meta' : 'Control';
  await page.keyboard.press(`${prefix}+${key}`);
}

export async function pressShortcut(page: Page, shortcut: string) {
  await page.keyboard.press(shortcut);
}

export async function typeIntoCanvas(page: Page, text: string) {
  await page.keyboard.type(text);
}
