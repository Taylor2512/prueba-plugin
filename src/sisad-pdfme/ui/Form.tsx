import React from 'react';
import { PreviewProps } from '@sisad-pdfme/common';
import { PreviewUI } from './class';
import { DESTROYED_ERR_MSG } from './constants';
import AppContextProvider from './components/AppContextProvider';
import Preview from './components/Preview';
import { FormJsonEnvelope } from './designerEngine';

class Form extends PreviewUI {
  private onChangeInputCallback?: (arg: { index: number; value: string; name: string }) => void;
  private onChangeInputsCallback?: (arg: { index: number; values: Record<string, string> }) => void;
  private onChangeFormJsonCallback?: (json: FormJsonEnvelope | null) => void;
  private onPageChangeCallback?: (pageInfo: { currentPage: number; totalPages: number }) => void;
  private pageCursor: number = 0;
  private lastFormJson: FormJsonEnvelope | null = null;

  constructor(props: PreviewProps) {
    super(props);
  }

  public onChangeInput(cb: (arg: { index: number; value: string; name: string }) => void) {
    this.onChangeInputCallback = cb;
  }

  public onChangeInputs(cb: (arg: { index: number; values: Record<string, string> }) => void) {
    this.onChangeInputsCallback = cb;
  }

  public onChangeFormJson(cb: (json: FormJsonEnvelope | null) => void) {
    this.onChangeFormJsonCallback = cb;
  }

  public onPageChange(cb: (pageInfo: { currentPage: number; totalPages: number }) => void) {
    this.onPageChangeCallback = cb;
  }

  public getPageCursor() {
    return this.pageCursor;
  }

  public getFormJson() {
    return this.lastFormJson;
  }

  public getTotalPages() {
    if (!this.domContainer) throw new Error(DESTROYED_ERR_MSG);
    return this.template.schemas.length;
  }

  public setInputs(inputs: { [key: string]: string }[]): void {
    const previousInputs = this.getInputs();

    super.setInputs(inputs);

    const changedInputs: Array<{ index: number; name: string; value: string }> = [];

    inputs.forEach((input, index) => {
      const prevInput = previousInputs[index] || {};

      const allKeys = new Set([...Object.keys(input), ...Object.keys(prevInput)]);

      allKeys.forEach((name) => {
        const newValue = input[name];
        const oldValue = prevInput[name];

        if (newValue !== oldValue) {
          changedInputs.push({ index, name, value: newValue });
        }
      });
    });

    changedInputs.forEach((input) => {
      if (this.onChangeInputCallback) {
        this.onChangeInputCallback(input);
      }
    });
  }

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
          onChangeInputs={(arg: { index: number; values: Record<string, string> }) => {
            const nextInputs = this.getInputs().map((input, index) =>
              index === arg.index ? { ...input, ...arg.values } : input,
            );
            this.setInputs(nextInputs);
            if (this.onChangeInputsCallback) {
              this.onChangeInputsCallback(arg);
            }
          }}
          onFormJsonChange={(json: FormJsonEnvelope | null) => {
            this.lastFormJson = json;
            if (this.onChangeFormJsonCallback) {
              this.onChangeFormJsonCallback(json);
            }
          }}
          onChangeInput={(arg: { index: number; value: string; name: string }) => {
            const { index, value, name } = arg;
            if (this.onChangeInputCallback) {
              this.onChangeInputCallback({ index, value, name });
            }
            const currentInput = this.inputs?.[index];
            if (currentInput && currentInput[name] !== value) {
              currentInput[name] = value;
              this.render();
            }
          }}
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

export default Form;
