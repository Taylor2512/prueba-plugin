import React from 'react';
import { Button, Popconfirm, Typography } from 'antd';
import { FileText, FileUp, Plus, Trash2 } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../constants.js';
import { SidebarBody, SidebarFrame, SidebarHeader } from './layout.js';
import { mergeClassNames } from '../shared/className.js';
import { SidebarSurfaceEmptyState, SidebarSurfaceHeader } from './shared/SidebarSurfacePrimitives.js';

const { Text } = Typography;

/**
 * Representa una página/documento visible dentro del rail de documentos.
 *
 * En modo multi-documento puede mapear a un archivo PDF; en modo simple puede
 * representar páginas del documento activo.
 */
export type DesignerDocumentItem = {
  /** Identificador estable del documento/página. */
  id: string;

  /** Nombre visible del documento/página. */
  name: string;

  /** Etiqueta secundaria de página, por ejemplo `1`, `2`, `A-1`. */
  pageLabel?: string;

  /** URL/data URI de preview opcional. */
  previewSrc?: string | null;

  /** Estado seleccionado controlado por el host. */
  selected?: boolean;

  /** Deshabilita interacción de selección para este item. */
  disabled?: boolean;

  /** Metadata secundaria opcional. */
  meta?: string;
};

/**
 * Props del rail de documentos/páginas del sidebar derecho.
 */
export type DocumentsRailProps = {
  /** Items de documentos o páginas disponibles. */
  items: DesignerDocumentItem[];

  /** ID seleccionado cuando el estado lo controla el host. */
  selectedId?: string | null;

  /** Callback de selección de documento/página. */
  onSelect?: (_id: string) => void;

  /** Callback para agregar una nueva página/documento. */
  onAdd?: () => void;

  /** Callback para subir/reemplazar PDF. */
  onUploadPdf?: () => void;

  /** Callback para eliminar un documento/página. */
  onDelete?: (_id: string) => void;

  /** Título del rail. */
  title?: React.ReactNode;

  /** Título del estado vacío. */
  emptyTitle?: React.ReactNode;

  /** Subtítulo opcional del header. */
  subtitle?: React.ReactNode;

  /** Clase adicional para el frame. */
  className?: string;

  /** Estilos inline del wrapper. */
  style?: React.CSSProperties;

  /** Controla si se aplican clases/estilos por defecto del runtime. */
  useDefaultStyles?: boolean;

  /** Densidad visual del rail. */
  density?: 'default' | 'compact';

  /** Muestra una tarjeta inline para agregar página al inicio de la lista. */
  showInlineAddCard?: boolean;

  /** Texto/nodo para subir PDF. */
  uploadLabel?: React.ReactNode;

  /** Texto/nodo para agregar página. */
  addPageLabel?: React.ReactNode;

  /** Prefijo de etiqueta de página. */
  pageLabelPrefix?: string;

  /** Descripción del estado vacío. */
  emptyDescription?: React.ReactNode;
};

/**
 * Rail de documentos/páginas para el sidebar derecho.
 *
 * Responsabilidades:
 *
 * - mostrar páginas/documentos disponibles;
 * - permitir selección;
 * - exponer acciones de subir PDF, agregar página y eliminar;
 * - renderizar preview si existe;
 * - mostrar estado vacío cuando no hay items.
 *
 * Restricciones:
 *
 * - no modifica documentos directamente;
 * - no realiza uploads por sí mismo;
 * - no conoce schemas ni geometría del canvas;
 * - delega toda mutación al host mediante callbacks.
 */
