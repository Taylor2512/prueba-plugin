import { expect, test, type Page } from '@playwright/test';

type Scenario =
  | {
      name: string;
      kind: 'change';
      config: Record<string, unknown>;
      patch: Record<string, unknown>;
      expected: Record<string, unknown>;
    }
  | {
      name: string;
      kind: 'feature' | 'action' | 'component';
      config: Record<string, unknown>;
      id: string;
      context?: Record<string, unknown>;
      expected: Record<string, unknown>;
    };

const modulePath = '/src/sisad-pdfme/config/index.ts';

const scenarios: Scenario[] = [
  {
    name: 'presentation-only updates keep runtime resources stable',
    kind: 'change',
    config: {
      runtime: { mode: 'designer' },
      documents: { mode: 'single', preserveDocumentSchemaRouting: true },
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
    },
    patch: {
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
    },
    expected: {
      presentationOnly: true,
      rebuildResources: false,
      sameDesignerEngine: true,
      sameEventHub: true,
      sameAdapters: true,
      documentsVisible: false,
      runtimeMode: 'designer',
    },
  },
  {
    name: 'runtime mode changes trigger controlled rebuilds',
    kind: 'change',
    config: {
      runtime: { mode: 'designer' },
    },
    patch: {
      runtime: { mode: 'viewer' },
    },
    expected: {
      presentationOnly: false,
      rebuildResources: true,
      sameDesignerEngine: false,
      sameEventHub: false,
      sameAdapters: false,
      runtimeMode: 'viewer',
    },
  },
  {
    name: 'reset restores the initial config and diagnostics',
    kind: 'change',
    config: {
      runtime: { mode: 'designer' },
      signatures: {
        defaultMode: 'provider',
        providers: [],
      },
    },
    patch: {
      runtime: { mode: 'viewer' },
    },
    expected: {
      hasSignatureIssue: true,
      resetRebuildResources: true,
      mode: 'designer',
    },
  },
  {
    name: 'runtime feature blocks on readonly',
    kind: 'feature',
    config: {
      runtime: { readonly: true },
    },
    id: 'runtime',
    expected: {
      id: 'runtime',
      executable: false,
      active: false,
      reason: 'runtime-readonly',
    },
  },
  {
    name: 'canvas feature blocks when disabled',
    kind: 'feature',
    config: {
      canvas: {
        enabled: false,
      },
    },
    id: 'canvas',
    expected: {
      id: 'canvas',
      enabled: false,
      supported: false,
      executable: false,
      reason: 'canvas-disabled',
    },
  },
  {
    name: 'sidebars feature hides without disabling capability',
    kind: 'feature',
    config: {
      sidebars: {
        left: { enabled: true },
        right: { enabled: true },
      },
      visibility: {
        sidebars: {
          left: { visible: false },
          right: { visible: false },
        },
      },
      ui: {
        visibility: {
          sidebars: {
            left: { visible: false },
            right: { visible: false },
          },
        },
      },
    },
    id: 'sidebars',
    expected: {
      id: 'sidebars',
      enabled: true,
      visible: false,
      executable: true,
    },
  },
  {
    name: 'documents feature tracks routing and panel visibility',
    kind: 'feature',
    config: {
      documents: {
        mode: 'multi',
        activeDocumentStrategy: 'host',
        preserveDocumentSchemaRouting: true,
      },
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
    id: 'documents',
    expected: {
      id: 'documents',
      enabled: true,
      visible: false,
      routingMode: 'multi',
      activeDocumentStrategy: 'host',
      panelVisible: false,
      executable: true,
    },
  },
  {
    name: 'comments feature hides panels without disabling capability',
    kind: 'feature',
    config: {
      comments: {
        enabled: true,
      },
      visibility: {
        modals: {
          comments: false,
        },
        sidebars: {
          right: {
            panels: {
              comments: false,
            },
          },
        },
      },
    },
    id: 'comments',
    expected: {
      id: 'comments',
      enabled: true,
      visible: false,
      panelVisible: false,
      modalVisible: false,
      executable: true,
    },
  },
  {
    name: 'signatures feature blocks on readonly',
    kind: 'feature',
    config: {
      signatures: {
        enabled: true,
        defaultMode: 'provider',
        providers: [{ key: 'provider-a', label: 'Provider A' }],
      },
    },
    id: 'signatures',
    context: { readOnly: true },
    expected: {
      id: 'signatures',
      executable: false,
      reason: 'signatures-readonly',
    },
  },
  {
    name: 'assignment feature is executable when selection and recipients exist',
    kind: 'feature',
    config: {
      assignment: {
        enabled: true,
      },
      collaboration: {
        enabled: true,
        canEditStructure: true,
      },
      visibility: {
        actions: {
          reassign: true,
        },
      },
      ui: {
        visibility: {
          actions: {
            reassign: true,
          },
        },
      },
    },
    id: 'assignment',
    context: {
      selectionCount: 1,
      recipientCount: 2,
      canEditStructure: true,
    },
    expected: {
      id: 'assignment',
      enabled: true,
      visible: true,
      permitted: true,
      available: true,
      executable: true,
    },
  },
  {
    name: 'assignment feature reports unavailable without selection',
    kind: 'feature',
    config: {
      assignment: {
        enabled: true,
      },
      collaboration: {
        enabled: true,
        canEditStructure: true,
      },
      visibility: {
        actions: {
          reassign: true,
        },
      },
      ui: {
        visibility: {
          actions: {
            reassign: true,
          },
        },
      },
    },
    id: 'assignment',
    context: {
      selectionCount: 0,
      recipientCount: 2,
      canEditStructure: true,
    },
    expected: {
      id: 'assignment',
      available: false,
      executable: false,
      reason: 'assignment-unavailable',
    },
  },
  {
    name: 'reassign action mirrors assignment state',
    kind: 'action',
    config: {
      assignment: {
        enabled: true,
      },
      collaboration: {
        canEditStructure: true,
      },
      visibility: {
        actions: {
          reassign: true,
        },
      },
    },
    id: 'reassign-recipient',
    context: {
      selectionCount: 1,
      recipientCount: 2,
      canEditStructure: true,
    },
    expected: {
      id: 'reassign-recipient',
      commandId: 'reassignSchemaOwner',
      visible: true,
      available: true,
      executable: true,
    },
  },
  {
    name: 'delete action respects config visibility',
    kind: 'action',
    config: {
      visibility: {
        actions: {
          delete: false,
        },
      },
      ui: {
        visibility: {
          actions: {
            delete: false,
          },
        },
      },
    },
    id: 'delete-schema',
    context: {
      selectionCount: 1,
    },
    expected: {
      id: 'delete-schema',
      visible: false,
      supported: false,
      executable: false,
      reason: 'hidden-by-config',
    },
  },
  {
    name: 'duplicate action stays executable with selection',
    kind: 'action',
    config: {
      visibility: {
        actions: {
          duplicate: true,
        },
      },
      ui: {
        visibility: {
          actions: {
            duplicate: true,
          },
        },
      },
    },
    id: 'duplicate-schema',
    context: {
      selectionCount: 1,
    },
    expected: {
      id: 'duplicate-schema',
      commandId: 'duplicateSchemas',
      available: true,
      executable: true,
    },
  },
  {
    name: 'right-sidebar component follows visibility',
    kind: 'component',
    config: {
      sidebars: {
        right: {
          enabled: true,
        },
      },
      visibility: {
        sidebars: {
          right: {
            visible: false,
          },
        },
      },
      ui: {
        visibility: {
          sidebars: {
            right: {
              visible: false,
            },
          },
        },
      },
    },
    id: 'right-sidebar',
    expected: {
      id: 'right-sidebar',
      componentId: 'RightSidebar',
      visible: false,
      enabled: false,
      executable: false,
      reason: 'hidden-by-config',
    },
  },
  {
    name: 'assignment-dialog component tracks modal visibility',
    kind: 'component',
    config: {
      visibility: {
        modals: {
          assignment: false,
        },
      },
      ui: {
        visibility: {
          modals: {
            assignment: false,
          },
        },
      },
    },
    id: 'assignment-dialog',
    expected: {
      id: 'assignment-dialog',
      componentId: 'SchemaAssignmentDialog',
      visible: false,
      executable: false,
      reason: 'hidden-by-config',
    },
  },
];

const runScenario = async (page: Page, scenario: Scenario) =>
  page.evaluate(async ({ path, data }) => {
    const { createSisadPdfmeConfigService } = await import(/* @vite-ignore */ path);
    const service = createSisadPdfmeConfigService(data.config);

    if (data.kind === 'change') {
      const initial = service.getResolvedConfig();
      const change = service.update(data.patch);
      const next = service.getResolvedConfig();

      const resetChange = service.reset();
      const afterReset = service.getResolvedConfig();
      const before = service.explain();

      return {
        presentationOnly: change.impact.presentationOnly,
        rebuildResources: change.impact.rebuildResources,
        sameDesignerEngine: next.designerEngine === initial.designerEngine,
        sameEventHub: next.eventHub === initial.eventHub,
        sameAdapters: next.adapters === initial.adapters,
        documentsVisible: next.visibility.sidebars?.right?.panels?.documents ?? null,
        runtimeMode: next.config.runtime.mode,
        hasSignatureIssue: before.issues.some((issue) => issue.code === 'signatures-provider-missing'),
        resetRebuildResources: resetChange.impact.rebuildResources,
        mode: afterReset.config.runtime.mode,
      };
    }

    if (data.kind === 'feature') {
      return service.selectFeatureState(data.id as never, (data.context || {}) as never);
    }

    if (data.kind === 'action') {
      return service.selectActionState(data.id as never, (data.context || {}) as never);
    }

    return service.selectComponentState(data.id as never, (data.context || {}) as never);
  }, { path: modulePath, data: scenario });

test.describe('configuration - public config closure', () => {
  for (const scenario of scenarios) {
    test(scenario.name, async ({ page }) => {
      await page.goto('/');
      const result = await runScenario(page, scenario);
      expect(result).toEqual(expect.objectContaining(scenario.expected));
    });
  }
});
