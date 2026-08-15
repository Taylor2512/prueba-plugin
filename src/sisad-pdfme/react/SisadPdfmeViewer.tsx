/** Public read-only Viewer wrapper with recipient-aware filtering. */
import {
  SisadPdfmePreviewRuntime,
  type SisadPdfmePreviewRuntimeProps,
} from '@sisad-pdfme/react/SisadPdfmePreviewRuntime';

type Props = Omit<
  SisadPdfmePreviewRuntimeProps,
  'mode' | 'onInputChange'
>;

export const SisadPdfmeViewer = (props: Props) => (
  <SisadPdfmePreviewRuntime mode="viewer" {...props} />
);
