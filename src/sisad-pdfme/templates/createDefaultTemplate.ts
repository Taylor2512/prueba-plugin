import type { Template, SchemaForUI } from '@sisad-pdfme/common';

export type CreateDefaultTemplateOptions = {
  /** Explicit basePdf. When provided, `pageSize`/`padding` are ignored. */
  basePdf?: Template['basePdf'];
  /** Blank-page size. Defaults to 390×400 ( lab default). */
  pageSize?: { width: number; height: number };
  /** Blank-page padding [top, right, bottom, left]. Defaults to [12,12,12,12]. */
  padding?: [number, number, number, number];
  /** Initial schema pages. Defaults to a single empty page `[[]]`. */
  schemas?: SchemaForUI[][];
};

const DEFAULT_PAGE_SIZE = { width: 390, height: 400 };
const DEFAULT_PADDING: [number, number, number, number] = [12, 12, 12, 12];

/**
 * Builds a minimal, valid pdfme template. Defaults reproduce the
 * `createInitialPdfmeTemplate()` from the lab, so existing callers get
 * identical output while gaining configurability.
 */
export function createDefaultTemplate(
  options: CreateDefaultTemplateOptions = {},
): Template {
  const { width, height } = options.pageSize ?? DEFAULT_PAGE_SIZE;
  const basePdf =
    options.basePdf ?? {
      width,
      height,
      padding: options.padding ?? DEFAULT_PADDING,
    };

  return {
    basePdf,
    schemas: options.schemas ?? [[]],
  } as Template;
}
