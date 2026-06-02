import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/features/pdfcomponent/PopoverMenu.jsx';

describe('features/pdfcomponent/PopoverMenu.jsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
