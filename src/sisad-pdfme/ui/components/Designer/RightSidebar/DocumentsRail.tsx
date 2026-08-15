import React from 'react';
import { Button, Popconfirm, Typography } from 'antd';
import { FileText, FileUp, Plus, Trash2 } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { SidebarBody, SidebarFrame, SidebarHeader } from '@sisad-pdfme/ui/components/Designer/RightSidebar/layout';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';
import { SidebarSurfaceEmptyState, SidebarSurfaceHeader } from '@sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives';

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
  // `border-0` explícito en todo <button>: sin preflight de Tailwind heredarían
  // el `2px outset` del navegador (ver tailwind.config.js).
  const headerActionClass = 'appearance-none rounded-full border-0 bg-slate-100/80 text-slate-700 shadow-none transition hover:bg-slate-200/70 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40';
  // Una sola superficie por documento: la fila es el propio botón. El borrar se
  // superpone dentro de la fila, no en un contenedor aparte.
  const railItemBaseClass = 'relative flex w-full items-center gap-2 rounded-[0.75rem] border-0 bg-white px-2 py-2 text-left shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-[background-color,box-shadow] duration-150 hover:bg-slate-50 hover:shadow-[0_2px_5px_rgba(15,23,42,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40 disabled:cursor-not-allowed disabled:opacity-60';
  const railItemActiveClass = 'bg-sky-50 shadow-[0_1px_3px_rgba(14,165,233,0.12)] ring-1 ring-inset ring-sky-200 hover:bg-sky-50';
  const railPreviewClass = 'flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border-0 bg-slate-100 text-slate-500';
  const railAddCardClass = 'flex w-full items-center gap-2 rounded-[0.75rem] border border-dashed border-slate-300 bg-transparent px-2 py-2 text-left transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/35';
  const emptyActionClass = 'appearance-none rounded-full border-0 bg-slate-100 text-slate-700 shadow-none transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/35';

  return (
    <div
      className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-wrapper', 'min-h-0 flex-1')}
      style={style}
    >
      <SidebarFrame
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'documents-rail',
          'flex min-h-0 flex-col overflow-hidden rounded-[0.875rem] border-0 bg-transparent shadow-none',
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
            // El contador va en la fila del título (`meta`), no como badge bajo
            // el subtítulo: suelto debajo se leía como un dato sin etiqueta.
            meta={hasItems ? (
              <span className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-count', 'inline-flex shrink-0 items-center rounded-full bg-slate-100 px-1.5 py-[0.0625rem] text-[10px] font-semibold leading-none text-slate-600 tabular-nums')}>
                {items.length}
              </span>
            ) : null}
            // `stacked`: en un rail estrecho las acciones bajan a su propia fila
            // en vez de comprimirse y salirse del panel.
            stacked
            trailing={(
              <div className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-header-actions', 'flex min-w-0 items-center gap-1.5')}>
                {canUpload ? (
                  <Button
                    size="small"
                    type="text"
                    htmlType="button"
                    icon={<FileUp size={14} />}
                    onClick={onUploadPdf}
                    className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-action', headerActionClass, 'inline-flex h-7 min-w-0 flex-1 items-center justify-center gap-1 px-2 text-[11.5px] font-semibold')}
                  >
                    <span className="truncate">{uploadLabel}</span>
                  </Button>
                ) : null}
                {canAddPage ? (
                  <Button
                    size="small"
                    type="text"
                    htmlType="button"
                    icon={<Plus size={14} />}
                    onClick={onAdd}
                    className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-action', headerActionClass, 'inline-flex h-7 w-7 shrink-0 items-center justify-center')}
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
                  aria-label={String(addPageLabel)}
                >
                  <div className={DESIGNER_CLASSNAME + 'documents-rail-leading'}>
                    <div className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-preview', railPreviewClass, 'bg-white')}>
                      <Plus size={18} />
                    </div>
                  </div>
                  <div className={DESIGNER_CLASSNAME + 'documents-rail-meta'}>
                    <Text strong className={mergeClassNames(DESIGNER_CLASSNAME + 'text-auto', 'block text-[12px] font-semibold leading-tight text-slate-900')}>
                      {addPageLabel}
                    </Text>
                    <Text type="secondary" className={mergeClassNames(DESIGNER_CLASSNAME + 'text-auto', 'block text-[11px] leading-tight text-slate-500')}>
                      Añade una página al final del documento
                    </Text>
                  </div>
                </button>
              ) : null}
              {items.map((item, index) => {
                const isSelected = item.selected ?? item.id === selectedId;
                const canDeleteItem = canDelete && items.length > 1;
                return (
                  <div
                    key={item.id}
                    data-active={isSelected ? 'true' : 'false'}
                    className={mergeClassNames(
                      DESIGNER_CLASSNAME + 'documents-rail-item-wrapper',
                      'group relative',
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
                        isSelected ? railItemActiveClass : '',
                        // espacio reservado para la acción de borrar superpuesta
                        canDeleteItem ? 'pr-9' : '',
                      )}
                      data-active={isSelected ? 'true' : 'false'}
                    >
                      <div className={DESIGNER_CLASSNAME + 'documents-rail-leading'}>
                        {item.previewSrc ? (
                          <div className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-preview', railPreviewClass, 'shadow-[0_1px_2px_rgba(15,23,42,0.04)]')}>
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
                            isSelected ? 'bg-sky-100 text-sky-700' : '',
                          )}>
                            <span className="text-[0.72rem] font-bold tabular-nums">{(item.pageLabel || `${index + 1}`).substring(0, 2)}</span>
                          </div>
                        )}
                      </div>
                      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-meta', 'min-w-0 flex-1')}>
                        <Text strong ellipsis={{ tooltip: item.name }} className={mergeClassNames(DESIGNER_CLASSNAME + 'text-auto', 'block text-[12px] font-semibold leading-tight text-slate-900')}>
                          {item.name}
                        </Text>
                        {/* Una sola línea de metadatos: el índice ya lo comunica
                            la miniatura, así que aquí solo va el dato propio del
                            documento y el estado activo. */}
                        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-meta-row', 'mt-0.5 flex min-w-0 items-center gap-1.5')}>
                          {item.meta ? (
                            <span className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-meta-text', 'min-w-0 truncate text-[11px] leading-tight text-slate-500')} title={String(item.meta)}>
                              {item.meta}
                            </span>
                          ) : (
                            <span className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-meta-text', 'min-w-0 truncate text-[11px] leading-tight text-slate-500')}>
                              {`${pageLabelPrefix} ${item.pageLabel || index + 1}`.trim()}
                            </span>
                          )}
                          {isSelected ? (
                            <span className={mergeClassNames(DESIGNER_CLASSNAME + 'documents-rail-active-badge', 'inline-flex shrink-0 items-center rounded-full bg-sky-100 px-1.5 py-[0.0625rem] text-[10px] font-semibold leading-none text-sky-700')}>
                              Activo
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </button>
                    {canDeleteItem ? (
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
                          icon={<Trash2 size={13} />}
                          className={mergeClassNames(
                            DESIGNER_CLASSNAME + 'documents-rail-delete-btn',
                            // Superpuesto dentro de la fila y anclado a su borde
                            // derecho: deja de ser una segunda caja flotante.
                            // Siempre presente (accesible en táctil, donde no hay
                            // hover) pero atenuado para no competir con el nombre.
                            'absolute right-1.5 top-1/2 z-10 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg border-0 bg-transparent text-slate-400 opacity-60 shadow-none transition-[opacity,background-color,color] duration-150 hover:bg-rose-50 hover:text-rose-600 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60 group-hover:opacity-100',
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
