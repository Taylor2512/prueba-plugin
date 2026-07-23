import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/annotation/PDFWidgetAnnotation';

describe('sisad-pdfme/pdf-lib/core/annotation/PDFWidgetAnnotation.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
