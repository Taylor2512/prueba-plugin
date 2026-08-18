/**
 * RTP-510.B — aislamiento de firma, iniciales y artifacts.
 *
 * El modelo mantiene tres cosas separadas y estas pruebas impiden que se
 * fundan:
 *
 * - **identidad** — nombre completo e iniciales del firmante;
 * - **estilo de adopción** — el `styleId` que eligió;
 * - **método de adquisición** — dibujo, imagen, P12 o proveedor.
 *
 * De ahí salen dos invariantes que se rompen con facilidad: firma e iniciales
 * comparten estilo pero producen artifacts DISTINTOS, y cambiar el estilo hoy
 * no puede reescribir un artifact que ya se adoptó ayer.
 */
import { describe, expect, it } from 'vitest';
import {
  buildSignatureProfileKey,
  deriveSignerInitials,
  normalizeSignerInitials,
  normalizeSignerName,
} from '@sisad-pdfme/schemas/signature/signatureIdentity';
import {
  clearSisadSignatureAdoption,
  parseSisadSignatureAdoption,
  readSisadSignatureAdoption,
  resolveActiveSignatureStyleId,
  resolveSisadSignatureAdoption,
  writeSisadSignatureAdoption,
} from '@sisad-pdfme/schemas/signature/signatureAdoptionProfile';
import {
  DEFAULT_SISAD_SIGNATURE_STYLE_ID,
  SISAD_SIGNATURE_STYLES,
  resolveSignatureArtifactKind,
  resolveSignatureArtifactText,
} from '@sisad-pdfme/schemas/signature/signatureStyleVariants';
import {
  createModeAwareCapabilities,
  resolveSignatureMode,
} from '@sisad-pdfme/schemas/signature/types';

/** Almacén en memoria: la aserción es sobre las claves, no sobre el navegador. */
const createStorage = () => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  };
};

const ADOPTION = {
  styleId: DEFAULT_SISAD_SIGNATURE_STYLE_ID,
  fullName: 'Ada Lovelace',
  initials: 'AL',
  adoptedAt: '2026-08-14T10:00:00.000Z',
};

describe('clave de aislamiento del perfil', () => {
  it('dos usuarios de la misma solicitud no comparten clave', () => {
    const alice = buildSignatureProfileKey({ requestId: 'req-1', recipientId: 'alice' });
    const bob = buildSignatureProfileKey({ requestId: 'req-1', recipientId: 'bob' });
    expect(alice).not.toBe(bob);
  });

  it('el mismo usuario en dos solicitudes tampoco', () => {
    expect(buildSignatureProfileKey({ requestId: 'req-1', recipientId: 'alice' })).not.toBe(
      buildSignatureProfileKey({ requestId: 'req-2', recipientId: 'alice' }),
    );
  });

  it('con documentId cada documento exige su propia adopción', () => {
    const d1 = buildSignatureProfileKey({ requestId: 'req-1', recipientId: 'alice', documentId: 'D1' });
    const d2 = buildSignatureProfileKey({ requestId: 'req-1', recipientId: 'alice', documentId: 'D2' });
    expect(d1).not.toBe(d2);
  });

  it('sin documentId la clave es la de solicitud × usuario, compartida entre documentos', () => {
    const sinDocumento = buildSignatureProfileKey({ requestId: 'req-1', recipientId: 'alice' });
    expect(sinDocumento).toBe('sisad-signature:req-1:alice');
    // Retrocompatible: un host que no pase documento no cambia de clave.
    expect(buildSignatureProfileKey({ requestId: 'req-1', recipientId: 'alice', documentId: '' })).toBe(
      sinDocumento,
    );
  });

  it('faltando solicitud o usuario no hay clave, y por tanto no hay lectura', () => {
    expect(buildSignatureProfileKey({ requestId: 'req-1' })).toBeNull();
    expect(buildSignatureProfileKey({ recipientId: 'alice' })).toBeNull();
    expect(buildSignatureProfileKey()).toBeNull();
  });

  it('sin clave no se lee ni se escribe nada', () => {
    const storage = createStorage();
    const { profile } = resolveSisadSignatureAdoption(ADOPTION);
    expect(writeSisadSignatureAdoption(null, profile, storage)).toBe(false);
    expect(readSisadSignatureAdoption(null, storage)).toBeNull();
    expect(storage.data.size).toBe(0);
  });
});

