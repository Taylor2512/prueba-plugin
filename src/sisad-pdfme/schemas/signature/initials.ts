/**
 * Initials schema — signing-based preset of signature with signatureKind: 'initials'.
 * Shares all rendering, propPanel and provider registry with signature.
 * Only differences: smaller default size, different placeholder text, signatureKind.
 */
import { cloneDeep } from '@sisad-pdfme/common';
import type { Plugin } from '@sisad-pdfme/common';
import { PenLine } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '../schemaBuilder.js';
import baseSignature from './index.js';
import type { SignatureSchema } from './types.js';

const initialsPlugin: Plugin<SignatureSchema> = createSchemaPlugin<SignatureSchema>(
  {
    ui: baseSignature.ui,
    pdf: baseSignature.pdf,
    propPanel: {
      ...baseSignature.propPanel,
      defaultSchema: {
        ...cloneDeep(baseSignature.propPanel.defaultSchema as SignatureSchema),
        type: 'initials',
        name: '',
        width: 22,
        height: 12,
        placeholderText: 'Iniciales aquí',
        signatureKind: 'initials' as unknown as never,
        strokeColor: '#1a56a0',
        borderColor: '#93c5fd',
        backgroundColor: '#eff6ff',
      },
    },
    icon: renderLucideIcon(PenLine, { stroke: '#1a56a0' }),
  },
  {
    key: 'initials',
    type: 'initials',
    label: 'Iniciales',
    category: 'Firma',
    tags: ['initials', 'signature', 'signing'],
    capabilities: ['designer', 'form', 'viewer'],
  },
);

export default initialsPlugin;
