import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/features/pdfcomponent/LabLandingPage.jsx';

describe('features/pdfcomponent/LabLandingPage.jsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
