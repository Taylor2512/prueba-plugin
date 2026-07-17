import { describe, expect, it } from 'vitest';
import {
  createAttachmentContainerEl,
  createNoteContainerEl,
} from '@/sisad-pdfme/schemas/actions/actionSchemaFactory';

describe('action schema DOM factory', () => {
  it('crea Note con contenido, color y wrapping', () => {
    const { container, textEl } = createNoteContainerEl({
      id: 'note-1', name: 'note', type: 'note', position: { x: 0, y: 0 }, width: 50, height: 20,
      content: 'Nota\nmultilínea', noteBackground: '#fffbea', noteTextColor: '#713f12', fontSize: 12,
    } as any);

    expect(container.classList.contains('sisad-pdfme-note-container')).toBe(true);
    expect(textEl.textContent).toBe('Nota\nmultilínea');
    expect(textEl.style.whiteSpace).toBe('pre-wrap');
    expect(container.style.background).not.toBe('');
  });

  it('crea Attachment con icono y label accesible por texto', () => {
    const container = createAttachmentContainerEl({
      id: 'attachment-1', name: 'attachment', type: 'attachment', position: { x: 0, y: 0 }, width: 50, height: 20,
    } as any);

    expect(container.classList.contains('sisad-pdfme-attachment-container')).toBe(true);
    expect(container.textContent).toContain('Adjuntar archivo');
    expect(container.querySelector('svg')).not.toBeNull();
  });
});
