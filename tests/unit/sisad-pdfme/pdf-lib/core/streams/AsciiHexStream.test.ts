import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/streams/AsciiHexStream';

describe('sisad-pdfme/pdf-lib/core/streams/AsciiHexStream.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
