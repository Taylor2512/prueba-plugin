import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/parser/ByteStream';

describe('sisad-pdfme/pdf-lib/core/parser/ByteStream.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
