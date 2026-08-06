import React from 'react';

import { FAMILY } from '../catalog/familyCatalog.js';
import {
  DocumentationShell,
  InfoPanelStack,
  FamilyBadgeList,
  PreviewFrame,
  RouteCard,
  MetricGrid,
} from '../components/Ui.jsx';
import { getSchemaRoute } from '../routes/routeDefinitions.js';

export function SchemasCatalogPage() {
  return (
    <DocumentationShell
      topLabel="Schemas"
      title="Catálogo de familias y rutas especializadas"
      description="Cada familia se genera desde el registry del paquete. El catálogo permite navegar a una vista enfocada por tipo de schema sin duplicar componentes."
      aside={
        <InfoPanelStack
          panels={[
            {
              key: 'routes',
              title: 'Rutas',
              description:
                'Las rutas se generan desde el catálogo semántico central y se enriquecen con los tipos descubiertos en el paquete.',
              render: () => (
                <MetricGrid
                  items={[
                    { label: 'Familias', value: String(FAMILY.length) },
                    { label: 'Rutas de familias', value: String(FAMILY.length) },
                    { label: 'Registry', value: 'public schema registry' },
                    { label: 'Estilo', value: 'Tailwind only' },
                  ]}
                />
              ),
            },
          ]}
        />
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FAMILY.map((family) => (
            <RouteCard
              key={family.key}
              to={getSchemaRoute(family.slug)}
              title={family.title}
              description={family.description}
              extra={`${family.types.length} tipos`}
            />
          ))}
        </div>
        <PreviewFrame>
          <div className="grid gap-0 md:grid-cols-2">
            {FAMILY.map((family) => (
              <div
                key={family.key}
                className="box-border border-b border-slate-200 p-5 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <div className="text-sm font-semibold text-slate-900">{family.title}</div>
                <p className="m-0 mt-2 text-sm leading-6 text-slate-600">{family.description}</p>
                <div className="mt-3">
                  <FamilyBadgeList types={family.types} tone="light" />
                </div>
              </div>
            ))}
          </div>
        </PreviewFrame>
      </div>
    </DocumentationShell>
  );
}
