import { expect, test } from '@playwright/test';

const ROUTE = '/lab/multi-document-routing';

type Point = { x: number; y: number };

const selectRegion = async (
  page: import('@playwright/test').Page,
  paperBox: { x: number; y: number },
  start: Point,
  end: Point,
) => {
  await page.mouse.move(paperBox.x + start.x, paperBox.y + start.y);
  await page.mouse.down();
  await page.mouse.move(paperBox.x + end.x, paperBox.y + end.y, { steps: 8 });
  await page.mouse.up();
};

const getActiveSchemaNames = async (page: import('@playwright/test').Page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll('.sisad-pdfme-ui-custom-selectable[data-schema-active="true"]'))
      .map((element) => element.getAttribute('data-schema-name') || '')
      .filter(Boolean),
  );

const getActiveSchemaUnion = async (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const rects = Array.from(
      document.querySelectorAll('.sisad-pdfme-ui-custom-selectable[data-schema-active="true"]'),
    ).map((element) => {
      const rect = (element as HTMLElement).getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
      };
    });

    if (!rects.length) return null;

    return rects.reduce(
      (acc, rect) => ({
        left: Math.min(acc.left, rect.left),
        top: Math.min(acc.top, rect.top),
        right: Math.max(acc.right, rect.right),
        bottom: Math.max(acc.bottom, rect.bottom),
      }),
      {
        left: Number.POSITIVE_INFINITY,
        top: Number.POSITIVE_INFINITY,
        right: Number.NEGATIVE_INFINITY,
        bottom: Number.NEGATIVE_INFINITY,
      },
    );
  });

const expectMoveableAligned = async (page: import('@playwright/test').Page) => {
  const union = await getActiveSchemaUnion(page);
  expect(union).not.toBeNull();

  const moveable = page.locator('.moveable-control-box').first();
  await expect(moveable).toBeVisible();

  const box = await moveable.boundingBox();
  expect(box).not.toBeNull();

  const delta = {
    left: Math.abs((box?.x || 0) - (union?.left || 0)),
    top: Math.abs((box?.y || 0) - (union?.top || 0)),
  };

  expect(delta.left).toBeLessThan(2);
  expect(delta.top).toBeLessThan(2);
};

const waitForSelectedMulti = async (page: import('@playwright/test').Page) => {
  await expect
    .poll(async () => page.locator('.sisad-pdfme-designer-canvas').getAttribute('data-interaction-phase'))
    .toBe('selected-multi');
};

test.describe('canvas region selection after moving a multi-selection', () => {
  test('keeps Selecto usable after dragging selected schemas', async ({ page }) => {
    await page.goto(ROUTE);

    const firstPaper = page.locator('[data-paper-page="true"]').nth(0);
    const secondPaper = page.locator('[data-paper-page="true"]').nth(1);
    await expect(firstPaper).toBeVisible();
    await expect(secondPaper).toBeVisible();

    const firstPaperBox = await firstPaper.boundingBox();
    expect(firstPaperBox).not.toBeNull();
    await selectRegion(page, firstPaperBox!, { x: 20, y: 20 }, { x: 255, y: 140 });
    await waitForSelectedMulti(page);

    await expect(page.locator('.sisad-pdfme-designer-canvas')).toHaveAttribute('data-interaction-count', '2');
    await expect.poll(async () => getActiveSchemaNames(page)).toEqual(['contract_name', 'contract_date']);
    await expectMoveableAligned(page);

    const draggable = page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_name"]').first();
    const draggableBox = await draggable.boundingBox();
    expect(draggableBox).not.toBeNull();

    await page.mouse.move((draggableBox?.x || 0) + (draggableBox?.width || 0) / 2, (draggableBox?.y || 0) + (draggableBox?.height || 0) / 2);
    await page.mouse.down();
    await page.mouse.move(
      (draggableBox?.x || 0) + (draggableBox?.width || 0) / 2 + 60,
      (draggableBox?.y || 0) + (draggableBox?.height || 0) / 2 + 20,
      { steps: 8 },
    );
    await page.mouse.up();

    await expect
      .poll(async () => page.locator('.sisad-pdfme-designer-canvas').getAttribute('data-interaction-phase'))
      .toBe('selected-multi');
    await expect(page.locator('.sisad-pdfme-designer-canvas')).toHaveAttribute('data-interaction-dragging', 'false');

    const secondPaperBox = await secondPaper.boundingBox();
    expect(secondPaperBox).not.toBeNull();
    await selectRegion(page, secondPaperBox!, { x: 20, y: 190 }, { x: 360, y: 350 });
    await waitForSelectedMulti(page);

    await expect(page.locator('.sisad-pdfme-designer-canvas')).toHaveAttribute('data-interaction-count', '2');
    await expect
      .poll(async () => (await getActiveSchemaNames(page)).length)
      .toBe(2);
    await expectMoveableAligned(page);
  });
});
