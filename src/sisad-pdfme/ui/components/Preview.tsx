import React, { useContext } from 'react';
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
import { OptionsContext } from '../contexts.js';
import { resolveRuntimeSchemaAccess } from '../collaboration/schemaRuntimeAccess.js';

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
  const previewOptions = useContext(OptionsContext) as {
    collaboration?: { activeRecipientId?: string | null; isGlobalView?: boolean };
  };
  // Recipient access only applies when the host supplies a collaboration view
  // (active recipient or global). Otherwise the form renders all schemas as before.
  const collab = previewOptions?.collaboration;
  const accessCtx =
    collab && (collab.activeRecipientId || collab.isGlobalView)
      ? {
          recipientColorMap: new Map<string, string>(),
          recipientNameMap: new Map<string, string>(),
          activeRecipientId: collab.activeRecipientId ?? null,
          isGlobalView: collab.isGlobalView === true,
          actorColor: null,
          canEditStructure: true,
        }
      : undefined;
  const handleExportTemplate = () => {
    const exportPayload = JSON.stringify(template, null, 2);
    const safeName = String(template.basePdf || 'sisad-pdfme-preview-template')
      .replace(/[\\/:*?"<>|]+/g, '_')
      .trim() || 'sisad-pdfme-preview-template';
    const blob = new Blob([exportPayload], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${safeName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

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
    registerPaperRef,
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
        pageNum={pageSizes.length}
        setPageCursor={(p) => {
          if (!containerRef.current) return;
          const nextPage = typeof p === 'function' ? p(pageCursor) : p;
          if (!Number.isFinite(nextPage)) return;
          setPageCursor(nextPage);
          const paper = paperRefs.current[nextPage];
          if (paper && typeof paper.scrollIntoView === 'function') {
            paper.scrollIntoView({ block: 'start', inline: 'nearest' });
          } else {
            containerRef.current.scrollTop = getPagesScrollTopByIndex(pageSizes, nextPage, scale);
          }
          if (onPageChange) {
            onPageChange({ currentPage: nextPage, totalPages: pageSizes.length });
          }
        }}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        onExport={handleExportTemplate}
      />
      <UnitPager
        size={size}
        unitCursor={unitCursor}
        unitNum={inputs.length}
        setUnitCursor={setUnitCursor}
      />
      <div ref={containerRef} className={UI_CLASSNAME + 'preview-scroll'}>
        <Paper
          scale={scale}
          size={size}
          schemasList={schemasList}
          pageSizes={pageSizes}
          backgrounds={backgrounds}
          registerPaperRef={registerPaperRef}
          renderPaper={() => null}
          renderSchema={({ schema, index }) => {
            if ((schema as SchemaForUI & { hidden?: boolean }).hidden === true) {
              return null;
            }

            // 001C — recipient access: skip schemas not visible to the active
            // recipient; force read-only when the active recipient can't edit.
            const access = accessCtx
              ? resolveRuntimeSchemaAccess(schema, isForm ? 'form' : 'viewer', accessCtx)
              : null;
            if (access && !access.visible) {
              return null;
            }
            const lockedByAccess = Boolean(access && !access.editable);
            const effSchema =
              lockedByAccess && !schema.readOnly
                ? ({ ...schema, readOnly: true } as SchemaForUI)
                : schema;

            // SIGN-002 — dateSigned linked to a signature field: stay blank until
            // the linked signature has a value, then the schema stamps the date.
            const autoFrom = (effSchema as SchemaForUI & { autoPopulateFrom?: string }).autoPopulateFrom;
            const isLinkedDateSigned =
              effSchema.type === 'dateSigned' && typeof autoFrom === 'string' && autoFrom.trim().length > 0;

            const inputValue = input?.[effSchema.name];
            const hasInputValue = inputValue !== undefined && inputValue !== null;
            const schemaTone =
              (effSchema as SchemaForUI & { ownerColor?: string; borderColor?: string }).ownerColor ||
              (effSchema as SchemaForUI & { ownerColor?: string; borderColor?: string }).borderColor ||
              token.colorPrimary;
            let value = '';
            if (effSchema.readOnly) {
              if (hasInputValue) {
                value = String(inputValue);
              } else {
                value = replacePlaceholders({
                  content: effSchema.content || '',
                  variables: { ...input, totalPages: schemasList.length, currentPage: index + 1 },
                  schemas: schemasList,
                });
              }
            } else if (hasInputValue) {
              value = String(inputValue);
            }

            if (isLinkedDateSigned) {
              // Trigger = the linked signature field has a value (was signed).
              const signed = Boolean(input?.[autoFrom as string]);
              value = signed ? 'signed' : '';
            }

            let outline = 'transparent';
            if (isForm) {
              outline = effSchema.readOnly ? `1px solid ${schemaTone}` : `1px dashed ${schemaTone}`;
            }

            return (
            <Renderer
              key={effSchema.id}
              schema={effSchema}
              basePdf={template.basePdf}
              value={value}
              pageIndex={index}
              pageNumber={index + 1}
              mode={isForm ? 'form' : 'viewer'}
              placeholder={effSchema.content}
              tabIndex={index + 100}
                onChange={(arg) => {
                  const args = Array.isArray(arg) ? arg : [arg];
                  handleOnChangeRenderer(args, effSchema);
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
