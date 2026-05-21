import { expect, type Locator, type Page } from '@playwright/test';

export async function expectVisible(locator: Locator) {
  await expect(locator).toBeVisible();
}

export async function expectHidden(locator: Locator) {
  await expect(locator).toBeHidden();
}

export async function expectNoConsoleErrors(page: Page, action: () => Promise<void>) {
  const messages: string[] = [];
  const onConsole = (message: Parameters<Page['on']>[1] extends (arg: infer T) => void ? T : never) => {
    if (message.type() === 'error') {
      messages.push(message.text());
    }
  };
  const onPageError = (error: Error) => {
    messages.push(error.message);
  };

  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  try {
    await action();
  } finally {
    page.off('console', onConsole);
    page.off('pageerror', onPageError);
  }

  expect(messages).toEqual([]);
}
