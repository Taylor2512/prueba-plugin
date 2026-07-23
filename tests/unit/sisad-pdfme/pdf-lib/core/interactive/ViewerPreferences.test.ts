import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/interactive/ViewerPreferences';

describe('sisad-pdfme/pdf-lib/core/interactive/ViewerPreferences.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
