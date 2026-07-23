import { createLabExample } from '../createLabExample.ts';
import {
  BASIC_SCHEMA_EXAMPLE_OVERRIDES,
  appendTemplatePages,
  createAuditMetadata,
  createCollaboration,
  createCommentAnchor,
  createStandardTextSchema,
  createTemplate,
  createLabSchemaShowcasePages,
  getTemplatePdfUrl,
} from './labCatalogFixtures.ts';

const LAB_PDFS = {
  enterprise: getTemplatePdfUrl('test.pdf'),
  multiuser: getTemplatePdfUrl('test.pdf'),
};

const BASE_COLLABORATION_TIMESTAMP = 1713570000000;

const createTextSchema = createStandardTextSchema;

const createCollaborationShowcasePages = (config) =>
  createLabSchemaShowcasePages(config, BASIC_SCHEMA_EXAMPLE_OVERRIDES);

const enterpriseCollaborationTemplate = createTemplate([
  [
    createTextSchema({
      schemaUid: 'enterprise-company-name',
      fileTemplateId: 'enterprise-contract',
      fileId: 'enterprise-contract',
      name: 'company_name',
      content: 'Taylor Holdings',
      ownerMode: 'multi',
      ownerRecipientId: 'sales-team',
      ownerRecipientIds: ['sales-team', 'legal-team'],
      ...createAuditMetadata('sales-user-1', 'legal-user-1', 5000),
      commentsCount: 1,
      comments: [
        {
          id: 'comment-enterprise-1',
          authorName: 'QA',
          timestamp: 1713571200000,
          text: 'Revisar el identificador fiscal antes de cerrar.',
        },
      ],
      commentAnchors: [
        createCommentAnchor({ schemaUid: 'enterprise-company-name', fileId: 'enterprise-contract', pageNumber: 1 }),
      ],
      commentsAnchors: [
        createCommentAnchor({ schemaUid: 'enterprise-company-name', fileId: 'enterprise-contract', pageNumber: 1 }),
      ],
    }),
    createTextSchema({
      schemaUid: 'enterprise-contract-status',
      fileTemplateId: 'enterprise-contract',
      fileId: 'enterprise-contract',
      name: 'contract_status',
      content: 'Pendiente',
      ownerMode: 'single',
      ownerRecipientId: 'ops-user-1',
      ...createAuditMetadata('ops-user-1', 'ops-user-1', 12000),
      state: 'locked',
      lock: {
        lockedBy: 'ops-user-1',
        lockedAt: 1713571260000,
        reason: 'Aprobacion final',
      },
      y: 42,
    }),
  ],
], { basePdf: LAB_PDFS.enterprise, pageCount: 2 })

const multiuserShowcasePages = createCollaborationShowcasePages({
  scope: 'multiuser-showcase',
  ownerRecipientId: 'sales-user-1',
  fileId: 'multiuser-contract',
  fileTemplateId: 'multiuser-contract',
  startingPageNumber: 3,
  auditOffset: 120000,
})

