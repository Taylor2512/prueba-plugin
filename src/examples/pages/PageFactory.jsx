import React, { useCallback, useMemo, useState } from 'react';
import { RuntimePageShell } from './RuntimePageShell.jsx';
import { useRuntimeConfig } from '../hooks/useRuntimeConfig.js';
import { useEventLog } from '../hooks/useEventLog.js';
import { useController } from '../hooks/useController.js';
import { SisadPdfmeInstance } from '@/sisad-pdfme';

export function createPageComponent(config) {
  const {
    instanceId,
    title,
    modeBadge,
    viewportName,
    infoComponent: InfoComponent,
    instanceBuilder,
    templateBuilder,
    defaultPath,
    selectors,
    handlers: customHandlers,
  } = config;

  return function PageComponent({ currentPath = defaultPath }) {
    const [template, setTemplate] = useState(() => templateBuilder?.());
    const [state, setState] = useState({});
    const runtimeConfig = useRuntimeConfig(instanceId);
    const { events, record, clear } = useEventLog();
    const { handleControllerReady } = useController();

    const handleEvent = useCallback((event) => record(event.name, event.payload), [record]);

    const handlers = useMemo(() => {
      const defaults = {
        onEvent: handleEvent,
        onControllerReady: handleControllerReady,
      };

      if (customHandlers) {
        return Object.entries(customHandlers).reduce(
          (acc, [key, handlerFactory]) => ({
            ...acc,
            [key]: handlerFactory?.({ record, setTemplate, setState, state, template }) || handlerFactory,
          }),
          defaults,
        );
      }

      return defaults;
    }, [handleEvent, handleControllerReady, record, state, template]);

    const instance = useMemo(
      () =>
        instanceBuilder({
          template,
          config: runtimeConfig,
          ...handlers,
          ...state,
        }),
      [template, runtimeConfig, handlers, state],
    );

    const infoProps = useMemo(() => {
      if (!selectors) return { events, onClear: clear };
      return Object.entries(selectors).reduce(
        (acc, [key, selector]) => ({
          ...acc,
          [key]: selector({ template, state, events }),
        }),
        { events, onClear: clear },
      );
    }, [template, state, events, clear]);

    return (
      <RuntimePageShell
        title={title}
        modeBadge={modeBadge}
        currentPath={currentPath}
        infoTitle={config.infoTitle}
        info={<InfoComponent {...infoProps} />}
        viewportName={viewportName}
        actions={config.actions?.(state)}
      >
        <SisadPdfmeInstance instance={instance} />
      </RuntimePageShell>
    );
  };
}
