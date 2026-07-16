import { expect, test } from '@playwright/test'

test.describe('lab designer visual baseline regression', () => {
  test('keeps the classic three-panel designer layout on multi-document routing', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1200 })
    await page.goto('/lab/multi-document-routing')

    await expect(page.getByRole('heading', { name: 'Multidocumento integral' })).toBeVisible({
      timeout: 30000,
    })

    const stage = page.locator('.sisad-pdfme-designer-stage')
    const leftSidebar = page.locator('.sisad-pdfme-designer-left-sidebar').first()
    const rightSidebar = page.locator('.sisad-pdfme-designer-right-sidebar').first()
    const canvas = page.locator('.sisad-pdfme-designer-canvas').first()
    const firstCatalogTile = page.locator('.sisad-pdfme-designer-left-sidebar [data-testid="left-sidebar-schema-tile"]').first()

    await expect(stage).toHaveAttribute('data-left-sidebar-variant', 'panel', { timeout: 30000 })
    await expect(stage).toHaveAttribute('data-left-sidebar-mode', 'docked')
    await expect(stage).toHaveAttribute('data-sidebar-open', 'true')
    await expect(stage).toHaveAttribute('data-layout-preset', 'three-panel')
    await expect(stage).toHaveAttribute('data-density', 'comfortable')
    await expect(rightSidebar).toHaveAttribute('data-sidebar-presentation', 'docked')
    await expect(firstCatalogTile).toHaveAttribute('data-catalog-layout', 'list')

    const [stageBox, leftBox, canvasBox, rightBox] = await Promise.all([
      stage.boundingBox(),
      leftSidebar.boundingBox(),
      canvas.boundingBox(),
      rightSidebar.boundingBox(),
    ])

    expect(stageBox).not.toBeNull()
    expect(leftBox).not.toBeNull()
    expect(canvasBox).not.toBeNull()
    expect(rightBox).not.toBeNull()

    const stageWidth = stageBox!.width
    expect(leftBox!.width).toBeGreaterThan(180)
    expect(leftBox!.width).toBeLessThan(stageWidth * 0.4)
    expect(rightBox!.width).toBeGreaterThan(220)
    expect(rightBox!.width).toBeLessThan(stageWidth * 0.4)
    expect(canvasBox!.width).toBeGreaterThan(stageWidth * 0.35)
    expect(canvasBox!.x).toBeGreaterThan(leftBox!.x + leftBox!.width - 4)
    expect(leftBox!.x).toBeLessThan(canvasBox!.x)
    expect(canvasBox!.x).toBeLessThan(rightBox!.x)

    // Contrato real del stage: el right sidebar es absoluto sobre el canvas y
    // el canvas reserva su espacio con padding-right (data-sidebar-open=true).
    // Por eso NO se compara la caja del canvas contra el sidebar: se valida que
    // el CONTENIDO (paper) no invada el sidebar y que el padding reserve el ancho.
    const paperBox = await page.locator('.sisad-pdfme-designer-canvas [data-paper-root="true"]').first().boundingBox()
    expect(paperBox).not.toBeNull()
    expect(paperBox!.x + paperBox!.width).toBeLessThan(rightBox!.x + 4)

    const canvasPaddingRight = await canvas.evaluate((el) => parseFloat(getComputedStyle(el).paddingRight))
    expect(canvasPaddingRight).toBeGreaterThanOrEqual(rightBox!.width - 4)

    // El catálogo no ocupa todo el ancho: el primer item queda dentro del sidebar.
    const tileBox = await firstCatalogTile.boundingBox()
    expect(tileBox).not.toBeNull()
    expect(tileBox!.width).toBeLessThan(stageWidth * 0.5)
    expect(tileBox!.x + tileBox!.width).toBeLessThan(leftBox!.x + leftBox!.width + 4)
  })

  test('active recipient and mode switches keep the layout styled', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1200 })
    await page.goto('/lab/multi-document-routing')

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
