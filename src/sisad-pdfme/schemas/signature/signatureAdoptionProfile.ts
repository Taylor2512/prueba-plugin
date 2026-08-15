/**
 * Perfil de adopción de Firma SISAD.
 *
 * Guarda QUÉ ESTILO adoptó el firmante, no las imágenes generadas: cada schema
 * ya conserva su propio `content`. Almacenar los data URL duplicaría cientos de
 * kB por campo y obligaría a mantenerlos sincronizados con la identidad.
 *
 * Con el `styleId` basta para regenerar tanto la firma (nombre completo) como
 * las iniciales, que comparten estilo por diseño.
 */
import {
  DEFAULT_SISAD_SIGNATURE_STYLE_ID,
  isSisadSignatureStyleId,
} from '@sisad-pdfme/schemas/signature/signatureStyleVariants';
import { normalizeSignerInitials, normalizeSignerName } from '@sisad-pdfme/schemas/signature/signatureIdentity';

export const SISAD_SIGNATURE_PROFILE_VERSION = 1;

export type SisadSignatureAdoptionProfile = {
  version: typeof SISAD_SIGNATURE_PROFILE_VERSION;
  styleId: string;
  fullName: string;
  initials: string;
  adoptedAt: string;
};

/**
 * Normaliza y valida una adopción.
 *
 * Devuelve `errors` en lugar de lanzar: el selector necesita señalar qué falta,
 * no abortar la ceremonia de firma.
 */
export const resolveSisadSignatureAdoption = ({
  styleId,
  fullName,
  initials,
  adoptedAt,
}: {
  styleId?: unknown;
  fullName?: unknown;
  initials?: unknown;
  adoptedAt?: unknown;
} = {}): { profile: SisadSignatureAdoptionProfile | null; errors: string[] } => {
  const safeName = normalizeSignerName(fullName);
  const safeInitials = normalizeSignerInitials(initials);
  const safeStyleId = String(styleId ?? '').trim();

  const errors: string[] = [];
  if (!safeName) errors.push('fullName');
  if (!safeInitials) errors.push('initials');
  if (!isSisadSignatureStyleId(safeStyleId)) errors.push('styleId');

  if (errors.length > 0) return { profile: null, errors };

  return {
    profile: {
      version: SISAD_SIGNATURE_PROFILE_VERSION,
      styleId: safeStyleId,
      fullName: safeName,
      initials: safeInitials,
      adoptedAt: String(adoptedAt ?? '').trim() || new Date().toISOString(),
    },
    errors: [],
  };
};

/**
 * Rehidrata un perfil almacenado.
 *
 * Un perfil de otra versión o con un estilo retirado se descarta en vez de
 * migrarse a ciegas: es preferible volver a preguntar el estilo que firmar con
 * una representación que el usuario no eligió.
 */
export const parseSisadSignatureAdoption = (
  raw: unknown,
): SisadSignatureAdoptionProfile | null => {
  if (!raw || typeof raw !== 'object') return null;

  const candidate = raw as Partial<SisadSignatureAdoptionProfile>;
  if (candidate.version !== SISAD_SIGNATURE_PROFILE_VERSION) return null;

  const { profile } = resolveSisadSignatureAdoption(candidate);
  return profile;
};

type ProfileStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const resolveStorage = (storage?: ProfileStorage | null): ProfileStorage | null => {
  if (storage) return storage;
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    // Cookies/almacenamiento bloqueados: la adopción sigue funcionando, sólo
    // no se recuerda entre campos.
    return null;
  }
};

/**
 * Lee el perfil de la sesión.
 *
 * `sessionKey` viene de `buildSignatureProfileKey` (`requestId + recipientId`).
 * Sin clave no se lee nada: una clave compartida dejaría que un destinatario
 * heredase la firma de otro.
 */
export const readSisadSignatureAdoption = (
  sessionKey: unknown,
  storage?: ProfileStorage | null,
): SisadSignatureAdoptionProfile | null => {
  const key = String(sessionKey ?? '').trim();
  if (!key) return null;

  const store = resolveStorage(storage);
  if (!store) return null;

  try {
    const raw = store.getItem(key);
    return raw ? parseSisadSignatureAdoption(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
};

export const writeSisadSignatureAdoption = (
  sessionKey: unknown,
  profile: SisadSignatureAdoptionProfile | null,
  storage?: ProfileStorage | null,
): boolean => {
  const key = String(sessionKey ?? '').trim();
  if (!key || !profile) return false;

  const store = resolveStorage(storage);
  if (!store) return false;

  try {
    store.setItem(key, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
};

export const clearSisadSignatureAdoption = (
  sessionKey: unknown,
  storage?: ProfileStorage | null,
): void => {
  const key = String(sessionKey ?? '').trim();
  if (!key) return;
  resolveStorage(storage)?.removeItem(key);
};

/** Estilo a aplicar: el adoptado si existe, si no el estilo por defecto. */
export const resolveActiveSignatureStyleId = (
  profile: SisadSignatureAdoptionProfile | null,
): string =>
  profile && isSisadSignatureStyleId(profile.styleId)
    ? profile.styleId
    : DEFAULT_SISAD_SIGNATURE_STYLE_ID;
