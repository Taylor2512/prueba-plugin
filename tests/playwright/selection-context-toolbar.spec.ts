import { expect, test } from '@playwright/test';

const ROUTE = '/lab/multi-document-routing';
const SCHEMA_NAME = 'routing-primary-showcase_attachment';

test.describe('selection context toolbar', () => {
  test('stays within the stage and does not overlap the selected schema', async ({ page }) => {
    await page.goto(ROUTE);

    const pages = page.locator('[data-paper-page="true"]');
    await expect(pages.first()).toBeVisible();
    test.skip((await pages.count()) < 2, 'multi-page fixture required');

    const schema = page.locator(`.sisad-pdfme-ui-custom-selectable[data-schema-name="${SCHEMA_NAME}"]`).first();
    await expect(schema).toBeVisible();
    await schema.scrollIntoViewIfNeeded();
    await schema.click({ force: true });

    const toolbar = page.locator('.sisad-pdfme-ui-selection-context-toolbar');
    await expect(toolbar).toBeVisible();
    await expect(schema).toHaveAttribute('data-schema-active', 'true');

    const canvas = page.locator('.sisad-pdfme-designer-canvas');
    const [canvasBox, schemaBox, toolbarBox] = await Promise.all([
      canvas.boundingBox(),
      schema.boundingBox(),
      toolbar.boundingBox(),
    ]);

    expect(canvasBox).not.toBeNull();
    expect(schemaBox).not.toBeNull();
    expect(toolbarBox).not.toBeNull();

    const canvasRect = canvasBox!;
    const schemaRect = schemaBox!;
    const toolbarRect = toolbarBox!;

    const toolbarRight = toolbarRect.x + toolbarRect.width;
    const toolbarBottom = toolbarRect.y + toolbarRect.height;
    const canvasRight = canvasRect.x + canvasRect.width;
    const canvasBottom = canvasRect.y + canvasRect.height;
    const schemaRight = schemaRect.x + schemaRect.width;
    const schemaBottom = schemaRect.y + schemaRect.height;

    expect(toolbarRect.x).toBeGreaterThanOrEqual(canvasRect.x);
    expect(toolbarRect.y).toBeGreaterThanOrEqual(canvasRect.y);
    expect(toolbarRight).toBeLessThanOrEqual(canvasRight);
    expect(toolbarBottom).toBeLessThanOrEqual(canvasBottom);
    expect(
      toolbarBottom <= schemaRect.y - 6 ||
        toolbarRect.y >= schemaBottom + 6 ||
        toolbarRect.x >= schemaRight + 6 ||
        toolbarRight <= schemaRect.x - 6,
    ).toBeTruthy();

    const moreButton = toolbar.getByRole('button', { name: 'Más acciones' });
    await moreButton.click();
    await expect(schema).toHaveAttribute('data-schema-active', 'true');
  });
});
