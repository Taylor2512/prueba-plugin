import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/streams/LZWStream';

describe('sisad-pdfme/pdf-lib/core/streams/LZWStream.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