describe('la firma de un usuario no llega a otro', () => {
  it('Alice y Bob conservan cada uno la suya tras conmutar', () => {
    const storage = createStorage();
    const claveAlice = buildSignatureProfileKey({ requestId: 'req-1', recipientId: 'alice' });
    const claveBob = buildSignatureProfileKey({ requestId: 'req-1', recipientId: 'bob' });

    const { profile: perfilAlice } = resolveSisadSignatureAdoption(ADOPTION);
    const { profile: perfilBob } = resolveSisadSignatureAdoption({
      ...ADOPTION,
      styleId: SISAD_SIGNATURE_STYLES[1].id,
      fullName: 'Bob Stone',
      initials: 'BS',
    });

    writeSisadSignatureAdoption(claveAlice, perfilAlice, storage);
    writeSisadSignatureAdoption(claveBob, perfilBob, storage);

    expect(readSisadSignatureAdoption(claveAlice, storage)?.fullName).toBe('Ada Lovelace');
    expect(readSisadSignatureAdoption(claveBob, storage)?.fullName).toBe('Bob Stone');

    // Volver a Alice recupera EXACTAMENTE lo suyo, estilo incluido.
    const recuperado = readSisadSignatureAdoption(claveAlice, storage);
    expect(recuperado?.styleId).toBe(ADOPTION.styleId);
    expect(recuperado?.initials).toBe('AL');
  });

  it('borrar la adopción de uno no toca la del otro', () => {
    const storage = createStorage();
    const claveAlice = buildSignatureProfileKey({ requestId: 'req-1', recipientId: 'alice' });
    const claveBob = buildSignatureProfileKey({ requestId: 'req-1', recipientId: 'bob' });
    const { profile } = resolveSisadSignatureAdoption(ADOPTION);

    writeSisadSignatureAdoption(claveAlice, profile, storage);
    writeSisadSignatureAdoption(claveBob, profile, storage);
    clearSisadSignatureAdoption(claveAlice, storage);

    expect(readSisadSignatureAdoption(claveAlice, storage)).toBeNull();
    expect(readSisadSignatureAdoption(claveBob, storage)).not.toBeNull();
  });

  it('un documento no hereda la adopción de otro cuando la política los separa', () => {
    const storage = createStorage();
    const d1 = buildSignatureProfileKey({ requestId: 'req-1', recipientId: 'alice', documentId: 'D1' });
    const d2 = buildSignatureProfileKey({ requestId: 'req-1', recipientId: 'alice', documentId: 'D2' });
    const { profile } = resolveSisadSignatureAdoption(ADOPTION);

    writeSisadSignatureAdoption(d1, profile, storage);

    expect(readSisadSignatureAdoption(d1, storage)).not.toBeNull();
    expect(readSisadSignatureAdoption(d2, storage)).toBeNull();
  });
});

describe('firma e iniciales comparten estilo pero no artifact', () => {
  it('el mismo estilo produce textos distintos según el tipo de campo', () => {
    const identidad = { fullName: 'Ada Lovelace', initials: 'AL' };
    const firma = resolveSignatureArtifactText({ kind: 'signature', ...identidad });
    const iniciales = resolveSignatureArtifactText({ kind: 'initials', ...identidad });

    expect(firma).toBe('Ada Lovelace');
    expect(iniciales).toBe('AL');
    expect(firma).not.toBe(iniciales);
  });

  it('el tipo de artifact se deduce del schema', () => {
    expect(resolveSignatureArtifactKind({ type: 'initials' })).toBe('initials');
    expect(resolveSignatureArtifactKind({ type: 'signature' })).toBe('signature');
    expect(resolveSignatureArtifactKind(undefined)).toBe('signature');
  });

  it('sin iniciales explícitas se derivan del nombre, no se deja el campo vacío', () => {
    expect(resolveSignatureArtifactText({ kind: 'initials', fullName: 'Ada Lovelace' })).toBe('AL');
    expect(deriveSignerInitials('Ada Byron King Lovelace')).toBeTruthy();
  });
});

