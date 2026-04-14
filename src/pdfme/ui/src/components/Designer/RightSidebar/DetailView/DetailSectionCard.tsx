import React from 'react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { ChevronDown } from 'lucide-react';

type DetailSectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
};

const DetailSectionCard = ({
  title,
  description,
  children,
  collapsible = true,
  defaultCollapsed = false,
}: DetailSectionCardProps) => {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  return (
    <section
      className={DESIGNER_CLASSNAME + 'detail-section-card'}
      data-collapsible={collapsible ? 'true' : 'false'}
      data-collapsed={collapsed ? 'true' : 'false'}>
      <div className={DESIGNER_CLASSNAME + 'detail-section-card-head'}>
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
          <button
            type="button"
            className={DESIGNER_CLASSNAME + 'detail-section-card-toggle'}
            aria-label={collapsed ? `Expandir sección ${title}` : `Colapsar sección ${title}`}
            aria-expanded={String(!collapsed)}
            onClick={() => setCollapsed((prev) => !prev)}>
            <ChevronDown size={14} />
          </button>
        ) : null}
      </div>
      <div className={DESIGNER_CLASSNAME + 'detail-section-card-body'} data-collapsed={collapsed ? 'true' : 'false'}>
        {collapsed ? null : children}
      </div>
    </section>
  );
};

export default DetailSectionCard;
