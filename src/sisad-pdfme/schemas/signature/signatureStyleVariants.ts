/**
 * Estilos tipográficos de la adopción de Firma SISAD.
 *
 * Genera el artefacto que acaba en `schema.content`: sólo el texto firmado,
 * fondo transparente. El marco, el "Firmado por:" y el recuadro de iniciales
 * pertenecen a la interfaz del selector, no a la imagen que entra en el PDF —
 * incrustarlos en el artefacto los imprime dentro del documento final.
 */
import {
  deriveSignerInitials,
  normalizeSignerInitials,
  normalizeSignerName,
} from '@sisad-pdfme/schemas/signature/signatureIdentity';
import type { SignatureSchema } from '@sisad-pdfme/schemas/signature/types';

export type SignatureArtifactKind = 'signature' | 'initials';

export type SisadSignatureStyle = {
  id: string;
  label: string;
  fontFamily: string;
  fontStyle: string;
  fontWeight: number;
  /** Inclinación en grados. Diferencia los estilos aunque la fuente caiga a un fallback. */
  skewDeg: number;
  letterSpacing: number;
};

/**
 * Recetas de estilo.
 *
 * Cada una combina familia, estilo, peso, inclinación y espaciado: si el
 * sistema no tiene la fuente y cae a un fallback, los estilos siguen
 * distinguiéndose entre sí en vez de renderizarse idénticos.
 *
 * Sólo fuentes de sistema y familias genéricas: descargar tipografías de un CDN
 * rompería la política de red del flujo público.
 */
export const SISAD_SIGNATURE_STYLES: ReadonlyArray<SisadSignatureStyle> = Object.freeze([
  {
    id: 'sisad-script',
    label: 'Manuscrita',
    fontFamily: '"Segoe Script", "Brush Script MT", cursive',
    fontStyle: 'normal',
    fontWeight: 400,
    skewDeg: -4,
    letterSpacing: 0,
  },
  {
    id: 'sisad-elegant',
    label: 'Elegante',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontStyle: 'italic',
    fontWeight: 400,
    skewDeg: -6,
    letterSpacing: 1,
  },
  {
    id: 'sisad-modern',
    label: 'Moderna',
    fontFamily: '"Palatino Linotype", Palatino, serif',
    fontStyle: 'italic',
    fontWeight: 500,
    skewDeg: -2,
    letterSpacing: 0.5,
  },
  {
    id: 'sisad-classic',
    label: 'Clásica',
    fontFamily: 'cursive',
    fontStyle: 'normal',
    fontWeight: 400,
    skewDeg: 0,
    letterSpacing: 0,
  },
]);

export const DEFAULT_SISAD_SIGNATURE_STYLE_ID = SISAD_SIGNATURE_STYLES[0].id;

export const isSisadSignatureStyleId = (value: unknown): boolean =>
  SISAD_SIGNATURE_STYLES.some((style) => style.id === value);

export const getSisadSignatureStyle = (styleId: unknown): SisadSignatureStyle =>
  SISAD_SIGNATURE_STYLES.find((style) => style.id === styleId) ||
  SISAD_SIGNATURE_STYLES[0];

/**
 * ¿Este schema usa la adopción SISAD?
 *
 * `signatureMode === 'draw'` por sí solo NO basta: es el modo técnico que
 * comparten la firma dibujada genérica y la política SISAD. Sin discriminar por
 * variante, un schema `draw` corriente perdería su canvas.
 */
export const isSisadAdoptionFlow = (schema: Partial<SignatureSchema> | undefined): boolean => {
  if (!schema || schema.signatureMode !== 'draw') return false;

  const variant = String(
    (schema as { signatureVariant?: unknown }).signatureVariant ?? '',
  ).trim();
  if (variant === 'sisad') return true;

  const policyId = String(
    (schema.signatureMetadata as { signaturePolicyId?: unknown } | undefined)
      ?.signaturePolicyId ?? '',
  ).trim();
  return policyId === 'sisad';
};

