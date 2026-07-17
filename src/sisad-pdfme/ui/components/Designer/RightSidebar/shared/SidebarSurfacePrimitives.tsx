import React from 'react';

import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { mergeClassNames } from '../../shared/className.js';

/**
 * Lista vacía reutilizable de badges.
 *
 * Se declara como constante para evitar crear un nuevo array en cada render
 * cuando `SidebarSurfaceHeader` no recibe badges.
 */
const EMPTY_BADGES: SidebarSurfaceBadge[] = [];

/**
 * Badge compacto mostrado dentro del header de una superficie del sidebar.
 *
 * Se usa para mostrar contadores, estados, filtros activos o etiquetas
 * de contexto como:
 *
 * - cantidad visible / total;
 * - selección activa;
 * - estado de campo;
 * - modo de colaboración;
 * - advertencias resumidas.
 */
export type SidebarSurfaceBadge = {
  /**
   * Key estable para React.
   *
   * Si no se proporciona, el componente usa una combinación de tooltip,
   * label e índice como fallback.
   */
  key?: React.Key;

  /**
   * Contenido visible del badge.
   */
  label: React.ReactNode;

  /**
   * Color semántico visual.
   */
  color?:
    | 'default'
    | 'processing'
    | 'success'
    | 'warning'
    | 'error'
    | 'gold'
    | 'blue'
    | 'cyan'
    | 'purple';

  /**
   * Texto auxiliar mostrado como tooltip nativo mediante `title`.
   */
  tooltip?: string;
};

const resolveBadgeColorClass = (color: SidebarSurfaceBadge['color']) => {
  switch (color) {
    case 'processing':
    case 'blue':
      return 'border-sky-200 bg-sky-50 text-sky-700';
    case 'success':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'warning':
    case 'gold':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    case 'error':
      return 'border-rose-200 bg-rose-50 text-rose-700';
    case 'cyan':
      return 'border-cyan-200 bg-cyan-50 text-cyan-700';
    case 'purple':
      return 'border-violet-200 bg-violet-50 text-violet-700';
    default:
      return 'border-slate-200/70 bg-white text-slate-600';
  }
};

/**
 * Props del header reutilizable para superficies del sidebar.
 *
 * Esta primitiva estandariza el encabezado de paneles internos como:
 *
 * - lista de campos;
 * - detalle de schema;
 * - tarjetas compactas;
 * - secciones de inspector;
 * - bloques de configuración.
 */
type SidebarSurfaceHeaderProps = {
  /**
   * Título principal del header.
   */
  title: React.ReactNode;

  /**
   * Texto secundario opcional.
   *
   * Normalmente se usa para contexto, conteos o descripción corta.
   */
  subtitle?: React.ReactNode;

  /**
   * Nodo opcional a la izquierda del título.
   *
   * Ejemplos: ícono, badge de color, avatar o indicador de tipo.
   */
  leading?: React.ReactNode;

  /**
   * Nodo opcional a la derecha.
   *
   * Ejemplos: botones, menús, acciones rápidas o botón de volver.
   */
  trailing?: React.ReactNode;

  /**
   * Badges compactos mostrados debajo del título/subtítulo.
   */
  badges?: SidebarSurfaceBadge[];

  /**
   * Clases adicionales para customizar la superficie.
   */
  className?: string;

  /**
   * Activa una variante más compacta del header.
   */
  compact?: boolean;
};

/**
 * Header visual reutilizable para superficies del sidebar.
 *
 * Responsabilidades:
 *
 * - renderizar título y subtítulo;
 * - mostrar badges compactos;
 * - admitir contenido leading/trailing;
 * - mantener una estructura visual consistente entre paneles;
 * - centralizar clases base del runtime `sisad-pdfme`.
 *
 * Este componente es puramente presentacional:
 *
 * - no conoce schemas;
 * - no dispara comandos;
 * - no maneja selección;
 * - no accede a contexto del diseñador.
 */
