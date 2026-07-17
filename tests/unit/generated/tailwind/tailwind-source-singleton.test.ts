import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('Tailwind source contract', () => {
  it('mantiene una sola entrada canónica de Tailwind', () => {
    const canonical = read('src/styles/tailwind.css');
    expect(canonical.match(/@tailwind\s+(base|components|utilities)/g)).toHaveLength(3);
    expect(read('src/style.css')).not.toMatch(/@tailwind\s+(base|components|utilities)/);
  });

  it('no reintroduce contenido en el bridge neutralizado', () => {
    expect(read('src/styles/sisad-tailwind-bridge.css').trim()).toBe('');
  });
});
