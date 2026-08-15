/**
 * Clase pública `Viewer` del runtime UI.
 *
 * Rol arquitectónico:
 * - Renderiza una vista de solo lectura basada en `Preview`.
 * - Comparte la infraestructura de `PreviewUI` con `Form`, pero no expone callbacks de edición.
 * - Mantiene cursor de página y notifica cambios de página al host.
 *
 * Límites del módulo:
 * - No debe modificar inputs.
 * - No debe aplicar validaciones de negocio.
 * - No debe contener lógica de firma, envío o persistencia.
 */

import type { PreviewProps } from '@sisad-pdfme/common';
import { PagedPreviewUI } from '@sisad-pdfme/ui/PagedPreviewUI';

/** Runtime de solo lectura para visualizar template + inputs. */
class Viewer extends PagedPreviewUI {
  constructor(props: PreviewProps) {
    super(props);
  }

  /** Renderiza Preview sin callbacks de edición. */
  protected render() {
    this.renderPreview();
  }
}

export default Viewer;
