import React, { useState } from 'react';

import { ExampleImmersiveShell, ExampleInfoPanelStack, FamilyBadgeList, MetricGrid, RuntimeViewport } from '../components/exampleUi.jsx';
import { buildShowcaseTemplate } from '../builders/showcaseTemplate.js';
import { useExampleRuntimeConfig } from '../hooks/useExampleRuntimeConfig.js';
import { getExampleSchemaRoute } from '../routes/routeDefinitions.js';
import { SisadPdfmeDesigner } from '@/sisad-pdfme/react';

export function SchemaFamilyPage({ family, currentPath }) {
  const [template, setTemplate] = useState(() =>
    buildShowcaseTemplate([{ title: family.title, types: family.types }]),
  );
  const config = useExampleRuntimeConfig('schema-family');

  return (
    <ExampleImmersiveShell
      title={`Schemas · ${family.title}`}
      modeBadge="designer"
      currentPath={currentPath ?? getExampleSchemaRoute(family.slug)}
      infoTitle="Detalle de familia"
      info={
        <ExampleInfoPanelStack
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
      }
    >
      <RuntimeViewport name={`schema-family-${family.slug}`}>
        <SisadPdfmeDesigner config={config} template={template} onTemplateChange={setTemplate} />
      </RuntimeViewport>
    </ExampleImmersiveShell>
  );
}
