import { describe, expect, it } from 'vitest';
import {
  isActionSchema,
  isCheckboxGroupSchema,
  isCheckboxSchema,
  isOptionBasedSchema,
  isOptionGroupSchema,
  isRadioGroupSchema,
  isRawOptionItem,
  isSelectSchema,
  isSigningSchema,
  isTextLikeSchema,
  getSchemaOptions,
  resolveSchemaIdByIdentity,
} from '@/sisad-pdfme/schemas/shared/schemaGuards';
import { InspectorColorInput } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorColorInput';
import { InspectorDefinitionList } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorDefinitionList';
import { InspectorField } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorField';
import { InspectorNumberInput } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorNumberInput';
import { InspectorSelect } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorSelect';
import { InspectorSwitch } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorSwitch';
import {
  getInspectorDefaultOpenSections,
  getInspectorProfile,
  getInspectorVisibleDetailSections,
  getSectionWidgets,
} from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaDetailProfiles';
import {
  getCatalogLabel,
  getSchemaTypeLabel,
  resolveSchemaDisplayInfo,
} from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaDisplayInfo';
import {
  resolveSchemaInteractionState,
  resolveSchemaOwnerColor,
} from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaInteractionState';
import { RegisteredUsersSelector } from '@/sisad-pdfme/ui/components/RegisteredUsersSelector';
import { OptionListWidget } from '@/sisad-pdfme/schemas/options/OptionListWidget';
import { OptionListEditor } from '@/sisad-pdfme/schemas/options/optionPropPanel';
import { buildDefaultOptionGroupOptions, normalizeOptionId, normalizeOptionText } from '@/sisad-pdfme/schemas/options/optionModel';
import { resolveSelectedOptionId } from '@/sisad-pdfme/schemas/options/optionValueAdapter';

import type {
  ActionKind,
  CheckboxGroupSchemaLike,
  MinimalSchema,
  OptionGroupSchemaLike,
  RawOptionItem,
  RadioGroupSchemaLike,
  SchemaIdentityLike,
  SigningKind,
  TextLikeKind,
} from '@/sisad-pdfme/schemas/shared/schemaGuards';
import type {
  InspectorColorInputProps,
} from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorColorInput';
import type {
  InspectorDefinitionItem,
  InspectorDefinitionListProps,
} from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorDefinitionList';
import type { InspectorFieldProps } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorField';
import type { InspectorNumberInputProps } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorNumberInput';
import type {
  InspectorSelectOption,
  InspectorSelectProps,
} from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorSelect';
import type { InspectorSwitchProps } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorSwitch';
import type {
  DetailInspectorSection,
  DetailInspectorSectionKey,
  InspectorProfile,
} from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaDetailProfiles';
import type { SchemaDisplayInfo } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaDisplayInfo';
import type {
  SchemaInteractionBadge,
  SchemaInteractionState,
  SchemaInteractionStateContext,
} from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaInteractionState';
import type {
  RegisteredUsersSelectorProps,
  RegisteredUsersSelectorRecipient,
} from '@/sisad-pdfme/ui/components/RegisteredUsersSelector';

type DetailViewPublicModuleTypes = {
  minimal: MinimalSchema;
  optionGroup: OptionGroupSchemaLike;
  checkboxGroup: CheckboxGroupSchemaLike;
  radioGroup: RadioGroupSchemaLike;
  actionKind: ActionKind;
  signingKind: SigningKind;
  textLikeKind: TextLikeKind;
  rawOptionItem: RawOptionItem;
  schemaIdentity: SchemaIdentityLike;
  colorInput: InspectorColorInputProps;
  definitionItem: InspectorDefinitionItem;
  definitionList: InspectorDefinitionListProps;
  field: InspectorFieldProps;
  numberInput: InspectorNumberInputProps;
  selectOption: InspectorSelectOption;
  select: InspectorSelectProps;
  switch: InspectorSwitchProps;
  section: DetailInspectorSection;
  sectionKey: DetailInspectorSectionKey;
  profile: InspectorProfile;
  displayInfo: SchemaDisplayInfo;
  badge: SchemaInteractionBadge;
  state: SchemaInteractionState;
  stateContext: SchemaInteractionStateContext;
  recipient: RegisteredUsersSelectorRecipient;
  selectorProps: RegisteredUsersSelectorProps;
};

describe('detail view public modules', () => {
  it('exposes the inspector helper modules through static imports', () => {
    const schema: MinimalSchema = {
      type: 'checkboxGroup',
      options: [{ optionId: 'one', label: 'One' }],
      id: 'schema-1',
      name: 'field_1',
    };
    const recipient: RegisteredUsersSelectorRecipient = { id: 'user-1', name: 'User 1' };

    expect(isOptionGroupSchema(schema)).toBe(true);
    expect(isCheckboxGroupSchema(schema)).toBe(true);
    expect(isRadioGroupSchema(schema)).toBe(false);
    expect(isSelectSchema({ type: 'select' })).toBe(true);
    expect(isOptionBasedSchema(schema)).toBe(true);
    expect(isCheckboxSchema({ type: 'checkbox' })).toBe(true);
    expect(isActionSchema({ type: 'approve' })).toBe(true);
    expect(isSigningSchema({ type: 'signature' })).toBe(true);
    expect(isTextLikeSchema({ type: 'text' })).toBe(true);
    expect(isRawOptionItem({ optionId: 'x', label: 'X' })).toBe(true);
    expect(getSchemaOptions(schema)).toHaveLength(1);
    expect(resolveSchemaIdByIdentity([schema as SchemaIdentityLike], schema as SchemaIdentityLike)).toBe('schema-1');
    expect(typeof InspectorColorInput).toBe('function');
    expect(typeof InspectorDefinitionList).toBe('function');
    expect(typeof InspectorField).toBe('function');
    expect(typeof InspectorNumberInput).toBe('function');
    expect(typeof InspectorSelect).toBe('function');
    expect(typeof InspectorSwitch).toBe('function');
    expect(typeof OptionListWidget).toBe('function');
    expect(typeof OptionListEditor).toBe('function');
    expect(buildDefaultOptionGroupOptions('Opción', 2)).toHaveLength(2);
    expect(normalizeOptionText('  texto  ')).toBe('texto');
    expect(normalizeOptionId('texto', 0)).toBe('texto');
    expect(resolveSelectedOptionId('one', [{ optionId: 'one', label: 'One' }] as never)).toBe('one');
    expect(getInspectorProfile('text').schemaType).toBe('text');
    expect(getInspectorVisibleDetailSections('text')).toBeTruthy();
    expect(getInspectorDefaultOpenSections('text')).toBeTruthy();
    expect(
      getSectionWidgets({
        key: 'identity',
        title: 'Identity',
        description: '',
        schema: {
          type: 'object',
          properties: {
            label: { type: 'string', widget: 'input' },
          },
        } as never,
      } as never),
    ).toEqual(['input']);
    expect(getCatalogLabel('field_1', 'text', 'builtin')).toBeTruthy();
    expect(getSchemaTypeLabel('text')).toBeTruthy();
    expect(resolveSchemaDisplayInfo({ type: 'text', name: 'field_1' } as never).primaryLabel).toBeTruthy();
    expect(resolveSchemaInteractionState({ type: 'text' } as never).statusLabel).toBeTruthy();
    expect(typeof RegisteredUsersSelector).toBe('function');
    expect(recipient.id).toBe('user-1');
  });
});
