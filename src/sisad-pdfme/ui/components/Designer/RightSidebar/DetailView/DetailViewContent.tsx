/**
 * DetailViewContent — layout visual del inspector de propiedades.
 *
 * Renderiza header y secciones del DetailView dentro del frame de sidebar, además
 * de marcar el área como interactiva para que el canvas no capture clicks,
 * arrastres o context menu provenientes del inspector.
 */
import React from 'react';
import type { SchemaForUI, PropPanelWidgetProps } from '@sisad-pdfme/common';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { mergeClassNames } from '../../shared/className.js';
import { SidebarBody, SidebarFrame } from '../layout.js';
import DetailHeaderCard from './DetailHeaderCard.js';
import DetailFormSection, { type SectionFormInstance } from './DetailFormSection.js';
import { Lock } from 'lucide-react';
import type { SchemaDesignerConfig } from '../../../../designerEngine.js';
import type { DetailInspectorSection } from './detailSchemas.js';
import { stopInspectorPointerEvent } from './inspectorInteractionGuards.js';
import {
  describeSchemaAccessDenyReason,
  type SchemaAccessState,
} from '../../shared/accessPolicy.js';

/**
 * Props del layout visual del DetailView.
 */
type DetailViewContentProps = {
  activeSchema: SchemaForUI;
  resetToken?: string;
  schemaConfig: SchemaDesignerConfig | null;
  selectionCount?: number;
  deselectSchema: () => void;
  /** Valores del schema activo con los que se hidrata cada sección. */
  hydrationValues: Record<string, unknown>;
  sections: DetailInspectorSection[];
  widgets: Record<string, (_widgetProps: PropPanelWidgetProps) => React.JSX.Element>;
  watchHandler: (
    _values: Record<string, unknown>,
    _form: SectionFormInstance,
    _touchedKeys: ReadonlySet<string>,
  ) => void;
  backTooltip?: string;
  readOnly?: boolean;
  accessState?: SchemaAccessState;
  collaborationContext?: React.ComponentProps<typeof DetailHeaderCard>['collaborationContext'];
};

/**
 * Renderiza header y secciones del inspector dentro del sidebar.
 *
 * @param props Datos visuales y form state del DetailView.
 * @returns Contenido interactivo del inspector.
 */
const DetailViewContent = ({
  activeSchema,
  resetToken,
  schemaConfig,
  selectionCount,
  deselectSchema,
  hydrationValues,
  sections,
  widgets,
  watchHandler,
  backTooltip = 'Volver a campos',
  readOnly = false,
  accessState,
  collaborationContext,
}: DetailViewContentProps) => {
  // El aviso y el `disabled` de los widgets salen del mismo `accessState`: si el
  // badge dice "bloqueado", los controles están deshabilitados, y viceversa.
  const accessNotice = React.useMemo(() => {
    if (!accessState) return null;
    if (accessState.isRuntimeReadOnly) {
      return 'El documento está en modo solo lectura. No se pueden modificar las propiedades del campo.';
    }
    if (accessState.isLockedByOther) {
      return 'Este campo está siendo editado por otro usuario y no puede modificarse.';
    }
    if (!accessState.canEditStructure) {
      return (
        describeSchemaAccessDenyReason(accessState.reasons.structure) ||
        'No tienes permiso para modificar este campo.'
      );
    }
    // Candado propio: informativo, no bloquea. Se distingue explícitamente del
    // candado ajeno para no deshabilitar el inspector de quien tomó el candado.
    if (accessState.isLockedByMe) {
      return 'Estás editando este campo con un bloqueo activo a tu nombre.';
    }
    return null;
  }, [accessState]);

  const isBlocking = Boolean(accessState && !accessState.canEditStructure);

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
          selectionCount={selectionCount}
          collaborationContext={collaborationContext}
          onBack={deselectSchema}
          backTooltip={backTooltip}
          showPosition={false}
        />

        {accessNotice ? (
          <div
            data-testid="detail-view-access-notice"
            data-access-blocking={isBlocking ? 'true' : 'false'}
            className={mergeClassNames(
              'mx-2 my-1.5 flex items-start gap-1.5 rounded-lg border px-2 py-1 text-[0.61rem] leading-tight',
              isBlocking
                ? 'border-amber-200/80 bg-amber-50/90 text-amber-700'
                : 'border-slate-200/80 bg-slate-50/90 text-slate-600',
            )}
          >
            <Lock size={14} className="shrink-0" />
            <span>{accessNotice}</span>
          </div>
        ) : null}

        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'detail-view-sections', 'mt-0.5 space-y-1 pb-1.5')}>
          {sections.map((section) => (
            <DetailFormSection
              key={section.key}
              sectionKey={section.key}
              title={section.title}
              description={section.description}
              schema={section.schema}
              hydrationValues={hydrationValues}
              widgets={widgets}
              watchHandler={watchHandler}
              // El perfil por tipo decide qué secciones nacen abiertas; sin esto
              // todas se renderizaban expandidas y el inspector obligaba a
              // scrollear para llegar a lo relevante del tipo activo.
              defaultCollapsed={section.defaultCollapsed}
              resetToken={resetToken}
              readOnly={readOnly}
            />
          ))}
        </div>
      </SidebarBody>
    </SidebarFrame>
  );
};

export default DetailViewContent;
