import { devices, expect, test, type Page } from '@playwright/test';
import { canvas, leftSidebar, openDesigner, rightSidebar } from './generated/fixtures/designer.fixture';

const DESKTOP_VIEWPORTS = [
  { name: 'desktop-1366x768', width: 1366, height: 768 },
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'desktop-1600x900', width: 1600, height: 900 },
  { name: 'desktop-1920x1080', width: 1920, height: 1080 },
];

const DEVICE_PROFILES = [
  {
    name: 'tablet-ipad-mini',
    use: devices['iPad Mini'],
    minTouchTarget: 36,
  },
  {
    name: 'mobile-iphone-13',
    use: devices['iPhone 13'],
    minTouchTarget: 44,
  },
] as const;

async function readLayout(page: Page) {
  return page.evaluate(() => {
    const rect = (selector: string) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        left: box.left,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
      };
    };

    const root = rect('[data-sisad-pdfme-root]');
    const stage = rect('.sisad-pdfme-designer-stage');
    const canvasBox = rect('.sisad-pdfme-designer-canvas');
    const paper = rect('[data-paper-root="true"]');
    const toolbar = rect('[data-testid="designer-zoom-select"]');

    return {
      root,
      stage,
      canvas: canvasBox,
      paper,
      toolbar,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      bodyScrollWidth: document.body.scrollWidth,
      bodyClientWidth: document.body.clientWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      docClientWidth: document.documentElement.clientWidth,
    };
  });
}

async function expectDesignerReady(page: Page) {
  await openDesigner(page);
  await expect(page.locator('[data-sisad-pdfme-root]')).toBeVisible({ timeout: 20_000 });
  await expect(canvas(page)).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('[data-paper-root="true"]')).toBeVisible({ timeout: 20_000 });
}

async function expectCenteredPaper(page: Page, maxDelta = 8) {
  const layout = await readLayout(page);
  expect(layout.root?.width ?? 0).toBeGreaterThan(0);
  expect(layout.stage?.width ?? 0).toBeGreaterThan(0);
  expect(layout.canvas?.width ?? 0).toBeGreaterThan(0);
  expect(layout.paper?.width ?? 0).toBeGreaterThan(0);

  const paperCenterX = (layout.paper?.x ?? 0) + (layout.paper?.width ?? 0) / 2;
  const canvasCenterX = (layout.canvas?.x ?? 0) + (layout.canvas?.width ?? 0) / 2;
  expect(Math.abs(canvasCenterX - paperCenterX)).toBeLessThanOrEqual(maxDelta);

  expect(layout.bodyScrollWidth).toBeLessThanOrEqual(layout.bodyClientWidth);
  expect(layout.docScrollWidth).toBeLessThanOrEqual(layout.docClientWidth);
}

async function expectAccessibleControls(page: Page, minTouchTarget: number) {
  const leftCollapse = page.getByTestId('sidebar-collapse-left').first();
  const rightCollapse = page.getByTestId('sidebar-collapse-right').first();
  const zoomSelect = page.getByTestId('designer-zoom-select').first();

  await expect(leftCollapse).toBeVisible();
  await expect(rightCollapse).toBeVisible();
  await expect(zoomSelect).toBeVisible();

  const leftBox = await leftCollapse.boundingBox();
  const rightBox = await rightCollapse.boundingBox();
  const zoomBox = await zoomSelect.boundingBox();

  expect(leftBox?.width ?? 0).toBeGreaterThanOrEqual(minTouchTarget);
  expect(leftBox?.height ?? 0).toBeGreaterThanOrEqual(minTouchTarget);
  expect(rightBox?.width ?? 0).toBeGreaterThanOrEqual(minTouchTarget);
  expect(rightBox?.height ?? 0).toBeGreaterThanOrEqual(minTouchTarget);
  expect(zoomBox?.width ?? 0).toBeGreaterThanOrEqual(72);
}

test.describe('designer responsive matrix', () => {
  for (const viewport of DESKTOP_VIEWPORTS) {
    test(`centra el papel y mantiene el shell utilizable en ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await expectDesignerReady(page);
      await expectCenteredPaper(page);
      await expectAccessibleControls(page, 28);
    });
  }

  for (const profile of DEVICE_PROFILES) {
    test.describe(profile.name, () => {
      const { defaultBrowserType: _defaultBrowserType, ...deviceUse } = profile.use;
      test.use({
        viewport: deviceUse.viewport,
        userAgent: deviceUse.userAgent,
        deviceScaleFactor: deviceUse.deviceScaleFactor,
        isMobile: deviceUse.isMobile,
        hasTouch: deviceUse.hasTouch,
      });

      test(`mantiene el shell utilizable en ${profile.name}`, async ({ page }) => {
        await expectDesignerReady(page);
        await expectCenteredPaper(page, 12);
        await expectAccessibleControls(page, profile.minTouchTarget);

        const sidebar = leftSidebar(page);
        const rightRail = rightSidebar(page);
        await expect(sidebar).toBeVisible();
        await expect(rightRail).toBeVisible();
      });
    });
  }
});
