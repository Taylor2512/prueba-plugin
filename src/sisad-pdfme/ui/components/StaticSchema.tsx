import React from 'react';
import { isBlankPdf, replacePlaceholders, Template } from '@sisad-pdfme/common';
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
  const staticSchemaEntries = basePdf.staticSchema.map((schema, index) => ({
    ...schema,
    id: schema.id || `static-schema-${index}-${schema.name || schema.type || 'field'}`,
  }));
  return (
    <>
      {staticSchemaEntries.map((schema) => (
        <Renderer
          key={schema.id}
          schema={schema}
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
