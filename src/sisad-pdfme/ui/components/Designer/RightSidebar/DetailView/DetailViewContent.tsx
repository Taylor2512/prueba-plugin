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
  const commentCount = activeSchema.commentsCount || activeSchema.comments?.length || 0;
  const anchorCount = activeSchema.commentAnchors?.length || activeSchema.commentsAnchors?.length || 0;
  const configTags = [
    schemaConfig?.persistence?.enabled ? { label: 'Guardar', color: 'processing' as const } : null,
    schemaConfig?.api?.enabled ? { label: 'API', color: 'blue' as const } : null,
    schemaConfig?.form?.enabled ? { label: 'Form JSON', color: 'success' as const } : null,
    schemaConfig?.prefill?.enabled ? { label: 'Prefill', color: 'gold' as const } : null,
  ].filter(Boolean) as Array<{ label: string; color?: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue' }>;
  const collaborationTags = [
    activeSchema.ownerRecipientId ? { label: `Owner: ${activeSchema.ownerRecipientId}` } : null,
    activeSchema.fileId || activeSchema.fileTemplateId
      ? { label: `Archivo: ${activeSchema.fileId || activeSchema.fileTemplateId}` }
      : null,
    activeSchema.state ? { label: `Estado: ${activeSchema.state}` } : null,
    activeSchema.ownerMode ? { label: `OwnerMode: ${activeSchema.ownerMode}` } : null,
    activeSchema.saveValue === false ? { label: 'No guarda valor' } : null,
    commentCount > 0 ? { label: `Comentarios: ${commentCount}` } : null,
    anchorCount > 0 ? { label: `Anchors: ${anchorCount}` } : null,
  ].filter(Boolean) as Array<{ label: string }>;
  const contextTags = [...collaborationTags, ...configTags];
  const visibleContextTags = contextTags.slice(0, 4);
  const hiddenContextTagCount = Math.max(0, contextTags.length - visibleContextTags.length);

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
        {visibleContextTags.length > 0 ? (
          <div className={DESIGNER_CLASSNAME + 'detail-view-context-strip'}>
            {visibleContextTags.map((tag) => (
              <span key={tag.label} className={DESIGNER_CLASSNAME + 'detail-view-context-chip'}>
                {tag.label}
              </span>
            ))}
            {hiddenContextTagCount > 0 ? (
              <span className={DESIGNER_CLASSNAME + 'detail-view-context-chip'}>
                +{hiddenContextTagCount} más
              </span>
            ) : null}
          </div>
        ) : null}
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
