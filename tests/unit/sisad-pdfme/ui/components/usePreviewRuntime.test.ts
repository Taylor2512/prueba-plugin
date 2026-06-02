import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/ui/components/usePreviewRuntime';

describe('sisad-pdfme/ui/components/usePreviewRuntime.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
