import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/ui/components/Designer/shared/schemaCollision';

describe('sisad-pdfme/ui/components/Designer/shared/schemaCollision.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
