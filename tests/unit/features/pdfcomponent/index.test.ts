import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/features/pdfcomponent/index';

describe('features/pdfcomponent/index.js', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
