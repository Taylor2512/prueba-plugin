/**
 * Constructores de templates de ejemplo.
 *
 * Son funciones puras sobre grupos `{ title, types }` y sobre snapshots
 * declarativos del host: no conocen el catálogo ni el manifest, así que
 * `catalog.js` puede consumirlos sin generar un ciclo de imports.
 */
import { cloneDeep, getInputFromTemplate } from '@sisad-pdfme/common';
import { createDefaultSchema } from '@sisad-pdfme/schemas';
import { createDefaultTemplate, decorateCollaborationUsers, decorateTemplateWithCollaboration } from '@/sisad-pdfme/devtools';
import Data from './config/examplesData.json';

const { layout: LAYOUT, sampleValues: SAMPLE_VALUES } = Data;

const PAGE_SIZE = LAYOUT.pageSize;
const PAGE_PADDING = LAYOUT.pagePadding;
const PAGE_CONTENT_WIDTH = PAGE_SIZE.width - PAGE_PADDING[1] - PAGE_PADDING[3];
const PAGE_CONTENT_HEIGHT = PAGE_SIZE.height - PAGE_PADDING[0] - PAGE_PADDING[2];
const PAGE_LEFT = PAGE_PADDING[3];
const PAGE_TOP = PAGE_PADDING[0];
const COLUMN_GAP = LAYOUT.gaps.column;
const ROW_GAP = LAYOUT.gaps.row;
const FALLBACK_SIZE = LAYOUT.fallbackSize;

const getTextSampleValues = (locale = 'es') => SAMPLE_VALUES[locale] || SAMPLE_VALUES.es;

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
    (pages, group) => pages.concat(layoutPageForTypes(group.types, pages.length, sampleValues)),
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

const normalizeRecipient = (recipient, index) => {
  const id = String(recipient?.id ?? '').trim() || `recipient-${index + 1}`;
  const name = String(recipient?.name ?? recipient?.label ?? '').trim() || id;
  return { ...recipient, id, name };
};

const applyRecipientOwnership = (template, recipients) => {
  if (!template || !Array.isArray(template.schemas) || recipients.length === 0) {
    return template;
  }

  let schemaIndex = 0;
  return {
    ...template,
    schemas: template.schemas.map((pageSchemas = []) =>
      pageSchemas.map((schema) => {
        const recipient = recipients[schemaIndex % recipients.length];
        schemaIndex += 1;

        return {
          ...schema,
          ownerRecipientId: recipient.id,
          ownerRecipientIds: [recipient.id],
          ownerRecipientName: recipient.name,
          recipientId: recipient.id,
          ownerMode: 'single',
        };
      }),
    ),
  };
};

export function buildMultiUserShowcaseTemplate(groups, recipients = Data.recipients.multiUser) {
  const safeRecipients = decorateCollaborationUsers(
    (Array.isArray(recipients) ? recipients : []).map(normalizeRecipient),
  );
  const baseTemplate = buildShowcaseTemplate(groups);
  const ownershipTemplate = applyRecipientOwnership(baseTemplate, safeRecipients);

  return decorateTemplateWithCollaboration(ownershipTemplate, safeRecipients);
}

const SNAPSHOT_INPUT_TO_SCHEMA_TYPE = {
  multiline: 'multiVariableText',
  'datetime-local': 'dateTime',
  boolean: 'checkbox',
};

const getSnapshotFields = (snapshot = {}) =>
  (snapshot.templateFields || []).filter((field) => field.isHidden !== true);

/**
 * Convierte un snapshot declarativo del host (`config.formSnapshot`) en un
 * template de form. Sirve para cualquier origen, no solo DigitalAgreements.
 */
export function buildSnapshotFormTemplate(snapshot = {}) {
  const schemas = getSnapshotFields(snapshot).map((field, index) => {
    const schema = createDefaultSchema(SNAPSHOT_INPUT_TO_SCHEMA_TYPE[field.type] || field.type || 'text', {
      id: field.indexName,
      schemaUid: field.indexName,
      pageNumber: 1,
      position: { x: 28 + (index % 4) * 170, y: 28 + Math.floor(index / 4) * 34 },
      existingSchemas: [],
    });

    return {
      ...schema,
      name: field.indexName,
      content: String(field.value ?? field.defaultValue ?? ''),
      required: Boolean(field.isRequired),
      readOnly: Boolean(field.isDesabled),
      placeholderText: field.indexNameShow || field.indexName,
    };
  });

  return createDefaultTemplate({
    schemas: [schemas],
    basePdf: { width: 595, height: 842, padding: [24, 24, 24, 24] },
  });
}

export function buildSnapshotFormValues(snapshot = {}) {
  const template = buildSnapshotFormTemplate(snapshot);
  const defaults = getInputFromTemplate(template);
  const valueByName = Object.fromEntries(
    (snapshot.templateFields || []).map((field) => [
      field.indexName,
      field.value ?? field.defaultValue ?? '',
    ]),
  );

  return defaults.map((input) => {
    const next = { ...input };
    for (const name of Object.keys(next)) {
      if (Object.prototype.hasOwnProperty.call(valueByName, name)) {
        next[name] = valueByName[name];
      }
    }
    return next;
  });
}
