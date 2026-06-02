import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/canvas/useCanvasRenderState';

describe('sisad-pdfme/canvas/useCanvasRenderState.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
