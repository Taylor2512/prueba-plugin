import type { SchemaForUI } from '@sisad-pdfme/common';
import type { SchemaDesignerConfig } from '../../../../designerEngine.js';
import { getSchemaStateLabel, getSchemaTypeLabel } from '../../shared/designerLabels.js';

type HeaderSummary = {
  tags: Array<{ label: string; color: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue' }>;
  overflowTooltip: string;
  positionLabel: string;
  contextLabel: string;
  statusLabel: string;
  schemaName: string;
  schemaType: string;
  recipientColor: string | null;
};

/** Build the short metadata tooltip shown on the "+N" overflow indicator. */
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

export const buildDetailHeaderSummary = (
  activeSchema: SchemaForUI,
  schemaConfig: SchemaDesignerConfig | null | undefined,
): HeaderSummary => {
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
  const recipientColor =
    typeof activeSchema.ownerColor === 'string' && activeSchema.ownerColor.trim()
      ? activeSchema.ownerColor.trim()
      : typeof (activeSchema as SchemaForUI & { userColor?: string }).userColor === 'string'
        ? ((activeSchema as SchemaForUI & { userColor?: string }).userColor ?? null)
        : null;

  const tags: HeaderSummary['tags'] = [];
  if (!schemaName.trim()) tags.push({ label: 'Sin nombre', color: 'warning' });
  const statusLabel =
    activeSchema.readOnly || schemaHidden
      ? 'Solo lectura'
      : activeSchema.lock || activeSchema.state === 'locked'
        ? String((activeSchema.lock as { lockedBy?: string } | undefined)?.lockedBy || '').trim() &&
          String((activeSchema.lock as { lockedBy?: string } | undefined)?.lockedBy || '').trim() ===
            String(activeSchema.ownerRecipientId || '').trim()
          ? 'En edición'
          : 'Bloqueado para edición'
        : schemaConfig?.persistence?.enabled || activeSchema.saveValue !== false
          ? 'Guardado'
          : 'Cambios pendientes';
  const statusColor =
    statusLabel === 'Guardado'
      ? 'success'
      : statusLabel === 'En edición'
        ? 'processing'
        : statusLabel === 'Bloqueado para edición'
        ? 'warning'
        : statusLabel === 'Solo lectura'
          ? 'gold'
          : 'processing';
  tags.push({ label: statusLabel, color: statusColor });

  const posX = Number((activeSchema.position?.x ?? 0).toFixed(1));
  const posY = Number((activeSchema.position?.y ?? 0).toFixed(1));
  const contextParts: string[] = [];
  if (ownerLabel) contextParts.push(ownerLabel);
  if (fileId) contextParts.push(`Doc. ${fileId}`);
  if (pageNumber > 0) contextParts.push(`Pág. ${pageNumber}`);

  return {
    tags,
    overflowTooltip: buildMetaTooltip(activeSchema, schemaConfig),
    positionLabel: `${posX},${posY}`,
    contextLabel: contextParts.join(' · '),
    statusLabel,
    schemaName,
    schemaType,
    recipientColor,
  };
};