const DocumentsRail = ({
  items,
  selectedId,
  onSelect,
  onAdd,
  onUploadPdf,
  onDelete,
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
  pageLabelPrefix = '',
  emptyDescription = 'Carga un PDF para empezar.',
}: DocumentsRailProps) => {
  const canDelete = typeof onDelete === 'function';
  const hasItems = items.length > 0;
  const canUpload = typeof onUploadPdf === 'function';
  const canAdd = typeof onAdd === 'function';
  const canAddPage = canAdd && hasItems;
  const resolvedSubtitle = subtitle ?? (hasItems ? 'Selecciona una página' : 'Carga un PDF para empezar.');
  const headerActionClass = 'appearance-none rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40 focus-visible:ring-offset-1';
  const railItemBaseClass = 'group relative flex w-full items-center gap-2.5 rounded-[0.95rem] border border-slate-200/70 bg-white/96 px-2 py-2 text-left shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/35 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60';
  const railItemActiveClass = 'border-sky-200 bg-sky-50/85 shadow-[0_1px_3px_rgba(15,23,42,0.05)]';
  const railPreviewClass = 'flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-slate-200/80 bg-slate-50 text-slate-500';
  const railAddCardClass = 'flex w-full items-center gap-2.5 rounded-[0.95rem] border border-dashed border-slate-200 bg-slate-50/80 px-2 py-2 text-left transition hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/35 focus-visible:ring-offset-1';
  const emptyActionClass = 'appearance-none rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/35 focus-visible:ring-offset-1';

  return (
    <div
      className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-wrapper', 'min-h-0 flex-1')}
      style={style}
    >
        <SidebarFrame
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'documents-rail',
          'flex min-h-0 flex-col overflow-hidden rounded-[1rem] border border-slate-200/65 bg-white/95 shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
          density === 'compact' ? DESIGNER_CLASSNAME + 'documents-rail-compact' : '',
          useDefaultStyles ? DESIGNER_CLASSNAME + 'documents-rail-default' : '',
          className,
        )}
      >
        <SidebarHeader>
          <SidebarSurfaceHeader
            leading={<FileText size={14} className={DESIGNER_CLASSNAME + 'filetext-auto'} />}
            title={title}
            subtitle={resolvedSubtitle}
            badges={[{ label: items.length, color: 'default' }]}
            trailing={(
              <div className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-header-actions', 'flex items-center gap-2')}>
                {canUpload ? (
                  <Button
                    size="small"
                    type="text"
                    htmlType="button"
                    icon={<FileUp size={14} />}
                    onClick={onUploadPdf}
                    className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-action', headerActionClass, 'inline-flex h-8 items-center justify-center gap-1.5 px-2 text-xs font-medium')}
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
                    className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-action', headerActionClass, 'inline-flex h-8 w-8 items-center justify-center')}
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
            <div className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-items', 'space-y-1.5')}>
              {canAdd && showInlineAddCard ? (
                <button
                  type="button"
                  onClick={onAdd}
                  className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-item', railAddCardClass)}
                >
                  <div className={DESIGNER_CLASSNAME + 'documents-rail-leading'}>
                    <div className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-preview', railPreviewClass, 'bg-white')}>
                      <Plus size={18} />
                    </div>
                  </div>
                  <div className={DESIGNER_CLASSNAME + 'documents-rail-meta'}>
                    <Text strong className={mergeClassNames(DESIGNER_CLASSNAME + 'text-auto', 'block text-[0.78rem] font-medium leading-tight text-slate-800')}>
                      {addPageLabel}
                    </Text>
                    <Text type="secondary" className={mergeClassNames(DESIGNER_CLASSNAME + 'text-auto', 'block text-[0.68rem] leading-tight text-slate-500')}>
                      Añade una página al final del documento
                    </Text>
                  </div>
                </button>
              ) : null}
              {items.map((item, index) => {
                const isSelected = item.selected ?? item.id === selectedId;
                return (
                  <div
                    key={item.id}
                    className={mergeClassNames(
                      DESIGNER_CLASSNAME + 'documents-rail-item-wrapper',
                      'group flex items-stretch gap-1.5',
                      isSelected ? DESIGNER_CLASSNAME + 'documents-rail-item-wrapper-active' : '',
                    )}
                  >
                    <button
                      type="button"
                      disabled={item.disabled}
                      aria-pressed={isSelected}
                      onClick={() => onSelect?.(item.id)}
                      className={mergeClassNames(
                        DESIGNER_CLASSNAME + 'documents-rail-item',
                        railItemBaseClass,
                        'flex-1',
                        isSelected ? railItemActiveClass : '',
                      )}
                      data-active={isSelected ? 'true' : 'false'}
                    >
                      <div className={DESIGNER_CLASSNAME + 'documents-rail-leading'}>
                        {item.previewSrc ? (
                          <div className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-preview', railPreviewClass)}>
                            <img
                              src={item.previewSrc}
                              alt={item.name}
                              className={DESIGNER_CLASSNAME + 'documents-rail-preview-image'}
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className={mergeClassNames(
                            DESIGNER_CLASSNAME + 'documents-rail-preview',
                            railPreviewClass,
                            'border-sky-100 bg-sky-50 text-sky-600',
                          )}>
                            <span className="text-[0.68rem] font-bold">{(item.pageLabel || `${index + 1}`).substring(0, 2)}</span>
                          </div>
                        )}
                      </div>
                      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-meta', 'min-w-0 flex-1 space-y-1')}>
                        <Text strong ellipsis={{ tooltip: item.name }} className={mergeClassNames(DESIGNER_CLASSNAME + 'text-auto', 'block text-[0.78rem] font-medium leading-tight text-slate-800')}>
                          {item.name}
                        </Text>
                        <div className={DESIGNER_CLASSNAME + 'documents-rail-meta-row'}>
                          <Text type="secondary" ellipsis={{ tooltip: item.pageLabel || `${index + 1}` }} className={mergeClassNames(DESIGNER_CLASSNAME + 'text-auto', 'block text-[0.68rem] leading-tight text-slate-500')}>
                            {pageLabelPrefix} {item.pageLabel || `${index + 1}`}
                          </Text>
                          {isSelected ? (
                            <span className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-active-badge', 'inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-1.5 text-[10px] font-medium leading-none text-sky-700')}>
                              Activo
                            </span>
                          ) : null}
                        </div>
                        {item.meta ? (
                          <Text type="secondary" ellipsis={{ tooltip: item.meta }} className={mergeClassNames(DESIGNER_CLASSNAME + 'text-auto', 'block text-[0.68rem] leading-tight text-slate-500')}>
                            {item.meta}
                          </Text>
                        ) : null}
                      </div>
                    </button>
                    {canDelete && items.length > 1 ? (
                      <Popconfirm
                        title="¿Eliminar documento?"
                        description={`Se eliminará "${item.name}" y sus campos del diseño.`}
                        okText="Eliminar"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          onDelete!(item.id);
                        }}
                        onCancel={(e) => e?.stopPropagation()}
                      >
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<Trash2 size={13} />}
                          className={mergeClassNames(
                            DESIGNER_CLASSNAME + 'documents-rail-delete-btn',
                            'inline-flex h-8 w-8 shrink-0 self-center items-center justify-center rounded-full border border-slate-200 bg-white text-rose-600 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-[opacity,background-color,border-color,box-shadow,transform] duration-150 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60 focus-visible:ring-offset-1',
                          )}
                          aria-label={`Eliminar ${item.name}`}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Popconfirm>
                    ) : null}
                  </div>
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
                  className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-empty-upload', emptyActionClass)}
                >
                  {uploadLabel}
                </Button>
              ) : null}
              className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-empty', 'rounded-[0.95rem] border border-dashed border-slate-200 bg-slate-50/80 p-3')}
            />
          )}
        </SidebarBody>
      </SidebarFrame>
    </div>
  );
};

export default DocumentsRail;
