import React from 'react';
import {
  cloneDeep,
  Template,
  DesignerProps,
  SchemaForUI,
  BLANK_A4_PDF,
  px2mm,
  checkDesignerProps,
  checkTemplate,
  PDFME_VERSION,
} from '@sisad-pdfme/common';
import { BaseUIClass } from './class';
import { DESTROYED_ERR_MSG } from './constants';
import DesignerComponent from './components/Designer/index';
import AppContextProvider from './components/AppContextProvider';
import { DesignerRuntimeApi } from './types';
import { SchemaDesignerConfig } from './designerEngine';

type SchemaConfigMatcher = 'id' | 'name' | 'identity' | 'prefill-source';
type DesignerTemplateChangeContext = {
  documentId?: string | null;
  fileId?: string | null;
  pageCount?: number;
  source?: string;
  updatedAt?: number;
};

const ensureDesignerTemplate = (template: Template): Template => {
  const basePdf = (template as Partial<Template>)?.basePdf;
  const hasBasePdf =
    (typeof basePdf === 'string' && basePdf.trim().length > 0) ||
    (typeof basePdf === 'object' && basePdf !== null);

  const schemas = Array.isArray(template.schemas) && template.schemas.length > 0 ? template.schemas : [[]];
  const round2 = (value: number) => Math.round(value * 100) / 100;
  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
  const toMmIfLikelyPx = (value: number, referenceMm: number) => {
    if (!Number.isFinite(value)) return value;
    if (value > referenceMm * 1.25) {
      const converted = px2mm(value);
      if (Number.isFinite(converted) && converted > 0) return converted;
    }
    return value;
  };

  if (hasBasePdf) {
    return { ...template, schemas };
  }

  // If the consumer starts Designer without a real base PDF, normalize schema geometry
  // so values that were accidentally stored in px do not render as oversized mm values.
  const normalizedSchemas = schemas.map((page) =>
    (Array.isArray(page) ? page : []).map((schema) => {
      const fallbackWidth = 45;
      const fallbackHeight = 12;
      const pageWidth = BLANK_A4_PDF.width;
      const pageHeight = BLANK_A4_PDF.height;

      const widthRaw = Number((schema as SchemaForUI).width);
      const heightRaw = Number((schema as SchemaForUI).height);
      const xRaw = Number((schema as SchemaForUI).position?.x ?? 0);
      const yRaw = Number((schema as SchemaForUI).position?.y ?? 0);

      const widthMm = toMmIfLikelyPx(widthRaw, pageWidth);
      const heightMm = toMmIfLikelyPx(heightRaw, pageHeight);

      const safeWidth = clamp(
        Number.isFinite(widthMm) && widthMm > 0 ? widthMm : fallbackWidth,
        1,
        pageWidth - 1,
      );
      const safeHeight = clamp(
        Number.isFinite(heightMm) && heightMm > 0 ? heightMm : fallbackHeight,
        0.5,
        pageHeight - 1,
      );

      const xMm = toMmIfLikelyPx(xRaw, pageWidth);
      const yMm = toMmIfLikelyPx(yRaw, pageHeight);

      const maxX = Math.max(0, pageWidth - safeWidth);
      const maxY = Math.max(0, pageHeight - safeHeight);

      return {
        ...(schema as SchemaForUI),
        width: round2(safeWidth),
        height: round2(safeHeight),
        position: {
          x: round2(clamp(Number.isFinite(xMm) ? xMm : 0, 0, maxX)),
          y: round2(clamp(Number.isFinite(yMm) ? yMm : 0, 0, maxY)),
        },
      } as SchemaForUI;
    }),
  );

  return {
    ...template,
    basePdf: cloneDeep(BLANK_A4_PDF),
    schemas: normalizedSchemas,
  };
};

