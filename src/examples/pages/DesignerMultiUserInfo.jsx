import React from 'react';

import {
  ControllerPanel,
  EventLog,
  InfoPanelStack,
  MetricGrid,
} from '../components/Ui.jsx';

export function DesignerMultiUserInfo({
  activeRecipient,
  recipients,
  documents,
  assignments,
  events,
  onClear,
  getController,
}) {
  return (
    <InfoPanelStack
      panels={[
        {
          key: 'context',
          title: 'Contexto actual',
          description: 'El selector del topbar solo cambia el recipient activo; no recrea la UI externa ni el runtime.',
          render: () => (
            <MetricGrid
              items={[
                { label: 'Participantes', value: String(recipients.length) },
                { label: 'Recipient', value: activeRecipient?.name || 'none' },
                { label: 'Documentos', value: String(documents.length) },
                { label: 'Asignaciones', value: String(assignments) },
              ]}
            />
          ),
        },
        {
          key: 'participants',
          title: 'Participantes',
          description: 'El mismo template sirve para probar assignment, comentarios y cambios de recipient.',
          render: () => (
            <div className="space-y-3">
              {recipients.map((recipient) => (
                <div
                  key={recipient.id}
                  className="box-border flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ background: recipient.color }}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white">{recipient.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                      {recipient.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          key: 'documents',
          title: 'Documentos',
          description: '`documents.mode: multi` enruta los schemas por documento; el panel Documentos los lista.',
          render: () => (
            <div className="space-y-3">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="box-border rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
                >
                  {document.label}
                </div>
              ))}
            </div>
          ),
        },
        {
          key: 'controller',
          title: 'Controlador',
          description: 'API imperativa pública, incluida la asignación al recipient activo.',
          render: () => <ControllerPanel getController={getController} />,
        },
        {
          key: 'events',
          title: 'Eventos',
          description: 'Callbacks del wrapper, tal como los recibe el host.',
          render: () => <EventLog events={events} onClear={onClear} />,
        },
      ]}
    />
  );
}
