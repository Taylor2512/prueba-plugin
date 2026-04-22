import React from 'react';
import { isBlankPdf, replacePlaceholders, Template, type SchemaForUI } from '@sisad-pdfme/common';
import Renderer from './Renderer.js';

const StaticSchema = (props: {
  template: Template;
  input: Record<string, string>;
  scale: number;
  totalPages: number;
  currentPage: number;
}) => {
  const {
    template: { schemas, basePdf },
    input,
    scale,
    totalPages,
    currentPage,
  } = props;
  if (!isBlankPdf(basePdf) || !basePdf.staticSchema) return null;
  const staticSchemaEntries = basePdf.staticSchema.map((schema, index) => {
    const nextSchema = schema as SchemaForUI & { id?: string };
    return {
      ...nextSchema,
      id: nextSchema.id || `static-schema-${index}-${nextSchema.name || nextSchema.type || 'field'}`,
    };
  }) as SchemaForUI[];
  return (
    <>
      {staticSchemaEntries.map((schema) => (
        <Renderer
          key={String(schema.id)}
          schema={schema as any}
          basePdf={basePdf}
          value={
            schema.readOnly
              ? replacePlaceholders({
                  content: schema.content || '',
                  variables: { ...input, totalPages, currentPage },
                  schemas,
                })
              : schema.content || ''
          }
          onChangeHoveringSchemaId={() => {
            void 0;
          }}
          mode={'viewer'}
          outline={`none`}
          scale={scale}
          selectable={false}
        />
      ))}
    </>
  );
};

export default React.memo(StaticSchema);
