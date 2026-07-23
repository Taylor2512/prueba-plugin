import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/streams/decode';

describe('sisad-pdfme/pdf-lib/core/streams/decode.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
