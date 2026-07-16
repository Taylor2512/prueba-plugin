/**
 * RuntimeFormPanel
 *
 * Exportación pública del componente Preview runtime.
 * Este componente es el bloque fundamental para externalForms y otros hosts
 * que necesiten renderizar el llenado de formulario o la vista previa
 * de forma declarativa sin usar la clase imperativa Form/Viewer.
 */
import Preview from './Preview.js';

/**
 * Panel de ejecución de formulario/visor runtime.
 *
 * Encapsula la orquestación de páginas, backgrounds, zoom e interacción de schemas.
 * No incluye herramientas de diseño estructural.
 */
export const RuntimeFormPanel = Preview;

export default RuntimeFormPanel;
