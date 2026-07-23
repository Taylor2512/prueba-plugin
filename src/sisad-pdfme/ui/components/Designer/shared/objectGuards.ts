import { SELECTABLE_CLASSNAME } from '../../../constants.js';

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export const asRecord = (value: unknown): Record<string, unknown> | null =>
  isRecord(value) ? value : null;

const isSchemaRootElement = (element: Element | null | undefined): element is HTMLElement => {
  if (!(element instanceof HTMLElement)) return false;
  return element.classList.contains(SELECTABLE_CLASSNAME) && element.hasAttribute('data-schema-id');
};
