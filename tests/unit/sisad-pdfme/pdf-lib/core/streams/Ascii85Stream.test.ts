import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/streams/Ascii85Stream';

describe('sisad-pdfme/pdf-lib/core/streams/Ascii85Stream.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
