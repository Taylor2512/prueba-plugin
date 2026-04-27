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
};

const SectionHead = ({ collapsible, collapsed, bodyId, onToggle, title, description }: SectionHeadProps) => {
  if (!collapsible) {
    return (
      <div className={DESIGNER_CLASSNAME + 'detail-section-card-head'}>
        <SectionText title={title} description={description} />
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
      <SectionText title={title} description={description} />
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
}: DetailSectionCardProps) => {
  const [collapsed, setCollapsed] = React.useState(() => defaultCollapsed);
  const bodyId = `${sectionKey || title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <section
      className={DESIGNER_CLASSNAME + 'detail-section-card'}
      data-section={sectionKey}
      data-collapsible={collapsible ? 'true' : 'false'}
      data-collapsed={collapsed ? 'true' : 'false'}>
      <SectionHead
        collapsible={collapsible}
        collapsed={collapsed}
        bodyId={bodyId}
        onToggle={() => setCollapsed((prev) => !prev)}
        title={title}
        description={description}
      />
      <div
        id={`${bodyId}-body`}
        className={DESIGNER_CLASSNAME + 'detail-section-card-body'}
        aria-hidden={collapsed ? 'true' : 'false'}
        data-collapsed={collapsed ? 'true' : 'false'}
      >
        {collapsed ? null : children}
      </div>
    </section>
  );
};

export default DetailSectionCard;
