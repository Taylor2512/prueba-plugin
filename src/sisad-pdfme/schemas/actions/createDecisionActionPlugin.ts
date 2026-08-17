import type { Plugin, PropPanelSchema, Schema } from '@sisad-pdfme/common';
import type { LucideIcon } from 'lucide-react';
import { createSchemaPlugin, renderLucideIcon } from '@sisad-pdfme/schemas/schemaBuilder';
import { createSchemaInspectorConfig } from '@sisad-pdfme/schemas/schemaFamilies';
import {
  COMMON_PROPERTY_MAP,
  dataLabelFields,
  helpFields,
} from '@sisad-pdfme/schemas/propPanel/commonInspectorFields';
import { resolveSchemaOwnerColorValue } from '@sisad-pdfme/collaboration/schemaOwnershipAppearance';
import { renderSchemaWithChrome } from '@sisad-pdfme/schemas/shared/renderSchemaWithChrome';
import { createActionButtonEl } from '@sisad-pdfme/schemas/shared/schemaDom';
import { readableTextColor } from '@sisad-pdfme/schemas/shared/fieldChrome';
import type { ActionSchemaBase } from '@sisad-pdfme/schemas/shared/schemaTypes';
import { getCanonicalDefault } from '@sisad-pdfme/schemas/runtime-normalizer';

type DecisionActionSchema = ActionSchemaBase<{
  requiresReason?: boolean;
  confirmationMessage?: string;
  auditEventName?: string;
  action?: string;
}>;

type DecisionActionPluginConfig = {
  type: 'approve' | 'decline';
  label: string;
  defaultColor: string;
  pdfColor: [number, number, number];
  actionStatus: string;
  confirmationPlaceholder: string;
  auditEventName?: string;
  icon: LucideIcon;
  iconSvg: string;
  tags: string[];
};

const ACTION_OWNER_STRIP_HEIGHT = 4;
const ACTION_CHROME_GAP = 2;
const ACTION_CHROME_PADDING = 2;

const createDecisionActionChromeEl = (ownerColor: string): HTMLDivElement => {
  const frame = document.createElement('div');
  frame.className = 'sisad-pdfme-decision-action-frame';
  Object.assign(frame.style, {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: `${ACTION_CHROME_GAP}px`,
    padding: `${ACTION_CHROME_PADDING}px`,
    boxSizing: 'border-box',
    overflow: 'hidden',
  });

  const buttonShell = document.createElement('div');
  buttonShell.className = 'sisad-pdfme-decision-action-button-shell';
  Object.assign(buttonShell.style, {
    flex: '1 1 auto',
    minHeight: '0',
    display: 'flex',
  });

  const ownerStrip = document.createElement('div');
  ownerStrip.className = 'sisad-pdfme-decision-action-owner-strip';
  Object.assign(ownerStrip.style, {
    height: `${ACTION_OWNER_STRIP_HEIGHT}px`,
    flex: `0 0 ${ACTION_OWNER_STRIP_HEIGHT}px`,
    borderRadius: '999px',
    background: ownerColor,
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)',
  });

  frame.append(buttonShell, ownerStrip);
  return frame;
};

