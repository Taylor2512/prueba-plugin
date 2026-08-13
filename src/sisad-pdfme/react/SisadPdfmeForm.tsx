/** Public Form wrapper with recipient-aware filtering. */
import {
  SisadPdfmePreviewRuntime,
  type SisadPdfmePreviewRuntimeProps,
} from './SisadPdfmePreviewRuntime.js';

type Props = Omit<SisadPdfmePreviewRuntimeProps, 'mode' | 'inputs'> & {
  values?: unknown[];
};

export const SisadPdfmeForm = ({ values, ...props }: Props) => (
  <SisadPdfmePreviewRuntime mode="form" inputs={values} {...props} />
);
