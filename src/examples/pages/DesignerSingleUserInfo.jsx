import React from 'react';

import {
  ExampleControllerPanel,
  ExampleEventLog,
  ExampleInfoPanelStack,
  FamilyBadgeList,
  MetricGrid,
} from '../components/exampleUi.jsx';

export function DesignerSingleUserInfo({
  pageCount,
  schemaCount,
  savedAt,
  events,
  onClear,
  getController,
  families,
}) {
  return (
    <ExampleInfoPanelStack
      panels={[
        {
          key: 'summary',
          title: 'Resumen',
          description: 'El template cambia por `onTemplateChange` para mantener la demo viva mientras editas.',
          render: () => (
            <MetricGrid
              items={[
                { label: 'Páginas', value: String(pageCount) },
                { label: 'Schemas', value: String(schemaCount) },
                { label: 'Perfil', value: 'designer-single-user' },
                { label: 'Guardado', value: savedAt || 'nunca' },
              ]}
            />
          ),
        },
        {
          key: 'controller',
          title: 'Controlador',
          description: 'API imperativa pública: selección, alta, duplicado, borrado, asignación, snapshot y validación.',
          render: () => <ExampleControllerPanel getController={getController} />,
        },
        {
          key: 'events',
          title: 'Eventos',
          description: 'Callbacks del wrapper, tal como los recibe el host.',
          render: () => <ExampleEventLog events={events} onClear={onClear} />,
        },
        {
          key: 'families',
          title: 'Familias incluidas',
          description: 'El page builder usa el registry para evitar listas de tipos desconectadas del runtime.',
          render: () => (
            <div className="space-y-3">
              {families.map((family) => (
                <div key={family.key} className="box-border rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">{family.title}</div>
                  <p className="m-0 mt-1 text-sm leading-6 text-slate-300">{family.description}</p>
                  <div className="mt-3">
                    <FamilyBadgeList types={family.types} />
                  </div>
                </div>
              ))}
            </div>
          ),
        },
      ]}
    />
  );
}
