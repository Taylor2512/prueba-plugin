/**
 * Páginas del laboratorio de ejemplos.
 *
 * Hay una sola página de runtime (`RuntimePage`) parametrizada por la entrada
 * del manifest y dos páginas de documentación. Las rutas se construyen con
 * `buildRouteDefinitions()`: agregar un ejemplo es agregar una entrada al
 * manifest, no un archivo nuevo.
 */
import React, { useCallback, useMemo, useState } from 'react';

import { SisadPdfmeInstance } from '@/sisad-pdfme';
import {
  DEMO_DOCUMENTS,
  EXAMPLE_PRIMARY_ROUTES,
  EXAMPLE_ROUTE_MAP,
  FAMILY,
  FAMILY_ROUTE_CONFIG,
  FAMILY_ROUTE_GROUPS,
  MULTI_DOCUMENT_DOCUMENTS,
  MULTI_USER_RECIPIENTS,
  PRIMARY_ROUTE_GROUPS,
  getSchemaRoute,
  resolveFamilyGroups,
} from './catalog.js';
import {
  buildMultiUserShowcaseTemplate,
  buildShowcaseTemplate,
  buildSnapshotFormTemplate,
  buildSnapshotFormValues,
  buildExpandedFormTemplate,
  buildExpandedFormValues,
} from './builders.js';
import { createExampleInstance, useController, useEventLog, useRuntimeConfig } from './runtime.js';
import { createRuntimeConfig } from './catalog.js';
import {
  DocumentationShell,
  DynamicInfoPanel,
  FamilyBadgeList,
  ImmersiveShell,
  InfoCard,
  InfoPanelStack,
  MetricGrid,
  PreviewFrame,
  RouteCard,
  RuntimeViewport,
} from './ui.jsx';

/* ── Builders declarados en el manifest ───────────────────────────────── */

const TEMPLATE_BUILDERS = {
  showcaseTemplate: (config) => buildShowcaseTemplate(resolveFamilyGroups(config.template?.options)),
  multiUserShowcase: (config) => buildMultiUserShowcaseTemplate(resolveFamilyGroups(config.template?.options)),
  snapshotForm: (config) => buildSnapshotFormTemplate(config.formSnapshot),
  expandedForm: (config) => buildExpandedFormTemplate(config.formSnapshot),
};

const VALUES_BUILDERS = {
  snapshotForm: (config) => buildSnapshotFormValues(config.formSnapshot),
  expandedForm: (config) => buildExpandedFormValues(config.formSnapshot),
};

const buildFromRegistry = (registry, name, config) => {
  const builder = registry[name];
  if (!builder) throw new Error(`Builder no registrado: ${name}`);
  return builder(config);
};

/* ── Handlers declarados en el manifest ───────────────────────────────── */

const resolvePayloadValue = (payload, spec = {}) => {
  if (spec.format === 'nameValue') return `${payload?.name ?? 'campo'} = ${String(payload?.value ?? '')}`;
  if (spec.format === 'recipientId') return payload?.id ?? payload?.recipientId ?? payload ?? '';
  if (!spec.valuePath) return payload;

  return spec.valuePath.split('.').reduce((value, part) => (value == null ? undefined : value[part]), payload);
};

const HANDLER_FACTORIES = {
  setState: (spec, name, { record, setState }) => (payload) => {
    if (spec.field) {
      setState((prev) => {
        const nextValue = resolvePayloadValue(payload, spec);
        // El runtime reemite el evento sin payload al reinicializarse: ignorar
        // esos avisos evita vaciar el campo y recrear la instancia en bucle.
        if (nextValue == null || nextValue === prev[spec.field]) return prev;
        return { ...prev, [spec.field]: nextValue };
      });
    } else {
      setState(payload);
    }
    if (spec.record) record(name, payload);
  },

  setTemplate: (spec, name, { record, setTemplate }) => (nextTemplate) => {
    setTemplate(nextTemplate);
    if (spec.record) record(name, { pages: nextTemplate?.schemas?.length ?? 0 });
  },

  increment: (spec, name, { record, setState }) => (payload) => {
    setState((prev) => ({ ...prev, [spec.field]: (prev[spec.field] ?? 0) + 1 }));
    if (spec.record) record(name, payload);
  },
};

