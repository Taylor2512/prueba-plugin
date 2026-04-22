import React from 'react';
import type { SchemaForUI, PropPanelWidgetProps } from '@sisad-pdfme/common';
import type { useForm } from 'form-render';
import { ArrowLeft } from 'lucide-react';
import { Button, Tooltip } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { SidebarBody, SidebarFrame, SidebarHeader } from '../layout.js';
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
};

const DetailViewContent = ({
  activeSchema,
  schemaConfig,
  deselectSchema,
  form,
  sections,
  widgets,
  watchHandler,
}: DetailViewContentProps) => {
  return (
    <SidebarFrame className={DESIGNER_CLASSNAME + 'detail-view'}>
      <SidebarHeader>
        <Tooltip title="Campos del documento" placement="right">
          <Button
            className={DESIGNER_CLASSNAME + 'back-button'}
            htmlType="button"
            onClick={deselectSchema}
            icon={<ArrowLeft strokeWidth={1.5} size={18} />}
            size="small"
            type="text"
          />
        </Tooltip>
        <div className={DESIGNER_CLASSNAME + 'detail-view-title'}>
          Editar campo
        </div>
      </SidebarHeader>
      <SidebarBody tabIndex={0} aria-label="Secciones del detalle del campo">
        <DetailHeaderCard
          activeSchema={activeSchema}
          schemaConfig={schemaConfig}
        />
        <div className={DESIGNER_CLASSNAME + 'detail-view-sections'}>
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
