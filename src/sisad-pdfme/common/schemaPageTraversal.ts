export type SchemaPageLocation<T> = {
  schema: T;
  page: T[];
  pageIndex: number;
  schemaIndex: number;
};

export const forEachSchemaInPages = <T>(
  pages: T[][],
  visitor: (location: SchemaPageLocation<T>) => void,
): void => {
  pages.forEach((page, pageIndex) => {
    (page || []).forEach((schema, schemaIndex) => {
      visitor({ schema, page, pageIndex, schemaIndex });
    });
  });
};

export const findSchemaInPages = <T>(
  pages: T[][],
  predicate: (schema: T, location: Omit<SchemaPageLocation<T>, 'schema'>) => boolean,
): T | null => {
  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const page = pages[pageIndex] || [];
    for (let schemaIndex = 0; schemaIndex < page.length; schemaIndex += 1) {
      const schema = page[schemaIndex];
      if (predicate(schema, { page, pageIndex, schemaIndex })) return schema;
    }
  }
  return null;
};
