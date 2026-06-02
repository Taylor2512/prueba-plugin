import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/features/pdfcomponent/template';

describe('features/pdfcomponent/template.js', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
