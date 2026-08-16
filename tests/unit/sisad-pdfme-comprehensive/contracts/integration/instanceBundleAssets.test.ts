/**
 * PRT-150 — Bundle de instancia autocontenido.
 *
 * Contrato bajo prueba:
 * - los `basePdf` que son URL o binario se incrustan como data URI;
 * - se recorren plantilla, mapa de plantillas y documentos, en `definition` y
 *   en `resources`;
 * - lo que ya es autocontenido no se vuelve a descargar;
 * - un fallo de descarga se propaga en vez de producir un bundle incompleto;
 * - la incrustación ocurre ANTES de armar el bundle, que es lo único que
 *   preserva un `basePdf` binario.
 *
 * Esta es la única capacidad del antiguo `examples/hostBundle` sin equivalente
 * productivo: `createSisadPdfmeInstanceBundle` deja los `basePdf` tal cual, así
 * que un bundle exportado con una URL no se podía restaurar en otro host.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createSisadPdfmeInstanceBundle,
  type SisadPdfmeInstanceBundleInput,
} from '@sisad-pdfme/integration/SisadPdfmeInstanceBundle';
import {
  createPortableSisadPdfmeInstanceBundle,
  inlineSisadPdfmeInstanceAssets,
  isInlinedSisadPdfmeInstanceBundle,
} from '@sisad-pdfme/integration/instanceBundleAssets';

const PDF_BYTES = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]);
const DATA_URI = 'data:application/pdf;base64,JVBERi0=';
const DATA_URI_PREFIX = 'data:application/pdf;base64,';

/**
 * Sirve cualquier URL como el mismo PDF y cuenta las descargas.
 *
 * El `Blob` se construye con el constructor del entorno de test porque
 * `getB64BasePdf` lo pasa a un `FileReader`, que sólo acepta el suyo.
 */
const stubFetch = () => {
  const fetchSpy = vi.fn(async () => ({
    ok: true,
    status: 200,
    blob: async () => new Blob([PDF_BYTES.slice()], { type: 'application/pdf' }),
  }));
  vi.stubGlobal('fetch', fetchSpy);
  return fetchSpy;
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const buildInput = (
  definition: Record<string, unknown>,
  resources?: Record<string, unknown>,
): SisadPdfmeInstanceBundleInput =>
  ({ definition, ...(resources ? { resources } : {}) }) as SisadPdfmeInstanceBundleInput;

const basePdfOf = (template: unknown) => (template as { basePdf: unknown }).basePdf;

describe('PRT-150 — incrustación de activos', () => {
  it('convierte un basePdf binario en data URI', async () => {
    const bundle = await createPortableSisadPdfmeInstanceBundle(
      buildInput({ template: { basePdf: PDF_BYTES.slice(), schemas: [[]] } }),
    );

    expect(basePdfOf(bundle.definition.template)).toBe(`${DATA_URI_PREFIX}JVBERi0=`);
  });

  it('descarga un basePdf declarado como URL', async () => {
    const fetchSpy = stubFetch();
    const bundle = await createPortableSisadPdfmeInstanceBundle(
      buildInput({ template: { basePdf: 'https://host.example/base.pdf', schemas: [[]] } }),
    );

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(String(basePdfOf(bundle.definition.template))).toContain(DATA_URI_PREFIX);
  });

  it('alcanza los documentos anidados, no sólo la plantilla principal', async () => {
    const fetchSpy = stubFetch();
    const bundle = await createPortableSisadPdfmeInstanceBundle(
      buildInput({
        template: { basePdf: DATA_URI, schemas: [[]] },
        documents: [
          { id: 'a', template: { basePdf: 'https://host.example/a.pdf', schemas: [[]] } },
          { id: 'b', template: { basePdf: 'https://host.example/b.pdf', schemas: [[]] } },
        ],
      }),
    );

    const documents = bundle.definition.documents as { template: unknown }[];
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(documents.map((document) => String(basePdfOf(document.template)))).toEqual([
      `${DATA_URI_PREFIX}JVBERi0=`,
      `${DATA_URI_PREFIX}JVBERi0=`,
    ]);
  });

  it('recorre también la rama de recursos resueltos', async () => {
    const fetchSpy = stubFetch();
    const bundle = await createPortableSisadPdfmeInstanceBundle(
      buildInput(
        { template: { basePdf: DATA_URI, schemas: [[]] } },
        {
          template: { basePdf: 'https://host.example/resource.pdf', schemas: [[]] },
          templates: { contrato: { basePdf: 'https://host.example/contrato.pdf', schemas: [[]] } },
          documents: [{ id: 'c', template: { basePdf: 'https://host.example/c.pdf', schemas: [[]] } }],
        },
      ),
    );

    const resources = bundle.resources as {
      template: unknown;
      templates: Record<string, unknown>;
      documents: { template: unknown }[];
    };

    expect(fetchSpy).toHaveBeenCalledTimes(3);
    expect(String(basePdfOf(resources.template))).toContain('base64,');
    expect(String(basePdfOf(resources.templates.contrato))).toContain('base64,');
    expect(String(basePdfOf(resources.documents[0].template))).toContain('base64,');
  });

  it('no descarga lo que ya es autocontenido', async () => {
    const fetchSpy = stubFetch();
    const bundle = await createPortableSisadPdfmeInstanceBundle(
      buildInput({
        template: { basePdf: DATA_URI, schemas: [[]] },
        documents: [{ id: 'a', template: { basePdf: { width: 210, height: 297 }, schemas: [[]] } }],
      }),
    );

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(basePdfOf(bundle.definition.template)).toBe(DATA_URI);
    // Un `BlankPdf` describe la página: ya viaja entero dentro del JSON.
    const documents = bundle.definition.documents as { template: unknown }[];
    expect(basePdfOf(documents[0].template)).toEqual({ width: 210, height: 297 });
  });

  it('propaga el fallo de descarga en lugar de exportar un bundle incompleto', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down');
      }),
    );

    await expect(
      createPortableSisadPdfmeInstanceBundle(
        buildInput({ template: { basePdf: 'https://host.example/base.pdf', schemas: [[]] } }),
      ),
    ).rejects.toThrow();
  });
});

