/**
 * Entrypoint público del paquete UI de SISAD PDFME.
 *
 * Rol arquitectónico:
 * - Exporta Designer, Form, Viewer y DesignerEngineBuilder.
 * - Carga estilos base requeridos por el runtime.
 * - Expone alias semánticos: PdfEditor, PdfFormView, PdfViewer y PdfEditorEngineBuilder.
 * - Reexporta tipos públicos, designer engine, eventos/extensiones y colaboración.
 *
 * Regla:
 * - Mantener este archivo como fachada del paquete.
 * - No agregar lógica de negocio ni imports profundos innecesarios para el host.
 */

import Designer from './Designer';
import Form from './Form';
import Viewer from './Viewer';
import { DesignerEngineBuilder } from './designerEngine';
import './styles/tokens.css';
import './styles/sisad-pdfme.css';
import './styles/sisad-pdfme.css';
export type { DesignerComponentBridge, DesignerRuntimeApi, SidebarProps } from './types';
export type { DesignerDocumentsBridge } from './types';
export type {
	DesignerRuntimeEvent,
	DesignerRuntimeEventHub,
	DesignerRuntimeEventListener,
	DesignerRuntimeExtensions,
} from './components/Designer/shared/designerExtensions';
export { createDesignerRuntimeEventHub } from './components/Designer/shared/designerExtensions';

export const PdfEditor = Designer;
export const PdfFormView = Form;
export const PdfViewer = Viewer;
export const PdfEditorEngineBuilder = DesignerEngineBuilder;

export { Designer, Viewer, Form, DesignerEngineBuilder };
export * from './designerEngine';
export { applyCollaborationEvent, useCollaborationSync } from './collaboration';
export { defaultSisadPdfmeConfig, createSisadPdfmeConfig } from '../config/index.js';
export {
  SisadPdfmeProvider,
  SisadPdfmeDesigner,
  SisadPdfmeForm,
  SisadPdfmeViewer,
  useSisadPdfmeConfig,
  useSisadPdfmeController,
} from '../react/index.js';
