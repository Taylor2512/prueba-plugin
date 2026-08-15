/**
 * Estrés de opciones remotas sobre el registry vivo (RTP-515).
 *
 * `dataSourceRuntime.test.ts` cubre el ciclo de vida del runtime aislado
 * —carreras, scope, caché, dispose—. Aquí se cubre lo que sólo aparece cuando
 * ese runtime alimenta de verdad las OPCIONES de un schema:
 *
 * - páginas por cursor que se acumulan en vez de reemplazarse;
 * - listas de mil opciones que llegan enteras al DOM y siguen resolviendo valor;
 * - un reintento después de un fallo;
 * - la API cayéndose DESPUÉS de que el usuario ya comprometió su valor;
 * - campos dependientes, donde cambiar el padre no puede dejar viva la lista
 *   del hijo;
 * - qué tipos del registry declaran enlazar una colección, derivado del
 *   manifest y no de una lista escrita a mano.
 */
import { describe, expect, it, vi } from 'vitest';
import {
  createDataSourceRuntime,
  type DataQuery,
} from '../../../../../src/sisad-pdfme/integration/data/dataSourceRuntime';
import { getSchemaPluginByType } from '../../../../../src/sisad-pdfme/schemas';
import { mergeFormInputRows } from '../../../../../src/sisad-pdfme/ui/Form';
import { listRegisteredSchemaManifest } from '../../helpers/allSchemaStressHarness';

type Page = { items: string[]; nextCursor: string | null };

/** Fuente paginada por cursor, determinista. */
const pagedSource = (total: number, pageSize: number) => {
  const all = Array.from({ length: total }, (_, index) => `option-${index}`);
  return (cursor: string | null | undefined): Page => {
    const start = cursor ? Number(cursor) : 0;
    const items = all.slice(start, start + pageSize);
    const next = start + pageSize;
    return { items, nextCursor: next < total ? String(next) : null };
  };
};

const query = (over: Partial<DataQuery> = {}): DataQuery => ({ sourceKey: 'options', ...over });

describe('paginación por cursor', () => {
  it('acumula todas las páginas sin perder ni repetir opciones', async () => {
    const runtime = createDataSourceRuntime();
    const source = pagedSource(250, 40);
    const collected: string[] = [];
    let cursor: string | null = null;
    let requests = 0;

    do {
      const current = cursor;
      const result = await runtime.query<Page>(query({ cursor: current }), () => {
        requests += 1;
        return Promise.resolve(source(current));
      });
      expect(result.status).toBe('success');
      collected.push(...(result.data?.items ?? []));
      cursor = result.data?.nextCursor ?? null;
    } while (cursor);

    expect(requests).toBe(7);
    expect(collected).toHaveLength(250);
    expect(new Set(collected).size).toBe(250);
    expect(collected[0]).toBe('option-0');
    expect(collected[249]).toBe('option-249');
  });

  it('el cursor forma parte de la identidad de la petición', async () => {
    const runtime = createDataSourceRuntime({ cacheTtlMs: 60_000 });
    const executor = vi.fn(async (q: DataQuery) => ({ cursor: q.cursor ?? 'inicio' }));

    await runtime.query(query({ cursor: null }), executor);
    await runtime.query(query({ cursor: '40' }), executor);
    await runtime.query(query({ cursor: null }), executor);

    // La tercera repite la primera y sale de caché; la segunda no.
    expect(executor).toHaveBeenCalledTimes(2);
  });
});

describe('listas grandes', () => {
  const LARGE = 1200;

  it('mil doscientas opciones llegan completas al DOM del select', async () => {
    const options = Array.from({ length: LARGE }, (_, index) => `option-${index}`);
    const plugin = getSchemaPluginByType('select');
    const rootElement = document.createElement('div');
    const value = options[LARGE - 1];

    await plugin?.ui({
      schema: { name: 'remoteSelect', type: 'select', options, position: { x: 0, y: 0 }, width: 45, height: 10 },
      basePdf: '',
      mode: 'form',
      value,
      rootElement,
      options: {},
      theme: { colorPrimaryBg: '#ffffff', colorPrimary: '#1677ff', colorWhite: '#ffffff' },
      i18n: (key: string) => key,
      scale: 1,
      _cache: new Map(),
      onChange: () => undefined,
      stopEditing: () => undefined,
    } as never);

    const rendered = rootElement.querySelectorAll('option');

    // El `select` nativo no necesita virtualización en JS: la ventana de
    // desplegable la gestiona el navegador. Lo que sí hay que probar es que la
    // lista no se trunca y que un valor del final sigue resolviendo.
    expect(rendered.length).toBe(LARGE);
    expect(rootElement.querySelector<HTMLSelectElement>('select')?.value).toBe(value);
  });

  it('una lista grande no degrada la identidad de caché', async () => {
    const runtime = createDataSourceRuntime({ cacheTtlMs: 60_000 });
    const items = Array.from({ length: LARGE }, (_, index) => `option-${index}`);
    const executor = vi.fn(async () => items);

    const first = await runtime.query<string[]>(query(), executor);
    const second = await runtime.query<string[]>(query(), executor);

    expect(first.data).toHaveLength(LARGE);
    expect(second.fromCache).toBe(true);
    expect(executor).toHaveBeenCalledTimes(1);
  });
});

