import React from 'react';
import type { PropPanelSchema, SchemaForUI, PropPanelWidgetProps } from '@sisad-pdfme/common';
import type { useForm } from 'form-render';
import { ArrowLeft } from 'lucide-react';
import { Button, Tooltip } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { SidebarBody, SidebarFrame, SidebarHeader } from '../layout.js';
import DetailHeaderCard from './DetailHeaderCard.js';
import DetailFormSection from './DetailFormSection.js';
import type { SchemaDesignerConfig } from '../../../../designerEngine.js';

type DetailViewContentProps = {
  activeSchema: SchemaForUI;
  schemaConfig: SchemaDesignerConfig | null;
  deselectSchema: () => void;
  form: ReturnType<typeof useForm>;
  sectionSchemas: Record<'general' | 'style' | 'layout' | 'data' | 'validation' | 'advanced', PropPanelSchema>;
  widgets: Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element>;
  watchHandler: (..._args: unknown[]) => void;
};

const DetailViewContent = ({
  activeSchema,
  schemaConfig,
  deselectSchema,
  form,
  sectionSchemas,
  widgets,
  watchHandler,
}: DetailViewContentProps) => {
  const hasSchemaConfig = Boolean(
    schemaConfig?.persistence?.enabled || schemaConfig?.api?.enabled || schemaConfig?.form?.enabled || schemaConfig?.prefill?.enabled,
  );
  const configTags = [
    schemaConfig?.persistence?.enabled ? { label: 'Guardar', color: 'processing' as const } : null,
    schemaConfig?.api?.enabled ? { label: 'API', color: 'blue' as const } : null,
    schemaConfig?.form?.enabled ? { label: 'Form JSON', color: 'success' as const } : null,
    schemaConfig?.prefill?.enabled ? { label: 'Prefill', color: 'gold' as const } : null,
  ].filter(Boolean) as Array<{ label: string; color?: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue' }>;

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
        <DetailHeaderCard activeSchema={activeSchema} configTags={configTags} />
        {hasSchemaConfig ? (
          <div className={DESIGNER_CLASSNAME + 'detail-view-context-strip'}>
            {configTags.map((tag) => (
              <span key={tag.label} className={DESIGNER_CLASSNAME + 'detail-view-context-chip'}>
                {tag.label}
              </span>
            ))}
          </div>
        ) : null}
        <div className={DESIGNER_CLASSNAME + 'detail-view-sections'}>
          <DetailFormSection
            sectionKey="general"
            title="General"
            description="Identidad y metadatos del campo."
            schema={sectionSchemas.general}
            form={form}
            widgets={widgets}
            watchHandler={watchHandler}
            resetToken={activeSchema.id}
          />
          <DetailFormSection
            sectionKey="style"
            title="Estilo"
            description="Alineación y tratamiento visual."
            schema={sectionSchemas.style}
            form={form}
            widgets={widgets}
            watchHandler={watchHandler}
            defaultCollapsed
            resetToken={activeSchema.id}
          />
          <DetailFormSection
            sectionKey="layout"
            title="Layout"
            description="Posición y tamaño en la página."
            schema={sectionSchemas.layout}
            form={form}
            widgets={widgets}
            watchHandler={watchHandler}
            resetToken={activeSchema.id}
          />
          <DetailFormSection
            sectionKey="data"
            title="Datos"
            description="Comportamiento semántico y edición."
            schema={sectionSchemas.data}
            form={form}
            widgets={widgets}
            watchHandler={watchHandler}
            defaultCollapsed
            resetToken={activeSchema.id}
          />
          <DetailFormSection
            sectionKey="validation"
            title="Validación"
            description="Reglas y obligatoriedad."
            schema={sectionSchemas.validation}
            form={form}
            widgets={widgets}
            watchHandler={watchHandler}
            defaultCollapsed
            resetToken={activeSchema.id}
          />
          <DetailFormSection
            sectionKey="advanced"
            title="Avanzado"
            description="Propiedades avanzadas del plugin."
            schema={sectionSchemas.advanced}
            form={form}
            widgets={widgets}
            watchHandler={watchHandler}
            defaultCollapsed
            resetToken={activeSchema.id}
          />
        </div>
      </SidebarBody>
    </SidebarFrame>
  );
};

export default DetailViewContent;
