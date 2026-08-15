import type { OptionItem } from '@sisad-pdfme/schemas/options/optionTypes';
import {
  buildGroupWrapper,
  buildGroupContainer,
  buildGroupLabel,
  buildOptionRow,
  buildOptionLabel,
  applyOptionGroupBodyVariant,
  applyOptionGroupRowVariant,
  shouldShowOptionLabels,
} from '@sisad-pdfme/schemas/groupSchemaRender';
import { createOptionIndicatorElement } from '@sisad-pdfme/schemas/options/optionIndicator';

type OptionGroupRenderMode = 'designer' | 'form' | 'viewer';

// Designer double-click detection by click timing. The native `dblclick` event
// is unreliable here: selecting the group re-renders (rebuilds the option DOM)
// between the two physical clicks, so the browser never fires `dblclick` on a
// stable node. We instead compare click timestamps stored in a module-level map
// keyed by group+option, which survives re-renders. No timers involved.
const OPTION_DOUBLE_CLICK_MS = 450;
const lastOptionClickAt = new Map<string, number>();

export type OptionGroupRuntimeParams = {
  options: OptionItem[];
  selectionMode: 'single' | 'multiple';
  selectedOptionId?: string | null;
  selectedOptionIds?: string[];
  editable?: boolean;
  color?: string;
  ownerColor?: string;
  orientation?: 'vertical' | 'horizontal';
  spacing?: number;
  groupName?: string;
  schema?: unknown;
  /** Runtime mode; drives aria + interactivity of internal option rows. */
  mode?: OptionGroupRenderMode;
  required?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  /** Render the visual group caption. Default false: name lives in aria-label only. */
  showGroupLabel?: boolean;
  /** Render visible per-option text. Default false (marker-only, DocuSign-like). */
  showOptionLabels?: boolean;
  resolveSelection?: (params: {
    option: OptionItem;
    currentSelection: {
      selectedOptionId?: string | null;
      selectedOptionIds: string[];
    };
  }) => {
    content: string;
    selectedOptionId?: string;
    selectedOptionIds?: string[];
  } | null;
  onChange?: (arg: { key: string; value: unknown } | Array<{ key: string; value: unknown }>) => void;
};

