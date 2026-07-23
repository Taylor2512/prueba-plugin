export const DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS = [
  '[data-option-id]',
  '[data-role="group-add-option"]',
  '[data-schema-interactive-control]',
  '.sisad-pdfme-option-group__add-button',
  '.sisad-pdfme-option-group-floating-action',
  '.sisad-pdfme-ui-selection-context-toolbar',
  '.sisad-pdfme-option-group-action-overlay',
  '.moveable-control',
  '.moveable-line',
  '.moveable-control-box',
  // Controles/modales del diseñador: Selecto/Moveable jamás deben capturar
  // eventos originados dentro de ellos (TASK-INTERACTION-016).
  '[data-interaction-exclusion="true"]',
  '[data-designer-control="true"]',
  '[data-designer-modal="true"]',
  '.ant-modal-root',
  '.ant-modal-mask',
  '.ant-modal-wrap',
  '.ant-modal',
  '[class^="ant-modal-"]',
  '.ant-modal-content',
  '.ant-dropdown',
  '[class^="ant-dropdown-"]',
  '.ant-dropdown-menu',
  '.ant-popover',
  '.ant-select-dropdown',
  '.ant-picker-dropdown',
  '.ant-tooltip',
  '[role="dialog"]',
  '[role="button"]',
  'button',
  'input',
  'textarea',
  'select',
  '[contenteditable="true"]',
] as const;

/**
 * In-schema interactive controls that must receive their own pointer events
 * (instead of starting a Moveable drag) and must never be Selecto targets.
 * Centralized so Canvas hit-testing and the policy share one list.
 */
const DESIGNER_INTERACTIVE_CONTROL_SELECTORS = [
  '[data-schema-interactive-control]',
  '[data-role="group-add-option"]',
  '[data-checkbox-convert-to-group]',
  '[data-checkbox-group-add-option]',
  '[data-checkbox-group-option]',
] as const;

export const DESKTOP_EDITABLE_TARGET_SELECTORS = [
  'input',
  'textarea',
  'select',
  'button[role="switch"]',
  '[role="switch"]',
  '[role="checkbox"]',
  '[contenteditable=""]',
  '[contenteditable="true"]',
  '[contenteditable="plaintext-only"]',
  '[role="textbox"]',
  '.ant-input',
  '.ant-input-affix-wrapper',
  '.ant-input-number',
  '.ant-select',
  '.ant-select-selector',
  '.ant-picker',
  '.ant-switch',
  '.ant-switch-handle',
  '.ant-switch-inner',
  '.ant-checkbox',
  '.ant-checkbox-wrapper',
  '.ant-checkbox-input',
  '.ant-checkbox-inner',
] as const;

export const ANTD_POPUP_SELECTORS = [
  '.ant-select-dropdown',
  '.ant-dropdown',
  '.ant-popover',
  '.ant-modal',
  '.ant-tooltip',
  '.ant-picker-dropdown',
] as const;

export const buildSelectorList = (selectors: readonly string[]): string => selectors.join(', ');
