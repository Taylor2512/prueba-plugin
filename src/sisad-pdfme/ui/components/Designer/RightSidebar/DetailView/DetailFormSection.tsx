import React from 'react';
import type { PropPanelSchema, PropPanelWidgetProps } from '@sisad-pdfme/common';
import type { useForm } from 'form-render';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import DetailSectionCard from './DetailSectionCard.js';
import FormRenderComponent from 'form-render';

type DetailFormSectionProps = {
  sectionKey?: string;
  title: string;
  description: string;
  schema: PropPanelSchema;
  form: ReturnType<typeof useForm>;
  widgets: Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element>;
  watchHandler: (..._args: unknown[]) => void;
  defaultCollapsed?: boolean;
  resetToken?: string;
};

const DetailFormSection = ({
  sectionKey,
  title,
  description,
  schema,
  form,
  widgets,
  watchHandler,
  defaultCollapsed = false,
  resetToken,
}: DetailFormSectionProps) => (
  <DetailSectionCard
    key={resetToken || sectionKey || title}
    sectionKey={sectionKey}
    title={title}
    description={description}
    defaultCollapsed={defaultCollapsed}
  >
    <div className={`${DESIGNER_CLASSNAME}detail-view-form-shell rounded-2xl bg-white/90 p-2.5 shadow-sm`}>
      <FormRenderComponent
        form={form}
        schema={schema}
        widgets={widgets}
        watch={{ '#': watchHandler }}
        // form-render types only accept 'zh-CN' | 'en-US'. Use 'en-US' to satisfy typing.
        locale="en-US"
        footer={{
          reset: { hide: true },
          submit: { hide: true },
        }}
      />
    </div>
  </DetailSectionCard>
);

export default DetailFormSection;
