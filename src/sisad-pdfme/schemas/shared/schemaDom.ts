/**
 * Shared DOM helpers for schema ui() functions.
 * Reduces repetition of createElement, setAttribute, classList.add, textContent.
 */
import type { SisadSchemaBase, SchemaVisualFamily } from './schemaTypes.js';

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
  const tone = options.ownerColor ?? schema.ownerColor ?? schema.recipientColor ?? '#2563eb';

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
  root.style.setProperty('--schema-tone', tone);
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
  button.style.setProperty('--action-btn-bg', opts.bgColor);
  button.style.setProperty('--action-btn-color', opts.textColor);
  button.style.setProperty('--action-btn-font-size', `${opts.fontSize}px`);
  if (!opts.isInteractive) button.dataset.designerMode = 'true';
  button.innerHTML = `${opts.iconSvg}${opts.label}`;
  return button;
};
