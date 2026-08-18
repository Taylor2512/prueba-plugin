import { Plugin, Schema } from '@sisad-pdfme/common';
import svg from '@sisad-pdfme/schemas/graphics/svg';
import { isEditable } from '@sisad-pdfme/schemas/utils';
import { HEX_COLOR_PATTERN } from '@sisad-pdfme/schemas/constants';
import {
  hexColorField,
  basicsFields,
  helpFields,
  dataLabelFields,
  COMMON_PROPERTY_MAP,
} from '@sisad-pdfme/schemas/propPanel/commonInspectorFields';
import { SquareCheck } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '@sisad-pdfme/schemas/schemaBuilder';
import { createSchemaInspectorConfig } from '@sisad-pdfme/schemas/schemaFamilies';
import { buildAddOptionButton } from '@sisad-pdfme/schemas/groupSchemaRender';
import { renderOptionIndicatorSvg, createOptionIndicatorElement } from '@sisad-pdfme/schemas/options/optionIndicator';
import { buildCheckboxToGroupPatch } from '@sisad-pdfme/schemas/options/optionValueAdapter';
import { getCanonicalDefault } from '@sisad-pdfme/schemas/runtime-normalizer';

const getCheckedIcon = (stroke = 'currentColor') => renderLucideIcon(SquareCheck, { stroke });

// Designer double-click detection by click timing. Selecting the checkbox
// re-renders (rebuilds its DOM) between the two physical clicks, so the native
// `dblclick` never fires on a stable node. Timestamps are scoped to the root so
// two Designer instances cannot consume each other's first click.
const CHECKBOX_DOUBLE_CLICK_MS = 450;
const lastCheckboxMouseUpAtByRoot = new WeakMap<object, Map<string, number>>();

const getCheckboxClickTimes = (rootElement: HTMLDivElement) => {
  const existing = lastCheckboxMouseUpAtByRoot.get(rootElement);
  if (existing) return existing;
  const created = new Map<string, number>();
  lastCheckboxMouseUpAtByRoot.set(rootElement, created);
  return created;
};

interface Checkbox extends Schema {
  groupId?: string;
  /** Opcional: sin color propio, la casilla usa el tono de su dueño. */
  color?: string;
}