describe('PRT-150 — el orden importa: incrustar y luego armar', () => {
  it('armar el bundle sin incrustar primero destruye un basePdf binario', () => {
    const bundle = createSisadPdfmeInstanceBundle(
      buildInput({ template: { basePdf: PDF_BYTES.slice(), schemas: [[]] } }),
    );

    // La limpieza de secretos reconstruye cada objeto por sus claves
    // enumerables, así que el binario sobrevive como un mapa de índices —
    // irrecuperable una vez dentro del bundle.
    const basePdf = basePdfOf(bundle.definition.template);
    expect(basePdf).not.toBeInstanceOf(Uint8Array);
    expect(typeof basePdf).toBe('object');
  });

  it('incrustar antes deja una cadena que atraviesa la limpieza intacta', async () => {
    const inlined = await inlineSisadPdfmeInstanceAssets(
      buildInput({ template: { basePdf: PDF_BYTES.slice(), schemas: [[]] } }),
    );
    const bundle = createSisadPdfmeInstanceBundle(inlined);

    expect(basePdfOf(bundle.definition.template)).toBe(`${DATA_URI_PREFIX}JVBERi0=`);
  });
});

describe('PRT-150 — el bundle declara su codificación', () => {
  it('marca el bundle como autocontenido y lo reconoce', async () => {
    const input = buildInput({ template: { basePdf: DATA_URI, schemas: [[]] } });

    expect(isInlinedSisadPdfmeInstanceBundle(createSisadPdfmeInstanceBundle(input))).toBe(false);

    const portable = await createPortableSisadPdfmeInstanceBundle(input);
    expect(isInlinedSisadPdfmeInstanceBundle(portable)).toBe(true);
    expect(portable.assetEncoding).toBe('base64-inline');
  });

  it('conserva versión, issues y validez del bundle equivalente', async () => {
    const input = buildInput({ template: { basePdf: DATA_URI, schemas: [[]] } });
    const plain = createSisadPdfmeInstanceBundle(input);
    const portable = await createPortableSisadPdfmeInstanceBundle(input);

    expect(portable.version).toBe(plain.version);
    expect(portable.valid).toBe(plain.valid);
    expect(portable.issues).toEqual(plain.issues);
  });

  it('sobrevive a la serialización a JSON', async () => {
    const portable = await createPortableSisadPdfmeInstanceBundle(
      buildInput({ template: { basePdf: PDF_BYTES.slice(), schemas: [[]] } }),
    );

    const roundTripped = JSON.parse(JSON.stringify(portable)) as unknown;
    expect(isInlinedSisadPdfmeInstanceBundle(roundTripped)).toBe(true);
    expect(
      basePdfOf((roundTripped as { definition: { template: unknown } }).definition.template),
    ).toBe(`${DATA_URI_PREFIX}JVBERi0=`);
  });
});
