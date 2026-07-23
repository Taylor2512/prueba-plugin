import { createLabExample } from '../createLabExample.ts';
import {
  appendTemplatePages,
  createAuditMetadata,
  createCollaboration,
  createCommentAnchor,
  createStandardCheckboxSchema,
  createStandardSelectSchema,
  createStandardTextSchema,
  createTemplate,
  createLabSchemaShowcasePages,
  EXTENDED_SCHEMA_EXAMPLE_OVERRIDES,
  getTemplatePdfUrl,
} from './labCatalogFixtures.ts';

const LAB_PDFS = {
  generator: getTemplatePdfUrl('test.pdf'),
};

const createTextSchema = createStandardTextSchema;
const createSelectSchema = createStandardSelectSchema;
const createCheckboxSchema = createStandardCheckboxSchema;

const createGeneratorShowcasePages = (config) =>
  createLabSchemaShowcasePages(config, EXTENDED_SCHEMA_EXAMPLE_OVERRIDES);

const generatorRuntimeTemplate = createTemplate([
  [
    createTextSchema({
      schemaUid: 'generator-customer-name',
      name: 'customer_name',
      content: 'Taylor Demo',
      ownerMode: 'single',
      ownerRecipientId: 'generator-user-1',
      ...createAuditMetadata('generator-user-1', 'generator-user-1', 0),
    }),
    createSelectSchema({
      schemaUid: 'generator-plan',
      name: 'plan',
      content: 'enterprise',
      options: ['basic', 'pro', 'enterprise'],
      ownerMode: 'multi',
      ownerRecipientIds: ['generator-user-1', 'generator-user-2'],
      ...createAuditMetadata('generator-user-1', 'generator-user-2', 45000),
      commentsCount: 1,
      comments: [
        {
          id: 'comment-generator-1',
          authorName: 'Conversión',
          timestamp: 1713572000000,
          text: 'Validar el plan antes de generar el PDF final.',
        },
      ],
      commentAnchors: [
        createCommentAnchor({ schemaUid: 'generator-plan', pageNumber: 1, x: 18, y: 46 }),
      ],
      commentsAnchors: [
        createCommentAnchor({ schemaUid: 'generator-plan', pageNumber: 1, x: 18, y: 46 }),
      ],
    }),
    createCheckboxSchema({
      schemaUid: 'generator-terms',
      name: 'accept_terms',
      content: 'true',
      y: 64,
      ownerMode: 'shared',
      ownerRecipientIds: ['generator-user-1', 'generator-user-2'],
      ...createAuditMetadata('generator-user-1', 'generator-user-2', 90000),
    }),
  ],
], { basePdf: LAB_PDFS.generator, pageCount: 3 })

const generatorShowcasePages = createGeneratorShowcasePages({
  scope: 'generator-showcase',
  ownerRecipientId: 'generator-user-1',
  startingPageNumber: generatorRuntimeTemplate.schemas.length + 1,
  auditOffset: 360000,
})

const generatorRuntimeShowcaseTemplate = appendTemplatePages(generatorRuntimeTemplate, generatorShowcasePages)

export const BASIC_SIGNATURE_PROVIDERS = [
  {
    key: 'provider.remoto.tenantA',
    label: 'Tenant A Sign',
    description: 'Proveedor remoto embebido para pruebas del lab.',
    capabilities: {
      supportsVisibleSignature: true,
      supportsWebhook: true,
      supportsPolling: false,
      supportsCertificateMetadata: false,
      supportsReason: true,
      supportsLocation: false,
      supportsOtp: true,
      supportsBiometric: false,
    },
    defaultConfig: {
      flow: 'embedded',
      visibleSignature: true,
      baseUrl: 'https://firma.tenant-a.example.com',
    },
    configFields: [
      { key: 'baseUrl', label: 'Base URL', type: 'text', required: true },
      {
        key: 'flow',
        label: 'Flow',
        type: 'select',
        required: true,
        options: [
          { label: 'Embedded', value: 'embedded' },
          { label: 'Redirect', value: 'redirect' },
        ],
      },
      { key: 'visibleSignature', label: 'Firma visible', type: 'switch' },
    ],
  },
]

export const generatorRuntimeLabExample = createLabExample({
  id: 'generator-runtime',
  path: '/lab/generator-runtime',
  title: 'Runtime integral',
  description: 'Ruta integral en modo form para probar captura, generación, conversión y revisión de todos los schemas disponibles.',
  status: 'Listo para generar PDF, convertir y validar todos los schemas desde un solo runtime',
  defaultMode: 'form',
  initialSchemaType: 'select',
  collaboration: createCollaboration('generator-user-1', [
    { id: 'generator-user-1', name: 'Formulario', role: 'owner', team: 'automation-team', color: '#2563EB' },
    { id: 'generator-user-2', name: 'Conversión', role: 'reviewer', team: 'automation-team', color: '#D946EF' },
  ], { sessionId: 'generator-runtime-session', actorId: 'generator-user-1' }),
  template: generatorRuntimeShowcaseTemplate,
  runtimeOptions: {
    signatureProviders: BASIC_SIGNATURE_PROVIDERS,
  },
})