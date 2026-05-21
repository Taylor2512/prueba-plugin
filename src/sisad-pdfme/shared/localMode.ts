/**
 * LOCAL MODE — Modo sin backend
 *
 * Factory que ensambla todos los componentes necesarios para que sisad-pdfme
 * funcione completamente sin servidor:
 *
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │  createLocalModeConfig(options?)                            │
 *   │                                                             │
 *   │  → snapshotStore   LocalSnapshotStoreImpl  (localStorage)   │
 *   │  → formStorage     LocalFormStorage        (sessionStorage) │
 *   │  → signaturePolicy SignaturePolicy         (draw + image)   │
 *   │  → serializeOptions SerializeOptions       (base64)         │
 *   │  → collaborationMode 'offline'                              │
 *   └─────────────────────────────────────────────────────────────┘
 *
 * Restricciones del modo local:
 *   - Sin WebSocket / Yjs remoto → colaboración deshabilitada
 *   - Sin P12 server-side → solo draw e image como providers por defecto
 *   - Sin checksums de PDF → backgrounds almacenados como base64
 *   - Pérdida de datos si se limpian cookies/localStorage del browser
 *
 * El padre (ContentCustomForm) puede sobreescribir cualquier campo del config
 * antes de pasarlo al designer.
 */
import { LocalSnapshotStoreImpl } from './localSnapshotStore.js';
import { LocalFormStorage } from './localFormStorage.js';
import type { SerializeOptions } from './snapshot.js';
import type { SignaturePolicy } from './signatureRegistry.js';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type CollaborationMode = 'offline' | 'yjs_local' | 'yjs_remote';

export interface LocalModeConfig {
  /** Store de snapshots en localStorage */
  snapshotStore: LocalSnapshotStoreImpl;
  /** Storage de formulario en sessionStorage */
  formStorage: LocalFormStorage;
  /** Política de firma: solo draw e image en local (sin P12 server-side) */
  signaturePolicy: SignaturePolicy;
  /** Opciones de serialización: siempre base64 en local */
  serializeOptions: SerializeOptions;
  /** Modo de colaboración: offline (sin WS) */
  collaborationMode: CollaborationMode;
  /** templateId activo — puede ser undefined antes de crear el primer template */
  templateId: string | undefined;
}

export interface LocalModeOptions {
  /** templateId para namespacing del formStorage */
  templateId?: string;
  /**
   * Si true, habilita p12 como provider permitido.
   * Advertencia: la clave privada quedaría en memoria del cliente.
   * Solo habilitar en entornos controlados (ej. kiosco o desktop wrapper).
   */
  allowP12ClientSide?: boolean;
  /** Custom storage para snapshots (útil en tests) */
  snapshotStorage?: Storage;
  /** Custom storage para formulario (útil en tests) */
  formStorage?: Storage;
}

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Crea la configuración completa para modo sin backend.
 *
 * @example
 * // En ContentCustomForm o el componente raíz:
 * const localConfig = createLocalModeConfig({ templateId: 'my-template' });
 *
 * // Montar el designer:
 * <SisadDesigner
 *   snapshotStore={localConfig.snapshotStore}
 *   serializeOptions={localConfig.serializeOptions}
 *   collaborationMode={localConfig.collaborationMode}
 * />
 */
export function createLocalModeConfig(options: LocalModeOptions = {}): LocalModeConfig {
  const {
    templateId,
    allowP12ClientSide = false,
    snapshotStorage,
    formStorage: formStorageOverride,
  } = options;

  // ── Snapshot store ──────────────────────────────────────────────────────
  const snapshotStore = new LocalSnapshotStoreImpl({
    storage: snapshotStorage,
  });

  // ── Form storage ────────────────────────────────────────────────────────
  const formStorage = new LocalFormStorage({
    templateId: templateId ?? '__default',
    storage: formStorageOverride,
  });

  // ── Signature policy ────────────────────────────────────────────────────
  const allowedProviders: string[] = ['draw', 'image'];
  if (allowP12ClientSide) {
    allowedProviders.push('p12');
  }

  const signaturePolicy: SignaturePolicy = {
    allowedProviders,
    defaultProvider: 'draw',
  };

  // ── Serialize options ───────────────────────────────────────────────────
  const serializeOptions: SerializeOptions = {
    backgroundMode: 'base64',
  };

  return {
    snapshotStore,
    formStorage,
    signaturePolicy,
    serializeOptions,
    collaborationMode: 'offline',
    templateId,
  };
}

// ── Helpers de diagnóstico ────────────────────────────────────────────────────

/**
 * Comprueba si el entorno soporta localStorage.
 * Retorna false en SSR o si el usuario bloqueó el storage.
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__sisad_test__';
    localStorage.setItem(test, '1');
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Comprueba si el entorno soporta sessionStorage.
 */
export function isSessionStorageAvailable(): boolean {
  try {
    const test = '__sisad_test__';
    sessionStorage.setItem(test, '1');
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Retorna un diagnóstico de capacidades del modo local.
 * Útil para mostrar advertencias al usuario antes de montar el designer.
 */
export interface LocalModeDiagnostics {
  localStorage: boolean;
  sessionStorage: boolean;
  cryptoRandomUUID: boolean;
  /** Si false, el modo local puede tener degradaciones */
  fullySupported: boolean;
  warnings: string[];
}

export function diagnoseLocalMode(): LocalModeDiagnostics {
  const ls = isLocalStorageAvailable();
  const ss = isSessionStorageAvailable();
  const uuid = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function';

  const warnings: string[] = [];
  if (!ls) warnings.push('localStorage no disponible — los snapshots no persistirán entre sesiones.');
  if (!ss) warnings.push('sessionStorage no disponible — el progreso del formulario no se guardará.');
  if (!uuid) warnings.push('crypto.randomUUID no disponible — se usará Math.random() para UIDs (menos único).');

  return {
    localStorage: ls,
    sessionStorage: ss,
    cryptoRandomUUID: uuid,
    fullySupported: ls && ss && uuid,
    warnings,
  };
}