// Create a DOM runtime representation for an option-based group (radio/checkbox).
export const createOptionGroupRuntime = (params: OptionGroupRuntimeParams): HTMLDivElement => {
  const {
    options,
    selectionMode,
    selectedOptionId,
    selectedOptionIds,
    editable = false,
    color = '#1677ff',
    ownerColor,
    orientation = 'vertical',
    spacing = 3,
    groupName,
    schema,
    mode,
    required = false,
    readOnly = false,
    invalid = false,
    showGroupLabel = false,
    showOptionLabels = false,
    resolveSelection,
    onChange,
  } = params;

  const isViewer = mode === 'viewer';
  // Stable-ish key for this group so double-click timing survives re-renders.
  const groupKey = (() => {
    const s = schema as Record<string, unknown> | undefined;
    return String((s?.schemaUid ?? s?.id ?? s?.name ?? groupName ?? 'option-group') || 'option-group');
  })();
  const resolvedShowOptionLabels =
    showOptionLabels ?? (mode === 'designer' ? shouldShowOptionLabels(schema) : true);
  // Form toggles values on click. Designer only toggles values on double click
  // so a single click can still select the root schema wrapper.
  const rowsInteractive = mode === 'form' && editable && !readOnly;
  const rowsDesignerInteractive = mode === 'designer' && editable && !readOnly;
  const rowsValueInteractive = rowsInteractive || rowsDesignerInteractive;

  const wrapper = buildGroupWrapper();
  wrapper.classList.add('sisad-pdfme-option-group-wrapper');
  const container = buildGroupContainer({ color, gap: spacing, isHorizontal: orientation === 'horizontal' });
  container.classList.add('sisad-pdfme-option-group-body');

  // Group-level a11y/state hooks (root data-schema-id stays on rootElement).
  wrapper.setAttribute('role', selectionMode === 'single' ? 'radiogroup' : 'group');
  // Group name is exposed for assistive tech but NOT rendered as a visible
  // caption — it would consume field height and clip options.
  if (groupName) wrapper.setAttribute('aria-label', groupName);
  if (required) wrapper.setAttribute('aria-required', 'true');
  if (invalid) wrapper.setAttribute('aria-invalid', 'true');
  if (readOnly || isViewer) wrapper.setAttribute('aria-readonly', 'true');
  if (mode) wrapper.dataset.renderMode = mode;
  wrapper.dataset.optionGroupInvalid = String(Boolean(invalid));
  // Marker-only by default: option text lives in aria-label, not visually.
  wrapper.dataset.optionLabels = resolvedShowOptionLabels ? 'visible' : 'hidden';

  // Tag the inner container so CSS can target it.
  container.dataset.optionGroupBody = 'true';
  // Inline overrides beat the builder's inline styles (CSS can't). The schema
  // root/chrome owns the frame; the body must not draw its own border/bg and
  // must never clip options (overflow:hidden was cutting the last row).
  Object.assign(container.style, {
    border: 'none',
    background: 'transparent',
    padding: '0',
    overflow: 'visible',
    alignItems: orientation === 'horizontal' ? 'center' : 'flex-start',
    // Fill the schema box so the markers scale when the group is resized.
    width: '100%',
    height: '100%',
  });
  applyOptionGroupBodyVariant(container, {
    showOptionLabels: resolvedShowOptionLabels,
    isHorizontal: orientation === 'horizontal',
  });

  // Visual caption is opt-in (designer + __designer.showGroupLabel). Off by default.
  if (showGroupLabel && groupName) {
    const label = buildGroupLabel(groupName, color);
    label.dataset.optionGroupLabel = 'true';
    label.style.display = 'none';
    container.appendChild(label);
  }

  const selectedSet = new Set(Array.isArray(selectedOptionIds) ? selectedOptionIds : []);

  options.forEach((opt) => {
    const isSelected = selectionMode === 'single' ? opt.optionId === selectedOptionId : selectedSet.has(opt.optionId);

    const row = buildOptionRow({
      color,
      isHorizontal: orientation === 'horizontal',
      editable: rowsValueInteractive,
      role: selectionMode === 'single' ? 'radio' : 'checkbox',
      optionId: opt.optionId,
      dataAttr: selectionMode === 'single' ? 'data-radio-group-option' : 'data-checkbox-group-option',
    });
    // Accessible state for the option control (button + role=checkbox/radio).
    row.classList.add('sisad-pdfme-option-group__option');
    row.setAttribute('aria-checked', String(Boolean(isSelected)));
    // Option text is exposed to assistive tech but not rendered (marker-only).
    const optionAriaLabel = String(
      opt.label || (opt as { value?: string }).value || opt.optionId || '',
    ).trim();
    if (optionAriaLabel) {
      row.setAttribute('aria-label', optionAriaLabel);
    }
    applyOptionGroupRowVariant(row, { showOptionLabels: resolvedShowOptionLabels });
    row.style.minHeight = mode === 'viewer' ? '14px' : '16px';
    // Treat any non-form mode as non-interactive for option toggling. Avoid
    // checking 'pdf' literal which is not part of the OptionGroupRenderMode.
    if (mode === 'viewer' || readOnly || !rowsValueInteractive) {
      row.setAttribute('aria-disabled', 'true');
      row.disabled = true;
      row.style.opacity = '0.85';
    }
    // Interactive rows must opt back INTO pointer events: the option-group root is
    // pointer-events:none so Moveable/Selecto can grab the schema, but that makes
    // the rows click-through too. Re-enabling here lets clicks land on the option
    // (so single-click keeps the root selected and double-click toggles the value)
    // while empty group areas still fall through to the root for selection/drag.
    row.style.pointerEvents = rowsValueInteractive ? 'auto' : 'none';
    // Rows split the box evenly so the markers scale with the group size (resize).
    row.style.flex = '1 1 0';
    row.style.minHeight = '0';
    row.style.minWidth = '0';
    row.style.alignItems = 'center';

    const indicator = createOptionIndicatorElement({
      shape: selectionMode === 'single' ? 'circle' : 'square',
      checked: !!isSelected,
      color,
      ownerColor,
      mode: mode ?? 'viewer',
      size: 16,
      // Scale with the group box so resizing the schema resizes every marker.
      fill: true,
      readOnly: readOnly || isViewer,
      disabled: !rowsValueInteractive,
    });
    indicator.classList.add('sisad-pdfme-option-group-indicator');

    row.appendChild(indicator);
    // Visible per-option text is opt-in; default marker-only.
    if (resolvedShowOptionLabels) {
      const optionLabel = buildOptionLabel(opt.label || opt.optionId, color);
      optionLabel.dataset.optionLabelVisible = 'true';
      row.appendChild(optionLabel);
    }

    const commitSelection = () => {
      if (typeof onChange !== 'function') return;

      if (resolveSelection) {
        const nextSelection = resolveSelection({
          option: opt,
          currentSelection: {
            selectedOptionId,
            selectedOptionIds: Array.from(selectedSet),
          },
        });

        if (nextSelection) {
          const changes: Array<{ key: string; value: unknown }> = [];
          if ('content' in nextSelection) changes.push({ key: 'content', value: nextSelection.content });
          if ('selectedOptionId' in nextSelection) {
            changes.push({ key: 'selectedOptionId', value: nextSelection.selectedOptionId });
          }
          if ('selectedOptionIds' in nextSelection) {
            changes.push({ key: 'selectedOptionIds', value: nextSelection.selectedOptionIds });
          }
          onChange(changes);
        }
        return;
      }

      if (selectionMode === 'single') {
        onChange([
          { key: 'content', value: opt.optionId },
          { key: 'selectedOptionId', value: opt.optionId },
        ]);
        return;
      }

      const current = new Set(selectedSet);
      if (current.has(opt.optionId)) current.delete(opt.optionId);
      else current.add(opt.optionId);
      const next = Array.from(current);
      onChange([
        { key: 'content', value: next.join(',') },
        { key: 'selectedOptionIds', value: next },
      ]);
    };

    if (rowsInteractive && typeof onChange === 'function') {
      row.addEventListener('mouseup', (e) => {
        e.preventDefault();
        e.stopPropagation();
        commitSelection();
      });
    }

    if (rowsDesignerInteractive && typeof onChange === 'function') {
      // Designer: a SINGLE click bubbles so the root schema stays selected; a
      // DOUBLE click (two clicks within the threshold) toggles the value. Detected
      // by timing rather than the native dblclick event (see note at top of file).
      const clickKey = `${groupKey}:${opt.optionId}`;
      // Use `mouseup` (not `click`/`dblclick`): selecting the group rebuilds the
      // option DOM on mousedown, so the browser never fires `click`/`dblclick` on
      // a stable node. `mouseup` fires reliably on each press; two within the
      // threshold count as a double-click and toggle the value.
      row.addEventListener('mouseup', (e) => {
        const now = Date.now();
        const prev = lastOptionClickAt.get(clickKey) || 0;
        if (now - prev <= OPTION_DOUBLE_CLICK_MS) {
          lastOptionClickAt.delete(clickKey);
          e.preventDefault();
          e.stopPropagation();
          commitSelection();
          return;
        }
        lastOptionClickAt.set(clickKey, now);
        // Single press: no value change; the root stays selected.
      });
    }

    container.appendChild(row);
  });

  wrapper.appendChild(container);
  if (invalid) {
    Object.assign(wrapper.style, {
      border: '1px solid var(--color-danger, #dc2626)',
      borderRadius: 'var(--sisad-schema-radius)',
    });
  }
  return wrapper;
};
