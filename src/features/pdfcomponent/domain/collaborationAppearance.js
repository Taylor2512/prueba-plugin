// Re-export shim. Collaboration appearance logic moved to core
// (Fase 2 de migración features → sisad-pdfme). Removed in Fase 6.
// Default palette preserved as LAB_COLLABORATOR_PALETTE so lab colors are unchanged.
export { decorateCollaborationUsers } from '@/sisad-pdfme/collaboration/recipientPalette'
export {
  withAlpha,
  buildCollaboratorChipStyle,
  resolveCollaboratorById,
} from '@/sisad-pdfme/collaboration/appearance'
export {
  resolveSchemaOwnerColor,
  decorateSchemaWithCollaboration,
  decorateTemplateWithCollaboration,
} from '@/sisad-pdfme/collaboration/schemaOwnershipAppearance'