describe('cambiar de estilo no reescribe lo ya adoptado', () => {
  it('el perfil almacenado conserva su estilo aunque el activo cambie', () => {
    const storage = createStorage();
    const clave = buildSignatureProfileKey({ requestId: 'req-1', recipientId: 'alice' });
    const { profile: adoptado } = resolveSisadSignatureAdoption(ADOPTION);
    writeSisadSignatureAdoption(clave, adoptado, storage);

    const { profile: nuevoEstilo } = resolveSisadSignatureAdoption({
      ...ADOPTION,
      styleId: SISAD_SIGNATURE_STYLES[2]?.id ?? SISAD_SIGNATURE_STYLES[1].id,
    });

    // El perfil ya escrito es un valor, no una referencia viva al estilo actual.
    expect(readSisadSignatureAdoption(clave, storage)?.styleId).toBe(ADOPTION.styleId);
    expect(nuevoEstilo?.styleId).not.toBe(ADOPTION.styleId);
  });

  it('un perfil de otra versión se descarta en vez de migrarse a ciegas', () => {
    expect(parseSisadSignatureAdoption({ ...ADOPTION, version: 999 })).toBeNull();
  });

  it('un estilo retirado cae al estilo por defecto en lugar de romper', () => {
    expect(resolveActiveSignatureStyleId(null)).toBe(DEFAULT_SISAD_SIGNATURE_STYLE_ID);
    expect(
      resolveActiveSignatureStyleId({
        version: 1,
        styleId: 'estilo-que-ya-no-existe',
        fullName: 'Ada',
        initials: 'A',
        adoptedAt: ADOPTION.adoptedAt,
      }),
    ).toBe(DEFAULT_SISAD_SIGNATURE_STYLE_ID);
  });

  it('una adopción incompleta se rechaza señalando qué falta', () => {
    const { profile, errors } = resolveSisadSignatureAdoption({ styleId: '', fullName: '', initials: '' });
    expect(profile).toBeNull();
    expect(errors).toEqual(expect.arrayContaining(['fullName', 'initials', 'styleId']));
  });
});

describe('métodos permitidos y método seleccionado son cosas distintas', () => {
  it('el modo seleccionado conserva su capacidad principal activada', () => {
    const capacidades = createModeAwareCapabilities('p12', { allowP12: false });
    expect(capacidades.allowP12).toBe(true);
  });

  it('permitir un método no lo convierte en el seleccionado', () => {
    const capacidades = createModeAwareCapabilities('draw');
    expect(capacidades.allowDraw).toBe(true);
    // Se puede permitir reemplazar sin que reemplazar sea el modo activo.
    expect(resolveSignatureMode({ signatureMode: 'draw' })).toBe('draw');
  });

  it('un proveedor externo se deduce cuando hay clave de proveedor', () => {
    expect(resolveSignatureMode({ signatureProviderKey: 'uanataca' })).toBe('provider');
    expect(resolveSignatureMode({})).toBe('draw');
  });

  it('los alias locales de proveedor no se confunden con proveedor externo', () => {
    expect(resolveSignatureMode({ signatureProviderKey: 'local_draw' })).toBe('draw');
    expect(resolveSignatureMode({ signatureProviderKey: 'local_p12' })).toBe('p12');
  });
});

describe('normalización de identidad', () => {
  it('el nombre se limpia sin perder contenido', () => {
    expect(normalizeSignerName('  Ada   Lovelace  ')).toBe('Ada Lovelace');
  });

  it('las iniciales se recortan y van en mayúsculas', () => {
    expect(normalizeSignerInitials(' al ')).toBe('AL');
  });
});
