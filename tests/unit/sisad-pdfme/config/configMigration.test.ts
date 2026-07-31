import { describe, expect, it } from 'vitest';
import { migrateSisadPdfmeConfig } from '@/sisad-pdfme/config/configMigration';

describe('migrateSisadPdfmeConfig', () => {
  it('migrates ui and collaboration aliases into normalized paths without mutating input', () => {
    const input = {
      ui: {
        visibility: {
          canvas: { toolbar: false },
        },
        density: 'compact',
        sidebars: {
          left: { defaultOpen: false, catalogLayout: 'tiles' },
          right: { defaultOpen: true, defaultPanel: 'comments' },
        },
      },
      collaboration: {
        activeRecipientId: 'recipient-1',
      },
    } as const;
    const snapshot = JSON.parse(JSON.stringify(input));

    const result = migrateSisadPdfmeConfig(input);

    expect(input).toEqual(snapshot);
    expect(result.config.configVersion).toBe(2);
    expect(result.config.theme?.density).toBe('compact');
    expect(result.config.sidebars?.left?.defaultOpen).toBe(false);
    expect(result.config.sidebars?.left?.catalogLayout).toBe('tiles');
    expect(result.config.sidebars?.right?.defaultOpen).toBe(true);
    expect(result.config.sidebars?.right?.defaultPanel).toBe('comments');
    expect(result.config.recipients?.activeRecipientId).toBe('recipient-1');
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['config-path-migrated']),
    );
  });
});
