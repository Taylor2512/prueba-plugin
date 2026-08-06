import React from 'react';

import { EventLog, InfoPanelStack, MetricGrid } from '../components/Ui.jsx';

export function RuntimeFormInfo({ template, values, lastInput, events, onClear }) {
  return (
    <InfoPanelStack
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
          render: () => <EventLog events={events} onClear={onClear} />,
        },
      ]}
    />
  );
}
