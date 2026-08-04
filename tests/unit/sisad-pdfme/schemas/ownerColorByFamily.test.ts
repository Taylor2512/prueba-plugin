/**
 * COLOR-001 — ninguna familia inventa su paleta.
 *
 * Firma/iniciales y los marcadores de opción pintaban con literales propios
 * (crema, azul claro y turquesa), así que un campo asignado a un destinatario no
 * se veía de su color como el resto. Estas pruebas fijan que el respaldo sea el
 * tono del dueño y que un color declarado en el schema siga mandando.
 */
import { describe, expect, it } from 'vitest';
import { resolveSignaturePlaceholderColors } from '@/sisad-pdfme/schemas/signature';
import initialsPlugin from '@/sisad-pdfme/schemas/signature/initials';
import { propPanel as signaturePropPanel } from '@/sisad-pdfme/schemas/signature/propPanel';
import { renderOptionIndicatorSvg } from '@/sisad-pdfme/schemas/options/optionIndicator';
import { buildOptionGroupRuntimeSharedParams } from '@/sisad-pdfme/schemas/options/optionGroupFactory';
import type { SignatureSchema } from '@/sisad-pdfme/schemas/signature/types';

const OWNER = '#16A34A';

const signatureSchema = (overrides: Record<string, unknown> = {}) =>
  ({ type: 'signature', name: 'firma', ...overrides }) as unknown as SignatureSchema;

describe('firma e iniciales', () => {
  it('derivan el chrome del color del dueño', () => {
    const colors = resolveSignaturePlaceholderColors(signatureSchema({ ownerColor: OWNER }));

    // Verde del dueño mezclado con blanco, no el crema fijo anterior.
    expect(colors.backgroundColor).toBe('#e3f4e9');
    expect(colors.borderColor).toBe('#6ac48b');
    expect(colors.backgroundColor).not.toBe('#FFF9ED');
    expect(colors.borderColor).not.toBe('#D6B46B');
  });

  it('respetan un color declarado explícitamente en el schema', () => {
    const colors = resolveSignaturePlaceholderColors(
      signatureSchema({ ownerColor: OWNER, borderColor: '#123456', backgroundColor: '#654321' }),
    );

    expect(colors.borderColor).toBe('#123456');
    expect(colors.backgroundColor).toBe('#654321');
  });

  it('caen al tono neutro cuando el schema no tiene dueño', () => {
    const colors = resolveSignaturePlaceholderColors(signatureSchema());

    // `resolveSchemaOwnerTone` devuelve el gris neutro, nunca un azul que
    // simularía un destinatario asignado.
    expect(colors.borderColor).not.toBe('#D6B46B');
    expect(colors.backgroundColor).not.toBe('#FFF9ED');
  });

  it('ningún defaultSchema materializa una paleta fija', () => {
    const signatureDefaults = signaturePropPanel.defaultSchema as Record<string, unknown>;
    const initialsDefaults = initialsPlugin.propPanel.defaultSchema as Record<string, unknown>;

    // Materializarlos hacía que el schema naciera con color propio y el tono del
    // dueño no se aplicara nunca.
    for (const defaults of [signatureDefaults, initialsDefaults]) {
      expect(defaults.borderColor).toBeUndefined();
      expect(defaults.backgroundColor).toBeUndefined();
      expect(defaults.strokeColor).toBeUndefined();
    }
  });
});

describe('marcadores de opción', () => {
  it('usan el color del dueño en el recuadro exterior', () => {
    const svg = renderOptionIndicatorSvg({
      shape: 'square',
      checked: false,
      color: '#1677ff',
      ownerColor: OWNER,
      mode: 'designer',
    });

    expect(svg).toContain('rgba(22, 163, 74, 0.18)');
    expect(svg).not.toContain('rgba(165, 237, 252, 0.72)');
  });

  it('conservan el respaldo turquesa cuando no hay dueño', () => {
    const svg = renderOptionIndicatorSvg({
      shape: 'circle',
      checked: false,
      color: '#1677ff',
      mode: 'designer',
    });

    expect(svg).toContain('rgba(165, 237, 252, 0.72)');
  });

  it('el runtime del grupo propaga el color del dueño', () => {
    const params = buildOptionGroupRuntimeSharedParams({
      schema: { ownerColor: OWNER },
      mode: 'designer',
      editable: true,
      invalid: false,
    });

    // Sin esta propagación el marcador nunca recibía dueño y caía al turquesa.
    expect(params.ownerColor).toBe(OWNER);
  });

  it('el runtime del grupo no inventa un dueño cuando no lo hay', () => {
    const params = buildOptionGroupRuntimeSharedParams({
      schema: {},
      mode: 'designer',
      editable: true,
      invalid: false,
    });

    expect(params.ownerColor).toBe('');
  });
});
