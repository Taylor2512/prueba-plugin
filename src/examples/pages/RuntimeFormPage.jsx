import React, { useCallback, useMemo, useState } from 'react';

import { buildShowcaseTemplate } from '../builders/showcaseTemplate.js';
import { buildFamiliesForKeys } from '../helpers/familyGroups.js';
import { useExampleEventLog } from '../hooks/useExampleEventLog.js';
import { useExampleRuntimeConfig } from '../hooks/useExampleRuntimeConfig.js';
import { createRuntimeFormInstance } from '../instances/exampleInstances.js';
import { EXAMPLE_ROUTE_PATHS } from '../routes/routeDefinitions.js';
import { RuntimeFormInfo } from './RuntimeFormInfo.jsx';
import { RuntimePageShell } from './RuntimePageShell.jsx';
import { getInputFromTemplate } from '@sisad-pdfme/common';
import { SisadPdfmeInstance } from '@/sisad-pdfme';

export function RuntimeFormPage({ currentPath = EXAMPLE_ROUTE_PATHS.runtimeForm }) {
  const template = useMemo(
    () =>
      buildShowcaseTemplate([
        {
          title: 'Runtime form',
          types: buildFamiliesForKeys(['text', 'choice', 'boolean', 'dateTime', 'signature']).flatMap(
            (family) => family.types,
          ),
        },
      ]),
    [],
  );
  const values = useMemo(() => getInputFromTemplate(template), [template]);
  const [lastInput, setLastInput] = useState('');
  const config = useExampleRuntimeConfig('runtime-form');
  const { events, record, clear } = useExampleEventLog();

  const handleInputChange = useCallback(
    (payload) => {
      setLastInput(`${payload.name} = ${String(payload.value)}`);
      record('onInputChange', { campo: payload.name, índice: payload.index });
    },
    [record],
  );

  const runtimeFormInstance = useMemo(
    () =>
      createRuntimeFormInstance({
        template,
        values,
        config,
        onInputChange: handleInputChange,
      }),
    [config, handleInputChange, template, values],
  );

  return (
    <RuntimePageShell
      title="Runtime · Form para captura de datos"
      modeBadge="form"
      currentPath={currentPath}
      infoTitle="Captura de datos"
      info={<RuntimeFormInfo template={template} values={values} lastInput={lastInput} events={events} onClear={clear} />}
      viewportName="runtime-form"
    >
      <SisadPdfmeInstance instance={runtimeFormInstance} />
    </RuntimePageShell>
  );
}
