/**
 * actionSchemaFactory — shared DOM helpers for action-based schemas.
 *
 * Covers approve, decline, note, attachment.
 * Approve/decline use createActionButtonEl from schemaDom.
 * Note/attachment use their own container helpers below.
 */
import type { ActionSchemaKind, SemanticTone, SisadSchemaBase } from '../shared/schemaTypes.js';
import type { PDFPage, RGB } from 'pdf-lib';
import { applyFieldChrome } from '../shared/fieldChrome.js';
import { createSchemaPart } from '../shared/schemaDom.js';

type ActionChromeColor = readonly [number, number, number];

/** Dibuja el chrome rectangular compartido por los campos de acción en PDF. */
export const drawActionFieldChrome = ({
  schema,
  page,
  rgb,
  borderColor,
  backgroundColor,
}: {
  schema: { position: { x?: number; y?: number }; width?: number; height?: number };
  page: PDFPage;
  rgb: (_red: number, _green: number, _blue: number) => RGB;
  borderColor: ActionChromeColor;
  backgroundColor: ActionChromeColor;
}) => {
  const { position } = schema;
  const x = Number(position.x);
  const y = Number(position.y);
  const width = Number(schema.width);
  const height = Number(schema.height);
  page.drawRectangle({
    x,
    y: page.getHeight() - y - height,
    width,
    height,
    borderColor: rgb(...borderColor),
    borderWidth: 1,
    color: rgb(...backgroundColor),
  });
};

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

  Object.assign(container.style, {
    width: '100%',
    height: '100%',
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: '4px',
    padding: '4px 8px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'flex-start',
  });
  Object.assign(textEl.style, {
    color: text,
    fontSize: `${fontSize}px`,
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
  });

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

const createPaperclipIconEl = (): SVGSVGElement => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'm21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48');
  svg.appendChild(path);
  return svg;
};

/**
 * Creates the attachment container styled via CSS class.
 */
export const createAttachmentContainerEl = (schema: AttachmentSchema): HTMLDivElement => {
  const container = createSchemaPart('div', 'sisad-pdfme-attachment-container');
  applyFieldChrome(container, { schema, family: 'action-based', compact: true });
  Object.assign(container.style, {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed #d1d5db',
    borderRadius: '6px',
    background: '#f9fafb',
    cursor: 'pointer',
    boxSizing: 'border-box',
  });

  const label = createSchemaPart('span', 'sisad-pdfme-attachment-label');
  Object.assign(label.style, {
    color: '#6b7280',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  });
  label.appendChild(createPaperclipIconEl());
  label.appendChild(document.createTextNode('Adjuntar archivo'));

  container.appendChild(label);
  return container;
};
