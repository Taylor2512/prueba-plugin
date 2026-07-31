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

export { SisadPdfmeProvider } from './SisadPdfmeProvider.js';
export { SisadPdfmeDesigner } from './SisadPdfmeDesigner.js';
export { SisadPdfmeForm } from './SisadPdfmeForm.js';
export { SisadPdfmeViewer } from './SisadPdfmeViewer.js';
export {
  SISAD_PDFME_HOST_SURFACE_CLASS,
  mergeHostSurfaceClassName,
} from './hostSurface.js';
export { useSisadPdfmeConfigService } from './useSisadPdfmeConfigService.js';
export { useSisadPdfmeConfig } from './useSisadPdfmeConfig.js';
export { useSisadPdfmeController } from './useSisadPdfmeController.js';
export { useSisadPdfmeFeature } from './useSisadPdfmeFeature.js';
export { useSisadPdfmeAction } from './useSisadPdfmeAction.js';
export { useSisadPdfmeComponent } from './useSisadPdfmeComponent.js';
