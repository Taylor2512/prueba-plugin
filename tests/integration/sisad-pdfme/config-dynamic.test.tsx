import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SisadPdfmeProvider } from '@/sisad-pdfme/react/SisadPdfmeProvider';
import { useSisadPdfmeConfig } from '@/sisad-pdfme/react/useSisadPdfmeConfig';
import { useSisadPdfmeController } from '@/sisad-pdfme/react/useSisadPdfmeController';
import type { SisadPdfmeController, SisadPdfmeGlobalConfig } from '@/sisad-pdfme/config/SisadPdfmeConfig';

const createWrapper = (config: SisadPdfmeGlobalConfig) =>
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <SisadPdfmeProvider config={config}>{children}</SisadPdfmeProvider>;
  };

const visibleDocumentsPanels = {
  sidebars: {
    right: {
      panels: {
        documents: true,
      },
    },
  },
};

describe('config dynamic controller', () => {
  it('applies presentation-only updates without rebuilding resources', () => {
    const wrapper = createWrapper({
      runtime: { mode: 'designer' },
      documents: { mode: 'single', preserveDocumentSchemaRouting: true },
      visibility: visibleDocumentsPanels,
      ui: {
        visibility: visibleDocumentsPanels,
      },
    });

    const { result } = renderHook(
      () => {
        const controller = useSisadPdfmeController({ current: null });
        const config = useSisadPdfmeConfig();
        return { controller, config };
      },
      { wrapper },
    );

    let change: ReturnType<SisadPdfmeController['updateConfig']> | null = null;
    act(() => {
      change = result.current.controller.updateConfig({
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
    });

    expect(change?.impact.presentationOnly).toBe(true);
    expect(change?.impact.rebuildResources).toBe(false);
    expect(result.current.config.visibility.sidebars.right.panels.documents).toBe(false);
    expect(result.current.controller.getFeatureState('documents').visible).toBe(false);
    expect(result.current.controller.getConfig().ui.visibility.sidebars.right.panels.documents).toBe(false);
  });

  it('rebuilds resources when runtime.mode changes', () => {
    const wrapper = createWrapper({
      runtime: { mode: 'designer' },
      visibility: visibleDocumentsPanels,
      ui: {
        visibility: visibleDocumentsPanels,
      },
    });

    const { result } = renderHook(
      () => {
        const controller = useSisadPdfmeController({ current: null });
        const config = useSisadPdfmeConfig();
        return { controller, config };
      },
      { wrapper },
    );

    let change = null as ReturnType<typeof result.current.controller.updateConfig> | null;
    act(() => {
      change = result.current.controller.updateConfig({
        runtime: {
          mode: 'viewer',
        },
      });
    });

    expect(change?.impact.rebuildResources).toBe(true);
    expect(result.current.config.config.runtime.mode).toBe('viewer');
  });

  it('restores the initial config and explains validation issues', () => {
    const wrapper = createWrapper({
      runtime: { mode: 'designer' },
      signatures: {
        defaultMode: 'provider',
        providers: [],
      },
      visibility: visibleDocumentsPanels,
      ui: {
        visibility: visibleDocumentsPanels,
      },
    });

    const { result } = renderHook(
      () => {
        const controller = useSisadPdfmeController({ current: null });
        const config = useSisadPdfmeConfig();
        return { controller, config };
      },
      { wrapper },
    );

    const explanation = result.current.controller.explainConfiguration();
    expect(explanation.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'signatures-provider-missing',
        }),
      ]),
    );

    act(() => {
      result.current.controller.updateConfig({
        visibility: {
          sidebars: {
            right: {
              panels: {
                documents: false,
              },
            },
          },
        },
      });
    });

    act(() => {
      result.current.controller.resetConfig();
    });

    expect(result.current.config.config.runtime.mode).toBe('designer');
    expect(result.current.config.visibility.sidebars.right.panels.documents).toBe(true);
  });
});
