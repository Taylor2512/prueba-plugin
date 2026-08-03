import React, { useCallback, useMemo, useState } from 'react';

import { FAMILY_EXAMPLES } from '../catalog/familyCatalog.js';
import { buildShowcaseTemplate } from '../builders/showcaseTemplate.js';
import { useExampleController } from '../hooks/useExampleController.js';
import { useExampleEventLog } from '../hooks/useExampleEventLog.js';
import { useExampleRuntimeConfig } from '../hooks/useExampleRuntimeConfig.js';
import { createDesignerSingleUserInstance } from '../instances/exampleInstances.js';
import { EXAMPLE_ROUTE_PATHS } from '../routes/routeDefinitions.js';
import { DesignerSingleUserInfo } from './DesignerSingleUserInfo.jsx';
import { RuntimePageShell } from './RuntimePageShell.jsx';
import { SisadPdfmeInstance } from '@/sisad-pdfme';

export function DesignerSingleUserPage({ currentPath = EXAMPLE_ROUTE_PATHS.designerSingleUser }) {
  const [template, setTemplate] = useState(() =>
    buildShowcaseTemplate(
      FAMILY_EXAMPLES.map((family) => ({ title: family.title, types: family.types })),
    ),
  );
  const [savedAt, setSavedAt] = useState(null);
  const config = useExampleRuntimeConfig('designer-single-user');
  const { events, record, clear } = useExampleEventLog();
  const { handleControllerReady, getController } = useExampleController();
  const handleEvent = useCallback((event) => record(event.name, event.payload), [record]);

  const handleTemplateChange = useCallback(
    (nextTemplate) => {
      setTemplate(nextTemplate);
      record('onTemplateChange', { páginas: nextTemplate?.schemas?.length ?? 0 });
    },
    [record],
  );

  const handleSave = useCallback(
    (nextTemplate) => {
      setSavedAt(new Date().toLocaleTimeString('es'));
      record('onSave', { páginas: nextTemplate?.schemas?.length ?? 0 });
    },
    [record],
  );

  const designerSingleUserInstance = useMemo(
    () =>
      createDesignerSingleUserInstance({
        template,
        config,
        onTemplateChange: handleTemplateChange,
        onSave: handleSave,
        onControllerReady: handleControllerReady,
        onEvent: handleEvent,
      }),
    [config, handleControllerReady, handleEvent, handleSave, handleTemplateChange, template],
  );

  const pageCount = template.schemas?.length ?? 0;
  const schemaCount = template.schemas?.flat().length ?? 0;

  return (
    <RuntimePageShell
      title="Designer · una persona, todas las familias"
      modeBadge="designer"
      currentPath={currentPath}
      infoTitle="Resumen del ejemplo"
      info={
        <DesignerSingleUserInfo
          pageCount={pageCount}
          schemaCount={schemaCount}
          savedAt={savedAt}
          events={events}
          onClear={clear}
          getController={getController}
          families={FAMILY_EXAMPLES}
        />
      }
      viewportName="designer-single-user"
    >
      <SisadPdfmeInstance instance={designerSingleUserInstance} />
    </RuntimePageShell>
  );
}
