/**
 * COLOR-001 — contrato único de tono de dueño y política de color.
 *
 * Fija que exista **una** prioridad de color de dueño y **una** política que
 * decida si el contenido de un schema puede aportar color propio. Sin esto, cada
 * familia inventa su paleta y el color del destinatario deja de significar algo:
 * es lo que hoy ocurre con firma (crema), nota (ámbar), aprobar (verde),
 * rechazar (rojo) y las cajas de opción (turquesa).
 */
import { describe, it, expect } from 'vitest';
import {
  resolveSchemaOwnerTone,
  resolveSchemaOwnerColorValue,
  resolveSchemaColorPolicy,
  resolveSchemaVisualTone,
  mixHexColor,
} from '@/sisad-pdfme/schemas/shared/fieldChrome';

const OWNER = '#38BDF8';
const NEUTRAL_FALLBACK = '#94A3B8';

describe('resolveSchemaOwnerColorValue (prioridad de fuentes)', () => {
  it('prefiere schema.ownerColor sobre schema.userColor', () => {
    // `userColor` guarda el color del ÚLTIMO EDITOR (lo escribe
    // decorateSchemaWithCollaboration a partir de lastModifiedBy/createdBy), así
    // que si ganara, el campo se pintaría del color de quien lo tocó y no de su
    // dueño.
    expect(
      resolveSchemaOwnerColorValue({ ownerColor: OWNER, userColor: '#FF00FF' } as never),
    ).toBe(OWNER);
  });

  it('usa userColor cuando no hay ownerColor', () => {
    expect(resolveSchemaOwnerColorValue({ userColor: OWNER } as never)).toBe(OWNER);
  });

  it('usa recipientColor cuando no hay ownerColor ni userColor', () => {
    expect(resolveSchemaOwnerColorValue({ recipientColor: OWNER } as never)).toBe(OWNER);
  });

  it('desciende a __designer.collaboration.recipientColor', () => {
    expect(
      resolveSchemaOwnerColorValue({
        __designer: { collaboration: { recipientColor: OWNER } },
      } as never),
    ).toBe(OWNER);
  });

  it('desciende a __designer.ownerColor', () => {
    expect(
      resolveSchemaOwnerColorValue({ __designer: { ownerColor: OWNER } } as never),
    ).toBe(OWNER);
  });

  it('desciende a __designer.recipientColor', () => {
    expect(
      resolveSchemaOwnerColorValue({ __designer: { recipientColor: OWNER } } as never),
    ).toBe(OWNER);
  });

  it('respeta el orden completo cuando conviven todas las fuentes', () => {
    expect(
      resolveSchemaOwnerColorValue({
        ownerColor: '#111111',
        userColor: '#222222',
        recipientColor: '#333333',
        __designer: {
          collaboration: { recipientColor: '#444444' },
          ownerColor: '#555555',
          recipientColor: '#666666',
        },
      } as never),
    ).toBe('#111111');
  });

  it('devuelve cadena vacía cuando no hay dueño, sin inventar respaldo', () => {
    // Distinguir «sin dueño» de «pinta algo» es lo que permite a los atributos
    // de datos no mentir sobre la asignación.
    expect(resolveSchemaOwnerColorValue({} as never)).toBe('');
    expect(resolveSchemaOwnerColorValue(null as never)).toBe('');
  });

  it('ignora valores en blanco', () => {
    expect(
      resolveSchemaOwnerColorValue({ ownerColor: '   ', userColor: OWNER } as never),
    ).toBe(OWNER);
  });
});

