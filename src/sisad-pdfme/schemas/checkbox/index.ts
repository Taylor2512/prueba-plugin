import { Plugin, Schema } from '@sisad-pdfme/common';
import svg from '../graphics/svg.js';
import { isEditable } from '../utils.js';
import { HEX_COLOR_PATTERN } from '../constants.js';
import { SquareCheck } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import { buildAddOptionButton, hexAlpha } from '../groupSchemaRender.js';

const getCheckedIcon = (stroke = 'currentColor') => renderLucideIcon(SquareCheck, { stroke });

interface Checkbox extends Schema {
  groupId?: string;
  color: string;
}

const schema: Plugin<Checkbox> = createSchemaPlugin<Checkbox>({
  ui: (arg) => {
    const { schema, value, onChange, rootElement, mode } = arg;
    const color = (schema as Checkbox).color || '#1677ff';
    const isDesigner = mode === 'designer';
    const editable = isEditable(mode, schema);
    const checked = value === 'true';

    // Root wrapper — needed for + button absolute positioning
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
      position: 'relative',
      width: '100%',
      height: '100%',
    });

    // Main box — clean, lightweight square indicator
    const box = document.createElement('div');
    Object.assign(box.style, {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      border: `1px solid ${hexAlpha(color, checked ? 0.85 : 0.5)}`,
      borderRadius: '3px',
      background: checked ? hexAlpha(color, 0.12) : hexAlpha(color, 0.03),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: editable ? 'pointer' : 'default',
      overflow: 'hidden',
      transition: 'background 100ms ease, border-color 100ms ease',
    });

    if (editable && onChange) {
      box.addEventListener('click', (e) => {
        e.stopPropagation();
        onChange({ key: 'content', value: checked ? 'false' : 'true' });
      });
    }

    if (checked) {
      const markWrap = document.createElement('div');
      Object.assign(markWrap.style, {
        width: '72%',
        height: '72%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      });
      markWrap.innerHTML = renderLucideIcon(SquareCheck, { stroke: color, fill: 'none', width: '100%', height: '100%' });
      box.appendChild(markWrap);
    }
    // Unchecked: empty box, clean minimal look

    wrapper.appendChild(box);

    // + button below — designer only. Converts to checkboxGroup
    if (isDesigner && onChange) {
      const addBtn = buildAddOptionButton(color, 'Convertir en grupo de casillas', 'data-checkbox-convert-to-group-btn');
      addBtn.setAttribute('data-checkbox-convert-to-group', 'true');
      addBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Convert this lone checkbox into a checkboxGroup, preserving its checked state
        const wasChecked = checked;
        onChange([
          { key: 'type', value: 'checkboxGroup' },
          { key: 'groupName', value: 'Grupo de casillas' },
          { key: 'groupId', value: 'Grupo_Casillas' },
          { key: 'lockedAsGroup', value: true },
          { key: 'orientation', value: 'vertical' },
          { key: 'spacing', value: 3 },
          { key: 'height', value: 24 },
          { key: 'width', value: Math.max(55, Number(schema.width) || 0) },
          {
            key: 'options',
            value: [
              { optionId: 'option_1', label: 'Casilla 1' },
              { optionId: 'option_2', label: 'Casilla 2' },
            ],
          },
          { key: 'content', value: wasChecked ? 'option_1' : '' },
          { key: 'selectedOptionIds', value: wasChecked ? ['option_1'] : [] },
          // Group identity — preserved/extended without regenerating schemaUid or owner
          { key: '__designer.group.groupId', value: 'Grupo_Casillas' },
          { key: '__designer.group.groupType', value: 'checkbox' },
          { key: '__designer.group.groupName', value: 'Grupo de casillas' },
          { key: '__designer.group.lockedAsGroup', value: true },
        ]);
      });

      wrapper.appendChild(addBtn);
    }

    rootElement.appendChild(wrapper);
  },
  pdf: (arg) =>
    svg.pdf(Object.assign(arg, {
      value: arg.value === 'true'
        ? renderLucideIcon(SquareCheck, { stroke: arg.schema.color })
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${arg.schema.color}" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`,
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
