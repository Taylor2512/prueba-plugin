import { expect, test, type Page } from '@playwright/test';

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
    await page.goto('/lab/multi-document-routing');
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

    await test.step('view toggle cycles through the three densities', async () => {
      const toggleBtn = sidebar.getByTestId('left-sidebar-view-toggle');
      await expect(toggleBtn).toBeVisible();

      const seenModes = new Set<string>();
      for (let i = 0; i < 3; i += 1) {
        const mode = await tiles.first().getAttribute('data-view-mode');
        if (mode) seenModes.add(mode);
        await toggleBtn.click();
        await expect
          .poll(async () => tiles.first().getAttribute('data-view-mode'))
          .not.toBe(mode);
      }
      // rich, compact and mini must all be reachable from the toggle.
      const finalMode = await tiles.first().getAttribute('data-view-mode');
      if (finalMode) seenModes.add(finalMode);
      expect([...seenModes].sort()).toEqual(['compact', 'mini', 'rich']);
    });
  });
});

test.describe('DetailView · secciones proporcionales por schema', () => {
  test('select shows Opciones; text does not; Técnico never renders expanded by default', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

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
