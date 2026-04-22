import React from 'react';
import { SchemaForUI, PreviewProps, Size, replacePlaceholders } from '@sisad-pdfme/common';
import { theme } from 'antd';
import UnitPager from './UnitPager.js';
import Root from './Root.js';
import ErrorScreen from './ErrorScreen.js';
import CtlBar from './CtlBar.js';
import Paper from './Paper.js';
import Renderer from './Renderer.js';
import usePreviewRuntime from './usePreviewRuntime.js';
import type { FormJsonEnvelope } from '../designerEngine';
import { UI_CLASSNAME } from '../constants.js';

const Preview = ({
  template,
  inputs,
  size,
  onChangeInput,
  onChangeInputs,
  onFormJsonChange,
  onPageChange,
}: Omit<PreviewProps, 'domContainer'> & {
  onChangeInput?: (_args: { index: number; value: string; name: string }) => void;
  onChangeInputs?: (_args: { index: number; values: Record<string, string> }) => void;
  onFormJsonChange?: (_json: FormJsonEnvelope | null) => void;
  onPageChange?: (_pageInfo: { currentPage: number; totalPages: number }) => void;
  size: Size;
}) => {
  const { token } = theme.useToken();
  const {
    containerRef,
    paperRefs,
    unitCursor,
    setUnitCursor,
    pageCursor,
    setPageCursor,
    zoomLevel,
    setZoomLevel,
    schemasList,
    backgrounds,
    pageSizes,
    scale,
    error,
    input,
    isForm,
    handleOnChangeRenderer,
    getPagesScrollTopByIndex,
  } = usePreviewRuntime({
    template,
    inputs,
    size,
    onChangeInput,
    onChangeInputs,
    onFormJsonChange,
    onPageChange,
  });

  if (error) {
    return <ErrorScreen size={size} error={error} />;
  }

  return (
    <Root size={size} scale={scale}>
      <CtlBar
        size={size}
        pageCursor={pageCursor}
        pageNum={schemasList.length}
        setPageCursor={(p) => {
          if (!containerRef.current) return;
          const nextPage = typeof p === 'function' ? p(pageCursor) : p;
          if (!Number.isFinite(nextPage)) return;
          containerRef.current.scrollTop = getPagesScrollTopByIndex(pageSizes, nextPage, scale);
          setPageCursor(nextPage);
          if (onPageChange) {
            onPageChange({ currentPage: nextPage, totalPages: schemasList.length });
          }
        }}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
      />
      <UnitPager
        size={size}
        unitCursor={unitCursor}
        unitNum={inputs.length}
        setUnitCursor={setUnitCursor}
      />
      <div ref={containerRef} className={UI_CLASSNAME + 'preview-scroll'}>
        <Paper
          paperRefs={paperRefs}
          scale={scale}
          size={size}
          schemasList={schemasList}
          pageSizes={pageSizes}
          backgrounds={backgrounds}
          renderPaper={() => null}
          renderSchema={({ schema, index }) => {
            if ((schema as SchemaForUI & { hidden?: boolean }).hidden === true) {
              return null;
            }

            const inputValue = input?.[schema.name];
            const hasInputValue = inputValue !== undefined && inputValue !== null;
            const schemaTone =
              (schema as SchemaForUI & { ownerColor?: string; borderColor?: string }).ownerColor ||
              (schema as SchemaForUI & { ownerColor?: string; borderColor?: string }).borderColor ||
              token.colorPrimary;
            let value = '';
            if (schema.readOnly) {
              if (hasInputValue) {
                value = String(inputValue);
              } else {
                value = replacePlaceholders({
                  content: schema.content || '',
                  variables: { ...input, totalPages: schemasList.length, currentPage: index + 1 },
                  schemas: schemasList,
                });
              }
            } else if (hasInputValue) {
              value = String(inputValue);
            }

            let outline = 'transparent';
            if (isForm) {
              outline = schema.readOnly ? `1px solid ${schemaTone}` : `1px dashed ${schemaTone}`;
            }

            return (
              <Renderer
                key={schema.id}
                schema={schema}
                basePdf={template.basePdf}
                value={value}
                mode={isForm ? 'form' : 'viewer'}
                placeholder={schema.content}
                tabIndex={index + 100}
                onChange={(arg) => {
                  const args = Array.isArray(arg) ? arg : [arg];
                  handleOnChangeRenderer(args, schema);
                }}
                outline={outline}
                scale={scale}
              />
            );
          }}
        />
      </div>
    </Root>
  );
};

export default Preview;
