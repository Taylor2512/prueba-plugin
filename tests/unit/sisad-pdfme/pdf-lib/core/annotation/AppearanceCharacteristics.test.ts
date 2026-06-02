import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/annotation/AppearanceCharacteristics';

describe('sisad-pdfme/pdf-lib/core/annotation/AppearanceCharacteristics.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
