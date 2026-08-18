import { describe, expect, it } from 'vitest';
import { resolveSchemaDisplayInfo } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaDisplayInfo';

describe('schema display metadata capability', () => {
  it('resolves stable display labels from the schema contract', () => {
    const result = resolveSchemaDisplayInfo({ type: 'text', name: 'customerName' } as never);
    expect(result.technicalName).toBe('customerName');
    expect(result.typeLabel).toBeTruthy();
  });
});
