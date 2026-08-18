/**
 * Preview runtime para visor/formulario SISAD PDFME.
 *
 * Consume usePreviewRuntime para preparar páginas, backgrounds, zoom e inputs,
 * y delega cada schema a Renderer. También aplica reglas runtime de visibilidad,
 * acceso por destinatario y autocompletado de dateSigned enlazado a firma.
 */
import { useContext } from 'react';
import { SchemaForUI, PreviewProps, Size, replacePlaceholders } from '@sisad-pdfme/common';
import { flatSchemaPlugins } from '@sisad-pdfme/schemas';
import { generatePdfWithPreflight } from '@sisad-pdfme/generator';
import { downloadPdf } from '@sisad-pdfme/browser/downloads';
import {
  resolveDocumentPdfFileName,
  resolveTemplateJsonFileName,
} from '@sisad-pdfme/common/documentFileName';
import { theme } from 'antd';
import UnitPager from '@sisad-pdfme/ui/components/UnitPager';
import Root from '@sisad-pdfme/ui/components/Root';
import ErrorScreen from '@sisad-pdfme/ui/components/ErrorScreen';
import CtlBar from '@sisad-pdfme/ui/components/CtlBar';
import Paper from '@sisad-pdfme/ui/components/Paper';
import Renderer from '@sisad-pdfme/ui/components/Renderer';
import usePreviewRuntime from '@sisad-pdfme/ui/components/usePreviewRuntime';
import type { FormJsonEnvelope } from '@sisad-pdfme/ui/designerEngine';
import { UI_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { OptionsContext } from '@sisad-pdfme/ui/contexts';
import {
  buildRecipientNameMap,
  normalizeCollaborationRecipients,
} from '@sisad-pdfme/ui/collaborationContext';
import { resolveRuntimeSchemaAccess } from '@sisad-pdfme/ui/collaboration/schemaRuntimeAccess';

/**
 * Componente runtime de vista previa/formulario.
 *
 * Prepara Root, CtlBar, UnitPager, Paper y Renderer para pintar el template con
 * los inputs activos. En modo Form propaga cambios de plugins hacia callbacks.
 */
const Preview = ({
  template,
  inputs,
  size,
  onChangeInput,
  onChangeInputs,
  onFormJsonChange,
  onPageChange,
  plugins,
}: Omit<PreviewProps, 'domContainer'> & {
  onChangeInput?: (_args: { index: number; value: string; name: string }) => void;
  onChangeInputs?: (_args: { index: number; values: Record<string, string> }) => void;
  onFormJsonChange?: (_json: FormJsonEnvelope | null) => void;
  onPageChange?: (_pageInfo: { currentPage: number; totalPages: number }) => void;
  size: Size;
}) => {
  const { token } = theme.useToken();
  const previewOptions = useContext(OptionsContext) as {
    collaboration?: {
      activeRecipientId?: string | null;
      isGlobalView?: boolean;
      recipientOptions?: unknown[];
      users?: unknown[];
    };
  };
  // Recipient access only applies when the host supplies a collaboration view
  // (active recipient or global). Otherwise the form renders all schemas as before.
  const collab = previewOptions?.collaboration;
  const recipientOptions = normalizeCollaborationRecipients(collab?.recipientOptions || collab?.users);
  const accessCtx =
    collab && (collab.activeRecipientId || collab.isGlobalView || recipientOptions.length > 0)
      ? {
          recipientColorMap: new Map(
            recipientOptions
              .filter((recipient) => Boolean(recipient.color))
              .map((recipient) => [recipient.id, recipient.color as string] as const),
          ),
          recipientNameMap: buildRecipientNameMap(recipientOptions),
          activeRecipientId: collab.activeRecipientId ?? null,
          activeRecipient:
            recipientOptions.find((recipient) => recipient.id === collab.activeRecipientId) ?? null,
          isGlobalView: collab.isGlobalView === true,
          actorColor: null,
          canEditStructure: true,
        }
      : undefined;
  const handleExportTemplate = () => {
    const exportPayload = JSON.stringify(template, null, 2);
    // `basePdf` puede ser objeto: `String(...)` daba `[object Object].json`.
    const fileName = resolveTemplateJsonFileName(template.basePdf);
    const blob = new Blob([exportPayload], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  const handleDownloadPdf = async () => {
    const { pdf } = await generatePdfWithPreflight({
      template,
      inputs,
      options: { ...previewOptions, colorType: 'grayscale' },
      plugins: { ...flatSchemaPlugins, ...(plugins || {}) },
    });
    const url = downloadPdf(pdf, resolveDocumentPdfFileName(template.basePdf));
    if (url) window.setTimeout(() => URL.revokeObjectURL(url), 0);
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
        onDownloadPdf={handleDownloadPdf}
        onExportTemplate={handleExportTemplate}
      />
      <UnitPager
        size={size}
        unitCursor={unitCursor}
        unitNum={inputs.length}
        setUnitCursor={setUnitCursor}
      />
      <div
        ref={containerRef}
        className={UI_CLASSNAME + 'preview-scroll relative flex h-full w-full min-w-0 min-h-0 flex-1 items-start justify-center overflow-auto [scrollbar-gutter:stable_both-edges] pt-3 px-3.5 pb-5 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.08),transparent_22%),linear-gradient(180deg,rgba(248,250,252,0.96),rgba(241,245,249,0.98))]'}
      >
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
