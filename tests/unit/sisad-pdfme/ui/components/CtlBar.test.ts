import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/ui/components/CtlBar';
import { resolveSaveStatusPresentation } from '@/sisad-pdfme/ui/components/CtlBar';

describe('sisad-pdfme/ui/components/CtlBar.tsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });

  describe('resolveSaveStatusPresentation', () => {
    it('maps each save status to its accessible label', () => {
      expect(resolveSaveStatusPresentation('saving').label).toBe('Guardando…');
      expect(resolveSaveStatusPresentation('saved').label).toBe('Guardado');
      expect(resolveSaveStatusPresentation('error').label).toBe('Error al guardar');
      expect(resolveSaveStatusPresentation('dirty').label).toBe('Cambios sin guardar');
    });

    it('treats idle/undefined as neutral with no visible label', () => {
      expect(resolveSaveStatusPresentation('idle')).toEqual({ label: '', tone: 'neutral', live: 'off' });
      expect(resolveSaveStatusPresentation(undefined)).toEqual({ label: '', tone: 'neutral', live: 'off' });
    });

    it('assigns tones and live-region politeness per status', () => {
      expect(resolveSaveStatusPresentation('saved').tone).toBe('positive');
      expect(resolveSaveStatusPresentation('dirty').tone).toBe('warning');
      expect(resolveSaveStatusPresentation('saving').tone).toBe('pending');
      expect(resolveSaveStatusPresentation('error').tone).toBe('danger');
      // Errors interrupt (assertive); everything else is polite or off.
      expect(resolveSaveStatusPresentation('error').live).toBe('assertive');
      expect(resolveSaveStatusPresentation('saving').live).toBe('polite');
    });
  });
});
