import React from 'react';
import { Button, Typography } from 'antd';
import { FileText, FileUp, Plus } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../constants.js';
import { SidebarBody, SidebarFrame, SidebarHeader } from './layout.js';
import { mergeClassNames } from '../shared/className.js';

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
  className?: string;
  style?: React.CSSProperties;
  useDefaultStyles?: boolean;
  density?: 'default' | 'compact';
  showInlineAddCard?: boolean;
};

const DocumentsRail = ({
  items,
  selectedId,
  onSelect,
  onAdd,
  onUploadPdf,
  title = 'Páginas',
  emptyTitle = 'Sin páginas disponibles',
  className,
  style,
  useDefaultStyles = true,
  density = 'default',
  showInlineAddCard = true,
}: DocumentsRailProps) => {
  const hasItems = items.length > 0;
  const canUpload = typeof onUploadPdf === 'function';
  const canAdd = typeof onAdd === 'function';
  const canAddPage = canAdd && hasItems;

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
          <div className={DESIGNER_CLASSNAME + 'documents-rail-header'}>
            <div className={DESIGNER_CLASSNAME + 'documents-rail-header-title'}>
              <FileText size={14} className={DESIGNER_CLASSNAME + 'filetext-auto'} />
              <Text strong className={DESIGNER_CLASSNAME + 'text-auto'}>
                {title}
              </Text>
              <Text type="secondary" className={DESIGNER_CLASSNAME + 'documents-rail-count'}>
                {items.length}
              </Text>
            </div>
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
                  Subir PDF
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
                  title="Agregar página"
                  aria-label="Agregar página"
                />
              ) : null}
            </div>
          </div>
          <Text type="secondary" className={DESIGNER_CLASSNAME + 'documents-rail-subtitle'}>
            Sube un PDF para trabajar con páginas y documentos.
          </Text>
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
                      Agregar página
                    </Text>
                    <Text type="secondary" className={DESIGNER_CLASSNAME + 'text-auto'}>
                      Crea una nueva página dentro del documento activo
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
                      <div className={DESIGNER_CLASSNAME + 'documents-rail-page-label'}>
                        {item.pageLabel || `${index + 1}`}
                      </div>
                    </div>
                    <div className={DESIGNER_CLASSNAME + 'documents-rail-meta'}>
                      <Text strong ellipsis={{ tooltip: item.name }} className={DESIGNER_CLASSNAME + 'text-auto'}>
                        {item.name}
                      </Text>
                      <div className={DESIGNER_CLASSNAME + 'documents-rail-meta-row'}>
                        <Text type="secondary" ellipsis={{ tooltip: item.pageLabel || `${index + 1}` }} className={DESIGNER_CLASSNAME + 'text-auto'}>
                          Página {item.pageLabel || `${index + 1}`}
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
          <div className={DESIGNER_CLASSNAME + 'documents-rail-empty'}>
              <div className={DESIGNER_CLASSNAME + 'documents-rail-empty-icon'}>
                <FileText size={16} />
              </div>
              <div className={DESIGNER_CLASSNAME + 'documents-rail-empty-copy'}>
                <Text strong className={DESIGNER_CLASSNAME + 'documents-empty-title'}>
                  {emptyTitle}
                </Text>
                <Text type="secondary" className={DESIGNER_CLASSNAME + 'documents-rail-empty-hint'}>
                  Sube un PDF para empezar.
                </Text>
              </div>
              {canUpload ? (
                <div className={DESIGNER_CLASSNAME + 'documents-rail-empty-actions'}>
                  <Button
                    size="small"
                    type="default"
                    htmlType="button"
                    icon={<FileUp size={13} />}
                    onClick={onUploadPdf}
                    className={DESIGNER_CLASSNAME + 'documents-rail-empty-upload'}
                  >
                    Subir PDF
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </SidebarBody>
      </SidebarFrame>
    </div>
  );
};

export default DocumentsRail;