describe('resolveSchemaOwnerTone (respaldos)', () => {
  it('usa el respaldo del llamador sólo si el schema no trae color', () => {
    expect(resolveSchemaOwnerTone({}, OWNER)).toBe(OWNER);
  });

  it('el color del schema gana al respaldo del llamador', () => {
    // El respaldo es el destinatario activo (schema nuevo o preview); no debe
    // repintar schemas existentes al cambiar de destinatario.
    expect(resolveSchemaOwnerTone({ ownerColor: OWNER }, '#FF00FF')).toBe(OWNER);
  });

  it('cae en gris neutro, no en azul, cuando no hay nada', () => {
    // Un azul por defecto haría que un schema sin dueño pareciese asignado al
    // primer destinatario de la paleta.
    expect(resolveSchemaOwnerTone({})).toBe(NEUTRAL_FALLBACK);
  });
});

describe('resolveSchemaColorPolicy', () => {
  it('da owner-surface a los campos de datos', () => {
    for (const type of ['text', 'number', 'date', 'time', 'select', 'multiVariableText']) {
      expect(resolveSchemaColorPolicy({ type }, 'text-like')).toBe('owner-surface');
    }
  });

  it('da owner-surface a la familia de firma', () => {
    for (const type of ['signature', 'initials', 'dateSigned']) {
      expect(resolveSchemaColorPolicy({ type }, 'signing-based')).toBe('owner-surface');
    }
  });

  it('da owner-surface a attachment aunque sea action-based', () => {
    // El tipo manda sobre la familia: attachment no tiene color con significado,
    // así que no debe heredar el trato de approve/decline/note.
    expect(resolveSchemaColorPolicy({ type: 'attachment' }, 'action-based')).toBe(
      'owner-surface',
    );
  });

  it('da política semántica a approve, decline y note', () => {
    for (const type of ['approve', 'decline', 'note']) {
      expect(resolveSchemaColorPolicy({ type }, 'action-based')).toBe(
        'owner-surface-with-semantic-content',
      );
    }
  });

  it('da política semántica a opciones y booleanos por su estado interno', () => {
    expect(resolveSchemaColorPolicy({ type: 'checkboxGroup' }, 'option-based')).toBe(
      'owner-surface-with-semantic-content',
    );
    expect(resolveSchemaColorPolicy({ type: 'checkbox' }, 'boolean')).toBe(
      'owner-surface-with-semantic-content',
    );
  });

  it('preserva el contenido de medios, tablas, formas y códigos', () => {
    for (const type of ['image', 'svg', 'table', 'rectangle', 'ellipse', 'line', 'qrcode', 'code128']) {
      expect(resolveSchemaColorPolicy({ type })).toBe('content-preserved');
    }
  });

  it('resuelve por familia cuando el tipo es desconocido', () => {
    expect(resolveSchemaColorPolicy({ type: 'algoNuevo' }, 'media')).toBe('content-preserved');
    expect(resolveSchemaColorPolicy({ type: 'algoNuevo' }, 'text-like')).toBe('owner-surface');
  });

  it('por defecto asume owner-surface', () => {
    expect(resolveSchemaColorPolicy({})).toBe('owner-surface');
  });

  it('no distingue mayúsculas en el tipo', () => {
    expect(resolveSchemaColorPolicy({ type: 'APPROVE' })).toBe(
      'owner-surface-with-semantic-content',
    );
  });
});

