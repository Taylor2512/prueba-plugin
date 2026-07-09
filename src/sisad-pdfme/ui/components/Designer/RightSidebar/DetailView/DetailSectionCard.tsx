import React from 'react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { ChevronDown } from 'lucide-react';
import { mergeClassNames } from '../../shared/className.js';

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

type SectionTextProps = {
  title: string;
  description?: string;
};

const SectionText = ({ title, description }: SectionTextProps) => (
  <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-head-main', 'min-w-0 flex-1 space-y-0.5')}>
    <div
      className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-title', 'truncate text-[0.62rem] font-semibold uppercase tracking-[0.04em] leading-tight text-slate-900')}
      data-has-description={description ? 'true' : 'false'}
    >
      {title}
    </div>
    {description ? (
      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-description', 'truncate text-[0.6rem] leading-3 text-slate-500')}>
        {description}
      </div>
    ) : null}
  </div>
);

type SectionHeadProps = SectionTextProps & {
  collapsible: boolean;
  collapsed: boolean;
  bodyId: string;
  onToggle: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  header?: React.ReactNode;
};

const SectionHead = ({ collapsible, collapsed, bodyId, onToggle, title, description, leading, trailing, header }: SectionHeadProps) => {
  if (header) {
    if (!collapsible) {
      return <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-head', 'flex items-center justify-between gap-2')}>{header}</div>;
    }

    return (
      <button
        type="button"
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'detail-section-card-head',
          'flex min-h-[30px] w-full items-center justify-between gap-1.5 rounded-lg px-2 py-1 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60',
        )}
        aria-expanded={!collapsed}
        aria-controls={`${bodyId}-body`}
        aria-label={`${collapsed ? 'Expandir' : 'Colapsar'} sección ${title}`}
        onClick={onToggle}
      >
        {header}
        <span className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-toggle', 'inline-flex h-6 w-6 flex-none items-center justify-center rounded-lg text-slate-400')} aria-hidden="true">
          <ChevronDown size={11} />
        </span>
      </button>
    );
  }

  if (!collapsible) {
    return (
      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-head', 'flex min-h-[30px] w-full items-center justify-between gap-1.5 rounded-lg px-2 py-1')}>
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
        'flex min-h-[30px] w-full items-center justify-between gap-1.5 rounded-lg px-2 py-1 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60',
      )}
      aria-expanded={!collapsed}
      aria-controls={`${bodyId}-body`}
      aria-label={`${collapsed ? 'Expandir' : 'Colapsar'} sección ${title}`}
      onClick={onToggle}
    >
      {leading ? <div className={DESIGNER_CLASSNAME + 'detail-section-card-leading'}>{leading}</div> : null}
      <SectionText title={title} description={description} />
      {trailing ? <div className={DESIGNER_CLASSNAME + 'detail-section-card-trailing'}>{trailing}</div> : null}
      <span className={DESIGNER_CLASSNAME + 'detail-section-card-toggle'} aria-hidden="true">
        <ChevronDown size={12} />
      </span>
    </button>
  );
};

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
        'overflow-hidden rounded-xl border border-slate-200/70 bg-white/90 p-1.5 shadow-none',
        className,
      )}
      data-section={sectionKey}
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
          'mt-1 rounded-lg bg-slate-50/50 p-1.5',
          bodyClassName,
        )}
        aria-hidden={resolvedCollapsed ? 'true' : 'false'}
        data-collapsed={resolvedCollapsed ? 'true' : 'false'}
      >
        {resolvedCollapsed ? null : children}
      </div>
      {footer ? <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-section-card-footer', 'mt-1')}>{footer}</div> : null}
    </section>
  );
};

export default DetailSectionCard;
