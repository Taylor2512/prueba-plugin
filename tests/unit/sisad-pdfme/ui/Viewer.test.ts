import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/ui/Viewer';

describe('sisad-pdfme/ui/Viewer.tsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
