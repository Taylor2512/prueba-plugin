import { expect, test } from '@playwright/test';

const parseAlpha = (color: string) => {
  const m = color.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([0-9.]+)\)/i);
  if (m) return Number(m[1]);
  if (/rgb\(/i.test(color)) return 1;
  return 0;
};

const getInteractionProbe = async (page: import('@playwright/test').Page) => {
  return page.evaluate(() => {
    const stage = document.querySelector('.sisad-pdfme-designer-stage') as HTMLElement | null;
    const controlBar = document.querySelector('.sisad-pdfme-ui-control-bar') as HTMLElement | null;
    const maskNodes = Array.from(
      document.querySelectorAll('.sisad-pdfme-designer-mask, .sisad-pdfme-designer-canvas-state-overlay[data-blocking-mask="true"]'),
    ) as HTMLElement[];

    return {
      interactionPhase: stage?.getAttribute('data-interaction-phase') || null,
      controlBarBackground: controlBar ? getComputedStyle(controlBar).backgroundColor : null,
      visibleMasks: maskNodes
        .map((node) => {
          const style = getComputedStyle(node);
          return {
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity,
            backgroundColor: style.backgroundColor,
            width: node.getBoundingClientRect().width,
            height: node.getBoundingClientRect().height,
          };
        })
        .filter((item) => item.display !== 'none' && item.visibility !== 'hidden' && Number(item.opacity || '0') > 0),
    };
  });
};

test.describe('schema transform overlays', () => {
  test('dragging a schema does not dim the canvas', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const schema = page.locator('.sisad-pdfme-ui-custom-selectable').first();
    await expect(schema).toBeVisible();
    await schema.click({ force: true });

    const box = await schema.boundingBox();
    expect(box).not.toBeNull();

    await page.mouse.move((box?.x || 0) + (box?.width || 0) / 2, (box?.y || 0) + (box?.height || 0) / 2);
    await page.mouse.down();
    await page.mouse.move((box?.x || 0) + (box?.width || 0) / 2 + 70, (box?.y || 0) + (box?.height || 0) / 2 + 36);

    const probe = await getInteractionProbe(page);
    await page.mouse.up();

    expect(probe.interactionPhase).toBe('dragging');
    expect(parseAlpha(probe.controlBarBackground || 'rgba(0,0,0,0)')).toBeLessThanOrEqual(0.05);
    expect(probe.visibleMasks.length).toBe(0);
  });

  test('resize and rotate keep canvas readable without blocking mask', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const schema = page.locator('.sisad-pdfme-ui-custom-selectable').first();
    await expect(schema).toBeVisible();
    await schema.click({ force: true });

    const resizeHandle = page.locator('.moveable-control.moveable-se').first();
    await expect(resizeHandle).toBeVisible();
    const resizeBox = await resizeHandle.boundingBox();
    expect(resizeBox).not.toBeNull();

    await page.mouse.move((resizeBox?.x || 0) + (resizeBox?.width || 0) / 2, (resizeBox?.y || 0) + (resizeBox?.height || 0) / 2);
    await page.mouse.down();
    await page.mouse.move((resizeBox?.x || 0) + 18, (resizeBox?.y || 0) + 14);
    const resizingProbe = await getInteractionProbe(page);
    await page.mouse.up();

    expect(resizingProbe.interactionPhase).toBe('resizing');
    expect(parseAlpha(resizingProbe.controlBarBackground || 'rgba(0,0,0,0)')).toBeLessThanOrEqual(0.05);
    expect(resizingProbe.visibleMasks.length).toBe(0);

    const rotateHandle = page.locator('.moveable-control.moveable-rotation-control').first();
    await expect(rotateHandle).toBeVisible();
    const rotateBox = await rotateHandle.boundingBox();
    expect(rotateBox).not.toBeNull();

    await page.mouse.move((rotateBox?.x || 0) + (rotateBox?.width || 0) / 2, (rotateBox?.y || 0) + (rotateBox?.height || 0) / 2);
    await page.mouse.down();
    await page.mouse.move((rotateBox?.x || 0) + 26, (rotateBox?.y || 0) + 10);
    const rotatingProbe = await getInteractionProbe(page);
    await page.mouse.up();

    expect(rotatingProbe.interactionPhase).toBe('rotating');
    expect(parseAlpha(rotatingProbe.controlBarBackground || 'rgba(0,0,0,0)')).toBeLessThanOrEqual(0.05);
    expect(rotatingProbe.visibleMasks.length).toBe(0);
  });

  test('alignment controls move selected schema to page anchors', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const paper = page.locator('[data-paper-page="true"]').first();
    await expect(paper).toBeVisible();
    const paperBox = await paper.boundingBox();
    expect(paperBox).not.toBeNull();

    const candidates = page.locator('.sisad-pdfme-ui-custom-selectable');
    const count = await candidates.count();
    let targetIndex = 0;
    for (let i = 0; i < count; i++) {
      const box = await candidates.nth(i).boundingBox();
      if (!box || !paperBox) continue;
      const hasRoomHorizontally = box.width <= paperBox.width - 40;
      const hasRoomVertically = box.height <= paperBox.height - 40;
      if (hasRoomHorizontally && hasRoomVertically) {
        targetIndex = i;
        break;
      }
    }

    const schema = candidates.nth(targetIndex);
    await expect(schema).toBeVisible();
    await schema.click({ force: true });

    const getSchemaBox = async () => {
      const box = await schema.boundingBox();
      expect(box).not.toBeNull();
      return box!;
    };

    const clickAlign = async (name: string) => {
      await schema.click({ force: true });
      const button = page.getByRole('button', { name }).first();
      await expect(button).toBeVisible();
      await button.click();
    };

    const initialBox = await getSchemaBox();
    await clickAlign('Alinear a la izquierda');
    await expect
      .poll(async () => (await getSchemaBox()).x)
      .toBeLessThanOrEqual(initialBox.x + 1);

    const leftBox = await getSchemaBox();

    await clickAlign('Centrar horizontalmente');
    await expect
      .poll(async () => (await getSchemaBox()).x)
      .toBeGreaterThan(leftBox.x + 4);

    const centeredBox = await getSchemaBox();

    await clickAlign('Alinear a la derecha');
    await expect
      .poll(async () => (await getSchemaBox()).x)
      .toBeGreaterThan(centeredBox.x + 4);

    const rightBox = await getSchemaBox();

    await clickAlign('Alinear arriba');
    await expect
      .poll(async () => (await getSchemaBox()).y)
      .toBeLessThan(rightBox.y + 1);

    const topBox = await getSchemaBox();

    await clickAlign('Centrar verticalmente');
    await expect
      .poll(async () => (await getSchemaBox()).y)
      .toBeGreaterThan(topBox.y + 4);

    const middleBox = await getSchemaBox();

    await clickAlign('Alinear abajo');
    await expect
      .poll(async () => (await getSchemaBox()).y)
      .toBeGreaterThan(middleBox.y + 4);
  });
});
