/**
 * DetailSectionCard — contenedor visual colapsable para secciones del inspector.
 *
 * Provee estructura, test ids estables, encabezado accesible, estado colapsado y
 * slots de leading/trailing/header/footer. Debe mantenerse genérico para servir a
 * todas las secciones del DetailView.
 */
import React from 'react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { ChevronDown } from 'lucide-react';
import { mergeClassNames } from '../../shared/className.js';

/**
 * Props del contenedor de sección del inspector.
 */
type DetailSectionCardProps = {
  sectionKey?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  bodyClassName?: string;
  className?: string;
  resetToken?: unknown;
};

/** Canonical section key → stable test id (contract for e2e specs). */
/**
 * Mapa de sección canónica a test id estable para Playwright/Vitest.
 */
const SECTION_TESTIDS: Record<string, string> = {
  identity: 'detail-section-info',
  options: 'detail-section-options',
  validation: 'detail-section-fill-rules',
  box: 'detail-section-layout',
  appearance: 'detail-section-format',
  behavior: 'detail-section-behavior',
  dataBindings: 'detail-section-data',
  help: 'detail-section-help',
  collaboration: 'detail-section-assignment',
  comments: 'detail-section-comments',
  advanced: 'detail-section-technical',
};

/**
 * Resuelve el test id público de una sección.
 */
const resolveSectionTestId = (sectionKey?: string): string | undefined =>
  sectionKey ? SECTION_TESTIDS[sectionKey] || `detail-section-${sectionKey}` : undefined;

/** Props del bloque textual del header de sección. */
type SectionTextProps = {
  title: string;
  description?: string;
};

/**
 * Renderiza título y descripción de sección con truncado compacto.
 */
const SectionText = ({ title, description }: SectionTextProps) => (
  <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-head-main', 'min-w-0 flex-1 space-y-0')}>
    <div
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'detail-section-card-title',
        'truncate text-[0.64rem] font-semibold uppercase tracking-[0.05em] leading-tight text-slate-950',
      )}
      data-has-description={description ? 'true' : 'false'}
    >
      {title}
    </div>
    {description ? (
      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-description', 'truncate text-[0.58rem] leading-tight text-slate-600')}>
        {description}
      </div>
    ) : null}
  </div>
);

/** Props del encabezado colapsable/no colapsable. */
type SectionHeadProps = SectionTextProps & {
  collapsible: boolean;
  collapsed: boolean;
  bodyId: string;
  onToggle: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  header?: React.ReactNode;
};

/**
 * Renderiza el encabezado de sección y su control de colapso.
 */
const SectionHead = ({ collapsible, collapsed, bodyId, onToggle, title, description, leading, trailing, header }: SectionHeadProps) => {
  if (header) {
    if (!collapsible) {
      return (
        <div
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'detail-section-card-head',
            'flex min-h-[22px] w-full items-center justify-between gap-1 rounded-[0.75rem] border border-slate-200/70 bg-white px-1.5 py-[0.22rem] shadow-[0_1px_2px_rgba(15,23,42,0.03)]',
          )}
        >
          {header}
        </div>
      );
    }

    return (
      <button
        type="button"
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'detail-section-card-head',
          'group flex min-h-[22px] w-full appearance-none items-center justify-between gap-1 rounded-[0.75rem] border border-slate-200/70 bg-white px-1.5 py-[0.22rem] text-left shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60',
        )}
        aria-expanded={!collapsed}
        aria-controls={`${bodyId}-body`}
        aria-label={`${collapsed ? 'Expandir' : 'Colapsar'} sección ${title}`}
        onClick={onToggle}
      >
        {header}
        <span className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-toggle', 'inline-flex h-[1.375rem] w-[1.375rem] flex-none items-center justify-center rounded-lg text-slate-400 transition-colors group-hover:text-slate-600')} aria-hidden="true">
          <ChevronDown size={11} />
        </span>
      </button>
    );
  }

  if (!collapsible) {
    return (
      <div
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'detail-section-card-head',
          'flex min-h-[22px] w-full items-center justify-between gap-1 rounded-[0.75rem] border border-slate-200/70 bg-white px-1.5 py-[0.18rem] shadow-[0_1px_2px_rgba(15,23,42,0.03)]',
        )}
      >
        {leading ? <div className={DESIGNER_CLASSNAME + 'detail-section-card-leading'}>{leading}</div> : null}
        <SectionText title={title} description={description} />
        {trailing ? <div className={DESIGNER_CLASSNAME + 'detail-section-card-trailing'}>{trailing}</div> : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'detail-section-card-head',
        'group flex min-h-[22px] w-full appearance-none items-center justify-between gap-[0.3125rem] rounded-[0.75rem] border border-slate-200/70 bg-white px-1.5 py-[0.22rem] text-left shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60',
      )}
      aria-expanded={!collapsed}
      aria-controls={`${bodyId}-body`}
      aria-label={`${collapsed ? 'Expandir' : 'Colapsar'} sección ${title}`}
      onClick={onToggle}
    >
      {leading ? <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-leading', 'flex-none')}>{leading}</div> : null}
      <SectionText title={title} description={description} />
      {trailing ? <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-trailing', 'flex-none')}>{trailing}</div> : null}
      <span className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-toggle', 'ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center text-slate-400 transition-transform duration-200 group-hover:text-slate-600', !collapsed && 'rotate-180')} aria-hidden="true">
        <ChevronDown size={10} strokeWidth={2.5} />
      </span>
    </button>
  );
};

/**
 * Card colapsable usada por cada sección del DetailView.
 *
 * @param props Configuración visual y contenido de la sección.
 * @returns Contenedor semántico de sección.
 */
const DetailSectionCard = ({
  sectionKey,
  title,
  description,
  children,
  collapsible = true,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  leading,
  trailing,
  header,
  footer,
  bodyClassName,
  className,
}: DetailSectionCardProps) => {
  const [collapsed, setCollapsed] = React.useState(() => defaultCollapsed);
  const resolvedCollapsed = typeof controlledCollapsed === 'boolean' ? controlledCollapsed : collapsed;
  const bodyId = `${sectionKey || title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const setNextCollapsed = (next: boolean) => {
    if (typeof controlledCollapsed !== 'boolean') {
      setCollapsed(next);
    }
    onCollapsedChange?.(next);
  };

  return (
    <section
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'detail-section-card',
        'overflow-hidden rounded-[0.85rem] border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]',
        className,
      )}
      data-section={sectionKey}
      data-testid={resolveSectionTestId(sectionKey)}
      data-collapsible={collapsible ? 'true' : 'false'}
      data-collapsed={resolvedCollapsed ? 'true' : 'false'}>
      <SectionHead
        collapsible={collapsible}
        collapsed={resolvedCollapsed}
        bodyId={bodyId}
        onToggle={() => setNextCollapsed(!resolvedCollapsed)}
        title={title}
        description={description}
        leading={leading}
        trailing={trailing}
        header={header}
      />
      <div
        id={`${bodyId}-body`}
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'detail-section-card-body',
          'mt-px px-1.5 pb-[0.375rem] pt-[0.1875rem]',
          bodyClassName,
        )}
        aria-hidden={resolvedCollapsed ? 'true' : 'false'}
        data-collapsed={resolvedCollapsed ? 'true' : 'false'}
      >
        {resolvedCollapsed ? null : children}
      </div>
      {footer ? <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-footer', 'mt-px px-1 pb-[0.1875rem]')}>{footer}</div> : null}
    </section>
  );
};

export default DetailSectionCard;
