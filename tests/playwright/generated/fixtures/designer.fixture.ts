import { expect, type Locator, type Page } from '@playwright/test';

const LAB_ROUTE = '/lab/multi-document-routing';

export async function openDesigner(page: Page) {
  await page.goto(LAB_ROUTE);
  const root = page.locator('.sisad-pdfme-root').first();
  await expect(root).toBeVisible({ timeout: 20_000 });
  await expect(canvas(page)).toBeVisible({ timeout: 20_000 });
  return root;
}

export const canvas = (page: Page) =>
  page.locator('.sisad-pdfme-designer-canvas, .sisad-pdfme-canvas').first();

export const rightSidebar = (page: Page) =>
  page.locator('.sisad-pdfme-designer-right-sidebar, [data-testid="right-sidebar"]').last();

export const leftSidebar = (page: Page) =>
  page.locator('.sisad-pdfme-designer-left-sidebar, [data-testid="left-sidebar"]').first();

export const schemaOnCanvas = (page: Page, nameOrId: string) =>
  canvas(page).locator(
    `[data-schema-name="${nameOrId}"], [data-schema-id="${nameOrId}"], [data-schema-uid="${nameOrId}"]`,
  ).first();

const panelTab = (page: Page, label: RegExp | string) => {
  const named = page.getByRole('tab', { name: label });
  const button = page.getByRole('button', { name: label });
  return named.or(button).last();
};

export async function openPanel(page: Page, label: RegExp | string) {
  const tab = panelTab(page, label);
  if (await tab.count()) {
    await tab.click();
  }
  return rightSidebar(page);
}

export async function clickSchemaRow(page: Page, name: string, modifiers: Array<'Alt' | 'Control' | 'ControlOrMeta' | 'Meta' | 'Shift'> = []) {
  const sidebar = rightSidebar(page);
  const label = sidebar.getByText(name, { exact: true }).first();
  await expect(label).toBeVisible();
  await label.click({ modifiers });
  return label;
}

export async function expectSchemaSelected(locator: Locator) {
  await expect.poll(async () => {
    const selected = await locator.getAttribute('data-selected');
    const state = await locator.getAttribute('data-schema-state');
    const aria = await locator.getAttribute('aria-selected');
    const cls = await locator.getAttribute('class');
    return selected === 'true' || aria === 'true' || state === 'selected' || /selected|ring-sky|border-sky/.test(cls || '');
  }).toBe(true);
}

export async function countScrollableDescendants(container: Locator) {
  return container.evaluate((root) => {
    const elements = [root, ...Array.from(root.querySelectorAll('*'))] as HTMLElement[];
    return elements.filter((element) => {
      const style = getComputedStyle(element);
      const scrollableY = /(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
      return scrollableY;
    }).length;
  });
}

async function isFeatureVisible(locator: Locator) {
  return (await locator.count()) > 0 && await locator.first().isVisible().catch(() => false);
}
