import React, { useCallback, useMemo, useState } from 'react';

import { buildShowcaseTemplate } from '../builders/showcaseTemplate.js';
import { buildFamiliesForKeys } from '../helpers/familyGroups.js';
import { ExampleEventLog, ExampleInfoPanelStack, MetricGrid } from '../components/exampleUi.jsx';
import { useExampleEventLog } from '../hooks/useExampleEventLog.js';
import { useExampleRuntimeConfig } from '../hooks/useExampleRuntimeConfig.js';
import { EXAMPLE_ROUTE_PATHS } from '../routes/routeDefinitions.js';
import { RuntimePageShell } from './RuntimePageShell.jsx';
import { getInputFromTemplate } from '@sisad-pdfme/common';
import { SisadPdfmeForm } from '@/sisad-pdfme/react';

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

  return (
    <RuntimePageShell
      title="Runtime · Form para captura de datos"
      modeBadge="form"
      currentPath={currentPath}
      infoTitle="Captura de datos"
      info={
        <ExampleInfoPanelStack
          panels={[
            {
              key: 'inputs',
              title: 'Inputs iniciales',
              description: 'Los valores se derivan del template con el helper público del paquete common.',
              render: () => (
                <MetricGrid
                  items={[
                    { label: 'Páginas', value: String(template.schemas?.length ?? 0) },
                    { label: 'Inputs', value: String(values.length) },
                    { label: 'Perfil', value: 'runtime-form' },
                    { label: 'Último cambio', value: lastInput || 'ninguno' },
                  ]}
                />
              ),
            },
            {
              key: 'events',
              title: 'Eventos',
              description: 'Cada edición del formulario llega al host por `onInputChange`.',
              render: () => <ExampleEventLog events={events} onClear={clear} />,
            },
          ]}
        />
      }
      viewportName="runtime-form"
    >
      <SisadPdfmeForm config={config} template={template} values={values} onInputChange={handleInputChange} />
    </RuntimePageShell>
  );
}
