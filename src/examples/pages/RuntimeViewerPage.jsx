import React, { useMemo } from 'react';

import { buildShowcaseTemplate } from '../builders/showcaseTemplate.js';
import { buildFamiliesForKeys } from '../helpers/familyGroups.js';
import { useRuntimeConfig } from '../hooks/useRuntimeConfig.js';
import { createRuntimeViewerInstance } from '../instances/Instances.js';
import { ROUTE_PATHS } from '../routes/routeDefinitions.js';
import { RuntimeViewerInfo } from './RuntimeViewerInfo.jsx';
import { RuntimePageShell } from './RuntimePageShell.jsx';
import { SisadPdfmeInstance } from '@/sisad-pdfme';

export function RuntimeViewerPage({ currentPath = ROUTE_PATHS.runtimeViewer }) {
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
  const config = useRuntimeConfig('runtime-viewer');
  const runtimeViewerInstance = useMemo(
    () => createRuntimeViewerInstance({ template, config }),
    [config, template],
  );

  return (
    <RuntimePageShell
      title="Runtime · Viewer de solo lectura"
      modeBadge="viewer"
      currentPath={currentPath}
      infoTitle="Cobertura de lectura"
      info={<RuntimeViewerInfo template={template} />}
      viewportName="runtime-viewer"
    >
      <SisadPdfmeInstance instance={runtimeViewerInstance} />
    </RuntimePageShell>
  );
}
