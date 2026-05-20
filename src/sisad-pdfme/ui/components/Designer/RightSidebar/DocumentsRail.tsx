import React from 'react';
import { Button, Typography } from 'antd';
import { FileText, FileUp, Plus } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../constants.js';
import { SidebarBody, SidebarFrame, SidebarHeader } from './layout.js';
import { mergeClassNames } from '../shared/className.js';
import { SidebarSurfaceEmptyState, SidebarSurfaceHeader } from './shared/SidebarSurfacePrimitives.js';

const { Text } = Typography;

export type DesignerDocumentItem = {
  id: string;
  name: string;
  pageLabel?: string;
  previewSrc?: string | null;
  selected?: boolean;
  disabled?: boolean;
  meta?: string;
};

export type DocumentsRailProps = {
  items: DesignerDocumentItem[];
  selectedId?: string | null;
  onSelect?: (_id: string) => void;
  onAdd?: () => void;
  onUploadPdf?: () => void;
  title?: React.ReactNode;
  emptyTitle?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  useDefaultStyles?: boolean;
  density?: 'default' | 'compact';
  showInlineAddCard?: boolean;
  uploadLabel?: React.ReactNode;
  addPageLabel?: React.ReactNode;
  pageLabelPrefix?: string;
  emptyDescription?: React.ReactNode;
};

const DocumentsRail = ({
  items,
  selectedId,
  onSelect,
  onAdd,
  onUploadPdf,
  title = 'Páginas',
  emptyTitle = 'Sin páginas disponibles',
  subtitle,
  className,
  style,
  useDefaultStyles = true,
  density = 'default',
  showInlineAddCard = true,
  uploadLabel = 'Subir PDF',
  addPageLabel = 'Nueva página',
  pageLabelPrefix = 'Pág.',
  emptyDescription = 'Carga un PDF para empezar.',
}: DocumentsRailProps) => {
  const hasItems = items.length > 0;
  const canUpload = typeof onUploadPdf === 'function';
  const canAdd = typeof onAdd === 'function';
  const canAddPage = canAdd && hasItems;
  const resolvedSubtitle = subtitle ?? (hasItems ? 'Selecciona una página' : 'Carga un PDF para empezar.');

  return (
    <div
      className={DESIGNER_CLASSNAME + 'documents-rail-wrapper'}
      style={style}>
      <SidebarFrame
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'documents-rail',
          density === 'compact' ? DESIGNER_CLASSNAME + 'documents-rail-compact' : '',
          useDefaultStyles ? DESIGNER_CLASSNAME + 'documents-rail-default' : '',
          className,
        )}>
        <SidebarHeader>
          <SidebarSurfaceHeader
            leading={<FileText size={14} className={DESIGNER_CLASSNAME + 'filetext-auto'} />}
            title={title}
            subtitle={resolvedSubtitle}
            badges={[{ label: items.length, color: 'default' }]}
            trailing={(
              <div className={DESIGNER_CLASSNAME + 'documents-rail-header-actions'}>
                {canUpload ? (
                  <Button
                    size="small"
                    type="text"
                    htmlType="button"
                    icon={<FileUp size={14} />}
                    onClick={onUploadPdf}
                    className={DESIGNER_CLASSNAME + 'documents-rail-action ' + DESIGNER_CLASSNAME + "button-auto"}
                  >
                    {uploadLabel}
                  </Button>
                ) : null}
                {canAddPage ? (
                  <Button
                    size="small"
                    type="text"
                    htmlType="button"
                    icon={<Plus size={14} />}
                    onClick={onAdd}
                    className={DESIGNER_CLASSNAME + 'documents-rail-action ' + DESIGNER_CLASSNAME + "button-auto"}
                    title={String(addPageLabel)}
                    aria-label={String(addPageLabel)}
                  />
                ) : null}
              </div>
            )}
            compact
          />
        </SidebarHeader>
        <SidebarBody tabIndex={0} aria-label="Lista de páginas del documento">
          {hasItems ? (
            <div className={DESIGNER_CLASSNAME + 'documents-rail-items'}>
              {canAdd && showInlineAddCard ? (
                <button
                  type="button"
                  onClick={onAdd}
                  className={DESIGNER_CLASSNAME + 'documents-rail-item'}>
                  <div className={DESIGNER_CLASSNAME + 'documents-rail-leading'}>
                    <div className={DESIGNER_CLASSNAME + 'documents-rail-preview'}>
                      <Plus size={18} />
                    </div>
                  </div>
                  <div className={DESIGNER_CLASSNAME + 'documents-rail-meta'}>
                    <Text strong className={DESIGNER_CLASSNAME + 'text-auto'}>
                      {addPageLabel}
                    </Text>
                    <Text type="secondary" className={DESIGNER_CLASSNAME + 'text-auto'}>
                      Añade una página al final del documento
                    </Text>
                  </div>
                </button>
              ) : null}
              {items.map((item, index) => {
                const isSelected = item.selected ?? item.id === selectedId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={item.disabled}
                    onClick={() => onSelect?.(item.id)}
                    className={mergeClassNames(
                      DESIGNER_CLASSNAME + 'documents-rail-item',
                      isSelected ? DESIGNER_CLASSNAME + 'documents-rail-item-active' : '',
                    )}
                    data-active={isSelected ? 'true' : 'false'}>
                    <div className={DESIGNER_CLASSNAME + 'documents-rail-leading'}>
                      {item.previewSrc ? (
                        <div className={DESIGNER_CLASSNAME + 'documents-rail-preview'}>
                          <img
                            src={item.previewSrc}
                            alt={item.name}
                            className={DESIGNER_CLASSNAME + 'documents-rail-preview-image'}
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className={DESIGNER_CLASSNAME + 'documents-rail-preview'}>
                          <FileText size={20} />
                        </div>
                      )}
                    </div>
                    <div className={DESIGNER_CLASSNAME + 'documents-rail-meta'}>
                      <Text strong ellipsis={{ tooltip: item.name }} className={DESIGNER_CLASSNAME + 'text-auto'}>
                        {item.name}
                      </Text>
                      <div className={DESIGNER_CLASSNAME + 'documents-rail-meta-row'}>
                        <Text type="secondary" ellipsis={{ tooltip: item.pageLabel || `${index + 1}` }} className={DESIGNER_CLASSNAME + 'text-auto'}>
                          {pageLabelPrefix} {item.pageLabel || `${index + 1}`}
                        </Text>
                        {isSelected ? (
                          <span className={DESIGNER_CLASSNAME + 'documents-rail-active-badge'}>
                            Activo
                          </span>
                        ) : null}
                      </div>
                      {item.meta ? (
                        <Text type="secondary" ellipsis={{ tooltip: item.meta }} className={DESIGNER_CLASSNAME + 'text-auto'}>
                          {item.meta}
                        </Text>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <SidebarSurfaceEmptyState
              icon={<FileText size={16} />}
              title={emptyTitle}
              description={emptyDescription}
              action={canUpload ? (
                <Button
                  size="small"
                  type="default"
                  htmlType="button"
                  icon={<FileUp size={13} />}
                  onClick={onUploadPdf}
                  className={DESIGNER_CLASSNAME + 'documents-rail-empty-upload'}
                >
                  {uploadLabel}
                </Button>
              ) : null}
              className={DESIGNER_CLASSNAME + 'documents-rail-empty'}
            />
          )}
        </SidebarBody>
      </SidebarFrame>
    </div>
  );
};

export default DocumentsRail;
