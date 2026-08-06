import React, { useCallback, useMemo, useState } from 'react';

import { FAMILY } from '../catalog/familyCatalog.js';
import { DEMO_DOCUMENTS } from '../fixtures/documents.js';
import { MULTI_USER_FAMILY_KEYS, MULTI_USER_RECIPIENTS } from '../fixtures/recipients.js';
import { useController } from '../hooks/useController.js';
import { useEventLog } from '../hooks/useEventLog.js';
import { useRuntimeConfig } from '../hooks/useRuntimeConfig.js';
import { createDesignerMultiUserInstance } from '../instances/Instances.js';
import { buildMultiUserShowcaseTemplate } from '../builders/multiUserShowcase.js';
import { ROUTE_PATHS } from '../routes/routeDefinitions.js';
import { DesignerMultiUserInfo } from './DesignerMultiUserInfo.jsx';
import { RuntimePageShell } from './RuntimePageShell.jsx';
import { SisadPdfmeInstance } from '@/sisad-pdfme';

function RecipientSelect({ value, onChange }) {
  return (
    <label className="flex min-w-0 items-center">
      <span className="sr-only">Recipient activo</span>
      <select
        data-testid="recipient-select"
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

export function DesignerMultiUserPage({ currentPath = ROUTE_PATHS.designerMultiUser }) {
  const [activeRecipientId, setActiveRecipientId] = useState(MULTI_USER_RECIPIENTS[0]?.id ?? '');
  const [template, setTemplate] = useState(() =>
    buildMultiUserShowcaseTemplate(
      FAMILY.filter((family) => MULTI_USER_FAMILY_KEYS.includes(family.key)).map((family) => ({
        title: family.title,
        types: family.types,
      })),
    ),
  );
  const [assignments, setAssignments] = useState(0);
  const config = useRuntimeConfig('designer-multi-user');
  const { events, record, clear } = useEventLog();
  const { handleControllerReady, getController } = useController();
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

  const designerMultiUserInstance = useMemo(
    () =>
      createDesignerMultiUserInstance({
        template,
        activeRecipientId,
        config,
        documents: DEMO_DOCUMENTS,
        recipients: MULTI_USER_RECIPIENTS,
        onTemplateChange: setTemplate,
        onSave: handleSave,
        onControllerReady: handleControllerReady,
        onEvent: handleEvent,
        onRecipientsChange: handleRecipientsChange,
        onActiveRecipientChange: handleActiveRecipientChange,
        onAssignmentChange: handleAssignmentChange,
      }),
    [
      activeRecipientId,
      config,
      handleActiveRecipientChange,
      handleAssignmentChange,
      handleControllerReady,
      handleEvent,
      handleRecipientsChange,
      handleSave,
      template,
    ],
  );

  return (
    <RuntimePageShell
      title="Designer · flujo multiusuario"
      modeBadge="colaboración"
      currentPath={currentPath}
      actions={<RecipientSelect value={activeRecipientId} onChange={setActiveRecipientId} />}
      infoTitle="Participantes y contexto"
      info={
        <DesignerMultiUserInfo
          activeRecipient={activeRecipient}
          recipients={MULTI_USER_RECIPIENTS}
          documents={DEMO_DOCUMENTS}
          assignments={assignments}
          events={events}
          onClear={clear}
          getController={getController}
        />
      }
      viewportName="designer-multi-user"
    >
      <SisadPdfmeInstance instance={designerMultiUserInstance} />
    </RuntimePageShell>
  );
}
