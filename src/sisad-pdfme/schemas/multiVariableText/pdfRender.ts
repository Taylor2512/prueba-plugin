import { PDFRenderProps } from '@sisad-pdfme/common';
import { MultiVariableTextSchema } from '@sisad-pdfme/schemas/multiVariableText/types';
import { renderTextPdf as parentPdfRender } from '@sisad-pdfme/schemas/text/pdfRender';
import { substituteVariables, validateVariables } from '@sisad-pdfme/schemas/multiVariableText/helper';

export const renderMultiVariableTextPdf = async (arg: PDFRenderProps<MultiVariableTextSchema>) => {
  const { value, schema, ...rest } = arg;

  if (!validateVariables(value, schema)) {
    // Don't render if a required variable is missing
    return;
  }

  const renderArgs = {
    value: substituteVariables(schema.text || '', value),
    schema,
    ...rest,
  };

  await parentPdfRender(renderArgs);
};
