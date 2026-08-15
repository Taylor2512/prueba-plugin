/**
 * Renderizador de staticSchema para PDFs en blanco.
 *
 * Permite pintar elementos fijos definidos en basePdf.staticSchema, resolviendo
 * placeholders cuando el schema es readOnly y evitando que sean seleccionables.
 */
import React from 'react';
import { isBlankPdf, replacePlaceholders, Template, type SchemaForUI } from '@sisad-pdfme/common';
import Renderer from '@sisad-pdfme/ui/components/Renderer';

/**
 * Renderiza schemas estáticos declarados en basePdf.staticSchema.
 *
 * Estos elementos son decorativos/runtime y no participan en selección ni edición
 * del diseñador.
 */
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
    const fallbackId = `static-schema-${index}-${nextSchema.name || nextSchema.type || 'field'}`;

    return {
      ...nextSchema,
      id: nextSchema.id || fallbackId,
    } satisfies SchemaForUI;
  });

  return (
    <>
      {staticSchemaEntries.map((schema) => (
        <Renderer
          key={String(schema.id)}
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
          mode="viewer"
          pageIndex={currentPage - 1}
          pageNumber={currentPage}
          outline="none"
          scale={scale}
          selectable={false}
        />
      ))}
    </>
  );
};

export default React.memo(StaticSchema);
