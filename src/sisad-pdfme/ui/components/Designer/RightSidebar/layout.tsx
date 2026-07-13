import React from 'react';
import { DESIGNER_CLASSNAME } from '../../../constants.js';
import { mergeClassNames } from '../shared/className.js';

/** Padding horizontal estándar del sidebar derecho, en píxeles. */
export const SIDEBAR_H_PADDING_PX = 12;

/** Padding vertical estándar del sidebar derecho, en píxeles. */
export const SIDEBAR_V_PADDING_PX = 6;

/** Altura base estimada del header del sidebar, en píxeles. */
export const SIDEBAR_HEADER_HEIGHT = 52;

type SectionProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Contenido de la sección. */
  children: React.ReactNode;
};

type SidebarFrameProps = SectionProps & {
  /** Clase adicional para customizar el frame. */
  className?: string;
};

type SidebarHeaderProps = SectionProps & {
  /** Si es true, el header organiza el contenido verticalmente. */
  stacked?: boolean;
};

/**
 * Frame base para superficies internas del sidebar derecho.
 *
 * Define el contenedor principal con layout vertical, clipping interno,
 * borde y fondo estándar. Se usa como base para ListView, DetailView,
 * DocumentsRail y otros paneles.
 */
export const SidebarFrame = ({ children, className, ...props }: SidebarFrameProps) => (
  <div
    className={mergeClassNames(
      DESIGNER_CLASSNAME + 'sidebar-frame',
      DESIGNER_CLASSNAME + 'right-sidebar-layout-frame',
      'flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 shadow-sm',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

/**
 * Header base para paneles del sidebar derecho.
 *
 * Puede usarse en modo horizontal normal o en modo `stacked` cuando el header
 * contiene filtros/controles en varias líneas.
 */
export const SidebarHeader = ({ children, className, stacked = false, ...props }: SidebarHeaderProps) => (
  <div
    className={mergeClassNames(
      DESIGNER_CLASSNAME + 'right-sidebar-layout-header',
      stacked
        ? 'flex flex-none flex-col items-stretch justify-start gap-1.5 border-b border-slate-200/70 px-2.5 py-2'
        : 'flex flex-none items-center justify-between gap-2 border-b border-slate-200/70 px-2.5 py-2',
      className,
    )}
    {...props}
  >
    {children}
    <div
      aria-hidden="true"
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'right-sidebar-layout-header-divider',
        'my-0 border-t border-slate-200',
        stacked ? 'w-full' : 'hidden',
      )}
    />
  </div>
);

/**
 * Cuerpo scrollable del sidebar derecho.
 *
 * Esta sección debe contener el contenido principal del panel y mantiene
 * scroll vertical independiente para no desplazar el resto del diseñador.
 */
export const SidebarBody = ({ children, className, ...props }: SectionProps) => (
  <div
    className={mergeClassNames(DESIGNER_CLASSNAME + 'right-sidebar-layout-body', 'min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-2 py-2', className)}
    {...props}
  >
    {children}
  </div>
);

/**
 * Footer fijo para acciones inferiores del sidebar.
 *
 * Se usa especialmente en flujos de edición masiva o acciones de confirmación.
 */
export const SidebarFooter = ({ children, className, ...props }: SectionProps) => (
  <div
    className={mergeClassNames(
      DESIGNER_CLASSNAME + 'right-sidebar-layout-footer',
      'flex-none border-t border-slate-200/70 px-2.5 py-2',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
