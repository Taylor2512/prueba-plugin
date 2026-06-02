import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/features/pdfcomponent/LabExampleDownloadButton.jsx';

describe('features/pdfcomponent/LabExampleDownloadButton.jsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
