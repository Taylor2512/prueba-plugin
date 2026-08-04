import React, { useMemo, useState } from 'react';

import { buildShowcaseTemplate } from '../builders/showcaseTemplate.js';
import { useExampleRuntimeConfig } from '../hooks/useExampleRuntimeConfig.js';
import { createSchemaFamilyInstance } from '../instances/exampleInstances.js';
import { getExampleSchemaRoute } from '../routes/routeDefinitions.js';
import { SchemaFamilyInfo } from './SchemaFamilyInfo.jsx';
import { RuntimePageShell } from './RuntimePageShell.jsx';
import { SisadPdfmeInstance } from '@/sisad-pdfme';

export function SchemaFamilyPage({ family, currentPath }) {
  const [template, setTemplate] = useState(() =>
    buildShowcaseTemplate([{ title: family.title, types: family.types }]),
  );
  const config = useExampleRuntimeConfig('schema-family');
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
      currentPath={currentPath ?? getExampleSchemaRoute(family.slug)}
      infoTitle="Detalle de familia"
      info={<SchemaFamilyInfo family={family} />}
      viewportName={`schema-family-${family.slug}`}
    >
      <SisadPdfmeInstance instance={schemaFamilyInstance} />
    </RuntimePageShell>
  );
}
