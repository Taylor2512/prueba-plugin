import React from 'react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';

type DetailSectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

const DetailSectionCard = ({ title, description, children }: DetailSectionCardProps) => (
  <section className={DESIGNER_CLASSNAME + 'detail-section-card'}>
    <div className={DESIGNER_CLASSNAME + 'detail-section-card-head'}>
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
    {children}
  </section>
);

export default DetailSectionCard;
