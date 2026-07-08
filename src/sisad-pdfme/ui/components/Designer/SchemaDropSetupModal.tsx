import React from 'react';
import { Button, Input, Modal, Select } from 'antd';
import type { Schema } from '@sisad-pdfme/common';

type RecipientOption = {
  id: string;
  name?: string | null;
};

type SchemaDropDraft = {
  schema: Schema;
  position: { x: number; y: number };
  name: string;
  ownerRecipientId?: string;
  width?: number;
  height?: number;
};

type SchemaDropSetupModalProps = {
  open: boolean;
  draft: SchemaDropDraft;
  existingNames: string[];
  recipients: RecipientOption[];
  onChange: (_next: SchemaDropDraft) => void;
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
}: SchemaDropSetupModalProps) => {
  const normalizedName = normalize(draft.name || '');
  const hasDuplicate =
    normalizedName.length > 0 && existingNames.some((name) => normalize(String(name || '')) === normalizedName);
  const requiresRecipient = recipients.length > 0;
  const hasRecipient = String(draft.ownerRecipientId || '').trim().length > 0;
  const canConfirm = normalizedName.length > 0 && !hasDuplicate && (!requiresRecipient || hasRecipient);

  return (
    <Modal
      open={open}
      title="Configurar campo"
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <div className="flex flex-col gap-2.5">
        <Input
          placeholder="texto_01"
          value={draft.name}
          onChange={(event) => onChange({ ...draft, name: event.target.value })}
          className="rounded-xl border-slate-200 shadow-sm"
        />

        {hasDuplicate ? <div className="text-sm text-rose-600">El nombre ya existe en esta página.</div> : null}

        {requiresRecipient ? (
          <>
            <Select
              placeholder="Selecciona un destinatario"
              value={draft.ownerRecipientId || undefined}
              onChange={(value) => onChange({ ...draft, ownerRecipientId: value || '' })}
              options={recipients.map((recipient) => ({
                value: recipient.id,
                label: recipient.name || recipient.id,
              }))}
              className="rounded-xl"
            />
            {!hasRecipient ? <div className="text-sm text-amber-600">Selecciona un destinatario.</div> : null}
          </>
        ) : null}

        <div className="flex justify-end gap-2 pt-1">
          <Button onClick={onCancel} className="rounded-full border-slate-200 text-slate-700">
            Cancelar
          </Button>
          <Button type="primary" disabled={!canConfirm} onClick={onConfirm}>
            Crear campo
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SchemaDropSetupModal;
