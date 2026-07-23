import { describe, it, expect } from 'vitest';
import PDFDocument from 'pdf-lib/api/PDFDocument';
import * as moduleUnderTest from 'pdf-lib/api/form/PDFRadioGroup';

describe('sisad-pdfme/pdf-lib/api/form/PDFRadioGroup.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });

  it('keeps radio group selection mutually exclusive', async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const form = pdfDoc.getForm();
    const radioGroup = form.createRadioGroup('best.superhero.radioGroup');

    radioGroup.addOptionToPage('One Punch Man', page, { x: 10, y: 10, width: 20, height: 20 });
    radioGroup.addOptionToPage('Saitama', page, { x: 10, y: 40, width: 20, height: 20 });

    expect(radioGroup.getOptions()).toEqual(['One Punch Man', 'Saitama']);
    expect(radioGroup.getSelected()).toBeUndefined();

    radioGroup.select('One Punch Man');
    expect(radioGroup.getSelected()).toBe('One Punch Man');

    radioGroup.select('Saitama');
    expect(radioGroup.getSelected()).toBe('Saitama');
  });
});
