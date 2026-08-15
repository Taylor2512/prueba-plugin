/**
 * InlineMetricsOverlay — muestra métricas rápidas de selección.
 *
 * Presenta ancho y alto calculados desde los bounds activos. Es un overlay
 * puramente visual: no participa en selección, drag, resize ni persistencia.
 */


/**
 * Props del overlay de métricas inline.
 */
type InlineMetricsOverlayProps = {
  bounds: { top: number; left: number; width: number; height: number } | null;
};

const BADGE_SIZE = { width: 92, height: 22 };
const BADGE_GAP = 6;
const TOOLBAR_HEIGHT_HINT = 36;

const clampBadgeValue = (value: number, min: number, max: number) => Math.min(Math.max(min, value), max);

const resolveBadgePosition = (bounds: NonNullable<InlineMetricsOverlayProps['bounds']>) => {
  const canvasRoot = typeof document !== 'undefined'
    ? document.querySelector<HTMLElement>('.sisad-pdfme-designer-canvas')
    : null;
  const viewportLeft = canvasRoot?.scrollLeft ?? 0;
  const viewportTop = canvasRoot?.scrollTop ?? 0;
  const viewportWidth = canvasRoot?.clientWidth ?? 0;
  const viewportHeight = canvasRoot?.clientHeight ?? 0;
  const minLeft = viewportLeft + BADGE_GAP;
  const maxLeft = Math.max(minLeft, viewportLeft + viewportWidth - BADGE_SIZE.width - BADGE_GAP);
  const left = clampBadgeValue(bounds.left, minLeft, maxLeft);
  const bottom = bounds.top + bounds.height;
  const enoughSpaceAbove = bounds.top - viewportTop >= TOOLBAR_HEIGHT_HINT + BADGE_SIZE.height + BADGE_GAP * 2;
  const preferredTop = enoughSpaceAbove
    ? bottom + BADGE_GAP
    : bounds.top - BADGE_SIZE.height - BADGE_GAP;
  const maxTop = Math.max(viewportTop + BADGE_GAP, viewportTop + viewportHeight - BADGE_SIZE.height - BADGE_GAP);
  const top = clampBadgeValue(preferredTop, viewportTop + BADGE_GAP, maxTop);

  return { top, left };
};

/**
 * Muestra ancho y alto redondeados de la selección activa.
 */
const InlineMetricsOverlay = ({ bounds }: InlineMetricsOverlayProps) => {
  if (!bounds) return null;
  const width = Math.max(0, Math.round(bounds.width));
  const height = Math.max(0, Math.round(bounds.height));
  const position = resolveBadgePosition(bounds);

  return (
    <div
      className="sisad-pdfme-ui-inline-metrics pointer-events-none absolute inline-flex min-h-[22px] items-center rounded-[9px] border border-slate-200/80 bg-white/96 px-2 py-0.5 text-[10.5px] font-medium text-slate-500 shadow-[0_1px_2px_rgba(15,23,42,0.06)] backdrop-blur-sm"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {`${width}px × ${height}px`}
    </div>
  );
};

export default InlineMetricsOverlay;
