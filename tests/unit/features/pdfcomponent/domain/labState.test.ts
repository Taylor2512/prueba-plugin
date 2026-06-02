import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/features/pdfcomponent/domain/labState';

describe('features/pdfcomponent/domain/labState.js', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
