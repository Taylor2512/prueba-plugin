import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/features/pdfcomponent/utils/binary';

describe('features/pdfcomponent/utils/binary.js', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
