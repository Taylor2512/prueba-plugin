import React from 'react';
import type { SchemaForUI, PropPanelWidgetProps } from '@sisad-pdfme/common';
import type { useForm } from 'form-render';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { mergeClassNames } from '../../shared/className.js';
import { SidebarBody, SidebarFrame } from '../layout.js';
import DetailHeaderCard from './DetailHeaderCard.js';
import DetailFormSection from './DetailFormSection.js';
import type { SchemaDesignerConfig } from '../../../../designerEngine.js';
import type { DetailInspectorSection } from './detailSchemas.js';

type DetailViewContentProps = {
  activeSchema: SchemaForUI;
  schemaConfig: SchemaDesignerConfig | null;
  deselectSchema: () => void;
  form: ReturnType<typeof useForm>;
  sections: DetailInspectorSection[];
  widgets: Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element>;
  watchHandler: (..._args: unknown[]) => void;
  backTooltip?: string;
};

const DetailViewContent = ({
  activeSchema,
  schemaConfig,
  deselectSchema,
  form,
  sections,
  widgets,
  watchHandler,
  backTooltip = 'Volver a campos',
}: DetailViewContentProps) => {
  return (
    <SidebarFrame className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-view', 'flex h-full min-h-0 flex-col')}>
      <SidebarBody tabIndex={0} aria-label="Secciones del detalle del campo">
        <DetailHeaderCard
          activeSchema={activeSchema}
          schemaConfig={schemaConfig}
          onBack={deselectSchema}
          backTooltip={backTooltip}
        />
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-view-sections', 'mt-3 space-y-2.5')}>
          {sections.map((section) => (
            <DetailFormSection
              key={section.key}
              sectionKey={section.key}
              title={section.title}
              description={section.description}
              schema={section.schema}
              form={form}
              widgets={widgets}
              watchHandler={watchHandler}
              defaultCollapsed={section.defaultCollapsed}
              resetToken={`${activeSchema.id}:${section.key}`}
            />
          ))}
        </div>
      </SidebarBody>
    </SidebarFrame>
  );
};

export default DetailViewContent;