export const SidebarSurfaceHeader = ({
  title,
  subtitle,
  leading,
  trailing,
  badges = EMPTY_BADGES,
  className,
  compact = false,
}: SidebarSurfaceHeaderProps) => {
  return (
    <div
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'sidebar-surface-header',
        'flex justify-between gap-1.5 rounded-[0.95rem] border border-slate-200/70 bg-white px-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] backdrop-blur-sm',
        compact ? 'items-center py-1' : 'items-start py-1.5',
        className,
      )}
    >
      {leading ? (
        <div
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'sidebar-surface-header-leading',
            'flex flex-none items-center',
          )}
        >
          {leading}
        </div>
      ) : null}

      <div
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'sidebar-surface-header-main',
          'min-w-0 flex-1',
        )}
      >
        <div
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'sidebar-surface-header-copy',
            'min-w-0 space-y-0.5',
          )}
        >
          <span
            className={mergeClassNames(
              DESIGNER_CLASSNAME + 'sidebar-surface-header-title',
              'block truncate font-semibold leading-tight text-slate-950',
              compact ? 'text-[0.7rem]' : 'text-[0.8rem]'
            )}
          >
            {title}
          </span>

          {subtitle ? (
            <span
              className={mergeClassNames(
                DESIGNER_CLASSNAME + 'sidebar-surface-header-subtitle',
                'block truncate leading-tight text-slate-600',
                compact ? 'text-[0.58rem]' : 'text-[0.64rem]'
              )}
            >
              {subtitle}
            </span>
          ) : null}

          {badges.length > 0 ? (
            <div
              className={mergeClassNames(
                DESIGNER_CLASSNAME + 'sidebar-surface-header-badges',
                'mt-0.5 flex flex-wrap gap-1',
              )}
            >
              {badges.map((badge, index) => {
                const badgeClassName = mergeClassNames(
                  'm-0 inline-flex items-center rounded-full border leading-none shadow-none',
                  resolveBadgeColorClass(badge.color),
                  compact ? 'h-4 px-[0.26rem] text-[0.56rem]' : 'h-5 px-1.5 text-[10px]',
                );

                const key = badge.key ?? badge.tooltip ?? String(badge.label) ?? index;

                return (
                  <span key={key} title={badge.tooltip} className={badgeClassName}>
                    {badge.label}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {trailing ? (
        <div
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'sidebar-surface-header-trailing',
            'flex shrink-0 items-center',
          )}
        >
          {trailing}
        </div>
      ) : null}

    </div>
  );
};

/**
 * Props del empty state reutilizable para superficies del sidebar.
 *
 * Sirve para comunicar que una sección no tiene datos, filtros sin resultados
 * o que el usuario debe realizar una acción inicial.
 */
type SidebarSurfaceEmptyStateProps = {
  /**
   * Ícono opcional mostrado encima o junto al texto principal.
   */
  icon?: React.ReactNode;

  /**
   * Título principal del estado vacío.
   */
  title: React.ReactNode;

  /**
   * Descripción opcional con más contexto.
   */
  description?: React.ReactNode;

  /**
   * Acción opcional.
   *
   * Ejemplos: limpiar filtros, agregar campo, abrir catálogo.
   */
  action?: React.ReactNode;

  /**
   * Clases adicionales para customizar el contenedor.
   */
  className?: string;
};

/**
 * Estado vacío reutilizable para paneles del sidebar.
 *
 * Responsabilidades:
 *
 * - mostrar un mensaje claro cuando no hay contenido;
 * - permitir un ícono contextual;
 * - permitir una acción de recuperación;
 * - mantener el mismo lenguaje visual del diseñador.
 *
 * Este componente también es puramente presentacional.
 */
export const SidebarSurfaceEmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: SidebarSurfaceEmptyStateProps) => {
  return (
    <div
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'sidebar-surface-empty',
        'rounded-xl',
        className,
      )}
    >
      {icon ? (
        <div
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'sidebar-surface-empty-icon',
            'text-slate-400',
          )}
        >
          {icon}
        </div>
      ) : null}

      <div
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'sidebar-surface-empty-copy',
          'space-y-1',
        )}
      >
        <div
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'sidebar-surface-empty-title',
            'text-[0.78rem] font-semibold text-slate-800',
          )}
        >
          {title}
        </div>

        {description ? (
          <div
            className={mergeClassNames(
              DESIGNER_CLASSNAME + 'sidebar-surface-empty-description',
              'text-[0.68rem] leading-4 text-slate-500',
            )}
          >
            {description}
          </div>
        ) : null}
      </div>

      {action ? (
        <div className={DESIGNER_CLASSNAME + 'sidebar-surface-empty-action'}>
          {action}
        </div>
      ) : null}
    </div>
  );
};
