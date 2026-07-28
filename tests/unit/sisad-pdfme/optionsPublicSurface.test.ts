import { describe, expect, it } from 'vitest';
import {
  OptionListWidget,
} from '@/sisad-pdfme/schemas/options/OptionListWidget';

describe('sisad-pdfme option widgets public surface', () => {
  it('exposes the named option list widget export', () => {
    expect(typeof OptionListWidget).toBe('function');
  });
});
