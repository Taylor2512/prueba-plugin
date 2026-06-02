import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/features/pdfcomponent/CaseGrid.jsx';

describe('features/pdfcomponent/CaseGrid.jsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
