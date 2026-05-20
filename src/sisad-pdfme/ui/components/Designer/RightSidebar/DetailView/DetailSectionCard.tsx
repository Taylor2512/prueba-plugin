import React from 'react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { ChevronDown } from 'lucide-react';

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
  <div className={DESIGNER_CLASSNAME + 'detail-section-card-head-main'}>
    <div
      className={DESIGNER_CLASSNAME + 'detail-section-card-title'}
      data-has-description={description ? 'true' : 'false'}
    >
      {title}
    </div>
    {description ? (
      <div className={DESIGNER_CLASSNAME + 'detail-section-card-description'}>{description}</div>
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
      return <div className={DESIGNER_CLASSNAME + 'detail-section-card-head'}>{header}</div>;
    }

    return (
      <button
        type="button"
        className={DESIGNER_CLASSNAME + 'detail-section-card-head'}
        aria-expanded={!collapsed}
        aria-controls={`${bodyId}-body`}
        aria-label={`${collapsed ? 'Expandir' : 'Colapsar'} sección ${title}`}
        onClick={onToggle}
      >
        {header}
        <span className={DESIGNER_CLASSNAME + 'detail-section-card-toggle'} aria-hidden="true">
          <ChevronDown size={12} />
        </span>
      </button>
    );
  }

  if (!collapsible) {
    return (
      <div className={DESIGNER_CLASSNAME + 'detail-section-card-head'}>
        {leading ? <div className={DESIGNER_CLASSNAME + 'detail-section-card-leading'}>{leading}</div> : null}
        <SectionText title={title} description={description} />
        {trailing ? <div className={DESIGNER_CLASSNAME + 'detail-section-card-trailing'}>{trailing}</div> : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={DESIGNER_CLASSNAME + 'detail-section-card-head'}
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
      className={[DESIGNER_CLASSNAME + 'detail-section-card', className].filter(Boolean).join(' ')}
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
        className={[DESIGNER_CLASSNAME + 'detail-section-card-body', bodyClassName].filter(Boolean).join(' ')}
        aria-hidden={resolvedCollapsed ? 'true' : 'false'}
        data-collapsed={resolvedCollapsed ? 'true' : 'false'}
      >
        {resolvedCollapsed ? null : children}
      </div>
      {footer ? <div className={DESIGNER_CLASSNAME + 'detail-section-card-footer'}>{footer}</div> : null}
    </section>
  );
};

export default DetailSectionCard;
