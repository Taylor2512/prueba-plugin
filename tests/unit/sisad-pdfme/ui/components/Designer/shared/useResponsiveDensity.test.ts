import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/ui/components/Designer/shared/useResponsiveDensity';

describe('sisad-pdfme/ui/components/Designer/shared/useResponsiveDensity.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
