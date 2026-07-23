import { text, signature } from '@sisad-pdfme/schemas';
import { createAuditMetadata } from '@/features/pdfcomponent/labs/builders/schemaFactory';
import {
  appendTemplatePages,
  createCollaboration,
  createTemplate,
} from '@/features/pdfcomponent/labs/builders/exampleTemplate';
import { createLabExample } from '../createLabExample.ts';
import { BASIC_SIGNATURE_PROVIDERS } from './generatorRuntime.ts';
import {
  BASIC_SCHEMA_EXAMPLE_OVERRIDES,
  createCatalogSchemaFactory,
  createLabSchemaShowcasePages,
  getTemplatePdfUrl,
} from './labCatalogFixtures.ts';

const LAB_PDFS = {
  basic: getTemplatePdfUrl('test.pdf'),
};

const createTextSchema = createCatalogSchemaFactory(
  text.propPanel.defaultSchema,
  { x: 18, y: 24 },
  { width: 92, height: 12 },
);

const createSignatureSchema = createCatalogSchemaFactory(
  signature.propPanel.defaultSchema,
  { x: 18, y: 88 },
  { width: 60, height: 24 },
);

const createBasicShowcasePages = (config) =>
  createLabSchemaShowcasePages(config, BASIC_SCHEMA_EXAMPLE_OVERRIDES);

const basicDesignerTemplate = createTemplate([
  [
    createTextSchema({
      schemaUid: 'basic-full-name',
      name: 'full_name',
      content: 'Ada Lovelace',
      ownerMode: 'single',
      ownerRecipientId: 'basic-user-1',
      ...createAuditMetadata('basic-user-1', 'basic-user-1', 0),
    }),
    createTextSchema({
      schemaUid: 'basic-role',
      name: 'role',
      content: 'Researcher',
      y: 40,
      fontSize: 10,
      ownerMode: 'single',
      ownerRecipientId: 'basic-user-2',
      ...createAuditMetadata('basic-user-1', 'basic-user-2', 45000),
    }),
    createSignatureSchema({
      schemaUid: 'basic-signature',
      name: 'signature',
      ownerMode: 'single',
      ownerRecipientId: 'basic-user-1',
      ...createAuditMetadata('basic-user-1', 'basic-user-1', 90000),
    }),
  ],
], { basePdf: LAB_PDFS.basic, pageCount: 3 })

const designerShowcasePages = createBasicShowcasePages({
  scope: 'designer-showcase',
  ownerRecipientId: 'basic-user-1',
  startingPageNumber: basicDesignerTemplate.schemas.length + 1,
  auditOffset: 120000,
})

const basicDesignerShowcaseTemplate = appendTemplatePages(basicDesignerTemplate, designerShowcasePages)

export const basicDesignerLabExample = createLabExample({
  id: 'basic-designer',
  path: '/lab/basic-designer',
  title: 'Editor integral',
  description: 'Ruta integral en modo designer con todos los schemas disponibles, alta de páginas, selección y edición sobre PDF real.',
  status: 'Listo para editar, agregar schemas y recorrer todos los casos de uso en una sola ruta',
  defaultMode: 'designer',
  initialSchemaType: 'text',
  collaboration: createCollaboration('basic-user-1', [
    { id: 'basic-user-1', name: 'Diseño', role: 'owner', team: 'lab-team', color: '#2563EB' },
    { id: 'basic-user-2', name: 'QA', role: 'reviewer', team: 'lab-team', color: '#D946EF' },
  ], { sessionId: 'basic-designer-session', actorId: 'basic-user-1' }),
  template: basicDesignerShowcaseTemplate,
  runtimeOptions: {
    signatureProviders: BASIC_SIGNATURE_PROVIDERS,
  },
})