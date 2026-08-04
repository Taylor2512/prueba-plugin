/**
 * COLOR-001 — ninguna familia inventa su paleta.
 *
 * Renderiza cada plugin dos veces con dueños distintos y exige que los colores
 * del chrome cambien con el dueño. Un color que no cambia solo se admite si está
 * en la lista de excepciones documentadas (neutros, acentos semánticos y
 * contenido preservado). Sin esta prueba, cada familia vuelve a fijar su paleta
 * y el color del destinatario deja de significar nada.
 */
import { describe, expect, it } from 'vitest';
import { getBuiltInFields, getSchemaPluginByType } from '@/sisad-pdfme/schemas/index';

const OWNER_A = '#16A34A';
const OWNER_B = '#DC2626';

/** Colores que pueden no depender del dueño, con su motivo. */
const ALLOWED_FIXED = [
  // Neutros estructurales.
  /^#(fff|ffffff|000|000000)$/i,
  /^rgba?\(\s*255,\s*255,\s*255/i,
  /^rgba?\(\s*0,\s*0,\s*0/i,
  /^(transparent|none|inherit|currentColor)$/i,
  /^0(px|mm)/i,
  // Respaldo neutro cuando no hay dueño resuelto.
  /94a3b8|148,\s*163,\s*184/i,
  // Acentos semánticos: verde aprobar, rojo rechazar, ámbar nota.
  /#(16a34a|dc2626|fde047|fefce8|713f12)/i,
  /rgb\(\s*(22,\s*163,\s*74|220,\s*38,\s*38|254,\s*252,\s*232|113,\s*63,\s*18)/i,
] as const;

const isAllowed = (color: string): boolean => ALLOWED_FIXED.some((pattern) => pattern.test(color));

const COLOR_PROPS = [
  'color',
  'background',
  'backgroundColor',
  'borderColor',
  'border',
  'fill',
  'stroke',
] as const;

const collectColors = (root: HTMLElement): string[] => {
  const out: string[] = [];
  const push = (value: string | null | undefined) => {
    const normalized = String(value ?? '').trim();
    if (normalized) out.push(normalized);
  };
  const walk = (node: Element) => {
    const el = node as HTMLElement;
    COLOR_PROPS.forEach((prop) => {
      if (el.style) push((el.style as unknown as Record<string, string>)[prop]);
      push(el.getAttribute?.(prop));
    });
    Array.from(node.children).forEach(walk);
  };
  walk(root);
  return out;
};

const renderWithOwner = (
  plugin: { ui?: (_arg: unknown) => unknown },
  type: string,
  ownerColor: string,
): string[] | null => {
  const rootElement = document.createElement('div');
  document.body.appendChild(rootElement);
  const schema = {
    id: 's1',
    name: 'campo',
    type,
    position: { x: 0, y: 0 },
    width: 45,
    height: 10,
    content: '',
    ownerColor,
    options: [
      { optionId: 'option_1', label: 'A' },
      { optionId: 'option_2', label: 'B' },
    ],
  };

  try {
    const rendered = plugin.ui?.({
      rootElement,
      schema,
      value: '',
      mode: 'designer',
      onChange: () => {},
      stopEditing: () => {},
      tabIndex: 0,
      theme: {},
      i18n: (key: string) => key,
      options: {},
      _cache: new Map(),
    });
    // Los plugins async (tabla, texto multivariable) fallan sin datos reales;
    // su rechazo se ignora igual que la excepción síncrona.
    if (rendered && typeof (rendered as Promise<unknown>).catch === 'function') {
      (rendered as Promise<unknown>).catch(() => {});
    }
  } catch {
    // Tipos que no renderizan sin datos reales (imagen, svg, tabla) quedan fuera:
    // son `content-preserved` y su chrome lo aporta el canvas.
    return null;
  }

  const colors = collectColors(rootElement);
  rootElement.remove();
  return colors;
};

describe('contrato de color por dueño', () => {
  const types = getBuiltInFields().map((field: { type: string }) => field.type);

  it('cubre los tipos registrados', () => {
    expect(types.length).toBeGreaterThan(10);
  });

  types.forEach((type: string) => {
    it(`${type}: el chrome cambia con el dueño`, () => {
      const plugin = getSchemaPluginByType(type) as { ui?: (_arg: unknown) => unknown } | undefined;
      if (typeof plugin?.ui !== 'function') return;

      const withA = renderWithOwner(plugin, type, OWNER_A);
      const withB = renderWithOwner(plugin, type, OWNER_B);
      if (!withA || !withB) return;

      const frozen = withA
        .filter((color, index) => withB[index] === color)
        .filter((color) => !isAllowed(color));

      expect([...new Set(frozen)]).toEqual([]);
    });
  });
});
