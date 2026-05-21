import { Plugin, Schema } from '@sisad-pdfme/common';
import { Circle, CircleDot } from 'lucide-react';
import svg from '../graphics/svg.js';
import { isEditable } from '../utils.js';
import { HEX_COLOR_PATTERN } from '../constants.js';
import { renderLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';
import { createSchemaInspectorConfig } from '../schemaFamilies.js';
import type { GroupMeta } from '../../shared/schemaDesignerMeta.js';

const defaultStroke = 'currentColor';

const getCheckedIcon = (stroke = defaultStroke) => renderLucideIcon(CircleDot, { stroke });
const getUncheckedIcon = (stroke = defaultStroke) => renderLucideIcon(Circle, { stroke });

interface RadioGroup extends Schema {
  /** Legacy group name — kept for backward compatibility; prefer __designer.group */
  group?: string;
  /** Legacy group ID — kept for backward compatibility; prefer __designer.group.groupId */
  groupId?: string;
  color: string;
  /** __designer field — carries GroupMeta for logical radio grouping */
  __designer?: {
    group?: GroupMeta;
    [key: string]: unknown;
  };
}

/**
 * Resolves the canonical group key for a RadioGroup schema.
 * Priority: __designer.group.groupId > groupId > group > schema.name (fallback)
 */
const resolveGroupKey = (schema: RadioGroup): string =>
  schema.__designer?.group?.groupId ?? schema.groupId ?? schema.group ?? schema.name;

const getIcon = ({ value, color }: { value: string; color: string }) =>
  value === 'true' ? getCheckedIcon(color) : getUncheckedIcon(color);

const eventEmitter = new EventTarget();

interface RadioButtonState {
  value: string;
  onChange: (arg: { key: string; value: string }) => void;
}

const radioButtonStates = new Map<string, RadioButtonState>();
const eventListeners = new Map<string, EventListener>();

const schema: Plugin<RadioGroup> = createSchemaPlugin<RadioGroup>({
  ui: (arg) => {
    const { schema, value, onChange, rootElement, mode } = arg;
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';

    if (onChange) {
      radioButtonStates.set(schema.name, { value, onChange });
    }

    const groupKey = resolveGroupKey(schema);
    const oldListener = eventListeners.get(schema.name);
    if (oldListener) {
      eventEmitter.removeEventListener(`group-${groupKey}`, oldListener);
    }

    const handleGroupEvent = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const selectedSchemaName = customEvent.detail;
      if (selectedSchemaName !== schema.name) {
        const radioButtonState = radioButtonStates.get(schema.name);
        if (!radioButtonState) return;
        if (radioButtonState.value === 'true') {
          radioButtonState.onChange({ key: 'content', value: 'false' });
        }
      }
    };

    eventListeners.set(schema.name, handleGroupEvent);
    eventEmitter.addEventListener(`group-${groupKey}`, handleGroupEvent);

    if (isEditable(mode, schema)) {
      container.addEventListener('click', () => {
        if (value !== 'true' && onChange) {
          onChange({ key: 'content', value: 'true' });
          radioButtonStates.set(schema.name, { value: 'true', onChange });
          eventEmitter.dispatchEvent(new CustomEvent(`group-${groupKey}`, { detail: schema.name }));
        }
      });
    }

    void svg.ui({
      ...arg,
      rootElement: container,
      mode: 'viewer',
      value: getIcon({ value, color: schema.color }),
    });

    rootElement.appendChild(container);
  },
  pdf: (arg) =>
    svg.pdf(Object.assign(arg, { value: getIcon({ value: arg.value, color: arg.schema.color }) })),
  propPanel: {
    schema: ({ i18n }) => ({
      color: {
        title: i18n('schemas.color'),
        type: 'string',
        widget: 'color',
        props: {
          disabledAlpha: true,
        },
        required: true,
        rules: [{ pattern: HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
      },
      // groupId is the canonical field; group is a legacy alias
      groupId: {
        title: i18n('schemas.radioGroup.groupName'),
        type: 'string',
        description: 'ID del grupo de opción única. Botones con el mismo ID son mutuamente excluyentes.',
      },
      group: {
        title: i18n('schemas.radioGroup.groupName'),
        type: 'string',
        hidden: true, // kept for backward compat — not shown in UI
      },
    }),
    inspector: createSchemaInspectorConfig('choice', {
      propertyMap: {
        color: 'style',
        group: 'data',
      },
    }),
    defaultSchema: {
      name: '',
      type: 'radioGroup',
      content: 'false',
      position: { x: 0, y: 0 },
      width: 8,
      height: 8,
      groupId: 'MyGroup',
      group: 'MyGroup',
      color: '#000000',
    },
  },
  icon: getCheckedIcon(),
}, {
  key: 'radioGroup',
  type: 'radioGroup',
  label: 'Opción única',
  category: 'Opciones',
  tags: ['radio', 'choice', 'selection'],
  capabilities: ['designer', 'form', 'viewer', 'selection', 'content'],
});

export default schema;
