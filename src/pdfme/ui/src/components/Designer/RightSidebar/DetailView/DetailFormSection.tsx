import React from 'react';
import type { PropPanelSchema, PropPanelWidgetProps } from '@pdfme/common';
import type { useForm } from 'form-render';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import DetailSectionCard from './DetailSectionCard.js';
import FormRenderComponent from 'form-render';

type DetailFormSectionProps = {
  title: string;
  description: string;
  schema: PropPanelSchema;
  form: ReturnType<typeof useForm>;
  widgets: Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element>;
  watchHandler: (...args: unknown[]) => void;
  defaultCollapsed?: boolean;
};

const DetailFormSection = ({
  title,
  description,
  schema,
  form,
  widgets,
  watchHandler,
  defaultCollapsed = false,
}: DetailFormSectionProps) => (
  <DetailSectionCard title={title} description={description} defaultCollapsed={defaultCollapsed}>
    <div className={`${DESIGNER_CLASSNAME}detail-view-form-shell`}>
      <FormRenderComponent
        form={form}
        schema={schema}
        widgets={widgets}
        watch={{ '#': watchHandler }}
        locale="en-US"
      />
    </div>
  </DetailSectionCard>
);

export default DetailFormSection;
