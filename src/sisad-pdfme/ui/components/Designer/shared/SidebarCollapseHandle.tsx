import { Tooltip } from 'antd';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';

export type SidebarCollapseHandleProps = {
  side: 'left' | 'right';
  expanded: boolean;
  presentation: 'docked' | 'overlay';
  density?: 'full' | 'comfortable' | 'compact' | 'minimal';
  labelExpanded: string;
  labelCollapsed: string;
  /** Atajo mostrado en el tooltip, por ejemplo `⌘B`. */
  shortcutHint?: string;
  /**
   * `sm` para handles embebidos en una barra; `md` para los que van montados
   * sobre el borde del panel. No depende de la densidad: un handle que encoge
   * al colapsar movería el objetivo de clic bajo el cursor.
   */
  size?: 'sm' | 'md';
  onToggle: () => void;
  className?: string;
};

/**
 * Handle de colapso montado sobre el borde del sidebar.
 *
 * El icono apunta siempre hacia donde se moverá el panel, de modo que la
 * dirección del gesto es legible sin leer el tooltip.
 */
export const SidebarCollapseHandle = ({
  side,
  expanded,
  presentation,
  density = 'full',
  labelExpanded,
  labelCollapsed,
  shortcutHint,
  size = 'md',
  onToggle,
  className,
}: SidebarCollapseHandleProps) => {
  const isLeft = side === 'left';
  const compactTouchTarget = typeof window !== 'undefined' && window.innerWidth <= 768;
  // Expandido el panel se retrae hacia su borde; colapsado se despliega hacia el canvas.
  const pointsToStart = isLeft ? expanded : !expanded;
  const Icon = pointsToStart ? ChevronLeft : ChevronRight;
  const label = expanded ? labelExpanded : labelCollapsed;
  const placement = isLeft ? 'right' : 'left';
  const tooltipTitle = shortcutHint ? (
    <span className="inline-flex items-center gap-1.5">
      <span>{label}</span>
      <kbd className="rounded border border-white/25 px-1 py-px text-[0.62rem] font-semibold leading-none tracking-wide">
        {shortcutHint}
      </kbd>
    </span>
  ) : (
    label
  );

  return (
    <Tooltip title={tooltipTitle} placement={placement} mouseEnterDelay={0.35}>
      <button
        type="button"
        aria-expanded={expanded}
        aria-label={label}
        aria-keyshortcuts={shortcutHint ? (shortcutHint.startsWith('⌘') ? 'Meta+B' : 'Control+B') : undefined}
        data-testid={`sidebar-collapse-${side}`}
        data-side={side}
        data-expanded={expanded ? 'true' : 'false'}
        data-presentation={presentation}
        data-density={density}
        onClick={onToggle}
        style={compactTouchTarget ? { width: 44, height: 44 } : undefined}
        className={mergeClassNames(
          `${DESIGNER_CLASSNAME}sidebar-toggle-btn`,
          `${DESIGNER_CLASSNAME}sidebar-collapse-handle`,
          `${DESIGNER_CLASSNAME}sidebar-collapse-handle-${side}`,
          'group inline-flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500',
          'shadow-[0_2px_8px_rgba(15,23,42,0.12)] ring-1 ring-white',
          // `left`/`transform` acompañan el deslizamiento del panel cuando el
          // handle va montado sobre su borde.
          'transition-[left,right,transform,background-color,border-color,color,box-shadow] duration-200 ease-out',
          'motion-reduce:transition-none',
          'hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 hover:shadow-[0_3px_12px_rgba(15,23,42,0.18)]',
          'active:scale-95 motion-reduce:active:scale-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-1',
          size === 'sm' ? 'h-7 w-7' : 'h-8 w-8',
          className,
        )}
      >
        <Icon
          size={size === 'sm' ? 15 : 17}
          strokeWidth={2.4}
          className="transition-transform duration-150 group-hover:scale-110 motion-reduce:group-hover:scale-100"
          aria-hidden="true"
        />
      </button>
    </Tooltip>
  );
};
