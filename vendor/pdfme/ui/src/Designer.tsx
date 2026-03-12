import React from 'react';
import {
  cloneDeep,
  Template,
  DesignerProps,
  SchemaForUI,
  checkDesignerProps,
  checkTemplate,
  PDFME_VERSION,
} from '@pdfme/common';
import { BaseUIClass } from './class.js';
import { DESTROYED_ERR_MSG } from './constants.js';
import DesignerComponent from './components/Designer/index.js';
import AppContextProvider from './components/AppContextProvider.js';
import type { DesignerRuntimeApi } from './types.js';
import type { SchemaDesignerConfig } from './designerEngine.js';

class Designer extends BaseUIClass {
  private onSaveTemplateCallback?: (template: Template) => void;
  private onChangeTemplateCallback?: (template: Template) => void;
  private onPageChangeCallback?: (pageInfo: { currentPage: number; totalPages: number }) => void;
  private pageCursor: number = 0;
  private runtimeApi: DesignerRuntimeApi | null = null;

  constructor(props: DesignerProps) {
    super(props);
    checkDesignerProps(props);
  }

  public saveTemplate() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    if (this.onSaveTemplateCallback) {
      this.onSaveTemplateCallback(this.template);
    }
  }

  public updateTemplate(template: Template) {
    checkTemplate(template);
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.template = cloneDeep(template);
    if (this.onChangeTemplateCallback) {
      this.onChangeTemplateCallback(template);
    }
    this.render();
  }

  public onSaveTemplate(cb: (template: Template) => void) {
    this.onSaveTemplateCallback = cb;
  }

  public onChangeTemplate(cb: (template: Template) => void) {
    this.onChangeTemplateCallback = cb;
  }

  public onPageChange(cb: (pageInfo: { currentPage: number; totalPages: number }) => void) {
    this.onPageChangeCallback = cb;
  }

  public undo() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.undo();
  }

  public redo() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.redo();
  }

  public setZoom(zoom: number) {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.setZoom(zoom);
  }

  public getZoom() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    return this.runtimeApi?.getZoom() ?? 1;
  }

  public fitToWidth(page?: number) {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.fitToWidth(page);
  }

  public fitToPage(page?: number) {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.fitToPage(page);
  }

  public fitToDevice(page?: number) {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.fitToDevice(page);
  }

  public setViewportMode(mode: 'manual' | 'fit-width' | 'fit-page' | 'actual-size' | 'auto') {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.setViewportMode(mode);
  }

  public getViewportMode() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    return this.runtimeApi?.getViewportMode() ?? 'manual';
  }

  public getCanvasMetrics() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    return (
      this.runtimeApi?.getCanvasMetrics() ?? {
        viewportWidth: 0,
        viewportHeight: 0,
        usableWidth: 0,
        usableHeight: 0,
        pageWidth: 0,
        pageHeight: 0,
        scale: 0,
        zoom: 1,
        currentPage: 1,
        totalPages: this.template.schemas.length,
        sidebarOpen: true,
      }
    );
  }

  public setPage(page: number) {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.setPage(page);
  }

  public nextPage() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.nextPage();
  }

  public prevPage() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.prevPage();
  }

  public centerPage(page?: number) {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.centerPage(page);
  }

  public setSidebarOpen(open: boolean) {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.setSidebarOpen(open);
  }

  public toggleSidebar() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.toggleSidebar();
  }

  public focusField(fieldName: string) {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.focusField(fieldName);
  }

  public highlightField(fieldName: string) {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.highlightField(fieldName);
  }

  public addSchema(schema: SchemaForUI) {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.addSchema(schema);
  }

  public addSchemaByType(schemaType: string) {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.addSchemaByType(schemaType);
  }

  public getSchemaConfig(
    schemaIdOrName: string,
    matcher: 'id' | 'name' | 'identity' | 'prefill-source' = 'id',
  ): SchemaDesignerConfig | null {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    return this.runtimeApi?.getSchemaConfig(schemaIdOrName, matcher) ?? null;
  }

  public setSchemaConfig(
    schemaIdOrName: string,
    patch: Partial<SchemaDesignerConfig>,
    matcher: 'id' | 'name' | 'identity' | 'prefill-source' = 'id',
  ) {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    return this.runtimeApi?.setSchemaConfig(schemaIdOrName, patch, matcher) ?? false;
  }

  public applyExternalPrefill(
    payload: Record<string, unknown>,
    matcher: 'name' | 'id' | 'identity' | 'prefill-source' = 'name',
  ) {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    return this.runtimeApi?.applyExternalPrefill(payload, matcher) ?? 0;
  }

  public getPageCursor() {
    return this.pageCursor;
  }

  public getTotalPages() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    return this.template.schemas.length;
  }

  protected render() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    if (!this.domContainer.isConnected) return;

    let root;
    try {
      root = this.getOrCreateRoot();
    } catch {
      return;
    }

    root.render(
      <AppContextProvider
        lang={this.getLang()}
        font={this.getFont()}
        plugins={this.getPluginsRegistry()}
        options={this.getOptions()}
      >
        <DesignerComponent
          template={this.template}
          onApiReady={(api) => {
            this.runtimeApi = api;
          }}
          onSaveTemplate={(template) => {
            this.template = template;
            this.template.pdfmeVersion = PDFME_VERSION;
            if (this.onSaveTemplateCallback) {
              this.onSaveTemplateCallback(template);
            }
          }}
          onChangeTemplate={(template) => {
            this.template = template;
            this.template.pdfmeVersion = PDFME_VERSION;
            if (this.onChangeTemplateCallback) {
              this.onChangeTemplateCallback(template);
            }
          }}
          onPageCursorChange={(newPageCursor: number, totalPages: number) => {
            this.pageCursor = newPageCursor;
            if (this.onPageChangeCallback) {
              this.onPageChangeCallback({
                currentPage: newPageCursor,
                totalPages: totalPages,
              });
            }
          }}
          size={this.size}
        />
      </AppContextProvider>,
    );
  }
}

export default Designer;
