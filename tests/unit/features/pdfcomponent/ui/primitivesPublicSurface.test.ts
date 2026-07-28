import { describe, expect, it } from 'vitest';
import * as primitives from '@/features/pdfcomponent/ui/primitives.jsx';

describe('pdfcomponent ui primitives public surface', () => {
  it('exposes the lab primitives module exports', () => {
    expect(typeof primitives.IconButton).toBe('function');
    expect(typeof primitives.Hero).toBe('function');
    expect(typeof primitives.CaseGrid).toBe('function');
  });
});
