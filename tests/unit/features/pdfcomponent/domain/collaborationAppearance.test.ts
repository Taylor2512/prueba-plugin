import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/features/pdfcomponent/domain/collaborationAppearance';

describe('features/pdfcomponent/domain/collaborationAppearance.js', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
