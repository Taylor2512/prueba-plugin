import React from 'react';

import { InfoPanelStack, FamilyBadgeList, MetricGrid } from '../components/Ui.jsx';

export function SchemaFamilyInfo({ family }) {
  return (
    <InfoPanelStack
      panels={[
        {
          key: 'types',
          title: 'Tipos',
          description: family.description,
          render: () => <FamilyBadgeList types={family.types} />,
        },
        {
          key: 'detail',
          title: 'Detalle de familia',
          description: 'La misma plantilla base se especializa solo por el subconjunto de tipos que corresponda.',
          render: () => (
            <MetricGrid
              items={[
                { label: 'Tipos', value: String(family.types.length) },
                { label: 'Slug', value: family.slug },
                { label: 'Perfil', value: 'schema-family' },
                { label: 'Generación', value: 'data-driven' },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