const schema: Plugin<Checkbox> = createSchemaPlugin<Checkbox>({
  ui: (arg) => {
    const { schema, value, onChange, rootElement, mode } = arg;
    const ownerColor = (schema as Checkbox & { ownerColor?: string; __designer?: { ownerColor?: string } }).ownerColor
      || (schema as Checkbox & { __designer?: { ownerColor?: string } }).__designer?.ownerColor;
    // El azul de antd solo entra si no hay color propio NI dueño resuelto.
    const color = (schema as Checkbox).color || ownerColor || '#1677ff';
    const isDesigner = mode === 'designer';
    const editable = isEditable(mode, schema);
    const isReadOnly = Boolean(
      (schema as Checkbox & { readOnly?: boolean; readonly?: boolean; locked?: boolean }).readOnly
      || (schema as Checkbox & { readOnly?: boolean; readonly?: boolean; locked?: boolean }).readonly
      || (schema as Checkbox & { readOnly?: boolean; readonly?: boolean; locked?: boolean }).locked,
    );
    const canToggle = editable && !isReadOnly;
    const checked = value === 'true';

    // Root wrapper — no panel/card; just a transparent hit area for the chip.
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      border: '0',
      padding: '0',
      margin: '0',
    });
    // 'mode' is typed as 'viewer' | 'form' | 'designer'. Treat any non-viewer
    // mode as interactive. Avoid comparing against 'pdf' literal which is not
    // part of the Mode type to keep TypeScript happy.
    const isInteractive = mode !== 'viewer';
    wrapper.setAttribute('role', isInteractive ? 'checkbox' : 'presentation');
    if (isInteractive) {
      wrapper.setAttribute('aria-checked', String(checked));
      if (!canToggle) {
        wrapper.setAttribute('aria-disabled', 'true');
      }
    } else {
      wrapper.setAttribute('aria-hidden', 'true');
    }

    // Visual chip drawn by the shared option indicator helper. `fill` makes it
    // scale to the schema box (resizable) and cover the field so there is no
    // "box inside a box".
    const box = createOptionIndicatorElement({
      shape: 'square',
      checked,
      color,
      ownerColor,
      mode: mode === 'viewer' ? 'viewer' : isDesigner ? 'designer' : 'form',
      size: 18,
      fill: true,
      readOnly: !canToggle,
      disabled: !canToggle,
    });
    box.setAttribute('data-option-id', schema.groupId || schema.name || 'checkbox');
    Object.assign(box.style, {
      cursor: canToggle ? 'pointer' : 'default',
      pointerEvents: 'auto',
    });

    if (onChange && canToggle && mode === 'form') {
      wrapper.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onChange([{ key: 'content', value: checked ? 'false' : 'true' }]);
      });
    } else if (onChange && isDesigner && canToggle) {
      // Designer: single click keeps the root selected; double click (two mouseups
      // within the threshold) toggles. mouseup, not dblclick, because selecting the
      // schema rebuilds this DOM between the two clicks.
      const clickKey = String(
        (schema as { schemaUid?: string; id?: string; name?: string }).schemaUid
        || (schema as { id?: string }).id
        || schema.name
        || 'checkbox',
      );
      wrapper.addEventListener('mouseup', (e) => {
        const now = Date.now();
        const clickTimes = getCheckboxClickTimes(rootElement);
        const prev = clickTimes.get(clickKey) || 0;
        if (now - prev <= CHECKBOX_DOUBLE_CLICK_MS) {
          clickTimes.delete(clickKey);
          e.preventDefault();
          e.stopPropagation();
          onChange([{ key: 'content', value: checked ? 'false' : 'true' }]);
          return;
        }
        clickTimes.set(clickKey, now);
      });
    }

    wrapper.appendChild(box);

    // + button — designer only. Converts to checkboxGroup. Sits OUTSIDE the box,
    // just below it, so it never overlaps the (now box-filling) checkbox marker.
    if (isDesigner && onChange) {
      wrapper.style.overflow = 'visible';
      const addBtn = buildAddOptionButton(color, 'Convertir en grupo de casillas', 'data-checkbox-convert-to-group-btn');
      addBtn.setAttribute('data-checkbox-convert-to-group', 'true');
      Object.assign(addBtn.style, {
        bottom: 'auto',
        top: 'calc(100% + 4px)',
      });
      addBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Convert this lone checkbox into a checkboxGroup, preserving its checked state.
        onChange(buildCheckboxToGroupPatch(schema, checked));
      });

      wrapper.appendChild(addBtn);
    }

    rootElement.appendChild(wrapper);
  },
  pdf: (arg) =>
    svg.pdf(Object.assign(arg, {
      value: renderOptionIndicatorSvg({
        shape: 'square',
        checked: arg.value === 'true',
        color: String(arg.schema.color || '#1677ff'),
        mode: 'pdf',
        size: 24,
      }),
    })),
  propPanel: {
    schema: ({ i18n }) => ({
      // Una casilla suelta también se rellena: necesita obligatoriedad, ayuda y
      // clave de datos igual que el resto de campos de captura.
      ...basicsFields(),
      color: hexColorField({
        title: i18n('schemas.color'),
        pattern: HEX_COLOR_PATTERN,
        message: i18n('validation.hexColor'),
        required: true,
      }),
      groupId: {
        title: i18n('schemas.radioGroup.groupName'),
        type: 'string',
      },
      ...helpFields(),
      ...dataLabelFields(),
    }),
    inspector: createSchemaInspectorConfig('choice', {
      propertyMap: { ...COMMON_PROPERTY_MAP, color: 'style', groupId: 'data' },
      includeConnections: true,
    }),
    defaultSchema: ((): Schema => {
      const canonical = getCanonicalDefault(undefined, 'checkbox') as Partial<Schema> | null;
      return {
        ...(canonical || {}),
        name: '',
        type: 'checkbox',
        content: 'false',
        position: { x: 0, y: 0 },
        width: 8,
        height: 8,
        groupId: 'MyGroup',
        required: false,
        readOnly: false,
      } as Schema;
    })(),
  },
  icon: getCheckedIcon(),
}, {
  key: 'checkbox',
  type: 'checkbox',
  label: 'Casilla de verificación',
  category: 'Opciones',
  tags: ['checkbox', 'boolean', 'selection'],
  capabilities: ['designer', 'form', 'viewer', 'selection', 'content'],
});

export default schema;