export const createDecisionActionPlugin = ({
  type,
  label,
  defaultColor,
  pdfColor,
  actionStatus,
  confirmationPlaceholder,
  auditEventName,
  icon,
  iconSvg,
  tags,
}: DecisionActionPluginConfig): Plugin<Schema> =>
  createSchemaPlugin<Schema>(
    {
      ui: async ({ schema, rootElement, mode, onChange }) => {
        const decisionSchema = schema as DecisionActionSchema;
        const action = decisionSchema.action || type;

        renderSchemaWithChrome<DecisionActionSchema>({
          schema: decisionSchema,
          rootElement,
          family: 'action-based',
          compact: true,
          renderMode: mode,
          render: (chromeEl) => {
            const ownerColor =
              rootElement.dataset.schemaOwnerColor ||
              resolveSchemaOwnerColorValue(decisionSchema) ||
              '#94A3B8';
            const button = createActionButtonEl({
              label: decisionSchema.label || label,
              // El botón lleva el color del destinatario; `defaultColor` (verde
              // aprobar / rojo rechazar) queda como respaldo cuando no hay dueño.
              // El icono y la etiqueta siguen distinguiendo la acción.
              bgColor: decisionSchema.buttonColor || ownerColor || defaultColor,
              textColor:
                decisionSchema.buttonTextColor || readableTextColor(ownerColor || defaultColor),
              fontSize: decisionSchema.fontSize || 11,
              isInteractive: mode === 'form',
              iconSvg,
            });
            button.style.height = '100%';
            button.style.minHeight = '0';
            button.style.flex = '1 1 auto';

            if (mode === 'form') {
              button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                onChange?.([
                  { key: 'content', value: action },
                  { key: 'actionStatus', value: actionStatus },
                ]);
                rootElement.dispatchEvent(
                  new CustomEvent('sisad-pdfme:schema-action', {
                    bubbles: true,
                    detail: {
                      action,
                      schemaUid:
                        decisionSchema.schemaUid ??
                        (decisionSchema as { id?: string }).id,
                      schema: decisionSchema,
                    },
                  }),
                );
              });
            }

            const decisionChrome = createDecisionActionChromeEl(ownerColor);
            const buttonShell = decisionChrome.firstElementChild as HTMLDivElement | null;
            buttonShell?.appendChild(button);
            chromeEl.appendChild(decisionChrome);
          },
        });
      },
      pdf: async ({ schema, pdfLib, page }) => {
        const decisionSchema = schema as DecisionActionSchema & {
          position: { x: number; y: number };
        };
        const { position, width, height } = decisionSchema;
        const color = pdfLib.rgb(...pdfColor);

        page.drawRectangle({
          x: position.x,
          y: page.getHeight() - position.y - height,
          width,
          height,
          borderColor: color,
          borderWidth: 1,
          color,
          borderOpacity: 0,
          opacity: 0.15,
        });
      },
      propPanel: {
        schema: (): Record<string, PropPanelSchema> => ({
          label: {
            title: 'Etiqueta del botón',
            type: 'string',
            widget: 'input',
            span: 24,
            props: { placeholder: label },
          },
          requiresReason: {
            title: 'Requiere motivo',
            type: 'boolean',
            widget: 'switch',
            span: 12,
          },
          confirmationMessage: {
            title: 'Mensaje de confirmación',
            type: 'string',
            widget: 'textarea',
            span: 24,
            props: {
              placeholder: confirmationPlaceholder,
              autoSize: { minRows: 2, maxRows: 3 },
            },
          },
          ...(auditEventName
            ? {
                auditEventName: {
                  title: 'Nombre de evento (auditoría)',
                  type: 'string',
                  widget: 'input',
                  span: 24,
                  props: { placeholder: auditEventName },
                } as PropPanelSchema,
              }
            : {}),
          buttonColor: {
            title: 'Color botón',
            type: 'string',
            widget: 'colorPicker',
            span: 8,
          },
          buttonTextColor: {
            title: 'Color texto',
            type: 'string',
            widget: 'colorPicker',
            span: 8,
          },
          fontSize: {
            title: 'Tamaño',
            type: 'number',
            widget: 'inputNumber',
            span: 8,
            props: { min: 8, max: 20, precision: 0 },
          },
          ...helpFields(),
          ...dataLabelFields(),
        }),
        inspector: createSchemaInspectorConfig('textual', {
          propertyMap: {
            ...COMMON_PROPERTY_MAP,
            label: 'data',
            requiresReason: 'data',
            confirmationMessage: 'data',
            ...(auditEventName ? { auditEventName: 'connections' as const } : {}),
            buttonColor: 'style',
            buttonTextColor: 'style',
            fontSize: 'style',
          },
          includeConnections: true,
        }),
        defaultSchema: ((): any => {
          const canonical = getCanonicalDefault(undefined as any, type) as Record<string, unknown> | null;
          return {
            ...(canonical || {}),
            name: '',
            type,
            content: '',
            position: { x: 0, y: 0 },
            width: 40,
            height: 12,
            action: type,
            label,
            requiresReason: false,
            confirmationMessage: '',
            ...(auditEventName ? { auditEventName } : {}),
            // Sin color materializado: se deriva del dueño en cada render.
            fontSize: 11,
          };
        })(),
      },
      icon: renderLucideIcon(icon, { stroke: defaultColor }),
    },
    {
      key: type,
      type,
      label,
      category: 'Acción',
      tags,
      capabilities: ['designer', 'form', 'viewer'],
    },
  );
