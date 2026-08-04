import React from 'react';

import { ExampleInfoPanelStack, FamilyBadgeList, MetricGrid } from '../components/exampleUi.jsx';

export function RuntimeViewerInfo({ template }) {
  return (
    <ExampleInfoPanelStack
      panels={[
        {
          key: 'reading',
          title: 'Lectura',
          description: 'Útil para revisar visualmente que no se rompan los layouts ni los prefills.',
          render: () => (
            <MetricGrid
              items={[
                { label: 'Páginas', value: String(template.schemas?.length ?? 0) },
                { label: 'Perfil', value: 'runtime-viewer' },
                { label: 'Readonly', value: 'true' },
                { label: 'Global view', value: 'true' },
              ]}
            />
          ),
        },
        {
          key: 'coverage',
          title: 'Cobertura',
          description: 'Tablas, medios y códigos sin interacción de edición.',
          render: () => <FamilyBadgeList types={template.schemas?.flat().map((schema) => schema.type) ?? []} />,
        },
      ]}
    />
  );
}
