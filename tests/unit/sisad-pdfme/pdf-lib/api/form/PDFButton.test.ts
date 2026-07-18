import { describe, it, expect, vi } from 'vitest';
import PDFDocument from '@/sisad-pdfme/pdf-lib/api/PDFDocument';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/api/form/PDFButton';
import PDFButton from '@/sisad-pdfme/pdf-lib/api/form/PDFButton';

describe('sisad-pdfme/pdf-lib/api/form/PDFButton.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });

  it('allows captionless buttons for image-only variants', async () => {
    const realPdfDoc = await PDFDocument.create();
    const page = realPdfDoc.addPage();
    const mockDoc = {
      getForm: vi.fn(() => ({
        getDefaultFont: vi.fn(() => ({}) as never),
      })),
      context: {
        register: vi.fn(() => 'widget-ref'),
      },
    } as never;
    const button = Object.create(PDFButton.prototype) as PDFButton & {
      createWidget: ReturnType<typeof vi.fn>;
      updateWidgetAppearance: ReturnType<typeof vi.fn>;
    };
    button.doc = mockDoc;
    button.acroField = {
      addWidget: vi.fn(),
    } as never;
    button.createWidget = vi.fn(() => ({ dict: {} }));
    button.updateWidgetAppearance = vi.fn();

    expect(() =>
      PDFButton.prototype.addToPage.call(button, undefined, page, {
        x: 20,
        y: 30,
        width: 80,
        height: 24,
      }),
    ).not.toThrow();
    expect(button.createWidget).toHaveBeenCalledWith(
      expect.objectContaining({ caption: undefined }),
    );
  });
});
