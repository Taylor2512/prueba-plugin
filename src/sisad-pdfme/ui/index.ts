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

import Designer from '@sisad-pdfme/ui/Designer';
import Form from '@sisad-pdfme/ui/Form';
import Viewer from '@sisad-pdfme/ui/Viewer';
import { DesignerEngineBuilder } from '@sisad-pdfme/ui/designerEngine';
import './styles/tokens.css';
export type { DesignerComponentBridge, DesignerRuntimeApi, SidebarProps } from '@sisad-pdfme/ui/types';
export type { DesignerDocumentsBridge } from '@sisad-pdfme/ui/types';
export type {
	DesignerRuntimeEvent,
	DesignerRuntimeEventHub,
	DesignerRuntimeEventListener,
	DesignerRuntimeExtensions,
} from '@sisad-pdfme/ui/components/Designer/shared/designerExtensions';
export { createDesignerRuntimeEventHub } from '@sisad-pdfme/ui/components/Designer/shared/designerExtensions';

export const PdfEditor = Designer;
export const PdfFormView = Form;
export const PdfViewer = Viewer;
export const PdfEditorEngineBuilder = DesignerEngineBuilder;

export { Designer, Viewer, Form, DesignerEngineBuilder };
export { RuntimeFormPanel } from '@sisad-pdfme/ui/components/RuntimeFormPanel';
export * from '@sisad-pdfme/ui/designerEngine';
export { applyCollaborationEvent, useCollaborationSync } from '@sisad-pdfme/ui/collaboration';
export { defaultSisadPdfmeConfig, createSisadPdfmeConfig } from '@sisad-pdfme/config';
export {
  SisadPdfmeProvider,
  SisadPdfmeDesigner,
  SisadPdfmeForm,
  SisadPdfmeViewer,
  useSisadPdfmeConfig,
  useSisadPdfmeController,
} from '@sisad-pdfme/react';
