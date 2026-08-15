import React from 'react';
import type { PreviewProps } from '@sisad-pdfme/common';
import { PreviewUI } from '@sisad-pdfme/ui/class';
import { DESTROYED_ERR_MSG } from '@sisad-pdfme/ui/constants';
import AppContextProvider from '@sisad-pdfme/ui/components/AppContextProvider';
import Preview from '@sisad-pdfme/ui/components/Preview';

type PageInfo = { currentPage: number; totalPages: number };
type RuntimePreviewProps = Omit<
  React.ComponentProps<typeof Preview>,
  'template' | 'size' | 'inputs' | 'onPageChange'
>;

/** Shared page cursor and render shell for Form and Viewer runtimes. */
export abstract class PagedPreviewUI extends PreviewUI {
  private onPageChangeCallback?: (pageInfo: PageInfo) => void;
  protected pageCursor = 0;

  constructor(props: PreviewProps) {
    super(props);
  }

  public onPageChange(callback: (pageInfo: PageInfo) => void) {
    this.onPageChangeCallback = callback;
  }

  public getPageCursor() {
    return this.pageCursor;
  }

  public getTotalPages() {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    return this.template.schemas.length;
  }

  protected renderPreview(props: RuntimePreviewProps = {}) {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    this.getOrCreateRoot().render(
      <AppContextProvider
        lang={this.getLang()}
        font={this.getFont()}
        plugins={this.getPluginsRegistry()}
        options={this.getOptions()}
      >
        <Preview
          {...props}
          template={this.template}
          size={this.size}
          inputs={this.inputs}
          onPageChange={(pageInfo) => {
            this.pageCursor = pageInfo.currentPage;
            this.onPageChangeCallback?.(pageInfo);
          }}
        />
      </AppContextProvider>,
    );
  }
}
