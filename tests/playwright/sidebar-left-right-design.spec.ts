import { expect, test, type Page } from '@playwright/test';
import { EXAMPLE_ROUTE_PATHS } from '@/examples/routes/routeDefinitions.js';

const openCatalog = async (page: Page) => {
  const toggle = page
    .getByRole('button', { name: /Abrir catálogo de campos|Cerrar catálogo de campos/i })
    .first();
  await toggle.waitFor({ state: 'visible' });
  if (/Abrir catálogo/i.test((await toggle.textContent()) || '')) {
    await toggle.click();
  }
};

test.describe('LeftSidebar · catálogo compacto', () => {
  test('search, quick filters and view-mode cycle work over the tiles', async ({ page }) => {
    await page.goto(EXAMPLE_ROUTE_PATHS.designerMultiUser);
    await openCatalog(page);

    const sidebar = page.getByTestId('left-sidebar').first();
    await expect(sidebar).toBeVisible();

    const tiles = sidebar.getByTestId('left-sidebar-schema-tile');
    const groups = sidebar.getByTestId('left-sidebar-group');

    await test.step('catalog renders groups and tiles with icons', async () => {
      await expect.poll(async () => groups.count()).toBeGreaterThan(0);
      await expect.poll(async () => tiles.count()).toBeGreaterThan(0);
      await expect
        .poll(async () => sidebar.getByTestId('left-sidebar-schema-icon').count())
        .toBeGreaterThan(0);
    });

    await test.step('search narrows the catalog', async () => {
      const allCount = await tiles.count();
      const search = sidebar.getByTestId('left-sidebar-search').first();
      await search.fill('firma');
      await expect.poll(async () => tiles.count()).toBeLessThan(allCount);
      await search.fill('');
      await expect.poll(async () => tiles.count()).toBe(allCount);
    });

    await test.step('favorites filter shows an empty state when there are none', async () => {
      await sidebar.getByTestId('left-sidebar-filter-favorites').click();
      // No favorites marked → tiles disappear (empty state), never a broken panel.
      await expect.poll(async () => tiles.count()).toBe(0);
      await sidebar.getByTestId('left-sidebar-filter-all').click();
      await expect.poll(async () => tiles.count()).toBeGreaterThan(0);
    });

    await test.step('view selector exposes explicit densities', async () => {
      const richView = sidebar.getByTestId('left-sidebar-view-rich');
      const compactView = sidebar.getByTestId('left-sidebar-view-compact');
      const miniView = sidebar.getByTestId('left-sidebar-view-mini');

      await expect(richView).toBeVisible();
      await expect(compactView).toBeVisible();
      await expect(miniView).toBeVisible();

      await richView.click();
      await expect(richView).toHaveAttribute('data-active', 'true');
      await expect(tiles.first()).toHaveAttribute('data-view-mode', 'rich');

      await compactView.click();
      await expect(compactView).toHaveAttribute('data-active', 'true');
      await expect(tiles.first()).toHaveAttribute('data-view-mode', 'compact');

      await miniView.click();
      await expect(miniView).toHaveAttribute('data-active', 'true');
      await expect(tiles.first()).toHaveAttribute('data-view-mode', 'mini');
    });
  });
});

test.describe('DetailView · secciones proporcionales por schema', () => {
  test('select shows Opciones; text does not; Técnico never renders expanded by default', async ({ page }) => {
    await page.goto(EXAMPLE_ROUTE_PATHS.designerMultiUser);

    await test.step('select (contract_stage) → detail-section-options present', async () => {
      await page
        .locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_stage"]')
        .first()
        .click({ force: true });

      await expect(page.getByTestId('detail-view').first()).toBeVisible();
      await expect(page.getByTestId('detail-header-card')).toBeVisible();
      await expect(page.getByTestId('detail-section-options')).toBeVisible();
      await expect(page.getByTestId('detail-section-fill-rules')).toBeVisible();
      await expect(page.getByTestId('detail-section-layout')).toBeVisible();
    });

    await test.step('technical section, when present, starts collapsed', async () => {
      const technical = page.getByTestId('detail-section-technical');
      if (await technical.count()) {
        await expect(technical.first()).toHaveAttribute('data-collapsed', 'true');
      }
    });

    await test.step('text (contract_name) → no Opciones section', async () => {
      await page
        .locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_name"]')
        .first()
        .click({ force: true });

      await expect(page.getByTestId('detail-header-card')).toBeVisible();
      await expect(page.getByTestId('detail-section-fill-rules')).toBeVisible();
      await expect(page.getByTestId('detail-section-options')).not.toBeVisible();
    });
  });
});
