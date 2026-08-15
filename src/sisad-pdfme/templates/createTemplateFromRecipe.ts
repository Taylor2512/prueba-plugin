import { cloneDeep, type SchemaForUI, type Template } from '@sisad-pdfme/common';
import { createDefaultSchema } from '@sisad-pdfme/schemas';
import { createDefaultTemplate, type CreateDefaultTemplateOptions } from '@sisad-pdfme/templates/createDefaultTemplate';

export type SisadPdfmeTemplateRecipeGroup = {
  title: string;
  types: string[];
};

export type SisadPdfmeTemplateRecipe = {
  groups?: SisadPdfmeTemplateRecipeGroup[];
  basePdf?: Template['basePdf'];
  pageSize?: CreateDefaultTemplateOptions['pageSize'];
  padding?: CreateDefaultTemplateOptions['padding'];
};

const COLUMN_GAP = 6;
const ROW_GAP = 6;
const DEFAULT_PAGE_SIZE = { width: 390, height: 400 };
const DEFAULT_PADDING: [number, number, number, number] = [12, 12, 12, 12];
const FALLBACK_SIZE = { width: 45, height: 10 };

const resolveNaturalSize = (schema: SchemaForUI, contentWidth: number, contentHeight: number) => {
  const width = Number(schema.width) > 0 ? Number(schema.width) : FALLBACK_SIZE.width;
  const height = Number(schema.height) > 0 ? Number(schema.height) : FALLBACK_SIZE.height;

  return {
    width: Math.min(width, contentWidth),
    height: Math.min(height, contentHeight),
  };
};

const normalizePageSize = (
  recipe: SisadPdfmeTemplateRecipe,
) => {
  const fallbackPageWidth = recipe.pageSize?.width ?? DEFAULT_PAGE_SIZE.width;
  const fallbackPageHeight = recipe.pageSize?.height ?? DEFAULT_PAGE_SIZE.height;
  const basePdf = recipe.basePdf && typeof recipe.basePdf === 'object'
    ? (recipe.basePdf as Record<string, unknown>)
    : {};

  const padding = Array.isArray(recipe.padding)
    ? recipe.padding
    : Array.isArray(basePdf.padding)
      ? (basePdf.padding as [number, number, number, number])
      : DEFAULT_PADDING;

  const pageWidth = Number(basePdf.width);
  const pageHeight = Number(basePdf.height);
  const resolvedPageWidth = Number.isFinite(pageWidth) && pageWidth > 0 ? pageWidth : fallbackPageWidth;
  const resolvedPageHeight = Number.isFinite(pageHeight) && pageHeight > 0 ? pageHeight : fallbackPageHeight;

  return {
    basePdf: {
      ...basePdf,
      width: resolvedPageWidth,
      height: resolvedPageHeight,
      padding,
    } as Template['basePdf'],
    contentWidth: Math.max(1, resolvedPageWidth - padding[1] - padding[3]),
    contentHeight: Math.max(1, resolvedPageHeight - padding[0] - padding[2]),
    paddingTop: padding[0],
    paddingLeft: padding[3],
  };
};

const layoutRecipe = (
  groups: SisadPdfmeTemplateRecipeGroup[],
  contentWidth: number,
  contentHeight: number,
  paddingTop: number,
  paddingLeft: number,
) => {
  const pages: SchemaForUI[][] = [[]];
  const placedSchemas: SchemaForUI[] = [];
  let currentPageIndex = 0;
  let cursorX = paddingLeft;
  let cursorY = paddingTop;
  let rowHeight = 0;

  const currentPage = () => pages[currentPageIndex];

  const startNewRow = () => {
    cursorX = paddingLeft;
    cursorY += rowHeight + ROW_GAP;
    rowHeight = 0;
  };

  const startNewPage = () => {
    pages.push([]);
    currentPageIndex += 1;
    cursorX = paddingLeft;
    cursorY = paddingTop;
    rowHeight = 0;
  };

  groups.forEach((group) => {
    (group.types || []).forEach((type, typeIndex) => {
      const normalizedType = String(type || '').trim();
      if (!normalizedType) return;

      const schema = createDefaultSchema(normalizedType, {
        pageNumber: currentPageIndex + 1,
        id: `${normalizedType}-${currentPageIndex}-${typeIndex}`,
        schemaUid: `${normalizedType}-${currentPageIndex}-${typeIndex}`,
        existingSchemas: placedSchemas,
      });
      const size = resolveNaturalSize(schema, contentWidth, contentHeight);

      if (currentPage().length > 0 && cursorX + size.width > paddingLeft + contentWidth) {
        startNewRow();
      }
      if (currentPage().length > 0 && cursorY + size.height > paddingTop + contentHeight) {
        startNewPage();
      }

      const nextSchema = {
        ...schema,
        id: `${normalizedType}-${currentPageIndex}-${typeIndex}`,
        schemaUid: `${normalizedType}-${currentPageIndex}-${typeIndex}`,
        pageNumber: currentPageIndex + 1,
        name: schema.name || group.title || schema.type || `field-${typeIndex + 1}`,
        position: { x: cursorX, y: cursorY },
        width: size.width,
        height: size.height,
        groupTitle: group.title,
      } as SchemaForUI & { groupTitle?: string };

      currentPage().push(nextSchema);
      placedSchemas.push(nextSchema);

      cursorX += size.width + COLUMN_GAP;
      rowHeight = Math.max(rowHeight, size.height);
    });
  });

  return pages.filter((page) => page.length > 0);
};

export function createTemplateFromRecipe(recipe: SisadPdfmeTemplateRecipe = {}): Template {
  const layout = normalizePageSize(recipe);
  const pages = layoutRecipe(
    recipe.groups || [],
    layout.contentWidth,
    layout.contentHeight,
    layout.paddingTop,
    layout.paddingLeft,
  );

  return createDefaultTemplate({
    basePdf: layout.basePdf,
    schemas: pages.length > 0 ? cloneDeep(pages) : [[]],
  });
}
