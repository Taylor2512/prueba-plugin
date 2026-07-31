import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/examples/index.jsx';

describe('sisad-pdfme/examples barrel', () => {
  it('exposes the example builders used by the examples folder', () => {
    expect(moduleUnderTest).toBeTruthy();
    expect(typeof moduleUnderTest.createExample).toBe('function');
    expect(typeof moduleUnderTest.buildExampleBundle).toBe('function');
  });
});
