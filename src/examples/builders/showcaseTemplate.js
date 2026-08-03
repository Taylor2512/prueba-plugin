import { cloneDeep } from '@sisad-pdfme/common';
import { createDefaultSchema } from '@sisad-pdfme/schemas';
import { createDefaultTemplate } from '@/sisad-pdfme/devtools';

const PAGE_SIZE = { width: 210, height: 297 };
const PAGE_PADDING = [15, 15, 15, 15];
const PAGE_CONTENT_WIDTH = PAGE_SIZE.width - PAGE_PADDING[1] - PAGE_PADDING[3];
const PAGE_CONTENT_HEIGHT = PAGE_SIZE.height - PAGE_PADDING[0] - PAGE_PADDING[2];
const PAGE_LEFT = PAGE_PADDING[3];
const PAGE_TOP = PAGE_PADDING[0];
const COLUMN_GAP = 6;
const ROW_GAP = 6;
const FALLBACK_SIZE = { width: 45, height: 7 };

const TEXT_SAMPLE_VALUES = {
  text: 'Texto de ejemplo',
  multiVariableText: 'Linea 1\nLinea 2\nLinea 3',
  fullName: 'Ada Lovelace',
  emailAddress: 'ada@acme.example',
  company: 'Acme Labs',
  title: 'Analista senior',
  number: '42',
  date: '2026-07-29',
  time: '14:30',
  dateTime: '2026-07-29 14:30',
};

function decorateDemoSchema(schema) {
  const next = { ...schema };
  const sample = TEXT_SAMPLE_VALUES[schema.type];
  if (sample) {
    next.content = sample;
  }
  if (schema.type === 'checkbox') {
    next.content = 'true';
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

function layoutPageForTypes(types, firstPageIndex) {
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

    const schema = decorateDemoSchema(created);
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

export function buildShowcaseTemplate(groups) {
  const schemas = groups.reduce(
    (pages, group) => pages.concat(layoutPageForTypes(group.types, pages.length)),
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
