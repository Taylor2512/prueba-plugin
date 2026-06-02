import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/features/pdfcomponent/CaseCard.jsx';

describe('features/pdfcomponent/CaseCard.jsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
