import { cloneDeep } from '@sisad-pdfme/common';
import { createDefaultSchema } from '@sisad-pdfme/schemas';
import { createDefaultTemplate } from '@/sisad-pdfme/devtools';
import LayoutDefaults from '../config/layoutDefaults.json';
import SampleData from '../config/sampleData.json';

const PAGE_SIZE = LayoutDefaults.pageSize;
const PAGE_PADDING = LayoutDefaults.pagePadding;
const PAGE_CONTENT_WIDTH = PAGE_SIZE.width - PAGE_PADDING[1] - PAGE_PADDING[3];
const PAGE_CONTENT_HEIGHT = PAGE_SIZE.height - PAGE_PADDING[0] - PAGE_PADDING[2];
const PAGE_LEFT = PAGE_PADDING[3];
const PAGE_TOP = PAGE_PADDING[0];
const COLUMN_GAP = LayoutDefaults.gaps.column;
const ROW_GAP = LayoutDefaults.gaps.row;
const FALLBACK_SIZE = LayoutDefaults.fallbackSize;

const getTextSampleValues = (locale = 'es') => SampleData[locale] || SampleData.es;

function decorateDemoSchema(schema, sampleValues = getTextSampleValues()) {
  const next = { ...schema };
  const sample = sampleValues[schema.type];
  if (sample) {
    next.content = sample;
  }
  return next;
}

function resolveNaturalSize(schema) {
  const width = Number(schema.width) > 0 ? Number(schema.width) : FALLBACK_SIZE.width;
  const height = Number(schema.height) > 0 ? Number(schema.height) : FALLBACK_SIZE.height;

  return {
    width: Math.min(width, PAGE_CONTENT_WIDTH),
    height: Math.min(height, PAGE_CONTENT_HEIGHT),
  };
}

function layoutPageForTypes(types, firstPageIndex, sampleValues) {
  const pages = [];
  const placedSchemas = [];
  let currentPage = [];
  const cursor = { x: PAGE_LEFT, y: PAGE_TOP, rowHeight: 0, pageIndex: firstPageIndex };

  const breakRow = () => {
    cursor.x = PAGE_LEFT;
    cursor.y += cursor.rowHeight + ROW_GAP;
    cursor.rowHeight = 0;
  };

  const breakPage = () => {
    pages.push(currentPage);
    currentPage = [];
    cursor.x = PAGE_LEFT;
    cursor.y = PAGE_TOP;
    cursor.rowHeight = 0;
    cursor.pageIndex += 1;
  };

  types.forEach((type, typeIndex) => {
    const created = createDefaultSchema(type, {
      pageNumber: cursor.pageIndex + 1,
      id: `${type}-${typeIndex}`,
      schemaUid: `${type}-${typeIndex}`,
      position: { x: PAGE_LEFT, y: PAGE_TOP },
      existingSchemas: placedSchemas,
    });
    const size = resolveNaturalSize(created);

    if (cursor.x + size.width > PAGE_LEFT + PAGE_CONTENT_WIDTH && currentPage.length > 0) {
      breakRow();
    }
    if (cursor.y + size.height > PAGE_TOP + PAGE_CONTENT_HEIGHT && currentPage.length > 0) {
      breakPage();
    }

    const schema = decorateDemoSchema(created, sampleValues);
    schema.pageNumber = cursor.pageIndex + 1;
    schema.position = { x: cursor.x, y: cursor.y };
    schema.width = size.width;
    schema.height = size.height;

    currentPage.push(schema);
    placedSchemas.push(schema);

    cursor.x += size.width + COLUMN_GAP;
    cursor.rowHeight = Math.max(cursor.rowHeight, size.height);
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages.length > 0 ? pages : [[]];
}

export function buildShowcaseTemplate(groups, options = {}) {
  const { locale = 'es' } = options;
  const sampleValues = getTextSampleValues(locale);

  const schemas = groups.reduce(
    (pages, group) => pages.concat(
      layoutPageForTypes(group.types, pages.length, sampleValues),
    ),
    [],
  );

  return createDefaultTemplate({
    basePdf: {
      width: PAGE_SIZE.width,
      height: PAGE_SIZE.height,
      padding: PAGE_PADDING,
    },
    schemas: cloneDeep(schemas),
  });
}
