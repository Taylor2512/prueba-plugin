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

import React from 'react';
import { PreviewProps } from '@sisad-pdfme/common';
import { PreviewUI } from './class';
import { DESTROYED_ERR_MSG } from './constants';
import Preview from './components/Preview';
import AppContextProvider from './components/AppContextProvider';

/** Runtime de solo lectura para visualizar template + inputs. */
class Viewer extends PreviewUI {
  private onPageChangeCallback?: (pageInfo: { currentPage: number; totalPages: number }) => void;
  private pageCursor: number = 0;

  constructor(props: PreviewProps) {
    super(props);
  }

  public onPageChange(cb: (pageInfo: { currentPage: number; totalPages: number }) => void) {
    this.onPageChangeCallback = cb;
  }

  public getPageCursor() {
    return this.pageCursor;
  }

  public getTotalPages() {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    return this.template.schemas.length;
  }

  /** Renderiza Preview sin callbacks de edición. */
  protected render() {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.getOrCreateRoot().render(
      <AppContextProvider
        lang={this.getLang()}
        font={this.getFont()}
        plugins={this.getPluginsRegistry()}
        options={this.getOptions()}
      >
        <Preview
          template={this.template}
          size={this.size}
          inputs={this.inputs}
          onPageChange={(pageInfo) => {
            this.pageCursor = pageInfo.currentPage;
            if (this.onPageChangeCallback) {
              this.onPageChangeCallback(pageInfo);
            }
          }}
        />
      </AppContextProvider>,
    );
  }
}

export default Viewer;
