/**
 * selectionIdentityResolver
 *
 * Single source of truth for turning selected DOM elements (schema roots) back
 * into schema objects and page scope. Replaces three duplicated copies that
 * lived in CanvasOverlayManager, selectionCommands and Designer/index.
 *
 * SRP: identity resolution only. DIP: callers depend on this contract, not on
 * ad-hoc dataset parsing. Never falls back to schemasList[pageCursor] when
 * activeElements exist — identity comes from the element's own dataset.
 */
import type { SchemaForUI } from '@sisad-pdfme/common';
import { asRecord } from './objectGuards.js';

export type SchemaElementIdentity = {
  schemaId?: string;
  schemaUid?: string;
  schemaName?: string;
  documentId?: string;
  pageNumber?: number;
  pageIndex?: number;
};

export type SelectionPageScope = {
  documentId?: string;
  pageNumber?: number;
  pageIndex?: number;
  isSinglePage: boolean;
};

const toInt = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : undefined;
};

const schemaUidOf = (schema: SchemaForUI): string | undefined => {
  const uid = asRecord(schema)?.schemaUid;
  return typeof uid === 'string' && uid ? uid : undefined;
};

export const resolveSchemaIdentityFromElement = (element: HTMLElement): SchemaElementIdentity => ({
  schemaId: element.dataset.schemaId || element.id || undefined,
  schemaUid: element.dataset.schemaUid || undefined,
  schemaName: element.dataset.schemaName || undefined,
  documentId: element.dataset.documentId || undefined,
  pageNumber: toInt(element.dataset.pageNumber),
  pageIndex: toInt(element.dataset.pageIndex),
});

const matchesIdentity = (schema: SchemaForUI, identity: SchemaElementIdentity): boolean => {
  // Prefer uid when BOTH sides carry it; otherwise fall back to schemaId.
  const uid = schemaUidOf(schema);
  if (identity.schemaUid && uid) return uid === identity.schemaUid;
  return Boolean(identity.schemaId) && schema.id === identity.schemaId;
};

const resolveSchemaFromElement = (
  schemasList: SchemaForUI[][],
  element: HTMLElement | null | undefined,
): SchemaForUI | null => {
  if (!element) return null;
  const identity = resolveSchemaIdentityFromElement(element);
  if (!identity.schemaId && !identity.schemaUid) return null;

  // The element's own page first, then a global scan across all pages.
  if (typeof identity.pageIndex === 'number' && identity.pageIndex >= 0) {
    const found = (schemasList[identity.pageIndex] || []).find((s) => matchesIdentity(s, identity));
    if (found) return found;
  }
  for (const pageSchemas of schemasList) {
    const found = (pageSchemas || []).find((s) => matchesIdentity(s, identity));
    if (found) return found;
  }
  return null;
};

export const resolveActiveSchemasFromElements = (
  schemasList: SchemaForUI[][],
  activeElements: HTMLElement[],
): SchemaForUI[] =>
  activeElements
    .map((element) => resolveSchemaFromElement(schemasList, element))
    .filter((schema): schema is SchemaForUI => schema !== null);

const resolveSelectionPageScope = (activeElements: HTMLElement[]): SelectionPageScope => {
  const keys = new Set<string>();
  let first: SchemaElementIdentity | null = null;
  for (const element of activeElements) {
    if (!element) continue;
    const identity = resolveSchemaIdentityFromElement(element);
    if (!first) first = identity;
    keys.add(`${identity.documentId || ''}:${identity.pageIndex ?? ''}`);
  }
  return {
    documentId: first?.documentId,
    pageNumber: first?.pageNumber,
    pageIndex: first?.pageIndex,
    isSinglePage: keys.size <= 1,
  };
};

export const resolveSelectionPageIndex = (
  activeElements: HTMLElement[],
  fallbackPageIndex = 0,
): number | null => {
  for (const element of activeElements) {
    const pageIndex = resolveSchemaIdentityFromElement(element).pageIndex;
    if (typeof pageIndex === 'number' && pageIndex >= 0) {
      return pageIndex;
    }
  }
  return Number.isInteger(fallbackPageIndex) && fallbackPageIndex >= 0 ? fallbackPageIndex : null;
};

export const isSameDocumentPageSelection = (activeElements: HTMLElement[]): boolean =>
  resolveSelectionPageScope(activeElements).isSinglePage;
