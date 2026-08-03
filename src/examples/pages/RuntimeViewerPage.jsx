import React, { useMemo } from 'react';

import { ExampleImmersiveShell, ExampleInfoPanelStack, FamilyBadgeList, MetricGrid, RuntimeViewport } from '../components/exampleUi.jsx';
import { buildShowcaseTemplate } from '../builders/showcaseTemplate.js';
import { buildFamiliesForKeys } from '../helpers/familyGroups.js';
import { useExampleRuntimeConfig } from '../hooks/useExampleRuntimeConfig.js';
import { EXAMPLE_ROUTE_PATHS } from '../routes/routeDefinitions.js';
import { SisadPdfmeViewer } from '@/sisad-pdfme/react';

export function RuntimeViewerPage({ currentPath = EXAMPLE_ROUTE_PATHS.runtimeViewer }) {
  const template = useMemo(
    () =>
      buildShowcaseTemplate([
        {
          title: 'Runtime viewer',
          types: buildFamiliesForKeys(['text', 'table', 'media', 'barcode', 'shape']).flatMap(
            (family) => family.types,
          ),
        },
      ]),
    [],
  );
  const config = useExampleRuntimeConfig('runtime-viewer');

  return (
    <ExampleImmersiveShell
      title="Runtime · Viewer de solo lectura"
      modeBadge="viewer"
      currentPath={currentPath}
      infoTitle="Cobertura de lectura"
      info={
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
      }
    >
      <RuntimeViewport name="runtime-viewer">
        <SisadPdfmeViewer config={config} template={template} />
      </RuntimeViewport>
    </ExampleImmersiveShell>
  );
}
