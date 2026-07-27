import { describe, expect, it, vi } from 'vitest';
import { createSisadPdfmeConfigService } from '@/sisad-pdfme/config/SisadPdfmeConfigService';

describe('createSisadPdfmeConfigService', () => {
  it('preserves independence between service instances', () => {
    const first = createSisadPdfmeConfigService({ runtime: { readonly: true } });
    const second = createSisadPdfmeConfigService({ runtime: { readonly: false } });

    expect(first.getResolvedConfig().config.runtime.readonly).toBe(true);
    expect(second.getResolvedConfig().config.runtime.readonly).toBe(false);
  });

  it('notifies once after a transaction and keeps raw snapshots immutable', () => {
    const service = createSisadPdfmeConfigService({ runtime: { readonly: false } });
    const listener = vi.fn();
    const unsubscribe = service.subscribe(listener);

    service.transaction((draft) => {
      draft.update({ runtime: { readonly: true } });
      draft.update({ debug: { enabled: true } });
    });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(service.getResolvedConfig().config.runtime.readonly).toBe(true);
    expect(service.getIssues()).toEqual([]);

    unsubscribe();
    service.update({ debug: { enabled: false } });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
