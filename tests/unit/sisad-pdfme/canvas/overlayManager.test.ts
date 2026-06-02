import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/canvas/overlayManager';

describe('sisad-pdfme/canvas/overlayManager.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
