import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/ui/components/Designer/shared/useDesignerKeyboardShortcuts';

describe('sisad-pdfme/ui/components/Designer/shared/useDesignerKeyboardShortcuts.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
