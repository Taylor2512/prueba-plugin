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

  it('preserves runtime resources for presentation-only updates and rebuilds on runtime mode changes', () => {
    const service = createSisadPdfmeConfigService({
      runtime: { mode: 'designer' },
      visibility: {
        sidebars: {
          right: {
            panels: {
              documents: true,
            },
          },
        },
      },
      ui: {
        visibility: {
          sidebars: {
            right: {
              panels: {
                documents: true,
              },
            },
          },
        },
      },
    });

    const initial = service.getResolvedConfig();
    const presentationChange = service.update({
      ui: {
        visibility: {
          sidebars: {
            right: {
              panels: {
                documents: false,
              },
            },
          },
        },
      },
    });
    const afterPresentation = service.getResolvedConfig();

    expect(presentationChange.impact.presentationOnly).toBe(true);
    expect(presentationChange.impact.rebuildResources).toBe(false);
    expect(afterPresentation.designerEngine).toBe(initial.designerEngine);
    expect(afterPresentation.eventHub).toBe(initial.eventHub);
    expect(afterPresentation.adapters).toBe(initial.adapters);

    const runtimeChange = service.update({
      runtime: {
        mode: 'viewer',
      },
    });
    const afterRuntime = service.getResolvedConfig();

    expect(runtimeChange.impact.rebuildResources).toBe(true);
    expect(afterRuntime.designerEngine).not.toBe(afterPresentation.designerEngine);
    expect(afterRuntime.eventHub).not.toBe(afterPresentation.eventHub);
    expect(afterRuntime.adapters).not.toBe(afterPresentation.adapters);
  });
});
