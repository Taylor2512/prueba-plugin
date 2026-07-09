import { describe, expect, it } from 'vitest';
import {
  createOptionIndicatorElement,
  getOptionIndicatorAriaRole,
  getOptionIndicatorIcon,
  renderOptionIndicatorSvg,
} from '@/sisad-pdfme/schemas/options/optionIndicator.js';

describe('sisad-pdfme/schemas/options/optionIndicator.ts', () => {
  it('renders the expected aria roles by mode', () => {
    expect(getOptionIndicatorAriaRole({ mode: 'form', shape: 'square' })).toBe('checkbox');
    expect(getOptionIndicatorAriaRole({ mode: 'form', shape: 'circle' })).toBe('radio');
    expect(getOptionIndicatorAriaRole({ mode: 'designer', shape: 'square' })).toBe('presentation');
    expect(getOptionIndicatorAriaRole({ mode: 'form', shape: 'square', readOnly: true })).toBe('presentation');
  });

  it('creates a compact checked indicator element', () => {
    const indicator = createOptionIndicatorElement({
      shape: 'square',
      checked: true,
      color: '#1677ff',
      mode: 'form',
      size: 12,
    });

    expect(indicator.tagName).toBe('SPAN');
    expect(indicator.dataset.optionIndicatorShape).toBe('square');
    expect(indicator.dataset.optionIndicatorState).toBe('checked');
    expect(indicator.dataset.optionIndicatorMode).toBe('form');
    expect(indicator.getAttribute('role')).toBe('checkbox');
    expect(indicator.getAttribute('aria-checked')).toBe('true');
    expect(indicator.style.width).toBe('12px');
    expect(indicator.innerHTML).toContain('<svg');
  });

  it('renders the correct svg icon family for checked and unchecked states', () => {
    expect(getOptionIndicatorIcon({ shape: 'square', checked: false })).toBeNull();
    expect(getOptionIndicatorIcon({ shape: 'square', checked: true })).toBe('check');
    expect(getOptionIndicatorIcon({ shape: 'circle', checked: true })).toBe('dot');

    expect(renderOptionIndicatorSvg({
      shape: 'square',
      checked: true,
      color: '#1677ff',
      mode: 'pdf',
    })).toContain('<polyline');

    expect(renderOptionIndicatorSvg({
      shape: 'circle',
      checked: true,
      color: '#1677ff',
      mode: 'pdf',
    })).toContain('<circle');
  });
});
