/**
 * DetailViewContent — layout visual del inspector de propiedades.
 *
 * Renderiza header y secciones del DetailView dentro del frame de sidebar, además
 * de marcar el área como interactiva para que el canvas no capture clicks,
 * arrastres o context menu provenientes del inspector.
 */
import React from 'react';
import type { SchemaForUI, PropPanelWidgetProps } from '@sisad-pdfme/common';
import type { useForm } from 'form-render';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { mergeClassNames } from '../../shared/className.js';
import { SidebarBody, SidebarFrame } from '../layout.js';
import DetailHeaderCard from './DetailHeaderCard.js';
import DetailFormSection from './DetailFormSection.js';
import { Lock } from 'lucide-react';
import type { SchemaDesignerConfig } from '../../../../designerEngine.js';
import type { DetailInspectorSection } from './detailSchemas.js';
import { stopInspectorPointerEvent } from './inspectorInteractionGuards.js';
import type { SchemaAccessState } from '../../shared/accessPolicy.js';

/**
 * Props del layout visual del DetailView.
 */
type DetailViewContentProps = {
  activeSchema: SchemaForUI;
  schemaConfig: SchemaDesignerConfig | null;
  deselectSchema: () => void;
  form: ReturnType<typeof useForm>;
  sections: DetailInspectorSection[];
  widgets: Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element>;
  watchHandler: (..._args: unknown[]) => void;
  backTooltip?: string;
  readOnly?: boolean;
  accessState?: SchemaAccessState;
};

/**
 * Renderiza header y secciones del inspector dentro del sidebar.
 *
 * @param props Datos visuales y form state del DetailView.
 * @returns Contenido interactivo del inspector.
 */
const DetailViewContent = ({
  activeSchema,
  schemaConfig,
  deselectSchema,
  form,
  sections,
  widgets,
  watchHandler,
  backTooltip = 'Volver a campos',
  readOnly = false,
  accessState,
}: DetailViewContentProps) => {
  const isLockedByOther = accessState?.isLockedByOther ?? false;

  return (
    <SidebarFrame
      className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-view', 'flex h-full min-h-0 flex-col')}
      data-testid="detail-view"
    >
      <SidebarBody
        tabIndex={0}
        aria-label="Secciones del detalle del campo"
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
        <DetailHeaderCard
          activeSchema={activeSchema}
          schemaConfig={schemaConfig}
          onBack={deselectSchema}
          backTooltip={backTooltip}
          showPosition={false}
        />

        {isLockedByOther && (
          <div className="mx-2.5 my-1.5 flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[0.64rem] text-amber-700">
            <Lock size={14} className="shrink-0" />
            <span>Este campo está siendo editado por otro usuario y no puede modificarse.</span>
          </div>
        )}

        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-view-sections', 'mt-0.5 space-y-[0.3125rem]')}>
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
              readOnly={readOnly}
            />
          ))}
        </div>
      </SidebarBody>
    </SidebarFrame>
  );
};

export default DetailViewContent;
