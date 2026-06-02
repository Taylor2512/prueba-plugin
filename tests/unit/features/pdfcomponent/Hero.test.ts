import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/features/pdfcomponent/Hero.jsx';

describe('features/pdfcomponent/Hero.jsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
