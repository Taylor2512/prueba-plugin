/**
 * Central inspector contract system.
 * Each schema family declares which sidebar sections it needs.
 * DetailView renders sections based on this contract, not per-type if-chains.
 */

export type SchemaInspectorFamily =
  | 'textLike'
  | 'numberLike'
  | 'dateLike'
  | 'optionBased'
  | 'boolean'
  | 'signing'
  | 'action'
  | 'attachment'
  | 'formula'
  | 'note'
  | 'media'
  | 'barcode'
  | 'table'
  | 'shape'
  | 'advanced';

export type SchemaInspectorSections = {
  identity?: boolean;
  basics?: boolean;
  content?: boolean;
  options?: boolean;
  numberFormat?: boolean;
  formula?: boolean;
  signing?: boolean;
  visualization?: boolean;
  appearance?: boolean;
  validation?: boolean;
  dataLabel?: boolean;
  help?: boolean;
  location?: boolean;
  autoPlace?: boolean;
  permissions?: boolean;
  dataBindings?: boolean;
  collaboration?: boolean;
  conditional?: boolean;
  comments?: boolean;
  advanced?: boolean;
};

export type SchemaInspectorFooterActions = {
  saveAsCustom?: boolean;
  duplicate?: boolean;
  delete?: boolean;
};

export type SchemaInspectorContract = {
  type: string;
  family: SchemaInspectorFamily;
  sections: SchemaInspectorSections;
  footerActions: SchemaInspectorFooterActions;
};

const DEFAULT_FOOTER: SchemaInspectorFooterActions = {
  saveAsCustom: false,
  duplicate: true,
  delete: true,
};

const TEXT_LIKE_CONTRACT: Omit<SchemaInspectorContract, 'type'> = {
  family: 'textLike',
  sections: {
    identity: true,
    basics: true,
    content: true,
    appearance: true,
    validation: true,
    dataLabel: true,
    help: true,
    location: true,
    autoPlace: false,
    permissions: true,
    dataBindings: true,
    collaboration: true,
    conditional: true,
    comments: true,
    advanced: true,
  },
  footerActions: DEFAULT_FOOTER,
};

const NUMBER_LIKE_CONTRACT: Omit<SchemaInspectorContract, 'type'> = {
  family: 'numberLike',
  sections: {
    identity: true,
    basics: true,
    content: true,
    numberFormat: true,
    appearance: true,
    validation: true,
    dataLabel: true,
    help: true,
    location: true,
    permissions: true,
    dataBindings: true,
    collaboration: true,
    advanced: true,
  },
  footerActions: DEFAULT_FOOTER,
};

const DATE_LIKE_CONTRACT: Omit<SchemaInspectorContract, 'type'> = {
  family: 'dateLike',
  sections: {
    identity: true,
    basics: true,
    appearance: true,
    validation: true,
    dataLabel: true,
    help: true,
    location: true,
    permissions: true,
    advanced: true,
  },
  footerActions: DEFAULT_FOOTER,
};

const OPTION_BASED_CONTRACT: Omit<SchemaInspectorContract, 'type'> = {
  family: 'optionBased',
  sections: {
    identity: true,
    basics: true,
    options: true,
    appearance: true,
    validation: true,
    dataLabel: true,
    help: true,
    location: true,
    permissions: true,
    collaboration: true,
    conditional: true,
    advanced: true,
  },
  footerActions: DEFAULT_FOOTER,
};

const BOOLEAN_CONTRACT: Omit<SchemaInspectorContract, 'type'> = {
  family: 'boolean',
  sections: {
    identity: true,
    basics: true,
    content: true,
    appearance: true,
    dataLabel: true,
    help: true,
    location: true,
    permissions: true,
    conditional: true,
    advanced: true,
  },
  footerActions: DEFAULT_FOOTER,
};

const SIGNING_CONTRACT: Omit<SchemaInspectorContract, 'type'> = {
  family: 'signing',
  sections: {
    identity: true,
    basics: true,
    signing: true,
    visualization: true,
    appearance: true,
    dataLabel: true,
    help: true,
    location: true,
    autoPlace: false,
    permissions: true,
    advanced: true,
  },
  footerActions: DEFAULT_FOOTER,
};

const MEDIA_CONTRACT: Omit<SchemaInspectorContract, 'type'> = {
  family: 'media',
  sections: {
    identity: true,
    content: true,
    appearance: true,
    dataLabel: true,
    help: true,
    location: true,
    advanced: true,
  },
  footerActions: DEFAULT_FOOTER,
};

const BARCODE_CONTRACT: Omit<SchemaInspectorContract, 'type'> = {
  family: 'barcode',
  sections: {
    identity: true,
    content: true,
    appearance: true,
    dataLabel: true,
    help: true,
    location: true,
    advanced: true,
  },
  footerActions: DEFAULT_FOOTER,
};

const TABLE_CONTRACT: Omit<SchemaInspectorContract, 'type'> = {
  family: 'table',
  sections: {
    identity: true,
    content: true,
    appearance: true,
    dataBindings: true,
    location: true,
    collaboration: true,
    advanced: true,
  },
  footerActions: DEFAULT_FOOTER,
};

