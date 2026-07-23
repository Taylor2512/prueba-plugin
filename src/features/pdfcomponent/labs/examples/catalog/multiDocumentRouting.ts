import {
  checkboxGroup,
  radioGroup,
} from '@sisad-pdfme/schemas';
import {
  createCollaboration,
  createTemplate,
  createUploadedDocument as createUploadedDocumentCore,
} from '@/features/pdfcomponent/labs/builders/exampleTemplate';
import { mergeSchemaPages } from '@/features/pdfcomponent/labs/builders/schemaShowcase';
import { createLabExample } from '../createLabExample.ts';
import {
  createCatalogOptionGroupFactory,
  createAuditMetadata,
  createStandardCheckboxSchema,
  createStandardSelectSchema,
  createStandardTextSchema,
  createLabSchemaShowcasePages,
  EXTENDED_SCHEMA_EXAMPLE_OVERRIDES,
  getTemplatePdfUrl,
  SHOWCASE_SCHEMA_DEFINITIONS,
} from './labCatalogFixtures.ts';

const LAB_PDFS = {
  routingPrimary: getTemplatePdfUrl('test.pdf'),
};

const createTextSchema = createStandardTextSchema;
const createSelectSchema = createStandardSelectSchema;
const createCheckboxSchema = createStandardCheckboxSchema;

const createRadioGroupSchema = createCatalogOptionGroupFactory(
  radioGroup.propPanel.defaultSchema,
  'radioGroup',
  { x: 18, y: 84 },
);
const createCheckboxGroupSchema = createCatalogOptionGroupFactory(
  checkboxGroup.propPanel.defaultSchema,
  'checkboxGroup',
  { x: 18, y: 108 },
);

const createRoutingShowcasePages = (config) =>
  createLabSchemaShowcasePages(config, EXTENDED_SCHEMA_EXAMPLE_OVERRIDES);

const createUploadedDocument = (args) =>
  createUploadedDocumentCore({ ...args, pdfResolver: getTemplatePdfUrl });

const MULTI_DOCUMENT_ROUTING_PAGE_COUNT = 5
const routingSchemaSplitIndex = Math.ceil(SHOWCASE_SCHEMA_DEFINITIONS.length / 2)
const routingPrimarySchemaDefinitions = SHOWCASE_SCHEMA_DEFINITIONS.slice(0, routingSchemaSplitIndex)
const routingSecondarySchemaDefinitions = SHOWCASE_SCHEMA_DEFINITIONS.slice(routingSchemaSplitIndex)

const multiDocumentPrimaryBaseSchemas = [
  [
    createTextSchema({
      schemaUid: 'multi-contract-name',
      fileId: 'file-contract-a',
      fileTemplateId: 'file-contract-a',
      pageNumber: 1,
      ownerRecipientId: 'recipient-1',
      ownerMode: 'single',
      ...createAuditMetadata('recipient-1', 'recipient-1', 0),
      name: 'contract_name',
      content: 'Contrato principal',
    }),
    createTextSchema({
      schemaUid: 'multi-contract-date',
      fileId: 'file-contract-a',
      fileTemplateId: 'file-contract-a',
      ownerRecipientId: 'recipient-1',
      ownerMode: 'single',
      ...createAuditMetadata('routing-user-1', 'recipient-1', 45000),
      name: 'contract_date',
      content: '2026-05-01',
      y: 48,
    }),
    createSelectSchema({
      schemaUid: 'multi-contract-stage',
      fileId: 'file-contract-a',
      fileTemplateId: 'file-contract-a',
      pageNumber: 1,
      ownerRecipientId: 'recipient-1',
      ownerMode: 'single',
      ...createAuditMetadata('routing-user-1', 'recipient-1', 90000),
      name: 'contract_stage',
      content: 'Pendiente',
      options: ['Pendiente', 'Aprobado', 'Rechazado'],
      y: 72,
    }),
    createRadioGroupSchema({
      schemaUid: 'multi-contract-approval-mode',
      fileId: 'file-contract-a',
      fileTemplateId: 'file-contract-a',
      pageNumber: 1,
      ownerRecipientIds: ['recipient-1'],
      ownerMode: 'multi',
      ...createAuditMetadata('routing-user-1', 'recipient-1', 120000),
      name: 'approval_mode',
      groupId: 'multi-contract-approval-mode',
      group: 'multi-contract-approval-mode',
      groupName: 'Modo de aprobación',
      content: 'option_1',
      selectedOptionId: 'option_1',
      defaultSelectedOptionId: 'option_1',
      options: [
        { optionId: 'option_1', label: 'Firma' },
        { optionId: 'option_2', label: 'Revisión' },
      ],
      y: 96,
    }),
    createCheckboxGroupSchema({
      schemaUid: 'multi-contract-attachments',
      fileId: 'file-contract-a',
      fileTemplateId: 'file-contract-a',
      pageNumber: 1,
      ownerRecipientIds: ['recipient-1'],
      ownerMode: 'multi',
      ...createAuditMetadata('routing-user-1', 'recipient-1', 150000),
      name: 'required_documents',
      groupId: 'multi-contract-attachments',
      group: 'multi-contract-attachments',
      groupName: 'Documentos requeridos',
      selectedOptionIds: ['opt_1', 'opt_3'],
      options: [
        { optionId: 'opt_1', label: 'Cédula' },
        { optionId: 'opt_2', label: 'RUC' },
        { optionId: 'opt_3', label: 'Contrato firmado' },
      ],
      y: 124,
    }),
  ],
  [],
]

