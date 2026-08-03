import React, { useCallback, useState } from 'react';

import { FAMILY_EXAMPLES } from '../catalog/familyCatalog.js';
import { buildShowcaseTemplate } from '../builders/showcaseTemplate.js';
import {
  ExampleControllerPanel,
  ExampleEventLog,
  ExampleImmersiveShell,
  ExampleInfoPanelStack,
  FamilyBadgeList,
  MetricGrid,
  RuntimeViewport,
} from '../components/exampleUi.jsx';
import { useExampleController } from '../hooks/useExampleController.js';
import { useExampleEventLog } from '../hooks/useExampleEventLog.js';
import { useExampleRuntimeConfig } from '../hooks/useExampleRuntimeConfig.js';
import { EXAMPLE_ROUTE_PATHS } from '../routes/routeDefinitions.js';
import { SisadPdfmeDesigner } from '@/sisad-pdfme/react';

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

  const pageCount = template.schemas?.length ?? 0;
  const schemaCount = template.schemas?.flat().length ?? 0;

  return (
    <ExampleImmersiveShell
      title="Designer · una persona, todas las familias"
      modeBadge="designer"
      currentPath={currentPath}
      infoTitle="Resumen del ejemplo"
      info={
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
              render: () => <ExampleEventLog events={events} onClear={clear} />,
            },
            {
              key: 'families',
              title: 'Familias incluidas',
              description: 'El page builder usa el registry para evitar listas de tipos desconectadas del runtime.',
              render: () => (
                <div className="space-y-3">
                  {FAMILY_EXAMPLES.map((family) => (
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
      }
    >
      <RuntimeViewport name="designer-single-user">
        <SisadPdfmeDesigner
          config={config}
          template={template}
          onTemplateChange={handleTemplateChange}
          onSave={handleSave}
          onControllerReady={handleControllerReady}
          onEvent={handleEvent}
        />
      </RuntimeViewport>
    </ExampleImmersiveShell>
  );
}
