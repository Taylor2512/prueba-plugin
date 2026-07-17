import { expect, test } from '@playwright/test';

/**
 * Regresión W1-CLAUDE-RS-SCROLL — contrato de "un solo scroll owner" en el
 * RightSidebar (plan §3.2).
 *
 * Bug original: SidebarBody usaba `overflow-hidden`, por lo que el DetailView no
 * podía desplazarse hasta las secciones inferiores. El cuerpo del sidebar
 * (`right-sidebar-layout-body`) debe ser el único propietario del scroll
 * vertical, sin scroll horizontal, y sus ancestros (frame y panel-stack) deben
 * quedar recortados (`overflow: hidden`).
 */

const SCHEMA = '.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_name"]';
const DETAIL_VIEW = '[data-testid="detail-view"]';
const SCROLL_OWNER = `${DETAIL_VIEW} .sisad-pdfme-designer-right-sidebar-layout-body`;

/** Selecciona un schema y expande todas las secciones para forzar overflow. */
async function openDetailAndExpandAll(page: import('@playwright/test').Page) {
  // Altura reducida para garantizar que el contenido desborde el cuerpo.
  await page.setViewportSize({ width: 1280, height: 620 });
  await page.goto('/lab/multi-document-routing');

  await page.locator(SCHEMA).first().click({ force: true });
  await expect(page.locator(DETAIL_VIEW).first()).toBeVisible();

  // Expandir cualquier sección colapsada para maximizar la altura del contenido.
  for (let i = 0; i < 12; i += 1) {
    const expandBtn = page.getByRole('button', { name: /^Expandir sección/ }).first();
    if ((await expandBtn.count()) === 0) break;
    await expandBtn.click();
  }
}

test.describe('right sidebar — detail view scroll owner', () => {
  test('DetailView body is the single vertical scroll owner and reaches the bottom', async ({ page }) => {
    await openDetailAndExpandAll(page);

    const scrollOwner = page.locator(SCROLL_OWNER).first();
    await expect(scrollOwner).toBeVisible();

    // Contrato de overflow del propietario del scroll.
    const [overflowY, overflowX] = await scrollOwner.evaluate((el) => {
      const cs = getComputedStyle(el);
      return [cs.overflowY, cs.overflowX];
    });
    expect(overflowY).toBe('auto');
    expect(overflowX).toBe('hidden');

    // El contenido debe desbordar verticalmente y NO horizontalmente.
    const m = await scrollOwner.evaluate((el) => ({
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    expect(m.scrollHeight).toBeGreaterThan(m.clientHeight);
    expect(m.scrollWidth).toBeLessThanOrEqual(m.clientWidth + 1);

    // Debe poder desplazarse hasta el fondo real.
    await scrollOwner.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    const scrollTop = await scrollOwner.evaluate((el) => el.scrollTop);
    const maxScroll = m.scrollHeight - m.clientHeight;
    expect(scrollTop).toBeGreaterThan(0);
    expect(Math.abs(scrollTop - maxScroll)).toBeLessThanOrEqual(2);
  });

  test('only the detail body scrolls — frame and panel-stack stay clipped', async ({ page }) => {
    await openDetailAndExpandAll(page);

    // El frame del detalle no debe scrollear (propietario único = body).
    const frameOverflowY = await page
      .locator(DETAIL_VIEW)
      .first()
      .evaluate((el) => getComputedStyle(el).overflowY);
    expect(frameOverflowY).toBe('hidden');

    // El panel-stack tampoco debe scrollear.
    const stackOverflowY = await page
      .locator('.sisad-pdfme-designer-right-sidebar-panel-stack')
      .first()
      .evaluate((el) => getComputedStyle(el).overflowY);
    expect(stackOverflowY).toBe('hidden');
  });

  test('detail scroll position is preserved while typing (no reset per keypress)', async ({ page }) => {
    await openDetailAndExpandAll(page);

    const scrollOwner = page.locator(SCROLL_OWNER).first();
    // Desplazar a un punto intermedio.
    await scrollOwner.evaluate((el) => {
      el.scrollTop = Math.floor((el.scrollHeight - el.clientHeight) / 2);
    });
    const before = await scrollOwner.evaluate((el) => el.scrollTop);
    expect(before).toBeGreaterThan(0);

    // Escribir en el nombre del campo no debe reiniciar el scroll.
    const nameInput = page.locator('input#name').first();
    if (await nameInput.count()) {
      await nameInput.focus();
      await nameInput.press('End');
      await nameInput.type('x');
      const after = await scrollOwner.evaluate((el) => el.scrollTop);
      // Tolerancia por reflow menor; no debe saltar al tope.
      expect(after).toBeGreaterThan(before - 24);
    }
  });
});