describe('resolveSchemaVisualTone', () => {
  it('deriva todas las superficies del color del dueño', () => {
    const tone = resolveSchemaVisualTone({ type: 'text', ownerColor: OWNER }, {
      family: 'text-like',
    });

    expect(tone.ownerColor).toBe(OWNER);
    for (const surface of [
      tone.ownerBackground,
      tone.ownerBackgroundStrong,
      tone.ownerBorder,
      tone.ownerText,
    ]) {
      expect(surface).toContain(OWNER);
    }
  });

  it('mezcla color en vez de aplicar opacity', () => {
    // `opacity` en el contenedor atenuaría texto, iconos y trazos hijos.
    const tone = resolveSchemaVisualTone({ type: 'text', ownerColor: OWNER });
    expect(tone.ownerBackground).toMatch(/^color-mix\(in srgb,/);
    expect(tone.ownerBackground).not.toMatch(/opacity/);
  });

  it('el fondo es más tenue que su variante fuerte', () => {
    const tone = resolveSchemaVisualTone({ type: 'text', ownerColor: OWNER });
    const pct = (value: string) => Number(value.match(/(\d+)%/)?.[1] ?? 0);
    expect(pct(tone.ownerBackground)).toBeLessThan(pct(tone.ownerBackgroundStrong));
    expect(pct(tone.ownerBackgroundStrong)).toBeLessThan(pct(tone.ownerBorder));
  });

  it('expone el acento semántico de approve sin perder el tono del dueño', () => {
    const tone = resolveSchemaVisualTone({ type: 'approve', ownerColor: OWNER }, {
      family: 'action-based',
    });

    expect(tone.policy).toBe('owner-surface-with-semantic-content');
    expect(tone.ownerBackground).toContain(OWNER);
    expect(tone.semanticColor).toBe('#16a34a');
    expect(tone.semanticText).toBe('#ffffff');
  });

  it('distingue el acento de decline del de approve', () => {
    expect(resolveSchemaVisualTone({ type: 'decline' }).semanticColor).toBe('#dc2626');
    expect(resolveSchemaVisualTone({ type: 'approve' }).semanticColor).toBe('#16a34a');
  });

  it('mantiene el ámbar de note como acento, no como tono de dueño', () => {
    const tone = resolveSchemaVisualTone({ type: 'note', ownerColor: OWNER });
    expect(tone.ownerBackground).toContain(OWNER);
    expect(tone.semanticBackground).toBe('#fefce8');
    expect(tone.semanticColor).toBe('#fde047');
  });

  it('no expone acento semántico cuando la política no lo admite', () => {
    const text = resolveSchemaVisualTone({ type: 'text', ownerColor: OWNER });
    expect(text.semanticColor).toBeUndefined();
    expect(text.semanticBackground).toBeUndefined();

    const image = resolveSchemaVisualTone({ type: 'image', ownerColor: OWNER });
    expect(image.policy).toBe('content-preserved');
    expect(image.semanticColor).toBeUndefined();
  });

  it('un schema con contenido preservado sigue recibiendo chrome de dueño', () => {
    // `content-preserved` limita el recoloreado del contenido, no la
    // identificación del dueño en el borde.
    const tone = resolveSchemaVisualTone({ type: 'image', ownerColor: OWNER }, {
      family: 'media',
    });
    expect(tone.ownerBorder).toContain(OWNER);
    expect(tone.ownerBackground).toContain(OWNER);
  });

  it('usa el respaldo neutro sin romper el contrato', () => {
    const tone = resolveSchemaVisualTone({ type: 'text' });
    expect(tone.ownerColor).toBe(NEUTRAL_FALLBACK);
    expect(tone.ownerBackground).toContain(NEUTRAL_FALLBACK);
  });
});

describe('mixHexColor', () => {
  it('mezcla el tono con blanco en la proporción pedida', () => {
    expect(mixHexColor('#000000', 50)).toBe('#808080');
    expect(mixHexColor('#FFFFFF', 50, '#000000')).toBe('#808080');
  });

  it('devuelve el tono puro al 100% y la base al 0%', () => {
    expect(mixHexColor('#38bdf8', 100).toLowerCase()).toBe('#38bdf8');
    expect(mixHexColor('#38bdf8', 0)).toBe('#ffffff');
  });

  it('acepta hex corto', () => {
    expect(mixHexColor('#fff', 100)).toBe('#ffffff');
  });

  it('devuelve el valor original cuando no es hex', () => {
    // Necesario para no romper SVG/canvas cuando llega `var(--x)` o `rgb(...)`.
    expect(mixHexColor('var(--schema-tone)', 50)).toBe('var(--schema-tone)');
    expect(mixHexColor('rgb(1, 2, 3)', 50)).toBe('rgb(1, 2, 3)');
  });
});
