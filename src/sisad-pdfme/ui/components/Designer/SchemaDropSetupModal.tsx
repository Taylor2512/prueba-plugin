import React from 'react';
import { Alert, Input, InputNumber, Modal, Select, Space, Typography } from 'antd';
import type { Schema } from '@sisad-pdfme/common';
import type { CollaborationRecipientOption } from '../../collaborationContext.js';

type DropDraft = {
  schema: Schema;
  position: { x: number; y: number };
  name: string;
  ownerRecipientId: string;
  width: number;
  height: number;
};

type Props = {
  open: boolean;
  draft: DropDraft | null;
  existingNames: string[];
  recipients: CollaborationRecipientOption[];
  onChange: (patch: Partial<DropDraft>) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

const normalize = (value: string) => value.trim().toLowerCase();

const SchemaDropSetupModal = ({
  open,
  draft,
  existingNames,
  recipients,
  onChange,
  onCancel,
  onConfirm,
}: Props) => {
  const normalizedName = normalize(draft?.name || '');
  const duplicate = Boolean(
    normalizedName && existingNames.some((name) => normalize(name) === normalizedName),
  );
  const requiresRecipient = recipients.length > 0;
  const missingRecipient = requiresRecipient && !String(draft?.ownerRecipientId || '').trim();
  const missingName = !normalizedName;
  const hasErrors = missingName || duplicate || missingRecipient;

  return (
    <Modal
      open={open}
      title="Configurar campo nuevo"
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Crear campo"
      cancelText="Cancelar"
      okButtonProps={{ disabled: hasErrors }}
      destroyOnHidden
    >
      {draft ? (
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Typography.Text type="secondary">
            Define nombre, destinatario y tamaño antes de insertar el campo en el canvas.
          </Typography.Text>

          <div>
            <Typography.Text strong>Nombre de variable</Typography.Text>
            <Input
              value={draft.name}
              autoFocus
              onChange={(event) => onChange({ name: event.target.value })}
              placeholder="texto_01"
            />
            {missingName ? <Typography.Text type="danger">El nombre es obligatorio.</Typography.Text> : null}
            {duplicate ? <Typography.Text type="danger">El nombre ya existe en esta página.</Typography.Text> : null}
          </div>

          <div>
            <Typography.Text strong>Destinatario</Typography.Text>
            <Select
              value={draft.ownerRecipientId || undefined}
              onChange={(value) => onChange({ ownerRecipientId: String(value || '') })}
              placeholder="Selecciona destinatario"
              options={recipients.map((recipient) => ({
                label: recipient.name || recipient.id,
                value: recipient.id,
              }))}
              disabled={!requiresRecipient}
              allowClear
              style={{ width: '100%' }}
            />
            {missingRecipient ? <Typography.Text type="danger">Selecciona un destinatario.</Typography.Text> : null}
          </div>

          <Space size={8} style={{ width: '100%' }}>
            <div style={{ flex: 1 }}>
              <Typography.Text strong>Ancho</Typography.Text>
              <InputNumber
                min={1}
                value={draft.width}
                onChange={(value) => onChange({ width: Number(value || 1) })}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Typography.Text strong>Alto</Typography.Text>
              <InputNumber
                min={1}
                value={draft.height}
                onChange={(value) => onChange({ height: Number(value || 1) })}
                style={{ width: '100%' }}
              />
            </div>
          </Space>

          <Alert
            type="info"
            showIcon
            message={`Tipo: ${draft.schema.type}`}
            description={`Posición inicial X:${draft.position.x} Y:${draft.position.y}`}
          />
        </Space>
      ) : null}
    </Modal>
  );
};

export type { DropDraft };
export default SchemaDropSetupModal;
