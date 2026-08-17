import React, { useContext } from 'react';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { I18nContext } from '@sisad-pdfme/ui/contexts';
import { mergeUniqueClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';
import type { Dict } from '@sisad-pdfme/common';

export type LeftSidebarTab = 'standard' | 'custom' | 'prefill';
export type SidebarTabOption = { id: LeftSidebarTab; label: string; badge?: number };

/**
 * Keys de `Dict` por pestaña.
 *
 * Este componente tenía su propio mapa de etiquetas fijas que además mezclaba
 * idiomas (`Estándar` junto a `Custom`/`Prefill`) y pisaba la etiqueta que le
 * pasaba `LeftSidebar`. Ahora sólo declara QUÉ key resolver; el texto sale del
 * diccionario del idioma activo.
 *
 * `full` es la etiqueta completa y `short` la del rail/densidad reducida, donde
 * la completa no cabe.
 */
const TAB_LABEL_KEYS: Record<LeftSidebarTab, { full: keyof Dict; short: keyof Dict }> = {
  standard: { full: 'catalog.tabs.standard', short: 'catalog.tabsShort.standard' },
  custom: { full: 'catalog.tabs.custom', short: 'catalog.tabsShort.custom' },
  prefill: { full: 'catalog.tabs.prefill', short: 'catalog.tabsShort.prefill' },
};

type LeftSidebarTabsProps = {
  tabs: SidebarTabOption[];
  activeTab: LeftSidebarTab;
  onChangeTab: (tab: LeftSidebarTab) => void;
  renderTabIcon: (tab: LeftSidebarTab) => React.ReactNode;
  density?: 'comfortable' | 'compact' | 'minimal';
};

const LeftSidebarTabs = ({
  tabs,
  activeTab,
  onChangeTab,
  renderTabIcon,
  density = 'comfortable',
}: LeftSidebarTabsProps) => {
  const translate = useContext(I18nContext);
  const useRailLabel = density !== 'comfortable';
  const labelFor = (tab: SidebarTabOption) =>
    translate(TAB_LABEL_KEYS[tab.id][useRailLabel ? 'short' : 'full']);
  // Nombre accesible: siempre la etiqueta completa, aunque en pantalla se pinte
  // la variante corta.
  const accessibleNameFor = (tab: SidebarTabOption) => translate(TAB_LABEL_KEYS[tab.id].full);

  return (
  <ul
    className={mergeUniqueClassNames(
      `${DESIGNER_CLASSNAME}left-sidebar-tablist`,
      'grid w-full min-w-0 grid-cols-3 gap-0.5 overflow-hidden rounded-xl border border-slate-200/70 bg-slate-50/90 p-0.5 shadow-sm',
    )}
    role="tablist"
    aria-orientation="horizontal"
    aria-label={translate('catalog.tabsAriaLabel')}>
    {tabs.map((tab) => (
      <li key={tab.id} role="none" className="min-w-0">
        <button
          type="button"
          // El id del DOM se deriva del identificador de la pestaña, NO de su
          // etiqueta: si dependiera del texto visible, cambiar de idioma
          // cambiaría el id y rompería selectores y referencias ARIA.
          id={`${DESIGNER_CLASSNAME}left-sidebar-tab-${tab.id}`}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-label={accessibleNameFor(tab)}
          title={accessibleNameFor(tab)}
          className={mergeUniqueClassNames(
            `${DESIGNER_CLASSNAME}left-sidebar-tab-btn`,
            'group relative inline-flex min-h-[1.8rem] w-full min-w-0 flex-col items-center justify-center gap-[0.06rem] rounded-[0.7rem] border border-transparent bg-transparent px-1 py-[0.18rem] text-slate-500 cursor-pointer transition-[background,color,border-color,box-shadow,transform] duration-150 hover:border-slate-200 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-50',
            density === 'comfortable' ? 'text-[0.54rem]' : 'min-h-[1.7rem] gap-0 px-0.5 py-[0.14rem] text-[0.48rem]',
            activeTab === tab.id
              ? 'border-sky-200 bg-white text-sky-700 shadow-sm ring-1 ring-sky-100 after:absolute after:bottom-[2px] after:left-[28%] after:right-[28%] after:h-[2px] after:rounded-[1px] after:bg-sky-500 after:content-[\'\']'
              : '',
          )}
          onClick={() => onChangeTab(tab.id)}
        >
          <span className="inline-flex items-center justify-center [&>svg]:h-3 [&>svg]:w-3 [&>svg]:transition-transform group-hover:[&>svg]:scale-110">
            {renderTabIcon(tab.id)}
          </span>
          {/* El contador va en línea con la etiqueta: flotándolo sobre la
              esquina se solapaba con el texto en paneles estrechos. */}
          <span
            className={
              density !== 'minimal'
                ? 'flex max-w-full min-w-0 items-center justify-center gap-1 px-0.5 text-center font-semibold leading-[1.02]'
                : 'sr-only'
            }
          >
            <span className="truncate">
              {labelFor(tab)}
            </span>
            {/* Un contador en cero solo roba ancho a la etiqueta. */}
            {typeof tab.badge === 'number' && tab.badge > 0 && density !== 'minimal' ? (
              <span
                className={mergeUniqueClassNames(
                  `${DESIGNER_CLASSNAME}left-sidebar-tab-badge`,
                  'inline-flex h-[0.85rem] min-w-[0.85rem] flex-shrink-0 items-center justify-center rounded-full px-[0.2rem] text-[8px] font-bold leading-none transition-colors',
                  activeTab === tab.id
                    ? 'bg-sky-100 text-sky-700'
                    : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300 group-hover:text-slate-600',
                )}
              >
                {tab.badge}
              </span>
            ) : null}
          </span>
          {typeof tab.badge === 'number' && tab.badge > 0 && density === 'minimal' ? (
            <span
              className={mergeUniqueClassNames(
                `${DESIGNER_CLASSNAME}left-sidebar-tab-badge`,
                'absolute right-0.5 top-0.5 inline-flex h-[0.7rem] min-w-[0.7rem] items-center justify-center rounded-full px-[0.15rem] text-[7px] font-bold leading-none',
                activeTab === tab.id ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-500',
              )}
            >
              {tab.badge}
            </span>
          ) : null}
        </button>
      </li>
    ))}
  </ul>
  );
};

export default LeftSidebarTabs;
