/**
 * DetailSectionCard — contenedor visual colapsable para secciones del inspector.
 *
 * Provee estructura, test ids estables, encabezado accesible, estado colapsado y
 * slots de leading/trailing/header/footer. Debe mantenerse genérico para servir a
 * todas las secciones del DetailView.
 */
import React from 'react';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { ChevronDown } from 'lucide-react';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';

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

/**  section key → stable test id (contract for e2e specs). */
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
 * Clases compartidas por las cuatro variantes de encabezado.
 *
 * El encabezado es parte de la superficie de la sección, no una tarjeta dentro
 * de otra: sin borde ni sombra propios. `border-0` es obligatorio y no opcional:
 * el proyecto desactiva el preflight de Tailwind (`tailwind.config.js`), así que
 * un `<button>` sin borde declarado hereda el `2px outset` del navegador.
 */
const SECTION_HEAD_BASE =
  'flex min-h-[1.875rem] w-full items-center justify-between gap-1.5 rounded-[0.85rem] border-0 bg-transparent px-2 py-1 text-left';

/** Añadidos cuando el encabezado es interactivo (sección colapsable). */
const SECTION_HEAD_INTERACTIVE =
  'group appearance-none transition-colors duration-150 hover:bg-slate-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50';

/**
 * Renderiza título y descripción de sección con truncado compacto.
 */
const SectionText = ({ title, description }: SectionTextProps) => (
    <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-head-main', 'min-w-0 flex-1 space-y-0')}>
      <div
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'detail-section-card-title',
          'truncate text-[0.72rem] font-semibold leading-tight text-slate-950',
        )}
        data-has-description={description ? 'true' : 'false'}
      >
        {title}
      </div>
    {description ? (
      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-description', 'truncate text-[0.62rem] leading-tight text-slate-600')}>
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
  const toggleIcon = (
    <span
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'detail-section-card-toggle',
        'ml-0.5 inline-flex h-4 w-4 flex-none items-center justify-center rounded-md text-slate-400 transition-[transform,color] duration-200 group-hover:text-slate-600',
        !collapsed && 'rotate-180',
      )}
      aria-hidden="true"
    >
      <ChevronDown size={12} strokeWidth={2.25} />
    </span>
  );

  if (header) {
    if (!collapsible) {
      return (
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-head', SECTION_HEAD_BASE)}>
          {header}
        </div>
      );
    }

    return (
      <button
        type="button"
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'detail-section-card-head',
          SECTION_HEAD_BASE,
          SECTION_HEAD_INTERACTIVE,
        )}
        aria-expanded={!collapsed}
        aria-controls={`${bodyId}-body`}
        aria-label={`${collapsed ? 'Expandir' : 'Colapsar'} sección ${title}`}
        onClick={onToggle}
      >
        {header}
        {toggleIcon}
      </button>
    );
  }

  if (!collapsible) {
    return (
      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-head', SECTION_HEAD_BASE)}>
        {leading ? <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-leading', 'flex-none')}>{leading}</div> : null}
        <SectionText title={title} description={description} />
        {trailing ? <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-trailing', 'flex-none')}>{trailing}</div> : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'detail-section-card-head',
        SECTION_HEAD_BASE,
        SECTION_HEAD_INTERACTIVE,
      )}
      aria-expanded={!collapsed}
      aria-controls={`${bodyId}-body`}
      aria-label={`${collapsed ? 'Expandir' : 'Colapsar'} sección ${title}`}
      onClick={onToggle}
    >
      {leading ? <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-leading', 'flex-none')}>{leading}</div> : null}
      <SectionText title={title} description={description} />
      {trailing ? <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-trailing', 'flex-none')}>{trailing}</div> : null}
      {toggleIcon}
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
  resetToken,
}: DetailSectionCardProps) => {
  const [collapsed, setCollapsed] = React.useState(() => defaultCollapsed);
  const resolvedCollapsed = typeof controlledCollapsed === 'boolean' ? controlledCollapsed : collapsed;
  const bodyId = `${sectionKey || title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  React.useEffect(() => {
    setCollapsed(defaultCollapsed);
  }, [defaultCollapsed, resetToken]);

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
        // Sin borde: la sección se separa del panel por su fondo y una sombra
        // muy suave, no por una línea. Mantiene la superficie única del §6 del
        // contrato del inspector.
        'overflow-hidden rounded-[0.9rem] border-0 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]',
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
          // Colapsada, el cuerpo no debe reservar padding: si no, cada sección
          // cerrada suma varios píxeles muertos bajo su título.
          resolvedCollapsed ? 'h-0 overflow-hidden p-0' : 'px-2 pb-2 pt-0.5',
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
