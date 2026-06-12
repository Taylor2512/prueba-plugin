/**
 * actionSchemaFactory — shared DOM helpers for action-based schemas.
 *
 * Covers approve, decline, note, attachment.
 * Approve/decline use createActionButtonEl from schemaDom.
 * Note/attachment use their own container helpers below.
 */
import type { ActionSchemaKind, SemanticTone, SisadSchemaBase } from '../shared/schemaTypes.js';
import { applyFieldChrome } from '../shared/fieldChrome.js';
import { createSchemaPart } from '../shared/schemaDom.js';

export type { ActionSchemaKind, SemanticTone };

// ─── Note container ───────────────────────────────────────────────────────────

export type NoteSchema = SisadSchemaBase<{
  noteBackground?: string;
  noteBorderColor?: string;
  noteTextColor?: string;
  fontSize?: number;
  visibleToRecipients?: boolean;
  content?: string;
}>;

/**
 * Creates the note container + text elements styled via CSS classes.
 * Dynamic colors set via CSS custom properties so no inline Object.assign needed.
 */
export const createNoteContainerEl = (schema: NoteSchema): {
  container: HTMLDivElement;
  textEl: HTMLSpanElement;
} => {
  const container = createSchemaPart('div', 'sisad-pdfme-note-container');
  const textEl = createSchemaPart('span', 'sisad-pdfme-note-text');

  applyFieldChrome(container, { schema, family: 'action-based', compact: true });

  const bg = schema.noteBackground || '#fefce8';
  const border = schema.noteBorderColor || '#fde047';
  const text = schema.noteTextColor || '#713f12';
  const fontSize = schema.fontSize ?? 10;

  container.style.setProperty('--note-bg', bg);
  container.style.setProperty('--note-border', border);
  container.style.setProperty('--note-text', text);
  textEl.style.setProperty('--note-font-size', `${fontSize}px`);

  textEl.textContent = schema.content || 'Nota informativa';
  container.appendChild(textEl);

  return { container, textEl };
};

// ─── Attachment container ─────────────────────────────────────────────────────

export type AttachmentSchema = SisadSchemaBase<{
  allowedMimeTypes?: string;
  maxFiles?: number;
  maxSizeMb?: number;
  allowReplace?: boolean;
  showFileName?: boolean;
  showUploadStatus?: boolean;
}>;

const PAPERCLIP_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`;

/**
 * Creates the attachment container styled via CSS class.
 */
export const createAttachmentContainerEl = (schema: AttachmentSchema): HTMLDivElement => {
  const container = createSchemaPart('div', 'sisad-pdfme-attachment-container');
  applyFieldChrome(container, { schema, family: 'action-based', compact: true });

  const label = createSchemaPart('span', 'sisad-pdfme-attachment-label');
  label.innerHTML = `${PAPERCLIP_SVG}Adjuntar archivo`;

  container.appendChild(label);
  return container;
};