export const createPageHandlers = (config, context) =>
  Object.fromEntries(
    Object.entries(config.handlers || {})
      .map(([name, spec]) => [name, HANDLER_FACTORIES[spec.type]?.(spec, name, context)])
      .filter(([, handler]) => Boolean(handler)),
  );

const buildInitialState = (config) =>
  Object.fromEntries(
    Object.entries(config.state || {}).map(([key, value]) => [
      key,
      value === 'initializer' ? MULTI_USER_RECIPIENTS[0]?.id ?? '' : value,
    ]),
  );

/* ── Shell compartido ─────────────────────────────────────────────────── */

export function RuntimePageShell({ title, modeBadge, currentPath, actions, infoTitle, info, viewportName, children }) {
  return (
    <ImmersiveShell
      title={title}
      modeBadge={modeBadge}
      currentPath={currentPath}
      actions={actions}
      infoTitle={infoTitle}
      info={info}
    >
      <RuntimeViewport name={viewportName}>{children}</RuntimeViewport>
    </ImmersiveShell>
  );
}

/* ── Página universal de runtime ──────────────────────────────────────── */

function RecipientSelect({ value, onChange }) {
  return (
    <label className="flex min-w-0 items-center">
      <span className="sr-only">Recipient activo</span>
      <select
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        data-testid="lab-active-user-select"
        className="box-border h-11 w-full min-w-0 max-w-[8rem] appearance-none truncate rounded-full border border-amber-300/40 bg-amber-300/10 px-3 text-xs font-medium text-amber-100 outline-none transition hover:border-amber-300/70 focus-visible:ring-2 focus-visible:ring-amber-300/60"
      >
        {MULTI_USER_RECIPIENTS.map((recipient) => (
          <option key={recipient.id} value={recipient.id}>
            {recipient.name}
          </option>
        ))}
      </select>
    </label>
  );
}

/**
 * Conmutador de documento activo.
 *
 * Es el equivalente de `RecipientSelect` para la otra mitad del scope: sin él
 * `activeDocumentId` sólo podía cambiarse desde código, así que el aislamiento
 * entre documentos no era observable en navegador (RTP-510.A).
 */
