import React from 'react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  buildSelectionToolbarModel,
  type SelectionToolbarMode,
} from './canvasContextMenuActions.js';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import type { InteractionState } from '../../shared/interactionState.js';
import { Loader2 } from 'lucide-react';

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
  const [internalToolbarMode, setInternalToolbarMode] = React.useState<SelectionToolbarMode>(
    defaultToolbarMode ?? (interactionState.selectionCount > 1 ? 'expanded' : 'micro'),
  );

  React.useEffect(() => {
    const nextMode = defaultToolbarMode ?? (interactionState.selectionCount > 1 ? 'expanded' : 'micro');
    setInternalToolbarMode(nextMode);
  }, [activeSchemas[0]?.id, defaultToolbarMode, interactionState.selectionCount]);

  const resolvedToolbarMode = toolbarMode ?? internalToolbarMode;
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

  if (!position || !commands || !activeElements.length) return null;
  if (['editing', 'dragging', 'resizing', 'rotating'].includes(interactionState.phase)) return null;
  if (contextMenuOpen) return null;

  return (
    <div
      className="sisad-pdfme-ui-selection-context-toolbar"
      role="toolbar"
      aria-label="Barra contextual de edición"
      data-selection-count={String(selectionCount)}
      data-interaction-phase={interactionState.phase}
      data-selection-kind={toolbarModel.kind}
      data-toolbar-mode={resolvedToolbarMode}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: isExpanded ? 'min(100%, 32rem)' : isMicro ? 'min(100%, 18rem)' : 'min(100%, 24rem)',
      }}
    >
      <div className="sisad-pdfme-ui-selection-context-toolbar-summary" aria-label="Resumen de selección">
        {toolbarModel.summaryChips.map((chip, index) => (
          <span
            key={`summary-${chip}`}
            className={[
              'sisad-pdfme-ui-selection-context-toolbar-chip',
              index === 0 ? 'is-primary' : '',
            ].filter(Boolean).join(' ')}
          >
            {chip}
          </span>
        ))}
        <button
          type="button"
          className="sisad-pdfme-ui-selection-context-toolbar-toggle"
          aria-label={toggleLabel}
          aria-pressed={isExpanded ? 'true' : 'false'}
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
        <div className="sisad-pdfme-ui-selection-context-toolbar-state" aria-label="Estado de la selección">
          {toolbarModel.stateChips.map((chip) => (
            <span key={`state-${chip}`} className="sisad-pdfme-ui-selection-context-toolbar-state-chip">
              {chip}
            </span>
          ))}
        </div>
      ) : null}

      <div className="sisad-pdfme-ui-selection-context-toolbar-actions" role="group" aria-label="Acciones rápidas">
        {toolbarModel.primaryActions.map((btn) => (
          <button
            key={btn.id}
            type="button"
            title={btn.disabled && btn.disabledReason ? btn.disabledReason : btn.label}
            aria-label={btn.label}
            aria-pressed={btn.active ? 'true' : 'false'}
            data-active={btn.active ? 'true' : 'false'}
            data-danger={btn.danger ? 'true' : 'false'}
            data-loading={btn.loading ? 'true' : 'false'}
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
          >
            <span className="sisad-pdfme-ui-selection-context-toolbar-action-icon" aria-hidden="true">
              {btn.loading ? <Loader2 size={14} className="sisad-pdfme-ui-selection-context-toolbar-spinner" /> : btn.icon}
            </span>
            <span className="sisad-pdfme-ui-selection-context-toolbar-action-label">{btn.label}</span>
          </button>
        ))}
      </div>
      {isExpanded && toolbarModel.secondarySections.length > 0 ? (
        <div className="sisad-pdfme-ui-selection-context-toolbar-sections" aria-label="Acciones avanzadas">
          {toolbarModel.secondarySections.map((section) => (
            <section key={section.id} className="sisad-pdfme-ui-selection-context-toolbar-section">
              <div className="sisad-pdfme-ui-selection-context-toolbar-section-label">{section.label}</div>
              <div className="sisad-pdfme-ui-selection-context-toolbar-section-actions" role="group" aria-label={section.label}>
                {section.items.map((btn) => (
                  <button
                    key={btn.id}
                    type="button"
                    title={btn.disabled && btn.disabledReason ? btn.disabledReason : btn.label}
                    aria-label={btn.label}
                    aria-pressed={btn.active ? 'true' : 'false'}
                    data-active={btn.active ? 'true' : 'false'}
                    data-danger={btn.danger ? 'true' : 'false'}
                    data-loading={btn.loading ? 'true' : 'false'}
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
                  >
                    <span className="sisad-pdfme-ui-selection-context-toolbar-action-icon" aria-hidden="true">
                      {btn.loading ? <Loader2 size={14} className="sisad-pdfme-ui-selection-context-toolbar-spinner" /> : btn.icon}
                    </span>
                    <span className="sisad-pdfme-ui-selection-context-toolbar-action-label">{btn.label}</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SelectionContextToolbar;
