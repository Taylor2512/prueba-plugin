import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager';

describe('sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager.tsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
