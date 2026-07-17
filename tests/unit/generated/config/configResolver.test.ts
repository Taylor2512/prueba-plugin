import { describe, expect, it } from 'vitest';
import { resolveSisadPdfmeConfig } from '@/sisad-pdfme/config/resolveSisadPdfmeConfig';

describe('global config resolver', () => {
  it('produce adapters, engine, eventHub y runtime options', () => {
    const resolved = resolveSisadPdfmeConfig();
    expect(resolved.designerEngine).toBeTruthy();
    expect(resolved.eventHub).toBeTruthy();
    expect(resolved.adapters).toEqual(expect.objectContaining({ recipients: expect.anything(), documents: expect.anything(), persistence: expect.anything(), signatures: expect.anything() }));
    expect(resolved.runtimeOptions.lang).toBeTruthy();
  });

  it('fusiona visibility y calcula hiddenCatalogTypes', () => {
    const resolved = resolveSisadPdfmeConfig({
      visibility: { schemas: { catalog: { table: false, text: true } } },
    } as any);
    expect(resolved.visibility.schemas.catalog.table).toBe(false);
    expect(resolved.runtimeOptions.hiddenCatalogTypes).toContain('table');
    expect(resolved.runtimeOptions.hiddenCatalogTypes).not.toContain('text');
  });

  it('mapea panel documents a docs y conserva auto para fields', () => {
    const docs = resolveSisadPdfmeConfig({ ui: { sidebars: { right: { defaultPanel: 'documents' } } } } as any);
    expect(docs.runtimeOptions.rightSidebarViewMode).toBe('docs');
    const fields = resolveSisadPdfmeConfig({ ui: { sidebars: { right: { defaultPanel: 'fields' } } } } as any);
    expect(fields.runtimeOptions.rightSidebarViewMode).toBe('auto');
  });

  it('no controla permanentemente sidebarOpen desde el preset', () => {
    const resolved = resolveSisadPdfmeConfig({ ui: { sidebars: { right: { defaultOpen: false } } } } as any);
    expect(resolved.runtimeOptions.sidebarOpen).toBe(false);
    expect(resolved.runtimeOptions.sidebarOpenControlled).toBe(false);
  });
});