function DocumentSelect({ documents, value, onChange }) {
  return (
    <label className="flex min-w-0 items-center">
      <span className="sr-only">Documento activo</span>
      <select
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        data-testid="lab-active-document-select"
        className="box-border h-11 w-full min-w-0 max-w-[9rem] appearance-none truncate rounded-full border border-sky-300/40 bg-sky-300/10 px-3 text-xs font-medium text-sky-100 outline-none transition hover:border-sky-300/70 focus-visible:ring-2 focus-visible:ring-sky-300/60"
      >
        {documents.map((document) => (
          <option key={document.id} value={document.id}>
            {document.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Documentos de la ruta: los de estructura común sólo si el ejemplo lo pide. */
const resolveRouteDocuments = (config) => {
  if (config.documents === false) return [];
  return config.documents === 'multiDocument' ? MULTI_DOCUMENT_DOCUMENTS : DEMO_DOCUMENTS;
};

export function RuntimePage({ config, currentPath }) {
  const runtimeConfig = useRuntimeConfig(config.runtimeProfile || config.instanceId);
  const { events, record, clear } = useEventLog();
  const { handleControllerReady, getController } = useController();

  const [template, setTemplate] = useState(() =>
    buildFromRegistry(TEMPLATE_BUILDERS, config.template.builder, config),
  );
  const [state, setState] = useState(() => buildInitialState(config));

  const values = useMemo(
    () => (config.values ? buildFromRegistry(VALUES_BUILDERS, config.values.builder, config) : undefined),
    [config],
  );

  const handleEvent = useCallback((event) => record(event.name, event.payload), [record]);

  const routeDocuments = useMemo(() => resolveRouteDocuments(config), [config]);

  const pageHandlers = useMemo(
    () => createPageHandlers(config, { record, setTemplate, setState }),
    [config, record],
  );

  /**
   * Configuración efectiva con el contexto de colaboración.
   *
   * `Preview` sólo aplica acceso per-user cuando encuentra
   * `options.collaboration.activeRecipientId`; si no, renderiza todos los
   * schemas sin restricción. El lab declaraba `collaboration: true` —un
   * booleano— así que ese contexto nunca llegaba y el aislamiento entre
   * Usuarios no se aplicaba aunque la plantilla trajera ownership (RTP-510).
   */
  const collaborativeConfig = useMemo(() => {
    if (!config.collaboration) return runtimeConfig;
    // `createRuntimeConfig` hace el deep-merge del perfil: usar su API de
    // overrides en vez de un spread manual evita perder ramas anidadas.
    return createRuntimeConfig(config.runtimeProfile || config.instanceId, {
      collaboration: {
        enabled: true,
        activeRecipientId: state.activeRecipientId ?? null,
      },
      recipients: { activeRecipientId: state.activeRecipientId ?? null },
    });
  }, [config.runtimeProfile, config.instanceId, config.collaboration, state.activeRecipientId, runtimeConfig]);

  const instance = useMemo(
    () =>
      createExampleInstance(
        { id: config.instanceId, mode: config.mode, collaboration: config.collaboration },
        {
          template,
          values,
          config: collaborativeConfig,
          // Un documento demo trae SU PROPIA plantilla y
          // `resolveActiveDocumentTemplate` la prefiere sobre la construida.
          // En rutas con ownership per-user eso pisaba los owners y el
          // aislamiento entre Usuarios dejaba de aplicarse (RTP-510).
          documents: routeDocuments,
          recipients: MULTI_USER_RECIPIENTS,
          activeRecipientId: state.activeRecipientId,
          activeDocumentId: state.activeDocumentId,
          onEvent: handleEvent,
          onControllerReady: handleControllerReady,
          ...pageHandlers,
        },
      ),
    // Sólo el scope activo (User × Document) altera la instancia: el resto del
    // estado de la página (contadores, último input) alimenta los paneles.
    [
      config,
      template,
      values,
      collaborativeConfig,
      runtimeConfig,
      routeDocuments,
      state.activeRecipientId,
      state.activeDocumentId,
      pageHandlers,
      handleEvent,
      handleControllerReady,
    ],
  );

  const panelContext = useMemo(
    () => ({
      ...state,
      state,
      template,
      events,
      clear,
      getController,
      activeRecipient: MULTI_USER_RECIPIENTS.find((recipient) => recipient.id === state.activeRecipientId),
    }),
    [state, template, events, clear, getController],
  );

  return (
    <RuntimePageShell
      title={config.title}
      modeBadge={config.modeBadge}
      currentPath={currentPath || config.path || EXAMPLE_ROUTE_MAP[config.id]}
      actions={
        config.actions?.recipientSelect || config.actions?.documentSelect ? (
          <div className="flex min-w-0 items-center gap-2">
            {config.actions?.recipientSelect ? (
              <RecipientSelect
                value={state.activeRecipientId}
                onChange={(activeRecipientId) => setState((prev) => ({ ...prev, activeRecipientId }))}
              />
            ) : null}
            {config.actions?.documentSelect ? (
              <DocumentSelect
                documents={routeDocuments}
                value={state.activeDocumentId}
                onChange={(activeDocumentId) => setState((prev) => ({ ...prev, activeDocumentId }))}
              />
            ) : null}
          </div>
        ) : null
      }
      infoTitle="Información"
      info={<DynamicInfoPanel config={config} context={panelContext} />}
      viewportName={config.viewportName}
    >
      <SisadPdfmeInstance instance={instance} />
    </RuntimePageShell>
  );
}

/* ── Página de familia de schemas ─────────────────────────────────────── */

export function SchemaFamilyPage({ family, currentPath }) {
  const [template, setTemplate] = useState(() =>
    buildShowcaseTemplate([{ title: family.title, types: family.types }]),
  );
  const config = useRuntimeConfig(FAMILY_ROUTE_CONFIG.runtimeProfile);

  const instance = useMemo(
    () =>
      createExampleInstance(
        { id: `${FAMILY_ROUTE_CONFIG.viewportPrefix}-${family.slug}`, mode: 'designer' },
        { template, config, onTemplateChange: setTemplate },
      ),
    [config, family.slug, template],
  );

  return (
    <RuntimePageShell
      title={`Schemas · ${family.title}`}
      modeBadge={FAMILY_ROUTE_CONFIG.modeBadge}
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
                    { label: 'Perfil', value: FAMILY_ROUTE_CONFIG.runtimeProfile },
                    { label: 'Generación', value: 'data-driven' },
                  ]}
                />
              ),
            },
          ]}
        />
      }
      viewportName={`${FAMILY_ROUTE_CONFIG.viewportPrefix}-${family.slug}`}
    >
      <SisadPdfmeInstance instance={instance} />
    </RuntimePageShell>
  );
}

