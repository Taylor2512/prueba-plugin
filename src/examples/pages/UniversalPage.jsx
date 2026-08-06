import React, { useCallback, useMemo, useState } from 'react';
import { SisadPdfmeInstance } from '@/sisad-pdfme';
import { useRuntimeConfig } from '../hooks/useRuntimeConfig.js';
import { useEventLog } from '../hooks/useEventLog.js';
import { useController } from '../hooks/useController.js';
import { RuntimePageShell } from './RuntimePageShell.jsx';
import { DynamicInfoPanel } from '../components/DynamicInfoPanel.jsx';
import {
  getPageConfig,
  buildPageTemplate,
  createPageHandlers,
  getPageInfo,
  getPageRoute,
} from './pageGenerator.js';

export function createUniversalPage(pageKey, dependencies) {
  const { instanceBuilders, templateBuilders, FAMILY, DEMO_DOCUMENTS, MULTI_USER_RECIPIENTS } =
    dependencies;

  return function UniversalPageComponent({ currentPath }) {
    const config = getPageConfig(pageKey);
    const runtimeConfig = useRuntimeConfig(config.instanceId);
    const { events, record, clear } = useEventLog();
    const { handleControllerReady, getController } = useController();

    const [template, setTemplate] = useState(() =>
      buildPageTemplate(config, templateBuilders, FAMILY),
    );

    const [state, setState] = useState(() => {
      const initial = {};
      if (config.state) {
        Object.entries(config.state).forEach(([key, value]) => {
          if (typeof value === 'string' && value === 'initializer') {
            initial[key] = MULTI_USER_RECIPIENTS[0]?.id ?? '';
          } else {
            initial[key] = value;
          }
        });
      }
      return initial;
    });

    const handleEvent = useCallback((event) => record(event.name, event.payload), [record]);

    const pageHandlers = useMemo(
      () =>
        createPageHandlers(config, {
          record,
          setTemplate,
          setState,
        }),
      [config, record],
    );

    const instance = useMemo(
      () =>
        instanceBuilders[config.instanceId]({
          template,
          config: runtimeConfig,
          documents: DEMO_DOCUMENTS,
          recipients: MULTI_USER_RECIPIENTS,
          activeRecipientId: state.activeRecipientId,
          onEvent: handleEvent,
          onControllerReady: handleControllerReady,
          ...pageHandlers,
        }),
      [template, runtimeConfig, state, pageHandlers, handleEvent, handleControllerReady],
    );

    useMemo(
      () =>
        getPageInfo(config, { ...state, template, events }, {
          activeRecipient: MULTI_USER_RECIPIENTS.find((r) => r.id === state.activeRecipientId),
        }),
      [config, state, template, events, MULTI_USER_RECIPIENTS],
    );

    const renderActions = () => {
      if (!config.actions?.recipientSelect || !state.activeRecipientId) return null;

      return (
        <label className="flex min-w-0 items-center">
          <span className="sr-only">Recipient activo</span>
          <select
            value={state.activeRecipientId ?? ''}
            onChange={(e) => setState((prev) => ({ ...prev, activeRecipientId: e.target.value }))}
            className="box-border h-11 w-full min-w-0 max-w-[8rem] appearance-none truncate rounded-full border border-amber-300/40 bg-amber-300/10 px-3 text-xs font-medium text-amber-100 outline-none transition hover:border-amber-300/70 focus-visible:ring-2 focus-visible:ring-amber-300/60"
          >
            {MULTI_USER_RECIPIENTS.map((recipient) => (
              <option key={recipient.id} value={recipient.id}>
                {recipient.name}
              </option>
            ))}
          </select>
        </label>
      );
    };

    return (
      <RuntimePageShell
        title={config.title}
        modeBadge={config.modeBadge}
        currentPath={currentPath || getPageRoute(pageKey)}
        actions={renderActions()}
        infoTitle="Información"
        info={
          <DynamicInfoPanel
            config={config}
            state={{ ...state, template, events }}
            context={{
              record,
              clear,
              getController,
              events,
            }}
          />
        }
        viewportName={config.viewportName}
      >
        <SisadPdfmeInstance instance={instance} />
      </RuntimePageShell>
    );
  };
}
