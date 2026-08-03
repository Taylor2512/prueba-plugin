import { expect, test } from '@playwright/test'
import { EXAMPLE_ROUTE_PATHS } from '@/examples/routes/routeDefinitions.js'

const DESIGNER_ROUTE = EXAMPLE_ROUTE_PATHS.designerMultiUser

test.describe('lab designer visual baseline regression', () => {
  test('keeps the classic three-panel designer layout on multi-document routing', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1200 })
    await page.goto(DESIGNER_ROUTE)
    await expect(page.locator('[data-sisad-pdfme-root]').first()).toBeVisible({ timeout: 30_000 })

    const stage = page.locator('.sisad-pdfme-designer-stage')
    const leftSidebar = page.locator('.sisad-pdfme-designer-left-sidebar').first()
    const rightSidebar = page.locator('.sisad-pdfme-designer-right-sidebar').first()
    const canvas = page.locator('.sisad-pdfme-designer-canvas').first()
    const firstCatalogTile = page.locator('.sisad-pdfme-designer-left-sidebar [data-testid="left-sidebar-schema-tile"]').first()
    const collapseLeftSidebar = page.getByTestId('sidebar-collapse-left').first()
    const paper = page.locator('.sisad-pdfme-designer-canvas [data-paper-root="true"]').first()

    await expect(stage).toHaveAttribute('data-left-sidebar-variant', 'panel', { timeout: 30000 })
    await expect(stage).toHaveAttribute('data-left-sidebar-mode', 'docked')
    await expect(stage).toHaveAttribute('data-sidebar-open', 'true')
    await expect(stage).toHaveAttribute('data-layout-preset', 'three-panel')
    await expect(stage).toHaveAttribute('data-density', 'comfortable')
    await expect(rightSidebar).toHaveAttribute('data-sidebar-presentation', 'docked')
    await expect(firstCatalogTile).toHaveAttribute('data-catalog-layout', 'grid')

    const [stageBox, leftBox, canvasBox, rightBox] = await Promise.all([
      stage.boundingBox(),
      leftSidebar.boundingBox(),
      canvas.boundingBox(),
      rightSidebar.boundingBox(),
    ])
    const paperBox = await paper.boundingBox()

    expect(stageBox).not.toBeNull()
    expect(leftBox).not.toBeNull()
    expect(canvasBox).not.toBeNull()
    expect(rightBox).not.toBeNull()
    expect(paperBox).not.toBeNull()

    const stageWidth = stageBox!.width
    expect(leftBox!.width).toBeGreaterThan(180)
    expect(leftBox!.width).toBeLessThan(stageWidth * 0.4)
    expect(rightBox!.width).toBeGreaterThan(220)
    expect(rightBox!.width).toBeLessThan(stageWidth * 0.4)
    expect(canvasBox!.width).toBeGreaterThan(stageWidth * 0.35)

    // El catálogo izquierdo debe liberar ancho real al colapsar.
    await expect(collapseLeftSidebar).toBeVisible()
    const stageBoxBeforeToggle = stageBox
    const canvasBoxBeforeToggle = canvasBox
    const leftBoxBeforeToggle = leftBox
    const paperBoxBeforeToggle = paperBox
    await collapseLeftSidebar.click()
    await expect(leftSidebar).toHaveAttribute('data-left-sidebar-expanded', 'false')

    const [stageBoxAfterToggle, canvasBoxAfterToggle] = await Promise.all([
      stage.boundingBox(),
      canvas.boundingBox(),
    ])
    const paperBoxAfterToggle = await paper.boundingBox()

    expect(stageBoxAfterToggle).not.toBeNull()
    expect(canvasBoxAfterToggle).not.toBeNull()
    expect(stageBoxAfterToggle!.width).toBeGreaterThan(stageBoxBeforeToggle!.width + 40)
    expect(stageBoxAfterToggle!.x).toBeLessThan(stageBoxBeforeToggle!.x - 40)
    expect(canvasBoxAfterToggle!.width).toBeGreaterThan(canvasBoxBeforeToggle!.width + 40)
    expect(canvasBoxAfterToggle!.x).toBeLessThan(canvasBoxBeforeToggle!.x - 40)

    const leftBoxAfterToggle = await leftSidebar.boundingBox()
    expect(leftBoxAfterToggle).not.toBeNull()
    expect(leftBoxAfterToggle!.width).toBeLessThan(leftBoxBeforeToggle!.width)
    expect(leftBoxAfterToggle!.width).toBeLessThan(96)
    expect(
      Math.abs(
        paperBoxAfterToggle!.x + paperBoxAfterToggle!.width / 2 - (paperBoxBeforeToggle!.x + paperBoxBeforeToggle!.width / 2),
      ),
    ).toBeLessThanOrEqual(24)

    // El catálogo no ocupa todo el ancho: el primer item queda dentro del sidebar.
    const tileBox = await firstCatalogTile.boundingBox()
    expect(tileBox).not.toBeNull()
    expect(tileBox!.width).toBeLessThan(stageWidth * 0.5)
    expect(tileBox!.x + tileBox!.width).toBeLessThan(leftBox!.x + leftBox!.width + 4)
  })

  test('active recipient and mode switches keep the layout styled', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1200 })
    await page.goto(DESIGNER_ROUTE)
    await expect(page.locator('[data-sisad-pdfme-root]').first()).toBeVisible({ timeout: 30_000 })

    const stage = page.locator('.sisad-pdfme-designer-stage')
    await expect(stage).toHaveAttribute('data-sidebar-open', 'true', { timeout: 30000 })

    // Cambiar usuario activo no rompe el layout.
    const userSelect = page.getByLabel('Seleccionar usuario activo').first()
    if (await userSelect.count()) {
      await userSelect.selectOption({ label: 'Avalista' })
      await expect(stage).toHaveAttribute('data-sidebar-open', 'true')
      await expect(page.locator('.sisad-pdfme-designer-left-sidebar').first()).toBeVisible()
    }

    // El CSS base viene del wrapper público: el root del diseñador conserva
    // el layout de columnas (flex) tras cualquier re-render.
    const rootDisplay = await page
      .locator('.sisad-pdfme-designer-root')
      .first()
      .evaluate((el) => getComputedStyle(el).display)
    expect(rootDisplay).toBe('flex')
  })
})
