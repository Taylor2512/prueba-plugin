import { Plugin, Schema } from '@sisad-pdfme/common';
import svg from '../graphics/svg.js';
import { isEditable } from '../utils.js';
import { HEX_COLOR_PATTERN } from '../constants.js';
import { SquareCheck } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';

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

    // Main box — DocuSign style: colored border square
    const box = document.createElement('div');
    Object.assign(box.style, {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      border: `2px solid ${color}`,
      borderRadius: '3px',
      background: checked ? `${color}22` : `${color}0d`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: editable ? 'pointer' : 'default',
      overflow: 'hidden',
    });

    if (editable && onChange) {
      box.addEventListener('click', (e) => {
        e.stopPropagation();
        onChange({ key: 'content', value: checked ? 'false' : 'true' });
      });
    }

    // Check mark — only when checked
    if (checked) {
      const markWrap = document.createElement('div');
      Object.assign(markWrap.style, {
        width: '80%',
        height: '80%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      });
      markWrap.innerHTML = renderLucideIcon(SquareCheck, { stroke: color, fill: 'none', width: '100%', height: '100%' });
      box.appendChild(markWrap);
    } else {
      // Unchecked — subtle inner square like DocuSign
      const inner = document.createElement('div');
      Object.assign(inner.style, {
        width: '40%',
        height: '40%',
        border: `1.5px solid ${color}66`,
        borderRadius: '1px',
        background: 'transparent',
      });
      box.appendChild(inner);
    }

    wrapper.appendChild(box);

    // + button below — only in designer. Converts a lone checkbox into a checkboxGroup
    if (isDesigner && onChange) {
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.textContent = '+';
      // Center on the schema's bottom edge so it stays hit-testable
      // (fully-outside elements get covered by the paper page in canvas stacking).
      Object.assign(addBtn.style, {
        position: 'absolute',
        bottom: '1px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        border: `2px solid ${color}`,
        background: '#fff',
        color: color,
        fontSize: '13px',
        lineHeight: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: '30',
        padding: '0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        fontWeight: '700',
      });
      addBtn.title = 'Convertir en grupo de casillas';
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
