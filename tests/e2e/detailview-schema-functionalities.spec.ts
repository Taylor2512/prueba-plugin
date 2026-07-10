import { expect, test, type Page } from '@playwright/test';

type SchemaCase = {
  name: string;
  type: string;
  visibleSections: string[];
  hiddenSections: string[];
};

const cases: SchemaCase[] = [
  {
    name: 'contract_name',
    type: 'text',
    visibleSections: ['identity', 'validation', 'behavior', 'box', 'appearance', 'collaboration'],
    hiddenSections: ['options', 'advanced'],
  },
  {
    name: 'contract_stage',
    type: 'select',
    visibleSections: ['identity', 'options', 'validation', 'behavior', 'box', 'appearance', 'collaboration'],
    hiddenSections: ['advanced'],
  },
  {
    name: 'approval_mode',
    type: 'radioGroup',
    visibleSections: ['identity', 'options', 'validation', 'behavior', 'box', 'appearance', 'collaboration'],
    hiddenSections: ['advanced'],
  },
  {
    name: 'required_documents',
    type: 'checkboxGroup',
    visibleSections: ['identity', 'options', 'validation', 'behavior', 'box', 'appearance', 'collaboration'],
    hiddenSections: ['advanced'],
  },
  {
    name: 'routing-primary-showcase_attachment',
    type: 'attachment',
    visibleSections: ['identity', 'behavior', 'box', 'collaboration'],
    hiddenSections: ['options', 'validation', 'appearance', 'advanced'],
  },
  {
    name: 'routing-primary-showcase_approve',
    type: 'approve',
    visibleSections: ['identity', 'behavior', 'box', 'collaboration'],
    hiddenSections: ['options', 'validation', 'appearance', 'advanced'],
  },
  {
    name: 'routing-primary-showcase_decline',
    type: 'decline',
    visibleSections: ['identity', 'behavior', 'box', 'collaboration'],
    hiddenSections: ['options', 'validation', 'appearance', 'advanced'],
  },
  {
    name: 'routing-primary-showcase_table',
    type: 'table',
    visibleSections: ['identity', 'box', 'appearance', 'behavior', 'collaboration'],
    hiddenSections: ['options', 'validation', 'dataBindings', 'advanced'],
  },
];

const schemaLocator = (page: Page, name: string) =>
  page.locator(`.sisad-pdfme-ui-custom-selectable[data-schema-name="${name}"]`).first();

const sectionLocator = (page: Page, sectionKey: string) =>
  page.locator(`section[data-section="${sectionKey}"]`);

const selectSchema = async (page: Page, name: string) => {
  const locator = schemaLocator(page, name);
  await expect(locator).toBeVisible();
  await locator.click({ force: true });
  await expect(page.getByTestId('detail-view')).toBeVisible();
};

test.describe('detailview schema functionalities', () => {
  for (const item of cases) {
    test(`schema ${item.name} (${item.type}) exposes the expected sections`, async ({ page }) => {
      await page.goto('/lab/multi-document-routing');
      await selectSchema(page, item.name);

      for (const key of item.visibleSections) {
        await expect(sectionLocator(page, key), `section ${key} should be visible for ${item.name}`).toBeVisible();
      }

      for (const key of item.hiddenSections) {
        await expect(
          page.getByTestId(`detail-section-${key}`),
          `section ${key} should be hidden for ${item.name}`,
        ).toHaveCount(0);
      }

      await expect(schemaLocator(page, item.name)).toHaveAttribute('data-schema-type', item.type);
    });
  }
});
