import { cloneDeep, type SchemaForUI, type Template } from '@sisad-pdfme/common';
import { createDefaultSchema } from '../schemas/index.js';
import { createDefaultTemplate, type CreateDefaultTemplateOptions } from './createDefaultTemplate.js';

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

const PAGE_GAP = 6;
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

const layoutGroup = (
  group: SisadPdfmeTemplateRecipeGroup,
  pageIndex: number,
  existingSchemas: SchemaForUI[],
  contentWidth: number,
  contentHeight: number,
  paddingTop: number,
  paddingLeft: number,
) => {
  const pages: SchemaForUI[][] = [];
  const placedSchemas: SchemaForUI[] = [];
  let currentPage: SchemaForUI[] = [];
  let cursorX = paddingLeft;
  let cursorY = paddingTop;
  let rowHeight = 0;
  let currentPageIndex = pageIndex;

  const breakRow = () => {
    cursorX = paddingLeft;
    cursorY += rowHeight + ROW_GAP;
    rowHeight = 0;
  };

  const breakPage = () => {
    pages.push(currentPage);
    currentPage = [];
    cursorX = paddingLeft;
    cursorY = paddingTop;
    rowHeight = 0;
    currentPageIndex += 1;
  };

  (group.types || []).forEach((type, typeIndex) => {
    const schema = createDefaultSchema(type, {
      pageNumber: currentPageIndex + 1,
      id: `${type}-${pageIndex}-${typeIndex}`,
      schemaUid: `${type}-${pageIndex}-${typeIndex}`,
      existingSchemas: existingSchemas.concat(placedSchemas),
    });
    const size = resolveNaturalSize(schema, contentWidth, contentHeight);

    if (cursorX + size.width > paddingLeft + contentWidth && currentPage.length > 0) {
      breakRow();
    }
    if (cursorY + size.height > paddingTop + contentHeight && currentPage.length > 0) {
      breakPage();
    }

    const nextSchema = {
      ...schema,
      name: schema.name || group.title || schema.type || `field-${typeIndex + 1}`,
      position: { x: cursorX, y: cursorY },
      width: size.width,
      height: size.height,
      groupTitle: group.title,
    } as SchemaForUI & { groupTitle?: string };

    currentPage.push(nextSchema);
    placedSchemas.push(nextSchema);

    cursorX += size.width + PAGE_GAP;
    rowHeight = Math.max(rowHeight, size.height);
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
};

export function createTemplateFromRecipe(recipe: SisadPdfmeTemplateRecipe = {}): Template {
  const pageSize = recipe.pageSize ?? DEFAULT_PAGE_SIZE;
  const padding = recipe.padding ?? DEFAULT_PADDING;
  const basePdf =
    recipe.basePdf ?? {
      width: pageSize.width,
      height: pageSize.height,
      padding,
    };
  const contentWidth = Number(basePdf.width) - Number(basePdf.padding?.[1] ?? padding[1]) - Number(basePdf.padding?.[3] ?? padding[3]);
  const contentHeight = Number(basePdf.height) - Number(basePdf.padding?.[0] ?? padding[0]) - Number(basePdf.padding?.[2] ?? padding[2]);
  const paddingTop = Number(basePdf.padding?.[0] ?? padding[0]);
  const paddingLeft = Number(basePdf.padding?.[3] ?? padding[3]);

  const pages = (recipe.groups || []).reduce<SchemaForUI[][]>(
    (accumulator, group, index) =>
      accumulator.concat(
        layoutGroup(
          group,
          accumulator.length,
          accumulator.flat(),
          contentWidth,
          contentHeight,
          paddingTop,
          paddingLeft,
        ),
      ),
    [],
  );

  return createDefaultTemplate({
    basePdf,
    schemas: pages.length > 0 ? cloneDeep(pages) : [[]],
  });
}
