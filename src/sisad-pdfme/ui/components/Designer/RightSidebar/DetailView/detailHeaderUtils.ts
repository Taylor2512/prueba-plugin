/**
 * detailHeaderUtils — helpers puros para construir el resumen del header.
 *
 * Centraliza etiquetas de estado, tooltip de metadata, posición, propietario y
 * color del schema activo. No depende de React ni de Ant Design, por lo que puede
 * reutilizarse en tests, previews o documentación del inspector.
 */
import type { SchemaForUI } from '@sisad-pdfme/common';
import type { SchemaDesignerConfig } from '@sisad-pdfme/ui/designerEngine';
import { getSchemaStateLabel, getSchemaTypeLabel } from '@sisad-pdfme/ui/components/Designer/shared/designerLabels';
import { resolveSchemaInteractionState } from '@sisad-pdfme/ui/components/Designer/shared/schemaInteractionState';
import type { EffectiveCollaborationContext } from '@sisad-pdfme/ui/collaborationContext';
import { normalizeText } from '@sisad-pdfme/shared/text';

/**
 * Resumen normalizado usado por `DetailHeaderCard`.
 */
type HeaderSummary = {
  tags: Array<{ label: string; color: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue' }>;
  overflowTooltip: string;
  positionLabel: string;
  contextLabel: string;
  statusLabel: string;
  schemaName: string;
  schemaType: string;
  recipientColor: string | null;
  uid: string;
  ownerName: string;
};

/** Build the short metadata tooltip shown on the "+N" overflow indicator. */
/**
 * Construye el tooltip de metadata técnica para el indicador de overflow.
 *
 * @param activeSchema Schema activo del inspector.
 * @param schemaConfig Configuración designer asociada al schema.
 * @returns Texto multilinea con metadata disponible o fallback.
 */
export const buildMetaTooltip = (
  activeSchema: SchemaForUI,
  schemaConfig: SchemaDesignerConfig | null | undefined,
): string => {
  const lines: string[] = [];
  const uid =
    typeof activeSchema.schemaUid === 'string' && activeSchema.schemaUid.trim()
      ? activeSchema.schemaUid.trim()
      : String(activeSchema.id || '').slice(0, 8);
  if (uid) lines.push(`UID: ${uid}`);
  const createdBy = typeof activeSchema.createdBy === 'string' ? activeSchema.createdBy.trim() : '';
  const modifiedBy = typeof activeSchema.lastModifiedBy === 'string' ? activeSchema.lastModifiedBy.trim() : '';
  if (createdBy) lines.push(`Creado por: ${createdBy}`);
  if (modifiedBy) lines.push(`Modificado: ${modifiedBy}`);
  if (activeSchema.ownerRecipientId) lines.push(`Propietario: ${activeSchema.ownerRecipientId}`);
  if (activeSchema.state) lines.push(`Estado: ${getSchemaStateLabel(activeSchema.state)}`);
  if (activeSchema.ownerMode) lines.push(`Modo de propiedad: ${activeSchema.ownerMode}`);
  if (schemaConfig?.persistence?.enabled) lines.push('Persistencia activa');
  if (schemaConfig?.api?.enabled) lines.push('API activa');
  if (schemaConfig?.form?.enabled) lines.push('JSON del formulario activo');
  if (schemaConfig?.prefill?.enabled) lines.push('Rellenado previo activo');
  return lines.join('\n') || 'Sin metadatos adicionales';
};

/**
 * Normaliza nombre, tipo, estado, posición, contexto y color del header.
 *
 * @param activeSchema Schema activo del inspector.
 * @param schemaConfig Configuración designer asociada al schema.
 * @returns Resumen listo para renderizar por `DetailHeaderCard`.
 */
export const buildDetailHeaderSummary = (
  activeSchema: SchemaForUI,
  schemaConfig: SchemaDesignerConfig | null | undefined,
  collaborationContext?: Pick<
    EffectiveCollaborationContext,
    'recipientOptions' | 'recipientColorMap' | 'recipientNameMap' | 'activeRecipientId' | 'isGlobalView' | 'actorColor' | 'canEditStructure'
  > | null,
): HeaderSummary => {
  const interactionState = resolveSchemaInteractionState(activeSchema, {
    collaborationContext: collaborationContext || undefined,
  });
  const schemaName = typeof activeSchema.name === 'string' ? activeSchema.name : 'Campo';
  const schemaType = getSchemaTypeLabel(activeSchema.type || 'schema');
  const schemaHidden = (activeSchema as SchemaForUI & { hidden?: boolean }).hidden === true;
  const ownerLabel =
    typeof activeSchema.ownerRecipientName === 'string' && activeSchema.ownerRecipientName.trim()
      ? activeSchema.ownerRecipientName.trim()
      : typeof activeSchema.ownerRecipientId === 'string' && activeSchema.ownerRecipientId.trim()
        ? activeSchema.ownerRecipientId.trim()
        : '';
  const fileId =
    typeof activeSchema.fileId === 'string' && activeSchema.fileId.trim()
      ? activeSchema.fileId.trim()
      : typeof activeSchema.fileTemplateId === 'string' && activeSchema.fileTemplateId.trim()
        ? activeSchema.fileTemplateId.trim()
        : '';
  const pageNumber = typeof activeSchema.pageNumber === 'number' && Number.isFinite(activeSchema.pageNumber) ? Math.trunc(activeSchema.pageNumber) : 0;
  const explicitOwnerColor =
    normalizeText((activeSchema as SchemaForUI & { ownerColor?: string }).ownerColor) ||
    normalizeText((activeSchema as SchemaForUI & { recipientColor?: string }).recipientColor) ||
    normalizeText((activeSchema as SchemaForUI & { userColor?: string }).userColor) ||
    normalizeText((activeSchema as SchemaForUI & { __designer?: { ownerColor?: string; recipientColor?: string; collaboration?: { recipientColor?: string } } }).__designer?.collaboration?.recipientColor) ||
    normalizeText((activeSchema as SchemaForUI & { __designer?: { ownerColor?: string; recipientColor?: string; collaboration?: { recipientColor?: string } } }).__designer?.ownerColor) ||
    normalizeText((activeSchema as SchemaForUI & { __designer?: { ownerColor?: string; recipientColor?: string; collaboration?: { recipientColor?: string } } }).__designer?.recipientColor);
  const recipientColor = interactionState.ownerColor || explicitOwnerColor || null;

  const tags: HeaderSummary['tags'] = [];
  if (!schemaName.trim()) tags.push({ label: 'Sin nombre', color: 'warning' });
  const statusLabel =
    schemaHidden
      ? 'Solo lectura'
      : interactionState.statusLabel !== 'Disponible'
        ? interactionState.statusLabel
        : schemaConfig?.persistence?.enabled || activeSchema.saveValue !== false
          ? 'Guardado'
          : 'Cambios pendientes';
  const statusColor =
    interactionState.visibleBadge?.color ||
    (statusLabel === 'Guardado'
      ? 'success'
      : statusLabel === 'Solo lectura'
        ? 'gold'
        : statusLabel.includes('Bloqueado') || statusLabel.includes('Bloqueo') || statusLabel.includes('Posición')
        ? 'warning'
        : 'processing');
  tags.push({ label: statusLabel, color: statusColor });

  const posX = Number((activeSchema.position?.x ?? 0).toFixed(1));
  const posY = Number((activeSchema.position?.y ?? 0).toFixed(1));
  const contextParts: string[] = [];
  if (ownerLabel) contextParts.push(ownerLabel);
  if (fileId) contextParts.push(`Doc. ${fileId}`);
  if (pageNumber > 0) contextParts.push(`Pág. ${pageNumber}`);

  const uid =
    typeof activeSchema.schemaUid === 'string' && activeSchema.schemaUid.trim()
      ? activeSchema.schemaUid.trim()
      : String(activeSchema.id || '').slice(0, 8);

  return {
    tags,
    overflowTooltip: buildMetaTooltip(activeSchema, schemaConfig),
    positionLabel: `${posX},${posY}`,
    contextLabel: contextParts.join(' · '),
    statusLabel,
    schemaName,
    schemaType,
    recipientColor,
    uid,
    ownerName: ownerLabel,
  };
};
