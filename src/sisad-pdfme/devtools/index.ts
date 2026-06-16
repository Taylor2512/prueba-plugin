/**
 * Opt-in devtools surface for sisad-pdfme.
 *
 * This barrel re-exports the reusable runtime building blocks that a host can
 * use to assemble its own workbench (lab, playground, internal tooling). It is
 * intentionally NOT imported by the core runtime and is NOT part of any default
 * package entry — importing from `@/sisad-pdfme/devtools` is an explicit choice,
 * so it never adds weight to the production designer/form/viewer bundle.
 *
 * Lab UI (landing pages, cards, hero, routes, copy) deliberately stays in the
 * host (`src/features/pdfcomponent`). Only generic, parametrized logic lives
 * here.
 */

// Runtime lifecycle + artifacts
export {
  usePdfmeRuntimeInstance,
  getTemplateSignature,
  scheduleDestroyInstance,
} from '../runtime/usePdfmeRuntimeInstance.js';
export type {
  UsePdfmeRuntimeInstanceConfig,
  PdfmeRuntimeMode,
  PdfmeRuntimeConstructors,
  PdfmeRuntimeInstanceHandle,
} from '../runtime/usePdfmeRuntimeInstance.js';

export { usePdfmeArtifacts } from '../runtime/usePdfmeArtifacts.js';
export type {
  UsePdfmeArtifactsConfig,
  PdfmeArtifactsState,
} from '../runtime/usePdfmeArtifacts.js';

// Runtime mode/status helpers
export {
  RUNTIME_MODES,
  DEFAULT_UX_MODES,
  isValidRuntimeMode,
  getErrorMessage,
  formatPageStatus,
  resolveInitialUxMode,
} from '../runtime/runtimeModes.js';

// Example/fixture builders
export {
  sanitizeIdentifier,
  chunkItems,
  createSchema,
  createSchemaByType,
  createCommentAnchor,
  createAuditMetadata,
  DEFAULT_AUDIT_BASE_TIMESTAMP,
} from '../examples/builders/schemaFactory.js';
export {
  SHOWCASE_GRID_POSITIONS,
  rectsIntersect,
  mergeSchemaPages,
  createSchemaShowcasePages,
} from '../examples/builders/schemaShowcase.js';
export {
  createTemplate,
  appendTemplatePages,
  createUploadedDocument,
  createCollaboration,
  createExample,
  cloneExample,
} from '../examples/builders/exampleTemplate.js';

// Bundle export
export {
  buildExampleBundle,
  getExampleBundleFilename,
  inlineTemplateBasePdf,
  inlineRuntimeOptionsBasePdfs,
} from '../examples/export/buildExampleBundle.js';
export { buildExampleHref, downloadExampleBundle } from '../examples/export/downloadExampleBundle.js';
export {
  createPdfPreflightReport,
  generatePdfWithPreflight,
} from '../generator/index.js';

// Browser helpers
export { createObjectUrl, revokeObjectUrls } from '../browser/objectUrls.js';
export { downloadUrl, downloadJson, downloadBytes } from '../browser/downloads.js';

// Templates + collaboration appearance
export { createDefaultTemplate } from '../templates/createDefaultTemplate.js';
export {
  decorateCollaborationUsers,
  LAB_COLLABORATOR_PALETTE,
} from '../collaboration/recipientPalette.js';
export {
  withAlpha,
  buildCollaboratorChipStyle,
  resolveCollaboratorById,
} from '../collaboration/appearance.js';
export {
  resolveSchemaOwnerColor,
  decorateSchemaWithCollaboration,
  decorateTemplateWithCollaboration,
} from '../collaboration/schemaOwnershipAppearance.js';
