import React, { useCallback, useMemo, useState } from 'react';

import { FAMILY_EXAMPLES } from '../catalog/familyCatalog.js';
import { DEMO_DOCUMENTS } from '../fixtures/documents.js';
import { MULTI_USER_FAMILY_KEYS, MULTI_USER_RECIPIENTS } from '../fixtures/recipients.js';
import {
  ExampleControllerPanel,
  ExampleEventLog,
  ExampleInfoPanelStack,
  MetricGrid,
} from '../components/exampleUi.jsx';
import { useExampleController } from '../hooks/useExampleController.js';
import { useExampleEventLog } from '../hooks/useExampleEventLog.js';
import { useExampleRuntimeConfig } from '../hooks/useExampleRuntimeConfig.js';
import { buildMultiUserShowcaseTemplate } from '../builders/multiUserShowcase.js';
import { EXAMPLE_ROUTE_PATHS } from '../routes/routeDefinitions.js';
import { RuntimePageShell } from './RuntimePageShell.jsx';
import { SisadPdfmeDesigner } from '@/sisad-pdfme/react';

function RecipientSelect({ value, onChange }) {
  return (
    <label className="flex min-w-0 items-center">
      <span className="sr-only">Recipient activo</span>
      <select
        data-testid="example-recipient-select"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        className="box-border h-11 w-full min-w-0 max-w-[8rem] appearance-none truncate rounded-full border border-amber-300/40 bg-amber-300/10 px-3 text-xs font-medium text-amber-100 outline-none transition hover:border-amber-300/70 focus-visible:ring-2 focus-visible:ring-amber-300/60 md:h-9 md:max-w-[11rem]"
      >
        {MULTI_USER_RECIPIENTS.map((recipient) => (
          <option key={recipient.id} value={recipient.id} className="bg-slate-900 text-slate-100">
            {recipient.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export function DesignerMultiUserPage({ currentPath = EXAMPLE_ROUTE_PATHS.designerMultiUser }) {
  const [activeRecipientId, setActiveRecipientId] = useState(MULTI_USER_RECIPIENTS[0]?.id ?? '');
  const [template, setTemplate] = useState(() =>
    buildMultiUserShowcaseTemplate(
      FAMILY_EXAMPLES.filter((family) => MULTI_USER_FAMILY_KEYS.includes(family.key)).map((family) => ({
        title: family.title,
        types: family.types,
      })),
    ),
  );
  const [assignments, setAssignments] = useState(0);
  const config = useExampleRuntimeConfig('designer-multi-user');
  const { events, record, clear } = useExampleEventLog();
  const { handleControllerReady, getController } = useExampleController();
  const handleEvent = useCallback((event) => record(event.name, event.payload), [record]);

  const handleAssignmentChange = useCallback(
    (payload) => {
      setAssignments((count) => count + 1);
      record('onAssignmentChange', { schemas: payload?.schemaIds ?? [] });
    },
    [record],
  );

  const handleActiveRecipientChange = useCallback(
    (recipient) => {
      setActiveRecipientId(recipient?.id ?? null);
      record('onActiveRecipientChange', { recipient });
    },
    [record],
  );

  const handleRecipientsChange = useCallback(
    (recipients) => record('onRecipientsChange', { recipients }),
    [record],
  );

  const handleSave = useCallback(() => record('onSave', { documentos: DEMO_DOCUMENTS.length }), [record]);

  const activeRecipient = useMemo(
    () => MULTI_USER_RECIPIENTS.find((recipient) => recipient.id === activeRecipientId) ?? null,
    [activeRecipientId],
  );

  return (
    <RuntimePageShell
      title="Designer · flujo multiusuario"
      modeBadge="colaboración"
      currentPath={currentPath}
      actions={<RecipientSelect value={activeRecipientId} onChange={setActiveRecipientId} />}
      infoTitle="Participantes y contexto"
      info={
        <ExampleInfoPanelStack
          panels={[
            {
              key: 'context',
              title: 'Contexto actual',
              description: 'El selector del topbar solo cambia el recipient activo; no recrea la UI externa ni el runtime.',
              render: () => (
                <MetricGrid
                  items={[
                    { label: 'Participantes', value: String(MULTI_USER_RECIPIENTS.length) },
                    { label: 'Recipient', value: activeRecipient?.name || 'none' },
                    { label: 'Documentos', value: String(DEMO_DOCUMENTS.length) },
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
                  {MULTI_USER_RECIPIENTS.map((recipient) => (
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
                  {DEMO_DOCUMENTS.map((document) => (
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
              render: () => <ExampleControllerPanel getController={getController} />,
            },
            {
              key: 'events',
              title: 'Eventos',
              description: 'Callbacks del wrapper, tal como los recibe el host.',
              render: () => <ExampleEventLog events={events} onClear={clear} />,
            },
          ]}
        />
      }
      viewportName="designer-multi-user"
    >
      <SisadPdfmeDesigner
        config={config}
        template={template}
        documents={DEMO_DOCUMENTS}
        recipients={MULTI_USER_RECIPIENTS}
        activeRecipientId={activeRecipientId}
        onTemplateChange={setTemplate}
        onSave={handleSave}
        onControllerReady={handleControllerReady}
        onEvent={handleEvent}
        onRecipientsChange={handleRecipientsChange}
        onActiveRecipientChange={handleActiveRecipientChange}
        onAssignmentChange={handleAssignmentChange}
      />
    </RuntimePageShell>
  );
}
