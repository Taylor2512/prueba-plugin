import React from 'react';
import { Button, Empty, Typography } from 'antd';
import { FilePlus2, FileText, Plus } from 'lucide-react';
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
  onSelect?: (id: string) => void;
  onAdd?: () => void;
  title?: React.ReactNode;
  emptyTitle?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  useDefaultStyles?: boolean;
  density?: 'default' | 'compact';
  showInlineAddCard?: boolean;
};

const previewBoxBaseStyle: React.CSSProperties = {
  position: 'relative',
  height: 116,
  borderRadius: 12,
  border: '1px solid rgba(15, 23, 42, 0.08)',
  background:
    'linear-gradient(180deg, rgba(248, 250, 252, 0.96) 0%, rgba(241, 245, 249, 0.98) 100%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.75)',
  overflow: 'hidden',
};

const DocumentsRail = ({
  items,
  selectedId,
  onSelect,
  onAdd,
  title = 'Documentos',
  emptyTitle = 'Sin documentos disponibles',
  className,
  style,
  useDefaultStyles = true,
  density = 'default',
  showInlineAddCard = true,
}: DocumentsRailProps) => {
  const isCompact = density === 'compact';
  const rootStyle = useDefaultStyles
    ? {
        minWidth: 0,
        gap: 0,
        borderRadius: 14,
      }
    : {};

  return (
    <SidebarFrame
      className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail', className)}>
      <SidebarHeader>
        <div className={DESIGNER_CLASSNAME + "div-auto"}>
          <FileText size={15} className={DESIGNER_CLASSNAME + "filetext-auto"} />
          <Text strong className={DESIGNER_CLASSNAME + "text-auto"}>
            {title}
          </Text>
          {onAdd ? (
            <Button
              size="small"
              type="text"
              icon={<Plus size={14} />}
              onClick={onAdd}
              className={DESIGNER_CLASSNAME + "button-auto"}
            />
          ) : null}
        </div>
      </SidebarHeader>
      <SidebarBody>
        {items.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span className={DESIGNER_CLASSNAME + "span-auto"}>{emptyTitle}</span>}
          >
            {onAdd ? (
              <Button size="small" type="default" icon={<FilePlus2 size={14} />} onClick={onAdd}>
                Agregar
              </Button>
            ) : null}
          </Empty>
        ) : (
          <div className={DESIGNER_CLASSNAME + "div-auto"}>
            {onAdd && showInlineAddCard ? (
              <button
                type="button"
                onClick={onAdd}
                className={DESIGNER_CLASSNAME + 'documents-rail-item'}>
                <div
                  className={DESIGNER_CLASSNAME + "div-auto"}
                >
                  <div
                    className={DESIGNER_CLASSNAME + "div-auto"}
                  >
                    <Plus size={18} />
                  </div>
                </div>
                <div className={DESIGNER_CLASSNAME + "div-auto"}>
                  <Text strong className={DESIGNER_CLASSNAME + "text-auto"}>
                    Agregar documento
                  </Text>
                  <Text type="secondary" className={DESIGNER_CLASSNAME + "text-auto"}>
                    Adjunta otro PDF o una nueva página al flujo actual
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
                  className={DESIGNER_CLASSNAME + 'documents-rail-item'}>
                  <div className={DESIGNER_CLASSNAME + "div-auto"}>
                    {item.previewSrc ? (
                      <div
                        className={DESIGNER_CLASSNAME + "div-auto"}
                      />
                    ) : (
                      <div
                        className={DESIGNER_CLASSNAME + "div-auto"}
                      >
                        <FileText size={20} />
                      </div>
                    )}
                    <div
                      className={DESIGNER_CLASSNAME + "div-auto"}
                    >
                      {item.pageLabel || `${index + 1}`}
                    </div>
                  </div>
                  <div className={DESIGNER_CLASSNAME + "div-auto"}>
                    <Text strong ellipsis={{ tooltip: item.name }} className={DESIGNER_CLASSNAME + "text-auto"}>
                      {item.name}
                    </Text>
                    {item.meta ? (
                      <Text type="secondary" ellipsis={{ tooltip: item.meta }} className={DESIGNER_CLASSNAME + "text-auto"}>
                        {item.meta}
                      </Text>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </SidebarBody>
    </SidebarFrame>
  );
};

export default DocumentsRail;
