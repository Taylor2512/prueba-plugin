/**
 * Entrypoint público del runtime UI de SISAD PDFME.
 *
 * Este archivo centraliza las exportaciones principales que consume un host externo
 * cuando necesita integrar el diseñador, formulario o visor de PDFME.
 *
 * Responsabilidades:
 *
 * - exponer el Designer como editor visual de PDFs;
 * - exponer Form como runtime interactivo de llenado;
 * - exponer Viewer como runtime de solo lectura;
 * - exponer DesignerEngineBuilder para construir/configurar el engine;
 * - cargar estilos globales necesarios del runtime;
 * - exponer APIs de colaboración;
 * - exponer tipos públicos para bridges, sidebars, documentos y extensiones.
 *
 * Este archivo NO debe contener lógica de negocio, lógica de canvas,
 * lógica de schemas ni reglas específicas de SISAD.
 */

import Designer from '@sisad-pdfme/ui/Designer';
import Form from '@sisad-pdfme/ui/Form';
import Viewer from '@sisad-pdfme/ui/Viewer';
import { DesignerEngineBuilder } from '@sisad-pdfme/ui/designerEngine';

/**
 * Estilos base del runtime.
 *
 * Importante:
 * Estos CSS se cargan desde el entrypoint para asegurar que cualquier host
 * que consuma este paquete tenga los tokens, layout base e interacciones
 * mínimas necesarias para renderizar correctamente Designer/Form/Viewer.
 *
 * tokens.css:
 * Define variables/tokens visuales compartidos.
 *
 * sisad-pdfme.css:
 * Define estilos estructurales del runtime y los estilos de selección,
 * interacción visual, overlays y estados del canvas.
 *
 * Regla:
 * No agregar aquí CSS específico del host, StepTwo, DigitalAgreements,
 * Uanataca, workflows o pantallas externas.
 */
import '../ui/styles/tokens.css';
import '../ui/styles/sisad-pdfme.css';

/**
 * Alias público del diseñador PDF.
 *
 * Se mantiene como alias semántico para consumidores que prefieren
 * nombres orientados al producto:
 *
 * PdfEditor = Designer
 */
export const PdfEditor = Designer;

/**
 * Alias público del runtime de formulario.
 *
 * PdfFormView representa el modo donde el usuario final llena campos
 * interactivos del documento.
 */
export const PdfFormView = Form;

/**
 * Alias público del visor PDF.
 *
 * PdfViewer representa el modo de solo lectura, útil para revisión,
 * preview o visualización sin edición.
 */
export const PdfViewer = Viewer;

/**
 * Alias público del builder del engine del diseñador.
 *
 * Permite a hosts avanzados construir/configurar el DesignerEngine
 * sin acoplarse directamente al archivo interno.
 */
export const PdfEditorEngineBuilder = DesignerEngineBuilder;

/**
 * Exportaciones públicas con nombres originales.
 *
 * Estas exportaciones permiten consumir directamente:
 *
 * import { Designer, Form, Viewer, DesignerEngineBuilder } from '...';
 *
 * mientras los alias anteriores permiten una API más semántica:
 *
 * import { PdfEditor, PdfFormView, PdfViewer } from '...';
 */
export { Designer, Form, Viewer, DesignerEngineBuilder };

/**
 * Reexporta toda la API pública del designer engine.
 *
 * Esto expone contratos, builders, factories o helpers definidos en:
 *
 * ../ui/designerEngine.js
 *
 * Recomendación:
 * Mantener este archivo como fachada pública.
 * Evitar que los hosts importen rutas internas profundas del engine.
 */
export * from '@sisad-pdfme/ui/designerEngine';

/**
 * API pública de colaboración.
 *
 * applyCollaborationEvent:
 * Aplica eventos colaborativos al estado/template/runtime.
 *
 * useCollaborationSync:
 * Hook para sincronizar colaboración desde componentes React.
 *
 * Regla:
 * Esta exportación debe permanecer genérica. No debe conocer usuarios,
 * permisos, workflows, endpoints ni reglas específicas de SISAD.
 */
export {
  applyCollaborationEvent,
  useCollaborationSync,
} from '@sisad-pdfme/ui/collaboration';

/**
 * Tipos públicos para integrar el runtime con hosts externos.
 *
 * DesignerComponentBridge:
 * Contrato para conectar componentes externos con el Designer.
 *
 * DesignerRuntimeApi:
 * API pública disponible para operar el runtime desde fuera.
 *
 * SidebarProps:
 * Props compartidas para sidebars o paneles del diseñador.
 *
 * DesignerDocumentsBridge:
 * Contrato para integración de documentos/multidocumento.
 */
export type {
  DesignerComponentBridge,
  DesignerRuntimeApi,
  SidebarProps,
  DesignerDocumentsBridge,
} from '@sisad-pdfme/ui/types';

/**
 * Tipos públicos del sistema de eventos/extensiones del Designer.
 *
 * DesignerRuntimeEvent:
 * Evento emitido por el runtime.
 *
 * DesignerRuntimeEventHub:
 * Hub encargado de publicar/suscribir eventos.
 *
 * DesignerRuntimeEventListener:
 * Listener de eventos del runtime.
 *
 * DesignerRuntimeExtensions:
 * Extensiones/plugins que pueden conectarse al runtime.
 */
export type {
  DesignerRuntimeEvent,
  DesignerRuntimeEventHub,
  DesignerRuntimeEventListener,
  DesignerRuntimeExtensions,
} from '@sisad-pdfme/ui/components/Designer/shared/designerExtensions';

/**
 * Factory pública para crear un hub de eventos del Designer.
 *
 * Permite a integraciones externas suscribirse o emitir eventos
 * sin acceder directamente a implementaciones internas.
 */
export {
  createDesignerRuntimeEventHub,
} from '@sisad-pdfme/ui/components/Designer/shared/designerExtensions';