const multiuserCollaborationTemplate = appendTemplatePages(
  createTemplate(
    [
      [
        createTextSchema({
          schemaUid: 'multiuser-owner-name',
          fileTemplateId: 'multiuser-contract',
          fileId: 'multiuser-contract',
          name: 'owner_name',
          content: 'Sales owner',
          ownerMode: 'single',
          ownerRecipientId: 'sales-user-1',
          ...createAuditMetadata('sales-user-1', 'sales-user-1', 0),
        }),
        createTextSchema({
          schemaUid: 'multiuser-team-note',
          fileTemplateId: 'multiuser-contract',
          fileId: 'multiuser-contract',
          name: 'team_note',
          content: 'Legal review in progress',
          ownerRecipientId: 'legal-user-1',
          ownerMode: 'multi',
          ownerRecipientIds: ['sales-user-1', 'legal-user-1'],
          ...createAuditMetadata('sales-user-1', 'legal-user-1', 30000),
          commentAnchors: [
            createCommentAnchor({ schemaUid: 'multiuser-team-note', fileId: 'multiuser-contract', pageNumber: 1, x: 12, y: 40 }),
          ],
          commentsAnchors: [
            createCommentAnchor({ schemaUid: 'multiuser-team-note', fileId: 'multiuser-contract', pageNumber: 1, x: 12, y: 40 }),
          ],
          commentsCount: 1,
          comments: [
            {
              id: 'comment-multiuser-1',
              authorName: 'Legal',
              timestamp: 1713571600000,
              text: 'Alinear cláusula de confidencialidad con el borrador final.',
            },
          ],
          y: 40,
        }),
      ],
      [
        createTextSchema({
          schemaUid: 'multiuser-shared-summary',
          fileTemplateId: 'multiuser-contract',
          fileId: 'multiuser-contract',
          name: 'shared_summary',
          content: 'Visible to all collaborators',
          ownerMode: 'shared',
          ownerRecipientIds: ['sales-user-1', 'legal-user-1', 'ops-user-1'],
          ...createAuditMetadata('sales-user-1', 'ops-user-1', 60000),
          commentAnchors: [
            createCommentAnchor({ schemaUid: 'multiuser-shared-summary', fileId: 'multiuser-contract', pageNumber: 2, x: 12, y: 0 }),
          ],
          commentsAnchors: [
            createCommentAnchor({ schemaUid: 'multiuser-shared-summary', fileId: 'multiuser-contract', pageNumber: 2, x: 12, y: 0 }),
          ],
          commentsCount: 2,
          comments: [
            {
              id: 'comment-multiuser-2',
              authorName: 'Ops',
              timestamp: 1713571660000,
              text: 'Confirmar que el texto quede bloqueado tras aprobación.',
            },
            {
              id: 'comment-multiuser-3',
              authorName: 'Sales',
              timestamp: 1713571720000,
              text: 'Compartido con todos los usuarios activos del editor.',
            },
          ],
        }),
        createTextSchema({
          schemaUid: 'multiuser-locked-approval',
          fileTemplateId: 'multiuser-contract',
          fileId: 'multiuser-contract',
          name: 'approval_status',
          content: 'Locked for final approval',
          ownerMode: 'multi',
          ownerRecipientIds: ['legal-user-1', 'ops-user-1'],
          ...createAuditMetadata('legal-user-1', 'ops-user-1', 90000),
          state: 'locked',
          lock: {
            lockedBy: 'ops-user-1',
            lockedAt: BASE_COLLABORATION_TIMESTAMP + 135000,
            reason: 'Aprobacion final',
          },
          y: 40,
        }),
      ],
    ],
    { basePdf: LAB_PDFS.multiuser, pageCount: 2 },
  ),
  multiuserShowcasePages,
)

const collaborationShowcasePages = createCollaborationShowcasePages({
  scope: 'collaboration-showcase',
  ownerRecipientId: 'ops-user-1',
  fileId: 'enterprise-contract',
  fileTemplateId: 'enterprise-contract',
  startingPageNumber: 3,
  auditOffset: 240000,
})

const enterpriseCollaborationShowcaseTemplate = appendTemplatePages(
  appendTemplatePages(enterpriseCollaborationTemplate, collaborationShowcasePages),
  multiuserCollaborationTemplate.schemas,
)

export const enterpriseCollaborationLabExample = createLabExample({
  id: 'enterprise-collaboration',
  path: '/lab/enterprise-collaboration',
  title: 'Colaboración integral',
  description: 'Ruta integral para ownership, comentarios, locks y revisión colaborativa, incluyendo showcase completo de schemas en contexto enterprise.',
  status: 'Preparado para validar colaboración, bloqueo y cobertura total de schemas sobre PDF real',
  defaultMode: 'designer',
  initialSchemaType: 'text',
  collaboration: createCollaboration('ops-user-1', [
    { id: 'sales-user-1', name: 'Equipo de Ventas', role: 'editor', team: 'sales-team', color: '#2563EB' },
    { id: 'legal-user-1', name: 'Equipo Legal', role: 'reviewer', team: 'legal-team', color: '#D946EF' },
    { id: 'ops-user-1', name: 'Operaciones', role: 'admin', team: 'ops-team', color: '#F97316' },
  ], { sessionId: 'enterprise-collaboration-session', actorId: 'ops-user-1' }),
  template: enterpriseCollaborationShowcaseTemplate,
})

export const multiuserCollaborationLabExample = createLabExample({
  id: 'multiuser-collaboration',
  path: '/lab/multiuser-collaboration',
  title: 'Colaboración multiusuario',
  description: 'Ruta integral para validar ownership, comentarios, bloqueo y vista activa por usuario sobre un PDF colaborativo real.',
  status: 'Preparado para validar la interacción multiusuario con ownership y comentarios en contexto compartido',
  defaultMode: 'designer',
  initialSchemaType: 'text',
  collaboration: createCollaboration('sales-user-1', [
    { id: 'sales-user-1', name: 'Ventas Ejecutivas', role: 'editor', team: 'sales-team', color: '#2563EB' },
    { id: 'legal-user-1', name: 'Legal', role: 'reviewer', team: 'legal-team', color: '#D946EF' },
    { id: 'ops-user-1', name: 'Operaciones', role: 'admin', team: 'ops-team', color: '#F97316' },
  ], { sessionId: 'multiuser-collaboration-session', actorId: 'sales-user-1' }),
  template: multiuserCollaborationTemplate,
})