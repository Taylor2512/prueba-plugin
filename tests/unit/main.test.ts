import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/main';

describe('main.jsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
