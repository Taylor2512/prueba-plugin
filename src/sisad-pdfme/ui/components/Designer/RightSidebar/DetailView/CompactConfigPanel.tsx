/**
 * CompactConfigPanel — tarjeta resumida con modal de configuración avanzada.
 *
 * Sirve para widgets complejos del inspector que necesitan mostrar un resumen
 * compacto en el sidebar y abrir una edición detallada en modal. Marca su cuerpo
 * como interactivo para que Selecto, Moveable y canvas drop no capturen eventos.
 */
import React from 'react';
import { Button, Modal, Tag } from 'antd';
import { Settings2 } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { mergeClassNames } from '../../shared/className.js';
import { markInspectorInteractive, stopInspectorPointerEvent } from './inspectorInteractionGuards.js';

/**
 * Tag de estado mostrado en el resumen compacto del panel.
 */
type StatusTag = {
  label: string;
  color?: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue' | 'cyan' | 'purple';
};

/**
 * Props del panel compacto de configuración.
 *
 * Permite combinar una tarjeta de resumen con un modal que aloja controles más
 * extensos sin saturar el sidebar.
 */
type CompactConfigPanelProps = {
  title: string;
  description?: string;
  summary?: React.ReactNode;
  statusTags?: StatusTag[];
  quickActions?: React.ReactNode;
  footerActions?: React.ReactNode;
  modalTitle?: string;
  modalWidth?: number;
  modalTriggerLabel?: string;
  children: React.ReactNode;
};

/** Lista estable para evitar recrear arrays por defecto. */
const EMPTY_TAGS: StatusTag[] = [];

/**
 * Panel compacto con resumen, acciones rápidas y modal de edición detallada.
 *
 * @param props Configuración visual y contenido del panel.
 * @returns Tarjeta compacta del inspector con modal opcional.
 */
const CompactConfigPanel = ({
  title,
  description,
  summary,
  statusTags = EMPTY_TAGS,
  quickActions,
  footerActions,
  modalTitle,
  modalWidth = 720,
  modalTriggerLabel = 'Configurar',
  children,
}: CompactConfigPanelProps) => {
  const [open, setOpen] = React.useState(false);
  const modalBodyRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (open) {
      markInspectorInteractive(modalBodyRef.current);
    }
  }, [open]);

  return (
    <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel', 'rounded-xl border border-slate-200/70 bg-white/90 p-1.5 shadow-none')}>
      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-head', 'flex items-start justify-between gap-2')}>
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-copy', 'min-w-0 flex-1')}>
          <div
            className={mergeClassNames(
              DESIGNER_CLASSNAME + 'compact-config-panel-title',
              'min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[0.65rem] font-semibold leading-tight text-slate-900',
            )}
          >
            {title}
          </div>
          {description ? (
            <div
              className={mergeClassNames(
                DESIGNER_CLASSNAME + 'compact-config-panel-description',
                'min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[0.6rem] leading-3 text-slate-500',
              )}
            >
              {description}
            </div>
          ) : null}
        </div>
        {statusTags.length > 0 ? (
          <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-tags', 'flex flex-wrap gap-1.5')}>
            {statusTags.map((tag, index) => (
              <Tag key={`${tag.label}-${index}`} color={tag.color} className="m-0 inline-flex h-5 items-center rounded-full border border-slate-200 px-1.5 text-[10px] leading-none">
                {tag.label}
              </Tag>
            ))}
          </div>
        ) : null}
      </div>

      {summary ? (
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-summary', 'mt-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1')}>
          <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-summary-text', 'text-[0.68rem] leading-4 text-slate-700')}>
            {summary}
          </div>
        </div>
      ) : null}

      {quickActions ? (
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-actions', 'mt-2 flex flex-wrap gap-1.5')}>{quickActions}</div>
      ) : null}

      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-footer', 'mt-2 flex items-center justify-end gap-1.5')}>
        {footerActions ? <div className={mergeClassNames(DESIGNER_CLASSNAME + 'compact-config-panel-footer-actions', 'flex items-center gap-1.5')}>{footerActions}</div> : null}
        <Button
          size="small"
          type="default"
          icon={<Settings2 size={14} />}
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-lg border-slate-200 bg-white px-2.5 text-[0.68rem] font-semibold text-slate-700 shadow-none"
        >
          {modalTriggerLabel}
        </Button>
      </div>

      <Modal
        destroyOnHidden
        open={open}
        onCancel={() => setOpen(false)}
        title={modalTitle || title}
        width={modalWidth}
        centered
        footer={null}
      >
        <div
          ref={modalBodyRef}
          data-sisad-inspector-interactive="true"
          data-selecto-ignore="true"
          data-moveable-ignore="true"
          data-canvas-drop-ignore="true"
          onPointerDown={stopInspectorPointerEvent}
          onMouseDown={stopInspectorPointerEvent}
          onClick={stopInspectorPointerEvent}
          onDoubleClick={stopInspectorPointerEvent}
          onDragStart={stopInspectorPointerEvent}
          onDrop={stopInspectorPointerEvent}
          onContextMenu={stopInspectorPointerEvent}
        >
          {children}
        </div>
      </Modal>
    </div>
  );
};

export default CompactConfigPanel;
