/**
 * Initials schema — signing-based preset of signature with signatureKind: 'initials'.
 * Shares all rendering, propPanel and provider registry with signature.
 * Only differences: smaller default size, different placeholder text, signatureKind.
 */
import { cloneDeep } from '@sisad-pdfme/common';
import type { Plugin, Schema } from '@sisad-pdfme/common';
import { PenLine } from 'lucide-react';
import { renderLucideIcon, createSchemaPlugin } from '@sisad-pdfme/schemas/schemaBuilder';
import baseSignature from '@sisad-pdfme/schemas/signature';
import { getCanonicalDefault } from '@sisad-pdfme/schemas/runtime-normalizer';
import { isRecord } from '@sisad-pdfme/shared/objectGuards';
import type { SignatureSchema } from '@sisad-pdfme/schemas/signature/types';

const initialsPlugin: Plugin<Schema> = createSchemaPlugin<Schema>(
  {
    ui: baseSignature.ui,
    pdf: baseSignature.pdf,
    propPanel: {
      ...baseSignature.propPanel,
      defaultSchema: ((): Schema => {
        const canonical = getCanonicalDefault(baseSignature as unknown as Plugin<Schema>, 'initials') as Partial<SignatureSchema> | null;
        return {
          ...(canonical || (typeof baseSignature.propPanel.defaultSchema === 'object' ? baseSignature.propPanel.defaultSchema : {})),
          type: 'initials',
          name: '',
          width: 22,
          height: 12,
          placeholderText: 'Iniciales aquí',
          signatureKind: 'initials',
        } as Schema;
      })(),
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
