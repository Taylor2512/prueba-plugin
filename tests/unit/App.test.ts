import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/App';

describe('App.jsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
