import { useSisadPdfmeInstance } from '@sisad-pdfme/integration/useSisadPdfmeInstance';
import type { SisadPdfmeInstanceInput } from '@sisad-pdfme/integration/defineSisadPdfmeInstance';

export type SisadPdfmeInstanceProps = SisadPdfmeInstanceInput;

export const SisadPdfmeInstance = (props: SisadPdfmeInstanceProps) => {
  const { Component, props: resolvedProps } = useSisadPdfmeInstance(props);
  return <Component {...resolvedProps} />;
};
