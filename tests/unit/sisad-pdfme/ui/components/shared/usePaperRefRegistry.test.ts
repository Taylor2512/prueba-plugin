import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/ui/components/shared/usePaperRefRegistry';

describe('sisad-pdfme/ui/components/shared/usePaperRefRegistry.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
