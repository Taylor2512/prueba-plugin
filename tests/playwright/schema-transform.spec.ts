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
});
