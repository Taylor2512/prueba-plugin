import { useSisadPdfmeInstance } from './useSisadPdfmeInstance.js';
import type { SisadPdfmeInstanceInput } from './defineSisadPdfmeInstance.js';

export type SisadPdfmeInstanceProps = SisadPdfmeInstanceInput;

export const SisadPdfmeInstance = (props: SisadPdfmeInstanceProps) => {
  const { Component, props: resolvedProps } = useSisadPdfmeInstance(props);
  return <Component {...resolvedProps} />;
};
