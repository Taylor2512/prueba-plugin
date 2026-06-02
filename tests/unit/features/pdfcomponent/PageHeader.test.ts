import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/features/pdfcomponent/PageHeader.jsx';

describe('features/pdfcomponent/PageHeader.jsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
