import { Plugin, Schema } from '@sisad-pdfme/common';
import svg from '../graphics/svg.js';
import { isEditable } from '../utils.js';
import { HEX_COLOR_PATTERN } from '../constants.js';
import { SquareCheck } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import { buildAddOptionButton } from '../groupSchemaRender.js';
import { renderOptionIndicatorSvg, createOptionIndicatorElement } from '../options/optionIndicator.js';
import { buildCheckboxToGroupPatch } from '../options/optionValueAdapter.js';

const getCheckedIcon = (stroke = 'currentColor') => renderLucideIcon(SquareCheck, { stroke });

interface Checkbox extends Schema {
  groupId?: string;
  color: string;
}

const schema: Plugin<Checkbox> = createSchemaPlugin<Checkbox>({
  ui: (arg) => {
    const { schema, value, onChange, rootElement, mode } = arg;
    const color = (schema as Checkbox).color || '#1677ff';
    const ownerColor = (schema as Checkbox & { ownerColor?: string; __designer?: { ownerColor?: string } }).ownerColor
      || (schema as Checkbox & { __designer?: { ownerColor?: string } }).__designer?.ownerColor;
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
    wrapper.setAttribute('role', mode !== 'viewer' && mode !== 'pdf' ? 'checkbox' : 'presentation');
    if (mode !== 'viewer' && mode !== 'pdf') {
      wrapper.setAttribute('aria-checked', String(checked));
      if (!canToggle) {
        wrapper.setAttribute('aria-disabled', 'true');
      }
    } else {
      wrapper.setAttribute('aria-hidden', 'true');
    }

    // Visual chip drawn by the shared option indicator helper.
    const box = createOptionIndicatorElement({
      shape: 'square',
      checked,
      color,
      ownerColor,
      mode: mode === 'viewer' || mode === 'pdf' ? mode : isDesigner ? 'designer' : 'form',
      size: 18,
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
      wrapper.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onChange([{ key: 'content', value: checked ? 'false' : 'true' }]);
      });
    }

    wrapper.appendChild(box);

    // + button below — designer only. Converts to checkboxGroup
    if (isDesigner && onChange) {
      const addBtn = buildAddOptionButton(color, 'Convertir en grupo de casillas', 'data-checkbox-convert-to-group-btn');
      addBtn.setAttribute('data-checkbox-convert-to-group', 'true');
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
      color: {
        title: i18n('schemas.color'),
        type: 'string',
        widget: 'color',
        props: { disabledAlpha: true },
        required: true,
        rules: [{ pattern: HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
      },
      groupId: {
        title: i18n('schemas.radioGroup.groupName'),
        type: 'string',
      },
    }),
    inspector: createSchemaInspectorConfig('choice', {
      propertyMap: { color: 'style' },
    }),
    defaultSchema: {
      name: '',
      type: 'checkbox',
      content: 'false',
      position: { x: 0, y: 0 },
      width: 8,
      height: 8,
      groupId: 'MyGroup',
      color: '#1677ff',
    },
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
