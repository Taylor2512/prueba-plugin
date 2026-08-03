import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/examples/domain/exampleBuilder.js';
import * as bundleUnderTest from '@/examples/exporters/exampleBundle.js';

describe('sisad-pdfme/examples barrel', () => {
  it('exposes the example builders used by the examples folder', () => {
    expect(moduleUnderTest).toBeTruthy();
    expect(typeof moduleUnderTest.createExample).toBe('function');
    expect(typeof bundleUnderTest.buildExampleBundle).toBe('function');
  });
});
