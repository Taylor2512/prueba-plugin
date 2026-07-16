import { expect, test } from '@playwright/test'

test.describe('external data integration (async)', () => {
  test('loads async host data once, preserves recipients, and keeps docs routing working', async ({ page }) => {
    await page.goto('/lab/external-data-integration')
    await expect(page.getByText('Cargando datos externos...')).toBeVisible()

    await expect(page.getByRole('heading', { name: 'Multidocumento integral' })).toBeVisible({
      timeout: 30000,
    })

    const externalRecipientSelect = page.locator('select[aria-label="Usuario activo externo"]')
    await expect(externalRecipientSelect).toBeVisible({ timeout: 15000 })
    await expect(externalRecipientSelect.locator('option')).toHaveCount(3)

    await externalRecipientSelect.selectOption({ label: 'Avalista' })
    await expect(page.locator('select[aria-label="Seleccionar usuario activo"]')).toHaveValue('recipient-2')

    await page.getByRole('button', { name: 'Reinyectar datos externos' }).click()
    await expect(page.getByText('Cargando datos externos...')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Multidocumento integral' })).toBeVisible({
      timeout: 30000,
    })
    await expect(externalRecipientSelect.locator('option')).toHaveCount(3)
    await expect(page.locator('select[aria-label="Seleccionar usuario activo"]')).toHaveValue('recipient-1')

    await page.locator('#sisad-pdfme-right-sidebar-tab-docs').click()
    await expect(page.locator('aside[data-panel-mode="docs"]')).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('Documentos cargados')).toBeVisible()
    await expect(page.getByText('Documento 1')).toBeVisible()
    await expect(page.getByText('Documento 2')).toBeVisible()
  })
})
