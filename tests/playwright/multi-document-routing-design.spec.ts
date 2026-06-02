import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const ROUTE = '/lab/multi-document-routing';

const flattenSchemaTypes = (schemas: unknown): string[] => {
  if (!Array.isArray(schemas)) return [];
  return schemas.flatMap((page) => {
    if (!Array.isArray(page)) return [];
    return page
      .map((schema) => String((schema as { type?: string })?.type || '').trim())
      .filter(Boolean);
  });
};

test.describe('multi-document routing design and showcase coverage', () => {
  test('downloaded example bundle contains all schema types exposed in catalog', async ({ page }) => {
    await page.goto(ROUTE);

    const openCatalogButton = page
      .getByRole('button', { name: /Abrir catálogo de campos|Cerrar catálogo de campos/i })
      .first();
    await expect(openCatalogButton).toBeVisible();
    if ((await openCatalogButton.textContent())?.includes('Abrir')) {
      await openCatalogButton.click();
    }

    const expectedSchemaTypes = new Set(
      await page.locator('button[data-schema-type]').evaluateAll((buttons) =>
        buttons
          .map((button) => String(button.getAttribute('data-schema-type') || '').trim())
          .filter(Boolean),
      ),
    );

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /Descargar plantilla/i }).click(),
    ]);

    const downloadPath = await download.path();
    expect(downloadPath).not.toBeNull();

    const rawBundle = await readFile(downloadPath as string, 'utf8');
    const bundle = JSON.parse(rawBundle) as {
      template?: { schemas?: unknown };
      runtimeOptions?: { uploadedDocuments?: Array<{ template?: { schemas?: unknown } }> };
    };

    const observedSchemaTypes = new Set<string>();
    flattenSchemaTypes(bundle.template?.schemas).forEach((type) => observedSchemaTypes.add(type));
    (bundle.runtimeOptions?.uploadedDocuments || []).forEach((document) => {
      flattenSchemaTypes(document.template?.schemas).forEach((type) => observedSchemaTypes.add(type));
    });

    const missingTypes = Array.from(expectedSchemaTypes).filter((type) => !observedSchemaTypes.has(type));
    expect(missingTypes).toEqual([]);
  });

  test('showcase pages keep same-owner schemas separated and spread across the fixture', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.locator('[data-paper-page="true"]').first()).toBeVisible();

    const pageCount = await page.locator('[data-paper-page="true"]').count();
    expect(pageCount).toBeGreaterThanOrEqual(5);

    const groupedByPage = await page.evaluate(() => {
      const pageElements = Array.from(document.querySelectorAll('[data-paper-page="true"]')) as HTMLElement[];
      return pageElements.map((pageElement, pageIndex) => {
        const pageRect = pageElement.getBoundingClientRect();
        const schemas = Array.from(pageElement.querySelectorAll('.sisad-pdfme-ui-custom-selectable')).map((element) => {
          const rect = (element as HTMLElement).getBoundingClientRect();
          return {
            id: element.id,
            ownerId: element.getAttribute('data-schema-owner-id') || '',
            left: rect.left - pageRect.left,
            top: rect.top - pageRect.top,
            right: rect.right - pageRect.left,
            bottom: rect.bottom - pageRect.top,
          };
        });
        return {
          pageIndex,
          schemas,
        };
      });
    });

    const overlaps = (
      a: { left: number; top: number; right: number; bottom: number },
      b: { left: number; top: number; right: number; bottom: number },
    ) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

    const sameOwnerOverlaps: Array<{ pageIndex: number; ownerId: string; leftId: string; rightId: string }> = [];

    for (const pageEntry of groupedByPage) {
      const schemasByOwner = new Map<string, Array<{ id: string; left: number; top: number; right: number; bottom: number }>>();
      for (const schema of pageEntry.schemas) {
        if (!schema.ownerId) continue;
        const list = schemasByOwner.get(schema.ownerId) || [];
        list.push(schema);
        schemasByOwner.set(schema.ownerId, list);
      }

      for (const [ownerId, schemas] of schemasByOwner.entries()) {
        for (let i = 0; i < schemas.length; i += 1) {
          for (let j = i + 1; j < schemas.length; j += 1) {
            if (!overlaps(schemas[i], schemas[j])) continue;
            sameOwnerOverlaps.push({
              pageIndex: pageEntry.pageIndex,
              ownerId,
              leftId: schemas[i].id,
              rightId: schemas[j].id,
            });
          }
        }
      }
    }

    expect(sameOwnerOverlaps).toEqual([]);
  });

  test('lab shell keeps layout readable on desktop and mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(ROUTE);

    await expect(page.getByRole('heading', { name: 'Multidocumento integral' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Colaboración del ejemplo' })).toBeVisible();

    const desktopOverflow = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth - root.clientWidth;
    });
    expect(desktopOverflow).toBeLessThanOrEqual(16);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();

    await expect(page.getByRole('heading', { name: 'Multidocumento integral' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cliente Principal' })).toBeVisible();

    const mobileOverflow = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth - root.clientWidth;
    });
    expect(mobileOverflow).toBeLessThanOrEqual(16);
  });
});
