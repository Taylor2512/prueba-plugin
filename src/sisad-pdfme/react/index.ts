/**
 * Entrada pública de los wrappers React de sisad-pdfme.
 *
 * Autocontenida visualmente (TASK-LAB-026): importa el CSS base del editor
 * (tokens + layout del diseñador) para que cualquier host que consuma
 * `SisadPdfmeDesigner/Form/Viewer` reciba el layout de 3 paneles sin depender
 * del side-effect de `@sisad-pdfme/ui`.
 */
import '../ui/styles/tokens.css';
import '../ui/styles/sisad-pdfme.css';

export { SisadPdfmeProvider } from '@sisad-pdfme/react/SisadPdfmeProvider';
export { SisadPdfmeDesigner } from '@sisad-pdfme/react/SisadPdfmeDesigner';
export { SisadPdfmeForm } from '@sisad-pdfme/react/SisadPdfmeForm';
export { SisadPdfmeViewer } from '@sisad-pdfme/react/SisadPdfmeViewer';
export {
  SISAD_PDFME_HOST_SURFACE_CLASS,
  mergeHostSurfaceClassName,
} from '@sisad-pdfme/react/hostSurface';
export { useSisadPdfmeConfigService } from '@sisad-pdfme/react/useSisadPdfmeConfigService';
export { useSisadPdfmeConfig } from '@sisad-pdfme/react/useSisadPdfmeConfig';
export { useSisadPdfmeController } from '@sisad-pdfme/react/useSisadPdfmeController';
export { useSisadPdfmeFeature } from '@sisad-pdfme/react/useSisadPdfmeFeature';
export { useSisadPdfmeAction } from '@sisad-pdfme/react/useSisadPdfmeAction';
export { useSisadPdfmeComponent } from '@sisad-pdfme/react/useSisadPdfmeComponent';
