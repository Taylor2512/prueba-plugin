import type { SchemaForUI, SchemaPageArray } from './types.js';

const normalizeRecipientIds = (value?: string[] | string | null): string[] => {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .map((entry) => String(entry || '').trim())
          .filter(Boolean),
      ),
    );
  }

  if (typeof value === 'string') {
    return Array.from(
      new Set(
        value
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
      ),
    );
  }

  return [];
};

export type SchemaAssignments = Record<string, Record<string, Record<string, string[]>>>;

export const buildSchemaAssignments = (schemas: SchemaPageArray): SchemaAssignments => {
  const assignments: SchemaAssignments = {};

  schemas.forEach((page, pageIndex) => {
    page.forEach((schema) => {
      const rawSchema = schema as SchemaForUI & {
        schemaUid?: string;
        fileId?: string;
        fileTemplateId?: string;
        ownerRecipientId?: string;
        ownerRecipientIds?: string[] | string;
      };
      const schemaUid = String(rawSchema.schemaUid || rawSchema.id || rawSchema.name || '').trim();
      if (!schemaUid) return;

      const fileId = String(rawSchema.fileId || rawSchema.fileTemplateId || 'default').trim() || 'default';
      const pageKey = String(pageIndex);
      const recipientIds = normalizeRecipientIds(
        rawSchema.ownerRecipientIds || rawSchema.ownerRecipientId || '__unassigned__',
      );

      recipientIds.forEach((recipientId) => {
        if (!assignments[recipientId]) assignments[recipientId] = {};
        if (!assignments[recipientId][fileId]) assignments[recipientId][fileId] = {};
        if (!assignments[recipientId][fileId][pageKey]) assignments[recipientId][fileId][pageKey] = [];
        assignments[recipientId][fileId][pageKey].push(schemaUid);
      });
    });
  });

  Object.values(assignments).forEach((files) => {
    Object.values(files).forEach((pages) => {
      Object.keys(pages).forEach((pageKey) => {
        pages[pageKey] = Array.from(new Set(pages[pageKey]));
      });
    });
  });

  return assignments;
};