describe('reintento y caída de la API', () => {
  it('un reintento después de un fallo sí carga', async () => {
    const runtime = createDataSourceRuntime();
    let attempt = 0;
    const executor = async () => {
      attempt += 1;
      if (attempt === 1) throw new Error('network');
      return ['a', 'b'];
    };

    const failed = await runtime.query<string[]>(query(), executor);
    const retried = await runtime.query<string[]>(query(), executor);

    expect(failed.status).toBe('error');
    expect(retried.status).toBe('success');
    expect(retried.data).toEqual(['a', 'b']);
  });

  it('el valor ya comprometido sobrevive a que la API se caiga después', async () => {
    const runtime = createDataSourceRuntime();
    const executor = vi.fn(async () => ['madrid', 'lisboa']);

    const loaded = await runtime.query<string[]>(query(), executor);
    expect(loaded.data).toContain('madrid');

    // El usuario elige y su elección queda en la fila de inputs.
    let rows = mergeFormInputRows([{ ciudad: '' }], [{ ciudad: 'madrid' }]);

    // La API se cae. La recarga falla.
    const offline = await runtime.query<string[]>(query({ search: 'ma' }), async () => {
      throw new Error('offline');
    });
    expect(offline.status).toBe('error');

    // Un fallo de la fuente de opciones no puede borrar lo que ya se comprometió.
    rows = mergeFormInputRows(rows, [{}]);
    expect(rows[0].ciudad).toBe('madrid');
  });
});

describe('campos dependientes', () => {
  it('cambiar el padre invalida la lista del hijo y no sirve la anterior', async () => {
    const runtime = createDataSourceRuntime({ cacheTtlMs: 60_000 });
    const provincias: Record<string, string[]> = {
      es: ['madrid', 'barcelona'],
      pt: ['lisboa', 'porto'],
    };
    const executor = vi.fn(async (q: DataQuery) => provincias[String(q.params?.pais)] ?? []);

    const conEs = await runtime.query<string[]>(query({ params: { pais: 'es' } }), executor);
    const conPt = await runtime.query<string[]>(query({ params: { pais: 'pt' } }), executor);

    expect(conEs.data).toEqual(['madrid', 'barcelona']);
    expect(conPt.data).toEqual(['lisboa', 'porto']);
    // El valor del padre entra en la clave: el hijo no puede recibir la lista
    // del padre anterior servida desde caché.
    expect(conPt.fromCache).toBe(false);
    expect(executor).toHaveBeenCalledTimes(2);
  });

  it('invalidar la fuente obliga a recargar al hijo', async () => {
    const runtime = createDataSourceRuntime({ cacheTtlMs: 60_000 });
    const executor = vi.fn(async () => ['madrid']);

    await runtime.query<string[]>(query({ params: { pais: 'es' } }), executor);
    const removed = runtime.invalidate('options');
    const after = await runtime.query<string[]>(query({ params: { pais: 'es' } }), executor);

    expect(removed).toBe(1);
    expect(after.fromCache).toBe(false);
    expect(executor).toHaveBeenCalledTimes(2);
  });
});

describe('cobertura de binding derivada del registry', () => {
  const manifest = listRegisteredSchemaManifest();

  it('existe al menos un tipo que enlaza colecciones', () => {
    const collection = manifest.filter((entry) => entry.dataBinding === 'collection');

    expect(collection.length).toBeGreaterThan(0);
  });

  it('todo tipo que enlaza colección declara una completitud coherente', () => {
    manifest
      .filter((entry) => entry.dataBinding === 'collection')
      .forEach((entry) => {
        // Si sus opciones vienen de fuera, completarlo es elegir o rellenar; no
        // puede declararse `none`, porque entonces nada comprobaría su valor.
        expect(entry.completion, `${entry.type} enlaza colección sin política de completitud`).not.toBe(
          'none',
        );
      });
  });

  it('ningún tipo visual enlaza una colección remota', () => {
    manifest
      .filter((entry) => entry.interactionKind === 'visual')
      .forEach((entry) => {
        expect(entry.dataBinding, `${entry.type} es visual y aun así enlaza colección`).not.toBe(
          'collection',
        );
      });
  });
});