/* ── Páginas de documentación ─────────────────────────────────────────── */

const FamilyGrid = () => (
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
    {FAMILY_ROUTE_GROUPS.map((route) => (
      <RouteCard
        key={route.id}
        to={route.path}
        title={route.title}
        description={route.description}
        extra={`${FAMILY.find((family) => family.key === route.id)?.types.length ?? 0} tipos`}
      />
    ))}
  </div>
);

export function CatalogPage() {
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
                    { label: 'Rutas base', value: String(PRIMARY_ROUTE_GROUPS.length) },
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
          {PRIMARY_ROUTE_GROUPS.map((route) => (
            <RouteCard key={route.id} to={route.path} title={route.title} description={route.description} />
          ))}
        </div>
        <InfoCard
          title="Familias de schema"
          description="Las rutas de abajo se generan desde el registry de schemas del paquete y no desde listas manuales dispersas."
        >
          <FamilyGrid />
        </InfoCard>
      </div>
    </DocumentationShell>
  );
}

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
                    { label: 'Rutas de familias', value: String(FAMILY_ROUTE_GROUPS.length) },
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
        <FamilyGrid />
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

/* ── Registro de rutas ────────────────────────────────────────────────── */

const PAGE_RENDERERS = {
  catalog: () => <CatalogPage />,
  schemas: () => <SchemasCatalogPage />,
};

/**
 * Deriva todas las rutas del laboratorio: las primarias del manifest y una
 * por cada familia descubierta en el registry de schemas.
 */
export const buildRouteDefinitions = () => [
  ...EXAMPLE_PRIMARY_ROUTES.map((route) => {
    const path = route.path || EXAMPLE_ROUTE_MAP[route.id] || `/${route.id}`;
    const renderPage = PAGE_RENDERERS[route.page];

    return {
      id: route.id,
      path,
      title: route.title,
      description: route.description,
      shell: route.shell || (renderPage ? 'documentation' : 'immersive'),
      render: () => (renderPage ? renderPage() : <RuntimePage config={route} currentPath={path} />),
    };
  }),
  ...FAMILY.map((family) => ({
    id: family.key,
    path: getSchemaRoute(family.slug),
    title: family.title,
    description: family.description,
    shell: FAMILY_ROUTE_CONFIG.shell,
    render: () => <SchemaFamilyPage family={family} currentPath={getSchemaRoute(family.slug)} />,
  })),
];