const SHAPE_CONTRACT: Omit<SchemaInspectorContract, 'type'> = {
  family: 'shape',
  sections: {
    identity: true,
    appearance: true,
    location: true,
    advanced: true,
  },
  footerActions: DEFAULT_FOOTER,
};

const FORMULA_CONTRACT: Omit<SchemaInspectorContract, 'type'> = {
  family: 'formula',
  sections: {
    identity: true,
    formula: true,
    appearance: true,
    dataLabel: true,
    help: true,
    location: true,
    permissions: true,
    advanced: true,
  },
  footerActions: DEFAULT_FOOTER,
};

const NOTE_CONTRACT: Omit<SchemaInspectorContract, 'type'> = {
  family: 'note',
  sections: {
    identity: true,
    content: true,
    appearance: true,
    location: true,
    advanced: true,
  },
  footerActions: { duplicate: true, delete: true },
};

const ACTION_CONTRACT: Omit<SchemaInspectorContract, 'type'> = {
  family: 'action',
  sections: {
    identity: true,
    basics: true,
    content: true,
    appearance: true,
    dataLabel: true,
    help: true,
    location: true,
    advanced: true,
  },
  footerActions: DEFAULT_FOOTER,
};

const ATTACHMENT_CONTRACT: Omit<SchemaInspectorContract, 'type'> = {
  family: 'attachment',
  sections: {
    identity: true,
    basics: true,
    content: true,
    appearance: true,
    dataLabel: true,
    help: true,
    location: true,
    permissions: true,
    dataBindings: true,
    advanced: true,
  },
  footerActions: DEFAULT_FOOTER,
};

const BUILTIN_CONTRACTS: Record<string, Omit<SchemaInspectorContract, 'type'>> = {
  text: TEXT_LIKE_CONTRACT,
  multivariabletext: TEXT_LIKE_CONTRACT,
  fulllname: TEXT_LIKE_CONTRACT,
  fullname: TEXT_LIKE_CONTRACT,
  emailaddress: TEXT_LIKE_CONTRACT,
  company: TEXT_LIKE_CONTRACT,
  title: TEXT_LIKE_CONTRACT,
  number: NUMBER_LIKE_CONTRACT,
  date: DATE_LIKE_CONTRACT,
  datetime: DATE_LIKE_CONTRACT,
  time: DATE_LIKE_CONTRACT,
  datesigned: { ...SIGNING_CONTRACT, family: 'signing', sections: { ...SIGNING_CONTRACT.sections, signing: false, visualization: false, appearance: true, basics: true } },
  signature: SIGNING_CONTRACT,
  initials: SIGNING_CONTRACT,
  stamp: SIGNING_CONTRACT,
  checkbox: BOOLEAN_CONTRACT,
  checkboxgroup: OPTION_BASED_CONTRACT,
  radiogroup: OPTION_BASED_CONTRACT,
  select: OPTION_BASED_CONTRACT,
  dropdown: OPTION_BASED_CONTRACT,
  image: MEDIA_CONTRACT,
  svg: MEDIA_CONTRACT,
  qrcode: BARCODE_CONTRACT,
  japanpost: BARCODE_CONTRACT,
  ean13: BARCODE_CONTRACT,
  ean8: BARCODE_CONTRACT,
  code39: BARCODE_CONTRACT,
  code128: BARCODE_CONTRACT,
  nw7: BARCODE_CONTRACT,
  itf14: BARCODE_CONTRACT,
  upca: BARCODE_CONTRACT,
  upce: BARCODE_CONTRACT,
  gs1datamatrix: BARCODE_CONTRACT,
  pdf417: BARCODE_CONTRACT,
  table: TABLE_CONTRACT,
  line: SHAPE_CONTRACT,
  rectangle: SHAPE_CONTRACT,
  ellipse: SHAPE_CONTRACT,
  formula: FORMULA_CONTRACT,
  note: NOTE_CONTRACT,
  approve: ACTION_CONTRACT,
  decline: ACTION_CONTRACT,
  attachment: ATTACHMENT_CONTRACT,
};

const _pluginContracts = new Map<string, Omit<SchemaInspectorContract, 'type'>>();

export const registerInspectorContract = (
  type: string,
  contract: Omit<SchemaInspectorContract, 'type'>,
): void => {
  _pluginContracts.set(type.trim().toLowerCase(), contract);
};

export const resolveInspectorContract = (schemaType: string): SchemaInspectorContract => {
  const key = String(schemaType || '').trim().toLowerCase();
  const contract = _pluginContracts.get(key) || BUILTIN_CONTRACTS[key];
  if (contract) {
    return { type: key, ...contract };
  }
  return {
    type: key,
    family: 'advanced',
    sections: {
      identity: true,
      appearance: true,
      advanced: true,
    },
    footerActions: DEFAULT_FOOTER,
  };
};

export const contractSectionEnabled = (
  contract: SchemaInspectorContract,
  section: keyof SchemaInspectorSections,
): boolean => Boolean(contract.sections[section]);
