import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('sisad-pdfme/ui/components/Designer/index.tsx', () => {
  it('declares emitActiveDocumentChange before runtimeApi to avoid TDZ crashes', () => {
    const sourcePath = join(process.cwd(), 'src/sisad-pdfme/ui/components/Designer/index.tsx');
    const source = readFileSync(sourcePath, 'utf8');
    const emitIndex = source.indexOf('const emitActiveDocumentChange = useCallback');
    const runtimeApiIndex = source.indexOf('const runtimeApi: DesignerRuntimeApi = useMemo');

    expect(emitIndex).toBeGreaterThan(-1);
    expect(runtimeApiIndex).toBeGreaterThan(-1);
    expect(emitIndex).toBeLessThan(runtimeApiIndex);
  });
});
