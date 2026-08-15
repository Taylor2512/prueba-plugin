/**
 * Shared DOM helpers for schema ui() functions.
 * Reduces repetition of createElement, setAttribute, classList.add, textContent.
 */
import type { SisadSchemaBase, SchemaVisualFamily } from '@sisad-pdfme/schemas/shared/schemaTypes';

// ─── Root helpers ─────────────────────────────────────────────────────────────

/**
 * Applies common rootElement inline styles shared by all schema ui() functions.
 * Resets chrome applied by the host container so schemas control their own look.
 */
export const setSchemaRootBase = (root: HTMLElement, isDesigner: boolean): void => {
  Object.assign(root.style, {
    overflow: 'visible',
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    padding: '0',
    margin: '0',
    pointerEvents: isDesigner ? 'none' : 'auto',
  });
};

/**
 * Clears rootElement children using replaceChildren (avoids innerHTML = '').
 */
export const clearSchemaRoot = (root: HTMLElement): void => {
  root.replaceChildren();
};

/**
 * Stamps data attributes onto the rootElement from schema fields.
 * Does NOT touch data-schema-id (set by the pdfme host). Does NOT add selectable class.
 */
export const setSchemaRootAttributes = <TSchema extends SisadSchemaBase>(
  root: HTMLElement,
  schema: TSchema,
  options: {
    family?: SchemaVisualFamily;
    ownerColor?: string;
  } = {},
): void => {
  // Respaldo neutro (no azul): un schema sin color de dueño no debe parecer
  // asignado al recipient azul por defecto.
  const tone = options.ownerColor ?? schema.ownerColor ?? schema.recipientColor ?? '#94A3B8';

  if (options.family) root.dataset.schemaFamily = options.family;
  if (schema.documentId) {
    root.dataset.documentId = schema.documentId;
  }
  if (typeof schema.pageIndex === 'number') {
    root.dataset.pageIndex = String(schema.pageIndex);
  }
  if (typeof schema.pageNumber === 'number') {
    root.dataset.pageNumber = String(schema.pageNumber);
  }
  root.dataset.schemaRequired = String(Boolean(schema.required));
  root.dataset.schemaReadonly = String(Boolean(schema.readOnly || schema.readonly));
  root.dataset.schemaLocked = String(Boolean(schema.locked));
  root.dataset.schemaOwnerColor = tone;
  root.style.setProperty('--schema-tone', tone);
  root.style.setProperty('--schema-owner-color', tone);
};

// ─── Element factory ──────────────────────────────────────────────────────────

/**
 * Creates a typed element with a CSS class and optional text.
 * Prefer textContent over innerHTML.
 */
export const createSchemaPart = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text != null) el.textContent = text;
  return el;
};

/**
 * Appends non-null children to root in one pass.
 */
export const appendSchemaChildren = (
  root: HTMLElement,
  children: Array<HTMLElement | null | undefined>,
): void => {
  for (const child of children) {
    if (child) root.appendChild(child);
  }
};

// ─── Action button ────────────────────────────────────────────────────────────

export interface ActionButtonOptions {
  label: string;
  bgColor: string;
  textColor: string;
  fontSize: number;
  isInteractive: boolean;
  iconSvg: string;
}

/**
 * Creates a full-size action button (approve / decline style).
 * Appearance driven by CSS class; colors/size injected as custom properties.
 */
export const createActionButtonEl = (opts: ActionButtonOptions): HTMLButtonElement => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'sisad-pdfme-action-button';
  Object.assign(button.style, {
    width: '100%',
    height: '100%',
    background: opts.bgColor,
    color: opts.textColor,
    border: '0',
    borderRadius: '5px',
    fontWeight: '600',
    fontSize: `${opts.fontSize}px`,
    cursor: opts.isInteractive ? 'pointer' : 'default',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  });
  if (!opts.isInteractive) button.dataset.designerMode = 'true';
  button.innerHTML = `${opts.iconSvg}${opts.label}`;
  return button;
};
