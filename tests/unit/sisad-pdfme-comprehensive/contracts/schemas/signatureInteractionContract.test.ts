import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolveSignatureMode } from '../../../../../src/sisad-pdfme/schemas/signature/types';

describe('signature interaction contract', () => {
  it.each([
    [{ signatureMode: 'draw' }, 'draw'],
    [{ signatureMode: 'provider', signatureProviderKey: 'host-provider' }, 'provider'],
    [{ signatureMode: 'p12' }, 'p12'],
  ])('preserves the configured execution mode', (schema, expected) => {
    expect(resolveSignatureMode(schema as never)).toBe(expected);
  });

  it('draw lifecycle handles pointer capture cancellation', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'src/sisad-pdfme/schemas/signature/index.ts'),
      'utf8',
    );
    expect(source).toContain('setPointerCapture');
    expect(source).toContain("canvas.addEventListener('pointercancel', stop)");
    expect(source).toContain('releasePointerCapture');
  });
});
