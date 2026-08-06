import React, { useMemo, useState } from 'react';

import { buildShowcaseTemplate } from '../builders/showcaseTemplate.js';
import { useRuntimeConfig } from '../hooks/useRuntimeConfig.js';
import { createSchemaFamilyInstance } from '../instances/Instances.js';
import { getSchemaRoute } from '../routes/routeDefinitions.js';
import { SchemaFamilyInfo } from './SchemaFamilyInfo.jsx';
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
      info={<SchemaFamilyInfo family={family} />}
      viewportName={`schema-family-${family.slug}`}
    >
      <SisadPdfmeInstance instance={schemaFamilyInstance} />
    </RuntimePageShell>
  );
}
