import React from 'react';

import { FAMILY } from '../catalog/familyCatalog.js';
import {
  DocumentationShell,
  InfoPanelStack,
  InfoCard,
  MetricGrid,
  RouteCard,
} from '../components/Ui.jsx';
import { getSchemaRoute } from '../routes/routeDefinitions.js';

export function CatalogPage({ primaryRouteDefinitions = [] }) {
  return (
    <DocumentationShell
      topLabel="SISAD PDFME "
      title="Catálogo de ejemplos del runtime reusable"
      description="Cada ruta es data-driven, Tailwind-only en la capa externa y compone la API pública de Designer, Form y Viewer sin tocar negocio host."
      aside={
        <InfoPanelStack
          panels={[
            {
              key: 'coverage',
              title: 'Cobertura',
              description: 'Una sola base para documentar modos, colaboración y familias de schema.',
              render: () => (
                <MetricGrid
                  items={[
                    { label: 'Rutas base', value: String(primaryRouteDefinitions.length) },
                    { label: 'Familias', value: String(FAMILY.length) },
                    { label: 'Modes', value: 'designer / form / viewer' },
                    { label: 'Estilo externo', value: 'Tailwind only' },
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
          {primaryRouteDefinitions.map((route) => (
            <RouteCard key={route.id} to={route.path} title={route.title} description={route.description} />
          ))}
        </div>
        <InfoCard
          title="Familias de schema"
          description="Las rutas de abajo se generan desde el registry de schemas del paquete y no desde listas manuales dispersas."
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
        </InfoCard>
      </div>
    </DocumentationShell>
  );
}
