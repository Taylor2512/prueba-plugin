import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/types/custom.d';

describe('types/custom.d.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
