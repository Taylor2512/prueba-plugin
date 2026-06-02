import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/ui/components/Designer/shared/designerExtensions';

describe('sisad-pdfme/ui/components/Designer/shared/designerExtensions.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
