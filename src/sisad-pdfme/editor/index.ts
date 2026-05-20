import Designer from '../ui/Designer.js';
import Form from '../ui/Form.js';
import Viewer from '../ui/Viewer.js';
import { DesignerEngineBuilder } from '../ui/designerEngine.js';
import '../ui/styles/tokens.css';
import '../ui/styles/sisad-pdfme-runtime.css';
import '../ui/styles/canvas-interactions.css';

export const PdfEditor = Designer;
export const PdfFormView = Form;
export const PdfViewer = Viewer;
export const PdfEditorEngineBuilder = DesignerEngineBuilder;

export { Designer, Form, Viewer, DesignerEngineBuilder };
export * from '../ui/designerEngine.js';
export { applyCollaborationEvent, useCollaborationSync } from '../ui/collaboration.js';
export type { DesignerComponentBridge, DesignerRuntimeApi, SidebarProps, DesignerDocumentsBridge } from '../ui/types.js';
export type {
	DesignerRuntimeEvent,
	DesignerRuntimeEventHub,
	DesignerRuntimeEventListener,
	DesignerRuntimeExtensions,
} from '../ui/components/Designer/shared/designerExtensions.js';
export { createDesignerRuntimeEventHub } from '../ui/components/Designer/shared/designerExtensions.js';
