/**
 * Accessible, portal-backed type filter for the right sidebar field list.
 *
 * Replaces the native `<select>` (which rendered the unstyled macOS menu,
 * escaped the panel and could not be themed) with a controlled listbox:
 *
 * - trigger + popover follow the SISAD surface language (Tailwind only);
 * - the popover is portaled to `document.body` so sidebar `overflow-hidden`
 *   never clips it, and it flips above the trigger when space is tight;
 * - full keyboard support (Arrow/Home/End/Enter/Escape) and roving
 *   `aria-activedescendant`;
 * - marked as a designer control so opening it never starts canvas selection
 *   or drag.
 *
 * It is purely presentational: it emits the chosen value through `onChange`
 * and owns no filter state.
 */
import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';
import { stopDesignerControlEvent } from '@sisad-pdfme/ui/components/Designer/shared/interactionExclusions';

type Option = { value: string; label: string };

type Props = {
  id?: string;
  value: string;
  options: Option[];
  onChange: (_value: string) => void;
  densityMode?: 'compact' | 'comfortable' | 'minimal';
  ariaLabel?: string;
  className?: string;
};

/** Vertical gap between the trigger and the popover, in pixels. */
const POPUP_GAP = 4;
/** Maximum popover height before it scrolls internally, in pixels. */
const POPUP_MAX_HEIGHT = 264;

type PopupPosition = {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
  placement: 'below' | 'above';
};

const TypeFilterSelect = ({
  id,
  value,
  options,
  onChange,
  densityMode = 'compact',
  ariaLabel = 'Filtrar por tipo de campo',
  className,
}: Props) => {
  const reactId = useId();
  const listboxId = id ? `${id}-listbox` : `${reactId}-listbox`;
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [position, setPosition] = useState<PopupPosition | null>(null);

  const isMinimalDensity = densityMode === 'minimal';
  const selectedIndex = useMemo(
    () => Math.max(0, options.findIndex((option) => option.value === value)),
    [options, value],
  );
  const selectedLabel = options[selectedIndex]?.label ?? options[0]?.label ?? '';

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - POPUP_GAP;
    const spaceAbove = rect.top - POPUP_GAP;
    const placeAbove = spaceBelow < 160 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(
      120,
      Math.min(POPUP_MAX_HEIGHT, (placeAbove ? spaceAbove : spaceBelow) - 4),
    );
    setPosition({
      left: Math.round(rect.left),
      top: Math.round(placeAbove ? rect.top - POPUP_GAP : rect.bottom + POPUP_GAP),
      width: Math.round(rect.width),
      maxHeight: Math.round(maxHeight),
      placement: placeAbove ? 'above' : 'below',
    });
  }, []);

  const closeMenu = useCallback((returnFocus = true) => {
    setOpen(false);
    setActiveIndex(-1);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  const openMenu = useCallback(() => {
    updatePosition();
    setActiveIndex(selectedIndex);
    setOpen(true);
  }, [selectedIndex, updatePosition]);

  const commit = useCallback(
    (index: number) => {
      const option = options[index];
      if (option) onChange(option.value);
      closeMenu();
    },
    [closeMenu, onChange, options],
  );

  // Keep the popover anchored while the sidebar or window scrolls/resizes.
  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const onReflow = () => updatePosition();
    window.addEventListener('resize', onReflow);
    window.addEventListener('scroll', onReflow, true);
    return () => {
      window.removeEventListener('resize', onReflow);
      window.removeEventListener('scroll', onReflow, true);
    };
  }, [open, updatePosition]);

  // Move DOM focus into the listbox so arrow keys are captured there.
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  // Close on outside pointer interaction.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      closeMenu(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [closeMenu, open]);

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMenu();
    }
  };

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % options.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (activeIndex >= 0) commit(activeIndex);
        break;
      case 'Escape':
        event.preventDefault();
        closeMenu();
        break;
      case 'Tab':
        closeMenu(false);
        break;
      default:
        break;
    }
  };

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    // `scrollIntoView` no existe en algunos entornos (jsdom/SSR): guardado.
    if (node && typeof node.scrollIntoView === 'function') node.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const triggerHeight = isMinimalDensity ? 'h-7' : 'h-8';

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        data-designer-control="true"
        data-interaction-exclusion="true"
        data-testid="right-sidebar-fields-type-filter"
        onPointerDownCapture={stopDesignerControlEvent}
        onMouseDownCapture={stopDesignerControlEvent}
        onClick={(event) => {
          stopDesignerControlEvent(event);
          if (open) closeMenu();
          else openMenu();
        }}
        onKeyDown={handleTriggerKeyDown}
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'list-view-type-filter',
          'inline-flex min-w-0 flex-1 appearance-none items-center justify-between gap-1.5 rounded-xl border border-slate-200 bg-white px-2 text-[0.6875rem] text-slate-700 outline-none transition-colors hover:border-slate-300 focus-visible:border-sky-200 focus-visible:ring-2 focus-visible:ring-sky-100',
          triggerHeight,
          isMinimalDensity ? 'min-w-[9rem]' : 'min-w-[10rem]',
          className,
        )}
      >
        <span className="min-w-0 truncate">{selectedLabel}</span>
        <ChevronDown
          size={14}
          className={mergeClassNames('shrink-0 text-slate-400 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && typeof document !== 'undefined' && position
        ? createPortal(
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              tabIndex={-1}
              aria-label={ariaLabel}
              aria-activedescendant={activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined}
              data-designer-control="true"
              data-interaction-exclusion="true"
              data-testid="right-sidebar-fields-type-filter-listbox"
              onPointerDownCapture={stopDesignerControlEvent}
              onMouseDownCapture={stopDesignerControlEvent}
              onKeyDown={handleListKeyDown}
              className={mergeClassNames(
                DESIGNER_CLASSNAME + 'list-view-type-filter-listbox',
                // Reutiliza la capa de overlay del sidebar (RightSidebar usa z-[70]).
                'fixed z-[70] m-0 list-none overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white p-1 shadow-lg outline-none [scrollbar-gutter:stable]',
              )}
              style={{
                left: position.left,
                width: position.width,
                maxHeight: position.maxHeight,
                ...(position.placement === 'above'
                  ? { top: position.top, transform: 'translateY(-100%)' }
                  : { top: position.top }),
              }}
            >
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isActive = index === activeIndex;
                return (
                  <li
                    key={option.value}
                    id={`${listboxId}-opt-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    data-index={index}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={(event) => {
                      stopDesignerControlEvent(event);
                      commit(index);
                    }}
                    className={mergeClassNames(
                      'flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[0.6875rem] leading-tight text-slate-700 transition-colors',
                      isActive ? 'bg-sky-50 text-sky-800' : 'hover:bg-slate-50',
                      isSelected && 'font-semibold',
                    )}
                  >
                    <span className="min-w-0 truncate">{option.label}</span>
                    {isSelected ? <Check size={14} className="shrink-0 text-sky-600" /> : null}
                  </li>
                );
              })}
            </ul>,
            document.body,
          )
        : null}
    </>
  );
};

export default TypeFilterSelect;
