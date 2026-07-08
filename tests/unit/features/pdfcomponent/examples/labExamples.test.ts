import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/features/pdfcomponent/labs/examples/labExamples';

describe('features/pdfcomponent/labs/examples/labExamples.js', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
