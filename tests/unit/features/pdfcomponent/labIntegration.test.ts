import { describe, expect, it } from 'vitest';
import { createSisadPdfmeConfig } from '@/sisad-pdfme/config';

describe('sisad-pdfme/config integration', () => {
  it('propagates active recipient overrides and global view into collaboration config', () => {
    const resolved = createSisadPdfmeConfig({
      collaboration: {
        activeRecipientId: 'recipient-1',
        isGlobalView: true,
        enabled: true,
        canEditStructure: true,
      },
    });

    expect(resolved.config.collaboration.activeRecipientId).toBe('recipient-1');
    expect(resolved.config.collaboration.isGlobalView).toBe(true);
    expect(resolved.runtimeOptions.collaboration?.activeRecipientId).toBe('recipient-1');
    expect(resolved.runtimeOptions.collaboration?.isGlobalView).toBe(true);
  });

  it('opens the docs tab by default for document sidebar presets', () => {
    const resolved = createSisadPdfmeConfig({
      sidebars: {
        right: {
          defaultPanel: 'documents',
        },
      },
      documents: {
        mode: 'multi',
      },
    });

    expect(resolved.runtimeOptions.rightSidebarViewMode).toBe('docs');
  });
});
