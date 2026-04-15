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

  return (
    <section
      className={DESIGNER_CLASSNAME + 'detail-section-card'}
      data-section={sectionKey}
      data-collapsible={collapsible ? 'true' : 'false'}
      data-collapsed={collapsed ? 'true' : 'false'}>
      <div
        className={DESIGNER_CLASSNAME + 'detail-section-card-head'}
        role={collapsible ? 'button' : undefined}
        tabIndex={collapsible ? 0 : undefined}
        aria-expanded={collapsible ? String(!collapsed) : undefined}
        onClick={collapsible ? () => setCollapsed((prev) => !prev) : undefined}
        onKeyDown={collapsible ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCollapsed((prev) => !prev); } } : undefined}
      >
        <div className={DESIGNER_CLASSNAME + 'detail-section-card-head-main'}>
          <div
            className={DESIGNER_CLASSNAME + 'detail-section-card-title'}
            data-has-description={description ? 'true' : 'false'}
          >
            {title}
          </div>
          {description ? (
            <div className={DESIGNER_CLASSNAME + 'detail-section-card-description'}>
              {description}
            </div>
          ) : null}
        </div>
        {collapsible ? (
          <span
            className={DESIGNER_CLASSNAME + 'detail-section-card-toggle'}
            aria-hidden="true"
          >
            <ChevronDown size={12} />
          </span>
        ) : null}
      </div>
      <div className={DESIGNER_CLASSNAME + 'detail-section-card-body'} data-collapsed={collapsed ? 'true' : 'false'}>
        {collapsed ? null : children}
      </div>
    </section>
  );
};

export default DetailSectionCard;
