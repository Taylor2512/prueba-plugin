import React from 'react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  buildSelectionToolbarModel,
  type SelectionToolbarMode,
} from './canvasContextMenuActions.js';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import type { InteractionState } from '../../shared/interactionState.js';
import { Loader2 } from 'lucide-react';
import { Ellipsis } from 'lucide-react';
import { useResponsiveDensity } from '../../shared/useResponsiveDensity.js';
import { mergeClassNames } from '../../shared/className.js';

type SelectionContextToolbarProps = {
  position: { top: number; left: number; width: number; height: number } | null;
  commands?: SelectionCommandSet;
  activeElements: HTMLElement[];
  activeSchemas: SchemaForUI[];
  interactionState: InteractionState;
  contextMenuOpen?: boolean;
  toolbarMode?: SelectionToolbarMode;
  defaultToolbarMode?: SelectionToolbarMode;
  onToolbarModeChange?: (mode: SelectionToolbarMode) => void;
};

const SelectionContextToolbar = ({
  position,
  commands,
  activeElements,
  activeSchemas,
  interactionState,
  contextMenuOpen = false,
  toolbarMode,
  defaultToolbarMode,
  onToolbarModeChange,
}: SelectionContextToolbarProps) => {
  const toolbarRef = React.useRef<HTMLDivElement | null>(null);
  const { mode: toolbarDensityMode } = useResponsiveDensity(toolbarRef, {
    comfortable: 340,
    compact: 268,
    mini: 214,
  });
  const [internalToolbarMode, setInternalToolbarMode] = React.useState<SelectionToolbarMode>(
    defaultToolbarMode ?? (interactionState.selectionCount > 1 ? 'compact' : 'micro'),
  );
  const primarySchemaId = activeSchemas[0]?.id ?? '';
  const toolbarSeed = defaultToolbarMode ?? (interactionState.selectionCount > 1 ? 'compact' : 'micro');

  React.useEffect(() => {
    setInternalToolbarMode(toolbarSeed);
  }, [toolbarSeed, primarySchemaId]);

  const requestedToolbarMode = toolbarMode ?? internalToolbarMode;
  const resolvedToolbarMode: SelectionToolbarMode =
    toolbarDensityMode === 'mini'
      ? 'micro'
      : toolbarDensityMode === 'compact' && requestedToolbarMode === 'expanded'
        ? 'compact'
        : requestedToolbarMode;
  const isExpanded = resolvedToolbarMode === 'expanded';
  const isMicro = resolvedToolbarMode === 'micro';
  const nextToolbarMode: SelectionToolbarMode = isMicro ? 'compact' : isExpanded ? 'compact' : 'expanded';
  const toggleLabel = isMicro ? 'Compacto' : isExpanded ? 'Menos' : 'Expandir';

  const selectionCount = interactionState.selectionCount;
  const toolbarModel = buildSelectionToolbarModel({
    commands,
    activeSchemas,
    selectionCount,
    interactionPhase: interactionState.phase,
    mode: resolvedToolbarMode,
  });
  const miniPrimaryActions = isMicro ? toolbarModel.primaryActions.slice(0, 2) : toolbarModel.primaryActions;
  const renderToolbarButton = (btn: (typeof toolbarModel.primaryActions)[number]) => (
    <button
      key={btn.id}
      type="button"
      title={btn.disabled && btn.disabledReason ? btn.disabledReason : btn.label}
      aria-label={btn.label}
      aria-pressed={btn.active ? 'true' : 'false'}
      data-active={btn.active ? 'true' : 'false'}
      data-critical={btn.critical ? 'true' : 'false'}
      data-danger={btn.danger ? 'true' : 'false'}
      data-loading={btn.loading ? 'true' : 'false'}
      data-schema-interactive-control="true"
      disabled={btn.disabled || !btn.onSelect || btn.loading}
      aria-busy={btn.loading ? 'true' : 'false'}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        btn.onSelect?.();
      }}
      className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
    >
      <span className="sisad-pdfme-ui-selection-context-toolbar-action-icon" aria-hidden="true">
        {btn.loading ? <Loader2 size={14} className="sisad-pdfme-ui-selection-context-toolbar-spinner" /> : btn.icon}
      </span>
      <span className="sisad-pdfme-ui-selection-context-toolbar-action-label">{btn.label}</span>
    </button>
  );

  if (!position || !commands || !activeElements.length) return null;
  if (['editing', 'dragging', 'resizing', 'rotating'].includes(interactionState.phase)) return null;
  if (contextMenuOpen) return null;

  return (
    <div
      ref={toolbarRef}
      className="sisad-pdfme-ui-selection-context-toolbar rounded-2xl border border-slate-200/70 bg-white/95 p-2 shadow-lg backdrop-blur"
      role="toolbar"
      aria-label="Barra contextual de edición"
      data-schema-interactive-control="true"
      data-selection-count={String(selectionCount)}
      data-interaction-phase={interactionState.phase}
      data-selection-kind={toolbarModel.kind}
      data-toolbar-mode={resolvedToolbarMode}
      data-toolbar-density={toolbarDensityMode}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: isExpanded ? 'min(100%, 24rem)' : isMicro ? 'min(100%, 15rem)' : 'min(100%, 19rem)',
      }}
      >
      <div className="sisad-pdfme-ui-selection-context-toolbar-summary flex flex-wrap items-center gap-1.5" aria-label="Resumen de selección">
        {toolbarModel.summaryChips.map((chip, index) => (
          <span
            key={`summary-${chip}`}
            className={mergeClassNames(
              'sisad-pdfme-ui-selection-context-toolbar-chip inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
              index === 0 ? 'is-primary border-sky-200 bg-sky-50 text-sky-700' : 'border-slate-200 bg-slate-50 text-slate-600',
            )}
          >
            {chip}
          </span>
        ))}
        <button
          type="button"
          className="sisad-pdfme-ui-selection-context-toolbar-toggle inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm"
          aria-label={toggleLabel}
          aria-pressed={isExpanded ? 'true' : 'false'}
          data-schema-interactive-control="true"
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            const nextMode = nextToolbarMode;
            setInternalToolbarMode(nextMode);
            onToolbarModeChange?.(nextMode);
          }}
        >
          {toggleLabel}
        </button>
      </div>
      {!isMicro && toolbarModel.stateChips.length > 0 ? (
        <div className="sisad-pdfme-ui-selection-context-toolbar-state mt-2 flex flex-wrap gap-1" aria-label="Estado de la selección">
          {toolbarModel.stateChips.map((chip) => (
            <span
              key={`state-${chip}`}
              className="sisad-pdfme-ui-selection-context-toolbar-state-chip inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500"
            >
              {chip}
            </span>
          ))}
        </div>
      ) : null}

      <div className="sisad-pdfme-ui-selection-context-toolbar-actions mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Acciones rápidas">
        {miniPrimaryActions.map(renderToolbarButton)}
        {isMicro ? (
          <button
            type="button"
            title="Más acciones"
            aria-label="Más acciones"
            data-schema-interactive-control="true"
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const nextMode: SelectionToolbarMode = 'compact';
              setInternalToolbarMode(nextMode);
              onToolbarModeChange?.(nextMode);
            }}
          >
            <span className="sisad-pdfme-ui-selection-context-toolbar-action-icon inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600" aria-hidden="true">
              <Ellipsis size={14} />
            </span>
            <span className="sisad-pdfme-ui-selection-context-toolbar-action-label text-[11px] font-medium text-slate-700">Más</span>
          </button>
        ) : null}
      </div>
      {isExpanded && toolbarModel.secondarySections.length > 0 ? (
        <div className="sisad-pdfme-ui-selection-context-toolbar-sections mt-2 space-y-2" aria-label="Acciones avanzadas">
          {toolbarModel.secondarySections.map((section) => (
            <section key={section.id} className="sisad-pdfme-ui-selection-context-toolbar-section rounded-xl border border-slate-200 bg-slate-50 p-2">
              <div className="sisad-pdfme-ui-selection-context-toolbar-section-label mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{section.label}</div>
              <div className="sisad-pdfme-ui-selection-context-toolbar-section-actions flex flex-wrap gap-1.5" role="group" aria-label={section.label}>
                {section.items.map(renderToolbarButton)}
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SelectionContextToolbar;
