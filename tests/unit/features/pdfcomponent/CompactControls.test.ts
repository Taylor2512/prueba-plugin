import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/features/pdfcomponent/CompactControls.jsx';

describe('features/pdfcomponent/CompactControls.jsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
