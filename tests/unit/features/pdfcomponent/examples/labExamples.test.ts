import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/features/pdfcomponent/examples/labExamples';

describe('features/pdfcomponent/examples/labExamples.js', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
