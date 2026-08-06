import React, { useMemo, useState } from 'react';

import { buildShowcaseTemplate } from '../builders/showcaseTemplate.js';
import { useRuntimeConfig } from '../hooks/useRuntimeConfig.js';
import { createSchemaFamilyInstance } from '../instances/Instances.js';
import { getSchemaRoute } from '../routes/routeDefinitions.js';
import { FamilyBadgeList, InfoPanelStack, MetricGrid } from '../components/Ui.jsx';
import { RuntimePageShell } from './RuntimePageShell.jsx';
import { SisadPdfmeInstance } from '@/sisad-pdfme';

export function SchemaFamilyPage({ family, currentPath }) {
  const [template, setTemplate] = useState(() =>
    buildShowcaseTemplate([{ title: family.title, types: family.types }]),
  );
  const config = useRuntimeConfig('schema-family');
  const schemaFamilyInstance = useMemo(
    () =>
      createSchemaFamilyInstance({
        familySlug: family.slug,
        template,
        config,
        onTemplateChange: setTemplate,
      }),
    [config, family.slug, template],
  );

  return (
    <RuntimePageShell
      title={`Schemas · ${family.title}`}
      modeBadge="designer"
      currentPath={currentPath ?? getSchemaRoute(family.slug)}
      infoTitle="Detalle de familia"
      info={
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
      }
      viewportName={`schema-family-${family.slug}`}
    >
      <SisadPdfmeInstance instance={schemaFamilyInstance} />
    </RuntimePageShell>
  );
}