const multiDocumentSecondaryBaseSchemas = [
  [],
  [
    createTextSchema({
      schemaUid: 'multi-annex-name',
      fileId: 'file-contract-b',
      fileTemplateId: 'file-contract-b',
      pageNumber: 2,
      ownerRecipientIds: ['recipient-2'],
      ownerMode: 'multi',
      ...createAuditMetadata('routing-user-1', 'recipient-2', 90000),
      name: 'annex_name',
      content: 'Anexo técnico',
    }),
    createTextSchema({
      schemaUid: 'multi-annex-sign',
      fileId: 'file-contract-b',
      fileTemplateId: 'file-contract-b',
      pageNumber: 2,
      ownerRecipientIds: ['recipient-2'],
      ownerMode: 'multi',
      ...createAuditMetadata('routing-user-1', 'recipient-2', 135000),
      name: 'annex_sign',
      content: 'Firmado',
      y: 48,
    }),
    createCheckboxSchema({
      schemaUid: 'multi-annex-check',
      fileId: 'file-contract-b',
      fileTemplateId: 'file-contract-b',
      pageNumber: 2,
      ownerRecipientIds: ['recipient-2'],
      ownerMode: 'multi',
      ...createAuditMetadata('routing-user-1', 'recipient-2', 160000),
      name: 'annex_confirm',
      content: 'true',
      y: 72,
    }),
    createSelectSchema({
      schemaUid: 'multi-annex-select',
      fileId: 'file-contract-b',
      fileTemplateId: 'file-contract-b',
      pageNumber: 2,
      ownerRecipientIds: ['recipient-2'],
      ownerMode: 'multi',
      ...createAuditMetadata('routing-user-1', 'recipient-2', 190000),
      name: 'annex_status',
      content: 'En revisión',
      options: ['En revisión', 'Aprobado', 'Observado'],
      y: 96,
    }),
  ],
]

const multiDocumentPrimaryShowcaseSchemas = createRoutingShowcasePages({
  definitions: routingPrimarySchemaDefinitions,
  scope: 'routing-primary-showcase',
  ownerRecipientId: 'recipient-1',
  fileId: 'file-contract-a',
  fileTemplateId: 'file-contract-a',
  startingPageNumber: 3,
  auditOffset: 180000,
})

const multiDocumentSecondaryShowcaseSchemas = createRoutingShowcasePages({
  definitions: routingSecondarySchemaDefinitions,
  scope: 'routing-secondary-showcase',
  ownerRecipientId: 'recipient-2',
  fileId: 'file-contract-b',
  fileTemplateId: 'file-contract-b',
  startingPageNumber: 3,
  auditOffset: 360000,
})

const multiDocumentPrimarySchemas = mergeSchemaPages(
  multiDocumentPrimaryBaseSchemas,
  multiDocumentPrimaryShowcaseSchemas,
  MULTI_DOCUMENT_ROUTING_PAGE_COUNT,
)

const multiDocumentSecondarySchemas = mergeSchemaPages(
  multiDocumentSecondaryBaseSchemas,
  multiDocumentSecondaryShowcaseSchemas,
  MULTI_DOCUMENT_ROUTING_PAGE_COUNT,
)

const multiDocumentRoutingTemplate = createTemplate(
  mergeSchemaPages(
    multiDocumentPrimarySchemas,
    multiDocumentSecondarySchemas,
    MULTI_DOCUMENT_ROUTING_PAGE_COUNT,
    160,
  ),
  {
    basePdf: LAB_PDFS.routingPrimary,
    pageCount: MULTI_DOCUMENT_ROUTING_PAGE_COUNT,
  },
)

const multiDocumentRoutingDocuments = [
  createUploadedDocument({
    id: 'file-contract-a',
    name: 'Declaración de datos',
    pdfFileName: 'test.pdf',
    pageCount: MULTI_DOCUMENT_ROUTING_PAGE_COUNT,
    schemas: multiDocumentPrimarySchemas,
  }),
  createUploadedDocument({
    id: 'file-contract-b',
    name: 'Certificado académico',
    pdfFileName: 'test.pdf',
    pageCount: MULTI_DOCUMENT_ROUTING_PAGE_COUNT,
    schemas: multiDocumentSecondarySchemas,
  }),
]

export const multiDocumentRoutingLabExample = createLabExample({
  id: 'multi-document-routing',
  path: '/lab/multi-document-routing',
  title: 'Multidocumento integral',
  description: 'Ruta integral para asignaciones por documento, página y destinatario con carga de múltiples PDFs, handoff entre archivos y showcase de todos los schemas integrados.',
  status: 'Listo para validar rutas multidocumento y cobertura completa de schemas en un solo flujo',
  defaultMode: 'designer',
  initialSchemaType: 'text',
  collaboration: createCollaboration('recipient-1', [
    { id: 'recipient-1', name: 'Cliente Principal', role: 'signer', color: '#2563EB' },
    { id: 'recipient-2', name: 'Avalista', role: 'signer', color: '#D946EF' },
    { id: 'routing-user-1', name: 'Mesa de entrega', role: 'coordinator', color: '#F97316' },
  ], { sessionId: 'multi-document-routing-session', actorId: 'routing-user-1' }),
  template: multiDocumentRoutingTemplate,
  runtimeOptions: {
    activeDocumentId: 'file-contract-a',
    rightSidebarViewMode: 'docs',
    uploadedDocuments: multiDocumentRoutingDocuments,
    visibility: {
      sidebars: {
        right: {
          panels: {
            documents: true,
          },
        },
      },
    },
  },
})