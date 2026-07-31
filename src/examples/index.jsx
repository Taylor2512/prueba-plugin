/**
 * Páginas, UI y config de integración de los ejemplos.
 *
 * La lógica reusable vive en `sisad-pdfme` y el contrato global se lee desde
 * JSON puro. Este archivo concentra la integración pública de examples para
 * minimizar la superficie de archivos.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getInputFromTemplate } from '@sisad-pdfme/common';
import { SisadPdfmeDesigner, SisadPdfmeForm, SisadPdfmeViewer } from '@/sisad-pdfme/react';
import { SISAD_PDFME_HOST_SURFACE_CLASS } from '@/sisad-pdfme/react/hostSurface';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  DEMO_DOCUMENTS,
  FAMILY_EXAMPLES,
  MULTI_USER_FAMILY_KEYS,
  MULTI_USER_RECIPIENTS,
  IMMERSIVE_ROUTE_OPTIONS,
  PRIMARY_ROUTE_GROUPS,
  buildMultiUserShowcaseTemplate,
  buildShowcaseTemplate,
} from '@/sisad-pdfme/labs';
import examplesConfig from './config/sisad-pdfme.examples.json';

const isPlainObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function deepMerge(base, patch) {
  const result = { ...base };

  for (const [key, value] of Object.entries(patch)) {
    const current = result[key];
    result[key] = isPlainObject(current) && isPlainObject(value)
      ? deepMerge(current, value)
      : value;
  }

  return result;
}

export const EXAMPLE_CONFIG_PROFILES = Object.keys(examplesConfig.profiles);

export function createRuntimeConfig(profile, overrides = {}) {
  const base = structuredClone(examplesConfig.base);
  const profilePatch = structuredClone(profile ? examplesConfig.profiles[profile] : {});

  return deepMerge(deepMerge(base, profilePatch), overrides);
}

const ROUTE_PATHS = {
  catalog: '/',
  singleUser: '/examples/designer/single-user',
  multiUser: '/examples/designer/multi-user',
  form: '/examples/runtime/form',
  viewer: '/examples/runtime/viewer',
  schemas: '/examples/schemas',
};

const PRIMARY_ROUTE_DEFINITIONS = [
  {
    id: 'catalog',
    path: ROUTE_PATHS.catalog,
    title: 'Catálogo',
    description: 'Entrada principal a las demostraciones.',
    shell: 'documentation',
    render: () => <CatalogPage />,
  },
  {
    id: 'single-user',
    path: ROUTE_PATHS.singleUser,
    title: 'Designer: un usuario',
    description: 'Template completo con todas las familias.',
    shell: 'immersive',
    render: () => <DesignerSingleUserPage />,
  },
  {
    id: 'multi-user',
    path: ROUTE_PATHS.multiUser,
    title: 'Designer: multiusuario',
    description: 'Colaboración y recipient activo.',
    shell: 'immersive',
    render: () => <DesignerMultiUserPage />,
  },
  {
    id: 'form',
    path: ROUTE_PATHS.form,
    title: 'Runtime: Form',
    description: 'Modo de llenado.',
    shell: 'immersive',
    render: () => <RuntimeFormPage />,
  },
  {
    id: 'viewer',
    path: ROUTE_PATHS.viewer,
    title: 'Runtime: Viewer',
    description: 'Modo de solo lectura.',
    shell: 'immersive',
    render: () => <RuntimeViewerPage />,
  },
  {
    id: 'schemas',
    path: ROUTE_PATHS.schemas,
    title: 'Schemas',
    description: 'Catálogo por familia.',
    shell: 'documentation',
    render: () => <SchemasCatalogPage />,
  },
];

const buildFamilyRouteDefinitions = (families) =>
  families.map((family) => ({
    id: family.key,
    path: `/examples/schemas/${family.slug}`,
    title: family.title,
    description: family.description,
    shell: 'immersive',
    render: () => <SchemaFamilyPage family={family} />,
  }));

export function getLabExamples() {
  return [...PRIMARY_ROUTE_DEFINITIONS, ...buildFamilyRouteDefinitions(FAMILY_EXAMPLES)].map((route) => ({
    id: route.id,
    path: route.path,
    title: route.title,
    description: route.description,
    shell: route.shell,
    element: route.render(),
  }));
}

export function CatalogPage() {
  return (
    <ExampleDocumentationShell
      topLabel="SISAD PDFME examples"
      title="Catálogo de ejemplos del runtime reusable"
      description="Cada ruta es data-driven, Tailwind-only en la capa externa y compone la API pública de Designer, Form y Viewer sin tocar negocio host."
      aside={
        <InfoCard
          title="Cobertura"
          description="Una sola base para documentar modos, colaboración y familias de schema."
        >
          <MetricGrid
            items={[
              { label: 'Rutas base', value: String(PRIMARY_ROUTE_DEFINITIONS.length) },
              { label: 'Familias', value: String(FAMILY_EXAMPLES.length) },
              { label: 'Modes', value: 'designer / form / viewer' },
              { label: 'Estilo externo', value: 'Tailwind only' },
            ]}
          />
        </InfoCard>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PRIMARY_ROUTE_DEFINITIONS.map((route) => (
            <RouteCard key={route.id} to={route.path} title={route.title} description={route.description} />
          ))}
        </div>
        <InfoCard
          title="Familias de schema"
          description="Las rutas de abajo se generan desde el registry de schemas del paquete y no desde listas manuales dispersas."
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {FAMILY_EXAMPLES.map((family) => (
              <RouteCard
                key={family.key}
                to={`/examples/schemas/${family.slug}`}
                title={family.title}
                description={family.description}
                extra={`${family.types.length} tipos`}
              />
            ))}
          </div>
        </InfoCard>
      </div>
    </ExampleDocumentationShell>
  );
}

export function SchemasCatalogPage() {
  return (
    <ExampleDocumentationShell
      topLabel="Schemas"
      title="Catálogo de familias y rutas especializadas"
      description="Cada familia se genera desde el registry del paquete. El catálogo permite navegar a una vista enfocada por tipo de schema sin duplicar componentes."
      aside={
        <InfoCard
          title="Rutas"
          description="Las rutas se generan desde el catálogo semántico central y se enriquecen con los tipos descubiertos en el paquete."
        >
          <MetricGrid
            items={[
              { label: 'Familias', value: String(FAMILY_EXAMPLES.length) },
              { label: 'Rutas de familias', value: String(FAMILY_EXAMPLES.length) },
              { label: 'Registry', value: 'public schema registry' },
              { label: 'Estilo', value: 'Tailwind only' },
            ]}
          />
        </InfoCard>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FAMILY_EXAMPLES.map((family) => (
            <RouteCard
              key={family.key}
              to={`/examples/schemas/${family.slug}`}
              title={family.title}
              description={family.description}
              extra={`${family.types.length} tipos`}
            />
          ))}
        </div>
        <PreviewFrame>
          <div className="grid gap-0 md:grid-cols-2">
            {FAMILY_EXAMPLES.map((family) => (
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
    </ExampleDocumentationShell>
  );
}

function RecipientSelect({ value, onChange }) {
  return (
    <label className="flex min-w-0 items-center">
      <span className="sr-only">Recipient activo</span>
      <select
        data-testid="example-recipient-select"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        className="box-border h-11 w-full min-w-0 max-w-[8rem] appearance-none truncate rounded-full border border-amber-300/40 bg-amber-300/10 px-3 text-xs font-medium text-amber-100 outline-none transition hover:border-amber-300/70 focus-visible:ring-2 focus-visible:ring-amber-300/60 md:h-9 md:max-w-[11rem]"
      >
        {MULTI_USER_RECIPIENTS.map((recipient) => (
          <option key={recipient.id} value={recipient.id} className="bg-slate-900 text-slate-100">
            {recipient.name}
          </option>
        ))}
      </select>
    </label>
  );
}

const buildFamiliesForKeys = (keys) =>
  FAMILY_EXAMPLES.filter((family) => keys.includes(family.key)).map((family) => ({
    title: family.title,
    types: family.types,
  }));

export function DesignerSingleUserPage() {
  const [template, setTemplate] = useState(() =>
    buildShowcaseTemplate(
      FAMILY_EXAMPLES.map((family) => ({ title: family.title, types: family.types })),
    ),
  );
  const [savedAt, setSavedAt] = useState(null);
  const [events, setEvents] = useState([]);
  const controllerRef = useRef(null);

  const config = useMemo(() => createRuntimeConfig('designer-single-user'), []);

  const record = useCallback((name, detail) => {
    setEvents((current) => [...current.slice(-39), { id: `${Date.now()}-${current.length}`, name, detail, at: new Date().toLocaleTimeString('es') }]);
  }, []);
  const clear = useCallback(() => setEvents([]), []);

  const handleControllerReady = useCallback((controller) => {
    controllerRef.current = controller;
  }, []);
  const getController = useCallback(() => controllerRef.current, []);

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
      currentPath={ROUTE_PATHS.singleUser}
      infoTitle="Resumen del ejemplo"
      info={
        <>
          <InfoCard
            title="Resumen"
            description="El template cambia por `onTemplateChange` para mantener la demo viva mientras editas."
          >
            <MetricGrid
              items={[
                { label: 'Páginas', value: String(pageCount) },
                { label: 'Schemas', value: String(schemaCount) },
                { label: 'Perfil', value: 'designer-single-user' },
                { label: 'Guardado', value: savedAt || 'nunca' },
              ]}
            />
          </InfoCard>
          <InfoCard
            title="Controlador"
            description="API imperativa pública: selección, alta, duplicado, borrado, asignación, snapshot y validación."
          >
            <ExampleControllerPanel getController={getController} />
          </InfoCard>
          <InfoCard title="Eventos" description="Callbacks del wrapper, tal como los recibe el host.">
            <ExampleEventLog events={events} onClear={clear} />
          </InfoCard>
          <InfoCard
            title="Familias incluidas"
            description="El page builder usa el registry para evitar listas de tipos desconectadas del runtime."
          >
            {FAMILY_EXAMPLES.map((family) => (
              <div key={family.key} className="box-border rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">{family.title}</div>
                <p className="m-0 mt-1 text-sm leading-6 text-slate-300">{family.description}</p>
                <div className="mt-3">
                  <FamilyBadgeList types={family.types} />
                </div>
              </div>
            ))}
          </InfoCard>
        </>
      }
    >
      <RuntimeViewport name="designer-single-user">
        <SisadPdfmeDesigner
          config={config}
          template={template}
          onTemplateChange={handleTemplateChange}
          onSave={handleSave}
          onControllerReady={handleControllerReady}
        />
      </RuntimeViewport>
    </ExampleImmersiveShell>
  );
}

export function DesignerMultiUserPage() {
  const [activeRecipientId, setActiveRecipientId] = useState(MULTI_USER_RECIPIENTS[0]?.id ?? '');
  const [template, setTemplate] = useState(() =>
    buildMultiUserShowcaseTemplate(
      FAMILY_EXAMPLES.filter((family) => MULTI_USER_FAMILY_KEYS.includes(family.key)).map((family) => ({
        title: family.title,
        types: family.types,
      })),
    ),
  );
  const [assignments, setAssignments] = useState(0);
  const [events, setEvents] = useState([]);
  const controllerRef = useRef(null);

  const config = useMemo(() => createRuntimeConfig('designer-multi-user'), []);
  const record = useCallback((name, detail) => {
    setEvents((current) => [...current.slice(-39), { id: `${Date.now()}-${current.length}`, name, detail, at: new Date().toLocaleTimeString('es') }]);
  }, []);
  const clear = useCallback(() => setEvents([]), []);

  const handleControllerReady = useCallback((controller) => {
    controllerRef.current = controller;
  }, []);
  const getController = useCallback(() => controllerRef.current, []);

  const handleAssignmentChange = useCallback(
    (payload) => {
      setAssignments((count) => count + 1);
      record('onAssignmentChange', { schemas: payload?.schemaIds ?? [] });
    },
    [record],
  );

  const handleActiveRecipientChange = useCallback(
    (recipient) => {
      setActiveRecipientId(recipient?.id ?? null);
      record('onActiveRecipientChange', { recipient });
    },
    [record],
  );

  const handleRecipientsChange = useCallback(
    (recipients) => record('onRecipientsChange', { recipients }),
    [record],
  );

  const handleSave = useCallback(
    () => record('onSave', { documentos: DEMO_DOCUMENTS.length }),
    [record],
  );

  const activeRecipient = MULTI_USER_RECIPIENTS.find((recipient) => recipient.id === activeRecipientId) ?? null;

  return (
    <ExampleImmersiveShell
      title="Designer · flujo multiusuario"
      modeBadge="colaboración"
      currentPath={ROUTE_PATHS.multiUser}
      actions={<RecipientSelect value={activeRecipientId} onChange={setActiveRecipientId} />}
      infoTitle="Participantes y contexto"
      info={
        <>
          <InfoCard
            title="Contexto actual"
            description="El selector del topbar solo cambia el recipient activo; no recrea la UI externa ni el runtime."
          >
            <MetricGrid
              items={[
                { label: 'Participantes', value: String(MULTI_USER_RECIPIENTS.length) },
                { label: 'Recipient', value: activeRecipient?.name || 'none' },
                { label: 'Documentos', value: String(DEMO_DOCUMENTS.length) },
                { label: 'Asignaciones', value: String(assignments) },
              ]}
            />
          </InfoCard>
          <InfoCard
            title="Participantes"
            description="El mismo template sirve para probar assignment, comentarios y cambios de recipient."
          >
            {MULTI_USER_RECIPIENTS.map((recipient) => (
              <div
                key={recipient.id}
                className="box-border flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ background: recipient.color }}
                />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">{recipient.name}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                    {recipient.id}
                  </div>
                </div>
              </div>
            ))}
          </InfoCard>
          <InfoCard
            title="Documentos"
            description="`documents.mode: multi` enruta los schemas por documento; el panel Documentos los lista."
          >
            {DEMO_DOCUMENTS.map((document) => (
              <div
                key={document.id}
                className="box-border rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
              >
                {document.label}
              </div>
            ))}
          </InfoCard>
          <InfoCard
            title="Controlador"
            description="API imperativa pública, incluida la asignación al recipient activo."
          >
            <ExampleControllerPanel getController={getController} />
          </InfoCard>
          <InfoCard title="Eventos" description="Callbacks del wrapper, tal como los recibe el host.">
            <ExampleEventLog events={events} onClear={clear} />
          </InfoCard>
        </>
      }
    >
      <RuntimeViewport name="designer-multi-user">
        <SisadPdfmeDesigner
          config={config}
          template={template}
          documents={DEMO_DOCUMENTS}
          recipients={MULTI_USER_RECIPIENTS}
          activeRecipientId={activeRecipientId}
          onTemplateChange={setTemplate}
          onSave={handleSave}
          onControllerReady={handleControllerReady}
          onRecipientsChange={handleRecipientsChange}
          onActiveRecipientChange={handleActiveRecipientChange}
          onAssignmentChange={handleAssignmentChange}
        />
      </RuntimeViewport>
    </ExampleImmersiveShell>
  );
}

export function RuntimeFormPage() {
  const template = useMemo(
    () =>
      buildShowcaseTemplate([
        {
          title: 'Runtime form',
          types: buildFamiliesForKeys(['text', 'choice', 'boolean', 'dateTime', 'signature']).flatMap(
            (family) => family.types,
          ),
        },
      ]),
    [],
  );
  const values = useMemo(() => getInputFromTemplate(template), [template]);
  const [lastInput, setLastInput] = useState('');
  const [events, setEvents] = useState([]);
  const config = useMemo(() => createRuntimeConfig('runtime-form'), []);

  const record = useCallback((name, detail) => {
    setEvents((current) => [...current.slice(-39), { id: `${Date.now()}-${current.length}`, name, detail, at: new Date().toLocaleTimeString('es') }]);
  }, []);
  const clear = useCallback(() => setEvents([]), []);

  const handleInputChange = useCallback(
    (payload) => {
      setLastInput(`${payload.name} = ${String(payload.value)}`);
      record('onInputChange', { campo: payload.name, índice: payload.index });
    },
    [record],
  );

  return (
    <ExampleImmersiveShell
      title="Runtime · Form para captura de datos"
      modeBadge="form"
      currentPath={ROUTE_PATHS.form}
      infoTitle="Captura de datos"
      info={
        <>
          <InfoCard
            title="Inputs iniciales"
            description="Los valores se derivan del template con el helper público del paquete common."
          >
            <MetricGrid
              items={[
                { label: 'Páginas', value: String(template.schemas?.length ?? 0) },
                { label: 'Inputs', value: String(values.length) },
                { label: 'Perfil', value: 'runtime-form' },
                { label: 'Último cambio', value: lastInput || 'ninguno' },
              ]}
            />
          </InfoCard>
          <InfoCard title="Eventos" description="Cada edición del formulario llega al host por `onInputChange`.">
            <ExampleEventLog events={events} onClear={clear} />
          </InfoCard>
        </>
      }
    >
      <RuntimeViewport name="runtime-form">
        <SisadPdfmeForm
          config={config}
          template={template}
          values={values}
          onInputChange={handleInputChange}
        />
      </RuntimeViewport>
    </ExampleImmersiveShell>
  );
}

export function RuntimeViewerPage() {
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
  const config = useMemo(() => createRuntimeConfig('runtime-viewer'), []);

  return (
    <ExampleImmersiveShell
      title="Runtime · Viewer de solo lectura"
      modeBadge="viewer"
      currentPath={ROUTE_PATHS.viewer}
      infoTitle="Cobertura de lectura"
      info={
        <>
          <InfoCard
            title="Lectura"
            description="Útil para revisar visualmente que no se rompan los layouts ni los prefills."
          >
            <MetricGrid
              items={[
                { label: 'Páginas', value: String(template.schemas?.length ?? 0) },
                { label: 'Perfil', value: 'runtime-viewer' },
                { label: 'Readonly', value: 'true' },
                { label: 'Global view', value: 'true' },
              ]}
            />
          </InfoCard>
          <InfoCard title="Cobertura" description="Tablas, medios y códigos sin interacción de edición.">
            <FamilyBadgeList types={template.schemas?.flat().map((schema) => schema.type) ?? []} />
          </InfoCard>
        </>
      }
    >
      <RuntimeViewport name="runtime-viewer">
        <SisadPdfmeViewer config={config} template={template} />
      </RuntimeViewport>
    </ExampleImmersiveShell>
  );
}

export function SchemaFamilyPage({ family }) {
  const [template, setTemplate] = useState(() =>
    buildShowcaseTemplate([{ title: family.title, types: family.types }]),
  );
  const config = useMemo(() => createRuntimeConfig('schema-family'), []);

  return (
    <ExampleImmersiveShell
      title={`Schemas · ${family.title}`}
      modeBadge="designer"
      currentPath={`/examples/schemas/${family.slug}`}
      infoTitle="Detalle de familia"
      info={
        <>
          <InfoCard title="Tipos" description={family.description}>
            <FamilyBadgeList types={family.types} />
          </InfoCard>
          <InfoCard
            title="Detalle de familia"
            description="La misma plantilla base se especializa solo por el subconjunto de tipos que corresponda."
          >
            <MetricGrid
              items={[
                { label: 'Tipos', value: String(family.types.length) },
                { label: 'Slug', value: family.slug },
                { label: 'Perfil', value: 'schema-family' },
                { label: 'Generación', value: 'data-driven' },
              ]}
            />
          </InfoCard>
        </>
      }
    >
      <RuntimeViewport name={`schema-family-${family.slug}`}>
        <SisadPdfmeDesigner config={config} template={template} onTemplateChange={setTemplate} />
      </RuntimeViewport>
    </ExampleImmersiveShell>
  );
}

export function ExampleDocumentationShell({ title, description, topLabel, aside, children }) {
  return (
    <div
      data-example-shell="documentation"
      className="relative min-h-dvh w-full overflow-hidden bg-slate-950 font-sans text-slate-50"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,6,23,1))]" />
      <div className="relative mx-auto box-border flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8">
        <header className="box-border flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/25 backdrop-blur md:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="box-border inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
                {topLabel}
              </div>
              <h1 className="m-0 text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h1>
              <p className="m-0 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">{description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRIMARY_ROUTE_GROUPS.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    [
                      'box-border inline-flex min-h-11 items-center rounded-full border px-3 py-1.5 text-xs font-medium no-underline transition md:min-h-0',
                      isActive
                        ? 'border-amber-300/50 bg-amber-300/15 text-amber-100'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10',
                    ].join(' ')
                  }
                >
                  {route.title}
                </NavLink>
              ))}
            </div>
          </div>
        </header>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <main className="min-w-0">{children}</main>
          <aside className="min-w-0 space-y-4">{aside}</aside>
        </div>
      </div>
    </div>
  );
}

function ExampleRouteNav({ current }) {
  const navigate = useNavigate();

  return (
    <label className="flex min-w-0 items-center">
      <span className="sr-only">Ir a otro ejemplo</span>
      <select
        data-testid="example-route-nav"
        value={current}
        onChange={(event) => navigate(event.target.value)}
        className="box-border h-10 w-full min-w-0 max-w-[10rem] appearance-none truncate rounded-full border border-white/15 bg-white/5 px-3 text-xs font-medium text-slate-100 outline-none transition hover:border-white/30 focus-visible:ring-2 focus-visible:ring-amber-300/60 md:h-8 md:max-w-[15rem]"
      >
        {IMMERSIVE_ROUTE_OPTIONS.map((route) => (
          <option key={route.path} value={route.path} className="bg-slate-900 text-slate-100">
            {route.title}
          </option>
        ))}
      </select>
    </label>
  );
}

function ExampleInfoDrawer({ open, onClose, title, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div data-example-info-drawer="open" className="fixed inset-0 z-[200]">
      <button
        type="button"
        aria-label="Cerrar información"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default border-0 bg-slate-950/60 p-0 backdrop-blur-sm"
      />
      <div
        id="example-info-drawer"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        data-testid="example-info-panel"
        className="absolute inset-x-0 bottom-0 box-border flex max-h-[80dvh] flex-col rounded-t-3xl border border-white/10 bg-slate-950/95 pb-[env(safe-area-inset-bottom)] shadow-2xl shadow-black/50 outline-none backdrop-blur md:inset-y-0 md:bottom-auto md:left-auto md:right-0 md:h-dvh md:max-h-none md:w-[20rem] md:rounded-none md:rounded-l-3xl md:pb-0"
      >
        <div className="box-border flex h-12 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4">
          <h2 className="m-0 truncate text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="box-border inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-white/25 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-300/60 md:h-8 md:w-8"
          >
            <span aria-hidden="true">✕</span>
            <span className="sr-only">Cerrar</span>
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4">{children}</div>
      </div>
    </div>
  );
}

export function ExampleTopbar({
  title,
  modeBadge,
  currentPath,
  actions,
  infoOpen,
  onToggleInfo,
  infoButtonRef,
}) {
  return (
    <header
      data-example-topbar=""
      data-testid="example-topbar"
      className="box-border flex h-12 w-full min-w-0 items-center gap-2 border-b border-white/10 bg-slate-950/95 pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] backdrop-blur md:gap-3"
    >
      <Link
        to="/"
        aria-label="Volver al catálogo"
        className="box-border inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-base text-slate-200 no-underline transition hover:border-white/25 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-300/60 md:h-8 md:w-8"
      >
        <span aria-hidden="true">←</span>
      </Link>

      <div className="hidden min-w-0 flex-1 items-center gap-2 sm:flex">
        <h1 className="m-0 min-w-0 truncate text-sm font-semibold tracking-tight text-white">{title}</h1>
        <span className="box-border hidden shrink-0 rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200 lg:inline">
          {modeBadge}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:flex-none">
        {actions}
        <ExampleRouteNav current={currentPath} />
        <button
          ref={infoButtonRef}
          type="button"
          data-testid="example-info-toggle"
          aria-expanded={infoOpen}
          aria-controls="example-info-drawer"
          onClick={onToggleInfo}
          className="box-border inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 text-xs font-medium text-slate-100 transition hover:border-white/30 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-300/60 md:h-8"
        >
          <span aria-hidden="true">ⓘ</span>
          <span className="hidden md:inline">Información</span>
        </button>
      </div>
    </header>
  );
}

export function ExampleImmersiveShell({
  title,
  modeBadge,
  currentPath,
  actions,
  infoTitle,
  info,
  children,
}) {
  const [infoOpen, setInfoOpen] = useState(false);
  const infoButtonRef = useRef(null);

  return (
    <div
      data-example-shell="immersive"
      className="grid h-dvh min-h-0 w-full min-w-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-slate-950 font-sans text-slate-50"
    >
      <ExampleTopbar
        title={title}
        modeBadge={modeBadge}
        currentPath={currentPath}
        actions={actions}
        infoOpen={infoOpen}
        onToggleInfo={() => setInfoOpen((open) => !open)}
        infoButtonRef={infoButtonRef}
      />
      <main data-example-main="" className="min-h-0 min-w-0 overflow-hidden">
        {children}
      </main>
      <ExampleInfoDrawer open={infoOpen} onClose={() => setInfoOpen(false)} title={infoTitle}>
        {info}
      </ExampleInfoDrawer>
    </div>
  );
}

export function InfoCard({ title, description, children }) {
  return (
    <section className="box-border rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-black/20 backdrop-blur">
      <div className="mb-4 space-y-2">
        <h2 className="m-0 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">{title}</h2>
        {description ? <p className="m-0 text-sm leading-6 text-slate-300">{description}</p> : null}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function MetricGrid({ items }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="box-border rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
          <div className="mt-2 text-sm font-medium text-slate-100">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export function FamilyBadgeList({ types, tone = 'dark' }) {
  const toneClass =
    tone === 'light'
      ? 'border-slate-200 bg-slate-50 text-slate-700'
      : 'border-white/10 bg-white/5 text-slate-200';

  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => (
        <span
          key={type}
          className={`box-border rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClass}`}
        >
          {type}
        </span>
      ))}
    </div>
  );
}

export function RouteCard({ to, title, description, extra }) {
  return (
    <Link
      to={to}
      className="group box-border rounded-3xl border border-white/10 bg-white/5 p-5 no-underline transition hover:-translate-y-0.5 hover:border-amber-300/40 hover:bg-white/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-white">{title}</div>
          <div className="mt-2 text-sm leading-6 text-slate-300">{description}</div>
        </div>
        <span className="box-border shrink-0 rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
          Abrir
        </span>
      </div>
      {extra ? <div className="mt-4 text-xs text-slate-400">{extra}</div> : null}
    </Link>
  );
}

export function PreviewFrame({ children }) {
  return (
    <div className="box-border overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 p-3 shadow-2xl shadow-black/30">
      <div className="box-border overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/95 text-slate-900">
        {children}
      </div>
    </div>
  );
}

export function RuntimeViewport({ children, name }) {
  return (
    <div
      data-example-runtime-viewport={name}
      data-testid="example-runtime-viewport"
      className={SISAD_PDFME_HOST_SURFACE_CLASS}
    >
      {children}
    </div>
  );
}

export function ExampleEventLog({ events, onClear }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-slate-400">{events.length} eventos</span>
        <button
          type="button"
          onClick={onClear}
          className="box-border inline-flex min-h-11 items-center rounded-full border border-white/10 bg-white/5 px-3 text-xs font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-300/60 md:min-h-0 md:py-1.5"
        >
          Limpiar
        </button>
      </div>
      {events.length === 0 ? (
        <p className="m-0 text-sm leading-6 text-slate-400">
          Sin eventos todavía. Interactúa con el editor para verlos aparecer.
        </p>
      ) : (
        <ul className="m-0 list-none space-y-1 p-0" data-testid="example-event-log">
          {events.map((event) => (
            <li
              key={event.id}
              className="box-border rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-semibold text-amber-200">{event.name}</span>
                <span className="shrink-0 text-[10px] text-slate-500">{event.at}</span>
              </div>
              {event.detail ? (
                <div className="mt-1 truncate text-slate-400">{event.detail}</div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function isCapabilityState(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      typeof value.domain === 'string' &&
      typeof value.supported === 'boolean' &&
      typeof value.available === 'boolean',
  );
}

function formatCapabilityState(state) {
  const status = state.supported ? 'disponible' : 'no soportado';
  const availability = state.available ? 'activo' : 'inactivo';
  const reason = state.reason ? ` (${state.reason})` : '';
  return `${state.domain}: ${status} · ${availability}${reason}`;
}

function formatActionResult(action, value) {
  if (typeof value === 'string') return `${action.label}: ${value}`;
  if (isCapabilityState(value)) return `${action.label}: ${formatCapabilityState(value)}`;
  return `${action.label}: ok`;
}

const ACTIONS = [
  {
    id: 'capability-selection',
    label: 'Estado selection',
    run: (controller) => controller.getCapabilityState('selection'),
  },
  {
    id: 'read-template',
    label: 'Leer template',
    run: (controller) => {
      const template = controller.getTemplate();
      const pages = template?.schemas?.length ?? 0;
      const schemas = (template?.schemas ?? []).flat().length;
      return `${pages} páginas · ${schemas} schemas`;
    },
  },
  {
    id: 'snapshot',
    label: 'Leer snapshot',
    run: (controller) => {
      const snapshot = controller.getSnapshot();
      return snapshot ? `snapshot con ${Object.keys(snapshot).length} claves` : 'sin snapshot';
    },
  },
  {
    id: 'recipients',
    label: 'Listar recipients',
    run: (controller) => {
      const recipients = controller.getRecipients();
      const active = controller.getActiveRecipient();
      return `${recipients.length} recipients · activo ${active?.name ?? active?.id ?? 'ninguno'}`;
    },
  },
  {
    id: 'rotate-recipient',
    label: 'Rotar recipient activo',
    run: (controller) => {
      const recipients = controller.getRecipients();
      if (recipients.length === 0) return 'sin recipients';
      const active = controller.getActiveRecipient();
      const index = recipients.findIndex((recipient) => recipient.id === active?.id);
      const next = recipients[(index + 1) % recipients.length];
      controller.setActiveRecipient(next.id);
      return `activo → ${next.name ?? next.id}`;
    },
  },
  {
    id: 'assign',
    label: 'Asignar 1º schema al activo',
    run: (controller) => {
      const active = controller.getActiveRecipient();
      if (!active) return 'sin recipient activo';
      const first = (controller.getTemplate()?.schemas ?? []).flat()[0];
      if (!first) return 'sin schemas';
      controller.assignSchemasToRecipient([first.id], active.id);
      return `${first.name ?? first.id} → ${active.name ?? active.id}`;
    },
  },
  {
    id: 'select-first',
    label: 'Seleccionar primero',
    run: (controller) => {
      const first = (controller.getTemplate()?.schemas ?? []).flat()[0];
      if (!first) return 'sin schemas';
      controller.selectSchemas([first.id], 'replace');
      return `seleccionado ${first.name ?? first.id}`;
    },
  },
  {
    id: 'duplicate-selection',
    label: 'Duplicar selección',
    run: (controller) => {
      const selectedIds = controller.getSelectedSchemaIds();
      if (selectedIds.length === 0) return 'sin selección';
      controller.duplicateSchemas(selectedIds);
      return `${selectedIds.length} schemas duplicados`;
    },
  },
  {
    id: 'remove-selection',
    label: 'Eliminar selección',
    run: (controller) => {
      const selectedIds = controller.getSelectedSchemaIds();
      if (selectedIds.length === 0) return 'sin selección';
      controller.removeSchemas(selectedIds);
      return `${selectedIds.length} schemas eliminados`;
    },
  },
  {
    id: 'feature-state',
    label: 'Estado de feature',
    run: (controller) => {
      const state = controller.getFeatureState('assignment');
      return `assignment: ${state?.enabled ? 'activa' : 'inactiva'}`;
    },
  },
  {
    id: 'explain',
    label: 'Explicar configuración',
    run: (controller) => {
      const explanation = controller.explainConfiguration();
      return `${explanation.issues.length} issues · ${explanation.migrationIssues.length} migraciones`;
    },
  },
  {
    id: 'validate',
    label: 'Validar',
    run: async (controller) => {
      const result = await controller.validate();
      const errors = Array.isArray(result?.errors) ? result.errors.length : 0;
      return `validado · ${errors} errores`;
    },
  },
  {
    id: 'reset-config',
    label: 'Restablecer config',
    run: (controller) => {
      controller.resetConfig();
      return 'config restablecida';
    },
  },
];

export function ExampleControllerPanel({ getController }) {
  const [result, setResult] = useState('');

  const handleRun = async (action) => {
    const controller = getController();
    if (!controller) {
      setResult('El controlador aún no está listo.');
      return;
    }
    try {
      const value = await action.run(controller);
      setResult(formatActionResult(action, value));
    } catch (error) {
      setResult(`${action.label}: ${error.message}`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            data-testid={`example-controller-${action.id}`}
            onClick={() => handleRun(action)}
            className="box-border inline-flex min-h-11 items-center rounded-full border border-white/10 bg-white/5 px-3 text-xs font-medium text-slate-200 transition hover:border-amber-300/40 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-300/60 md:min-h-0 md:py-1.5"
          >
            {action.label}
          </button>
        ))}
      </div>
      <p
        role="status"
        data-testid="example-controller-result"
        className="m-0 min-h-[1.5rem] text-xs leading-6 text-slate-400"
      >
        {result}
      </p>
    </div>
  );
}

export {
  FAMILY_EXAMPLES,
  IMMERSIVE_ROUTE_OPTIONS,
  MULTI_USER_FAMILY_KEYS,
  MULTI_USER_RECIPIENTS,
  PRIMARY_ROUTE_GROUPS,
  buildMultiUserShowcaseTemplate,
  buildShowcaseTemplate,
} from '@/sisad-pdfme/labs';
