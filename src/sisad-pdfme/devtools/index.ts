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
} from '@sisad-pdfme/runtime/usePdfmeRuntimeInstance';
export type {
  UsePdfmeRuntimeInstanceConfig,
  PdfmeRuntimeMode,
  PdfmeRuntimeConstructors,
  PdfmeRuntimeInstanceHandle,
} from '@sisad-pdfme/runtime/usePdfmeRuntimeInstance';

export { usePdfmeArtifacts } from '@sisad-pdfme/runtime/usePdfmeArtifacts';
export type {
  UsePdfmeArtifactsConfig,
  PdfmeArtifactsState,
} from '@sisad-pdfme/runtime/usePdfmeArtifacts';

// Runtime mode/status helpers
export {
  RUNTIME_MODES,
  DEFAULT_UX_MODES,
  isValidRuntimeMode,
  getErrorMessage,
  formatPageStatus,
  resolveInitialUxMode,
} from '@sisad-pdfme/runtime/runtimeModes';

export {
  createPdfPreflightReport,
  generatePdfWithPreflight,
} from '@sisad-pdfme/generator';

// Browser helpers
export { createObjectUrl, revokeObjectUrls } from '@sisad-pdfme/browser/objectUrls';
export { downloadUrl, downloadJson } from '@sisad-pdfme/browser/downloads';

// Templates + collaboration appearance
export { createDefaultTemplate } from '@sisad-pdfme/templates/createDefaultTemplate';
export {
  decorateCollaborationUsers,
  LAB_COLLABORATOR_PALETTE,
} from '@sisad-pdfme/collaboration/recipientPalette';
export {
  withAlpha,
  buildCollaboratorChipStyle,
  resolveCollaboratorById,
} from '@sisad-pdfme/collaboration/appearance';
export {
  resolveSchemaOwnerColor,
  decorateSchemaWithCollaboration,
  decorateTemplateWithCollaboration,
} from '@sisad-pdfme/collaboration/schemaOwnershipAppearance';
