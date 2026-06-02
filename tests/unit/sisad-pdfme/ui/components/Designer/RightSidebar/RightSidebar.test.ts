import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar';

describe('sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