/** Un schema de iniciales pinta las iniciales; el resto, el nombre completo. */
export const resolveSignatureArtifactKind = (
  schema: Partial<SignatureSchema> | undefined,
): SignatureArtifactKind =>
  (schema as { signatureKind?: unknown } | undefined)?.signatureKind === 'initials' ||
  String(schema?.type ?? '').toLowerCase() === 'initials'
    ? 'initials'
    : 'signature';

/** Texto que corresponde pintar según el tipo de campo. */
export const resolveSignatureArtifactText = ({
  kind,
  fullName,
  initials,
}: {
  kind: SignatureArtifactKind;
  fullName?: unknown;
  initials?: unknown;
}): string => {
  const safeName = normalizeSignerName(fullName);
  if (kind !== 'initials') return safeName;
  return normalizeSignerInitials(initials) || deriveSignerInitials(safeName);
};

const ARTIFACT_WIDTH = 900;
const ARTIFACT_HEIGHT = 240;
/** Margen proporcional: sin él los trazos inclinados se recortan en los bordes. */
const ARTIFACT_PADDING = 48;

/**
 * Rasteriza el texto firmado a PNG con fondo transparente.
 *
 * Devuelve `""` si no hay DOM (SSR o tests de nodo): el catálogo de estilos
 * sigue siendo utilizable sin rasterizar.
 */
export const renderSisadSignatureArtifact = ({
  text,
  style,
  width = ARTIFACT_WIDTH,
  height = ARTIFACT_HEIGHT,
}: {
  text: string;
  style: SisadSignatureStyle;
  width?: number;
  height?: number;
}): string => {
  const safeText = String(text ?? '').trim();
  if (!safeText) return '';
  if (typeof document === 'undefined') return '';

  const canvas = document.createElement('canvas');
  const ratio =
    typeof window !== 'undefined' && window.devicePixelRatio ? window.devicePixelRatio : 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, width, height);

  const usableWidth = width - ARTIFACT_PADDING * 2;
  const usableHeight = height - ARTIFACT_PADDING * 2;

  // Se parte de un tamaño grande y se reduce hasta que el texto cabe: así un
  // nombre largo se ajusta en vez de salirse del lienzo. Ése es el recorte
  // ("honn Montenegro") que se ve en la implementación anterior.
  let fontSize = usableHeight;
  const applyFont = () => {
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
  };
  applyFont();
  while (fontSize > 12 && ctx.measureText(safeText).width > usableWidth) {
    fontSize -= 2;
    applyFont();
  }

  ctx.fillStyle = '#111827';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if ('letterSpacing' in ctx) {
    (ctx as unknown as { letterSpacing: string }).letterSpacing = `${style.letterSpacing}px`;
  }

  ctx.translate(width / 2, height / 2);
  ctx.transform(1, 0, Math.tan((style.skewDeg * Math.PI) / 180), 1, 0, 0);
  ctx.fillText(safeText, 0, 0);

  return canvas.toDataURL('image/png');
};

export type SisadSignatureStyleVariant = {
  id: string;
  label: string;
  text: string;
  style: SisadSignatureStyle;
  dataUrl: string;
};

/**
 * Variantes ofrecidas en el selector.
 *
 * El texto se resuelve una sola vez para todas: firma e iniciales comparten
 * `styleId`, sólo cambia qué se pinta.
 */
export const buildSisadSignatureStyleVariants = ({
  fullName,
  initials,
  kind = 'signature',
}: {
  fullName?: unknown;
  initials?: unknown;
  kind?: SignatureArtifactKind;
} = {}): SisadSignatureStyleVariant[] => {
  const text = resolveSignatureArtifactText({ kind, fullName, initials });
  if (!text) return [];

  return SISAD_SIGNATURE_STYLES.map((style) => ({
    id: style.id,
    label: style.label,
    text,
    style,
    dataUrl: renderSisadSignatureArtifact({ text, style }),
  }));
};
