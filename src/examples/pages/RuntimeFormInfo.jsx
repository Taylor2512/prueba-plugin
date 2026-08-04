import React from 'react';

import { ExampleEventLog, ExampleInfoPanelStack, MetricGrid } from '../components/exampleUi.jsx';

export function RuntimeFormInfo({ template, values, lastInput, events, onClear }) {
  return (
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
          render: () => <ExampleEventLog events={events} onClear={onClear} />,
        },
      ]}
    />
  );
}
