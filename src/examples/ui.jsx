import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { SISAD_PDFME_HOST_SURFACE_CLASS } from '@/sisad-pdfme/react/hostSurface';
import { FAMILY, IMMERSIVE_ROUTE_OPTIONS, PRIMARY_ROUTE_GROUPS } from './catalog.js';

export function DocumentationShell({ title, description, topLabel, aside, children }) {
  return (
    <div
      data--shell="documentation"
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

function RouteNav({ current }) {
  const navigate = useNavigate();

  return (
    <label className="flex min-w-0 items-center">
      <span className="sr-only">Ir a otro ejemplo</span>
      <select
        data-testid="-route-nav"
        value={current}
        onChange={(event) => navigate(event.target.value)}
        className="box-border h-11 w-full min-w-0 max-w-[10rem] appearance-none truncate rounded-full border border-white/15 bg-white/5 px-3 text-xs font-medium text-slate-100 outline-none transition hover:border-white/30 focus-visible:ring-2 focus-visible:ring-amber-300/60 md:h-9 md:max-w-[15rem]"
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

function InfoDrawer({ open, onClose, title, children }) {
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
    <div data--info-drawer="open" className="fixed inset-0 z-[200]">
      <button
        type="button"
        aria-label="Cerrar información"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default border-0 bg-slate-950/60 p-0 backdrop-blur-sm"
      />
      <div
        id="-info-drawer"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        data-testid="-info-panel"
        className="absolute inset-x-0 bottom-0 box-border flex max-h-[80dvh] flex-col rounded-t-3xl border border-white/10 bg-slate-950/95 pb-[env(safe-area-inset-bottom)] shadow-2xl shadow-black/50 outline-none backdrop-blur md:inset-y-0 md:bottom-auto md:left-auto md:right-0 md:h-dvh md:max-h-none md:w-[20rem] md:rounded-none md:rounded-l-3xl md:pb-0"
      >
        <div className="box-border flex h-12 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4">
          <h2 className="m-0 truncate text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="box-border inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-white/25 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-300/60 md:h-9 md:w-9"
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

export function Topbar({
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
      data--topbar=""
      data-testid="-topbar"
      className="box-border flex h-12 w-full min-w-0 items-center gap-2 border-b border-white/10 bg-slate-950/95 pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] backdrop-blur md:gap-3"
    >
      <Link
        to="/"
        aria-label="Volver al catálogo"
        className="box-border inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-base text-slate-200 no-underline transition hover:border-white/25 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-300/60 md:h-9 md:w-9"
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
        <RouteNav current={currentPath} />
        <button
          ref={infoButtonRef}
          type="button"
          data-testid="-info-toggle"
          aria-expanded={infoOpen}
          aria-controls="-info-drawer"
          onClick={onToggleInfo}
          className="box-border inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 text-xs font-medium text-slate-100 transition hover:border-white/30 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-300/60 md:h-9"
        >
          <span aria-hidden="true">ⓘ</span>
          <span className="hidden md:inline">Información</span>
        </button>
      </div>
    </header>
  );
}

export function ImmersiveShell({
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
      data--shell="immersive"
      className="grid h-dvh min-h-0 w-full min-w-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-slate-950 font-sans text-slate-50"
    >
      <Topbar
        title={title}
        modeBadge={modeBadge}
        currentPath={currentPath}
        actions={actions}
        infoOpen={infoOpen}
        onToggleInfo={() => setInfoOpen((open) => !open)}
        infoButtonRef={infoButtonRef}
      />
      <main data--main="" className="min-h-0 min-w-0 overflow-hidden">
        {children}
      </main>
      <InfoDrawer open={infoOpen} onClose={() => setInfoOpen(false)} title={infoTitle}>
        {info}
      </InfoDrawer>
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

export function InfoPanelStack({ panels }) {
  return (
    <div className="space-y-4">
      {panels.map((panel) => (
        <InfoCard key={panel.key ?? panel.title} title={panel.title} description={panel.description}>
          {typeof panel.render === 'function' ? panel.render() : panel.content}
        </InfoCard>
      ))}
    </div>
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
      data--runtime-viewport={name}
      data-testid="-runtime-viewport"
      className={SISAD_PDFME_HOST_SURFACE_CLASS}
    >
      {children}
    </div>
  );
}

function describeEventDetail(detail) {
  if (detail === null || detail === undefined) return '';
  if (typeof detail === 'string') return detail;
  if (typeof detail !== 'object') return String(detail);
  if (Array.isArray(detail)) return `${detail.length} elementos`;

  return Object.entries(detail)
    .slice(0, 3)
    .map(([key, value]) => {
      if (Array.isArray(value)) return `${key}: ${value.length}`;
      if (value && typeof value === 'object') {
        return `${key}: ${String(value.name ?? value.id ?? 'objeto')}`;
      }
      return `${key}: ${String(value)}`;
    })
    .join(' · ');
}

export function EventLog({ events, onClear }) {
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
        <ul className="m-0 list-none space-y-1 p-0" data-testid="-event-log">
          {events.map((event) => {
            const detail = describeEventDetail(event.detail);
            return (
              <li
                key={event.id}
                className="box-border rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-amber-200">{event.name}</span>
                  <span className="shrink-0 text-[10px] text-slate-500">{event.at}</span>
                </div>
                {detail ? <div className="mt-1 truncate text-slate-400">{detail}</div> : null}
              </li>
            );
          })}
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
    id: 'rotaterecipient',
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

export function ControllerPanel({ getController }) {
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
            data-testid={`-controller-${action.id}`}
            onClick={() => handleRun(action)}
            className="box-border inline-flex min-h-11 items-center rounded-full border border-white/10 bg-white/5 px-3 text-xs font-medium text-slate-200 transition hover:border-amber-300/40 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-300/60 md:min-h-0 md:py-1.5"
          >
            {action.label}
          </button>
        ))}
      </div>
      <p
        role="status"
        data-testid="-controller-result"
        className="m-0 min-h-[1.5rem] text-xs leading-6 text-slate-400"
      >
        {result}
      </p>
    </div>
  );
}

export function FamilyOverview() {
  return (
    <div className="space-y-3">
      {FAMILY.map((family) => (
        <div key={family.key} className="box-border rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold text-white">{family.title}</div>
          <p className="m-0 mt-1 text-sm leading-6 text-slate-300">{family.description}</p>
          <div className="mt-3">
            <FamilyBadgeList types={family.types} />
          </div>
        </div>
      ))}
    </div>
  );
}

const PATH_OPERATORS = {
  'flat()': (value) => (Array.isArray(value) ? value.flat() : value),
};

/**
 * Resuelve los `path` declarados en el manifest sobre el contexto de la página.
 * Soporta acceso anidado y los operadores de `PATH_OPERATORS`; cualquier otra
 * llamada se ignora en lugar de romper el panel.
 */
export const resolvePath = (source, path) => {
  if (!path) return undefined;

  return path.split('.').reduce((value, part) => {
    if (value == null) return undefined;
    const operator = PATH_OPERATORS[part];
    if (operator) return operator(value);
    if (part.endsWith('()')) return value;
    return value[part];
  }, source);
};

/** Una cadena vacía cuenta como "sin dato" y cede el turno al fallback. */
const firstPresent = (...candidates) =>
  candidates.find((candidate) => candidate !== undefined && candidate !== null && candidate !== '');

/**
 * Estado de interacción por schema, leído del controller.
 *
 * Existe para que un gate de navegador pueda aseverar `touched`/`dirty`/
 * `valid`/`completed` contra el MODELO. Sin esta superficie sólo se puede
 * mirar el DOM, y el DOM no dice si el runtime considera un campo tocado.
 *
 * Se recalcula cuando cambia el log de eventos: cada edición emite uno, así
 * que el panel sigue al runtime sin sondeos ni temporizadores.
 */
export function InteractionPanel({ getController, events }) {
  const states = useMemo(() => {
    const controller = getController?.();
    if (!controller?.getSchemaInteractionStates) return [];
    return controller.getSchemaInteractionStates();
    // `events` es la señal de que el runtime cambió; su contenido no se usa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getController, events]);

  if (states.length === 0) {
    return (
      <p className="m-0 text-xs text-slate-400" data-testid="lab-interaction-empty">
        Sin estado de interacción todavía.
      </p>
    );
  }

  return (
    <div className="space-y-1" data-testid="lab-interaction-list">
      {states.map((state) => (
        <div
          key={`${state.pageIndex}:${state.schemaUid}`}
          data-testid={`lab-interaction-${state.schemaName}`}
          data-touched={String(state.touched)}
          data-dirty={String(state.dirty)}
          data-valid={String(state.valid)}
          data-committed={String(state.committed)}
          data-completed={String(state.completed)}
          data-interaction-count={String(state.interactionCount)}
          className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300"
        >
          <span className="truncate font-medium text-slate-200">{state.schemaName}</span>
          <span className="shrink-0 tabular-nums text-slate-400">
            {state.touched ? 'T' : '·'}
            {state.dirty ? 'D' : '·'}
            {state.valid ? 'V' : '!'}
            {state.completed ? 'C' : '·'} ×{state.interactionCount}
          </span>
        </div>
      ))}
    </div>
  );
}

const PANEL_RENDERERS = {
  metrics: ({ panel, context }) => (
    <MetricGrid
      items={panel.metrics.map(({ label, path, value, fallback }) => ({
        label,
        value: String(firstPresent(value, resolvePath(context, path), fallback) ?? '—'),
      }))}
    />
  ),
  controller: ({ context }) => <ControllerPanel getController={context.getController} />,
  interaction: ({ context }) => (
    <InteractionPanel getController={context.getController} events={context.events} />
  ),
  events: ({ context }) => <EventLog events={context.events} onClear={context.clear} />,
  families: () => <FamilyOverview />,
};

/**
 * Construye el panel lateral de una página a partir de `config.infoPanels`.
 */
export function DynamicInfoPanel({ config, context }) {
  if (!config?.infoPanels) return null;

  const panels = config.infoPanels.map((panel) => ({
    key: panel.key,
    title: panel.title,
    description: panel.description,
    render: () => {
      const renderer = PANEL_RENDERERS[panel.type];
      if (!renderer) return <p className="m-0 text-sm text-slate-400">Panel sin renderer: {panel.type}</p>;
      return renderer({ panel, context });
    },
  }));

  return <InfoPanelStack panels={panels} />;
}