class Designer extends BaseUIClass {
  private onSaveTemplateCallback?: (template: Template) => void;
  private onChangeTemplateCallback?: (template: Template, context?: DesignerTemplateChangeContext) => void;
  private onPageChangeCallback?: (pageInfo: { currentPage: number; totalPages: number }) => void;
  private pageCursor: number = 0;
  private runtimeApi: DesignerRuntimeApi | null = null;

  constructor(props: DesignerProps) {
    const safeProps = {
      ...props,
      template: ensureDesignerTemplate(props.template),
    } as DesignerProps;
    super(safeProps);
    checkDesignerProps(safeProps);
  }

  public saveTemplate() {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    if (this.onSaveTemplateCallback) {
      this.onSaveTemplateCallback(this.template);
    }
  }

  public updateTemplate(template: Template) {
    const safeTemplate = ensureDesignerTemplate(template);
    checkTemplate(safeTemplate);
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.template = cloneDeep(safeTemplate);
    this.render();
  }

  public onSaveTemplate(cb: (template: Template) => void) {
    this.onSaveTemplateCallback = cb;
  }

  public onChangeTemplate(cb: (template: Template, context?: DesignerTemplateChangeContext) => void) {
    this.onChangeTemplateCallback = cb;
  }

  public onPageChange(cb: (pageInfo: { currentPage: number; totalPages: number }) => void) {
    this.onPageChangeCallback = cb;
  }

  public undo() {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.undo();
  }

  public redo() {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.redo();
  }

  public setZoom(zoom: number) {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.setZoom(zoom);
  }

  public getZoom() {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    return this.runtimeApi?.getZoom() ?? 1;
  }

  public fitToWidth(page?: number) {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.fitToWidth(page);
  }

  public fitToPage(page?: number) {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.fitToPage(page);
  }

  public fitToDevice(page?: number) {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.fitToDevice(page);
  }

  public setViewportMode(mode: 'manual' | 'fit-width' | 'fit-page' | 'actual-size' | 'auto') {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.setViewportMode(mode);
  }

  public getViewportMode() {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    return this.runtimeApi?.getViewportMode() ?? 'manual';
  }

  public getCanvasMetrics() {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
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
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.setPage(page);
  }

  public nextPage() {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.nextPage();
  }

  public prevPage() {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.prevPage();
  }

  public centerPage(page?: number) {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.centerPage(page);
  }

  public setSidebarOpen(open: boolean) {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.setSidebarOpen(open);
  }

  public toggleSidebar() {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.toggleSidebar();
  }

  public focusField(fieldName: string) {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.focusField(fieldName);
  }

  public highlightField(fieldName: string) {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.highlightField(fieldName);
  }

  public addSchema(schema: SchemaForUI) {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.addSchema(schema);
  }

  public addSchemaByType(schemaType: string) {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.runtimeApi?.addSchemaByType(schemaType);
  }

  public getSchemaConfig(
    schemaIdOrName: string,
    matcher: SchemaConfigMatcher = 'id',
  ): SchemaDesignerConfig | null {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    return this.runtimeApi?.getSchemaConfig(schemaIdOrName, matcher) ?? null;
  }

  public setSchemaConfig(
    schemaIdOrName: string,
    patch: Partial<SchemaDesignerConfig>,
    matcher: SchemaConfigMatcher = 'id',
  ) {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    return this.runtimeApi?.setSchemaConfig(schemaIdOrName, patch, matcher) ?? false;
  }

  public applyExternalPrefill(
    payload: Record<string, unknown>,
    matcher: SchemaConfigMatcher = 'name',
  ) {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    return this.runtimeApi?.applyExternalPrefill(payload, matcher) ?? 0;
  }

  public getPageCursor() {
    return this.pageCursor;
  }

  public getTotalPages() {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    return this.template.schemas.length;
  }

  protected render() {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
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
          template={ensureDesignerTemplate(this.template)}
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
          onChangeTemplate={(template, context) => {
            this.template = template;
            this.template.pdfmeVersion = PDFME_VERSION;
            if (this.onChangeTemplateCallback) {
              this.onChangeTemplateCallback(template, context);
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
