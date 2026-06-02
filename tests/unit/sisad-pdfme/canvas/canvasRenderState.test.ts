import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/canvas/canvasRenderState';

describe('sisad-pdfme/canvas/canvasRenderState.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
