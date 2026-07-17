import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const countApply = (relative: string) => {
  const content = fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');
  return (content.match(/@apply\b/g) || []).length;
};

describe('CSS migration ratchet', () => {
  it('sisad-pdfme.css no supera el presupuesto observado', () => {
    expect(countApply('src/sisad-pdfme/ui/styles/sisad-pdfme.css')).toBeLessThanOrEqual(47);
  });

  it('tokens.css no supera el presupuesto observado', () => {
    expect(countApply('src/sisad-pdfme/ui/styles/tokens.css')).toBeLessThanOrEqual(1);
  });
});
