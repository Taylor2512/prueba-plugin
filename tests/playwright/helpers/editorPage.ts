import type { Page } from '@playwright/test';

export const LAB_MULTIUSER_ROUTE = '/lab/multiuser-collaboration';

export async function openEditorPage(page: Page, pathname = LAB_MULTIUSER_ROUTE) {
  await page.goto(pathname);
  return page;
}

export function getCanvas(page: Page) {
  return page.getByTestId('designer-canvas').or(page.locator('[data-testid="canvas"]')).or(page.locator('.designer-canvas'));
}

export function getInspector(page: Page) {
  return page.getByTestId('designer-inspector').or(page.locator('[data-testid="right-sidebar"]')).or(page.locator('.right-sidebar'));
}

export function getToolbar(page: Page) {
  return page.getByTestId('floating-toolbar').or(page.locator('[data-testid="toolbar"]')).or(page.locator('.floating-toolbar'));
}

export async function waitForEditorIdle(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(50);
}
