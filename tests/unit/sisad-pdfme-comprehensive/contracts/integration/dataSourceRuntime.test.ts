/**
 * Ciclo de vida, carreras y aislamiento de las fuentes de datos (RTP-510).
 *
 * Los tres riesgos que se prueban aquí son de corrección, no de estilo:
 * respuestas fuera de orden pintando datos equivocados, caché sirviendo a un
 * usuario los datos autenticados de otro, y peticiones huérfanas escribiendo
 * en un scope que ya cambió.
 */
import { describe, expect, it, vi } from 'vitest';
import {
  createDataSourceRuntime,
  dataCacheKey,
  type DataQuery,
} from '../../../../../src/sisad-pdfme/integration/data/dataSourceRuntime';

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const query = (over: Partial<DataQuery> = {}): DataQuery => ({ sourceKey: 'pokemon', ...over });

describe('clave de caché', () => {
  it('el scope forma parte de la clave', () => {
    const a = dataCacheKey({ userId: 'a' }, query());
    const b = dataCacheKey({ userId: 'b' }, query());
    expect(a).not.toBe(b);
  });

  it('documento y sesión también separan', () => {
    expect(dataCacheKey({ documentId: 'd1' }, query())).not.toBe(dataCacheKey({ documentId: 'd2' }, query()));
    expect(dataCacheKey({ runtimeSessionId: 's1' }, query())).not.toBe(
      dataCacheKey({ runtimeSessionId: 's2' }, query()),
    );
  });

  it('el orden de los params no cambia la clave', () => {
    const a = dataCacheKey({}, query({ params: { a: 1, b: 2 } }));
    const b = dataCacheKey({}, query({ params: { b: 2, a: 1 } }));
    expect(a).toBe(b);
  });
});

describe('carreras de respuesta', () => {
  it('descarta una respuesta obsoleta que llega la última', async () => {
    const runtime = createDataSourceRuntime();
    const primera = deferred<string[]>();
    const ultima = deferred<string[]>();

    // El usuario teclea "a" y luego "abc".
    const pendienteA = runtime.query(query({ search: 'a' }), () => primera.promise);
    const pendienteAbc = runtime.query(query({ search: 'abc' }), () => ultima.promise);

    // "abc" responde primero…
    ultima.resolve(['resultado-abc']);
    const resultadoAbc = await pendienteAbc;
    expect(resultadoAbc.status).toBe('success');

    // …y "a" llega después: NO puede pintarse.
    primera.resolve(['resultado-a']);
    const resultadoA = await pendienteA;
    expect(resultadoA.status).toBe('cancelled');
  });

  it('una respuesta en orden sí se aplica', async () => {
    const runtime = createDataSourceRuntime();
    const primero = await runtime.query(query({ search: 'a' }), async () => ['a']);
    const segundo = await runtime.query(query({ search: 'ab' }), async () => ['ab']);
    expect(primero.status).toBe('success');
    expect(segundo.status).toBe('success');
    expect(segundo.sequence).toBeGreaterThan(primero.sequence);
  });
});

describe('single-flight', () => {
  it('dos peticiones idénticas simultáneas comparten una sola llamada', async () => {
    const runtime = createDataSourceRuntime();
    const executor = vi.fn().mockResolvedValue(['x']);
    const [a, b] = await Promise.all([
      runtime.query(query({ search: 'p' }), executor),
      runtime.query(query({ search: 'p' }), executor),
    ]);
    expect(executor).toHaveBeenCalledTimes(1);
    expect(a.status === 'success' || b.status === 'success').toBe(true);
  });

  it('consultas distintas no se comparten', async () => {
    const runtime = createDataSourceRuntime();
    const executor = vi.fn().mockResolvedValue(['x']);
    await Promise.all([
      runtime.query(query({ search: 'p' }), executor),
      runtime.query(query({ search: 'q' }), executor),
    ]);
    expect(executor).toHaveBeenCalledTimes(2);
  });
});

describe('aislamiento por scope', () => {
  it('la caché no filtra datos entre usuarios', async () => {
    let now = 0;
    const runtime = createDataSourceRuntime({ cacheTtlMs: 1000, now: () => now });

    runtime.setScope({ runtimeSessionId: 's', userId: 'a', documentId: 'd' });
    await runtime.query(query(), async () => ['datos-de-a']);

    const executorB = vi.fn().mockResolvedValue(['datos-de-b']);
    runtime.setScope({ runtimeSessionId: 's', userId: 'b', documentId: 'd' });
    const resultadoB = await runtime.query(query(), executorB);

    // B NO recibe la caché de A: se ejecuta de verdad.
    expect(executorB).toHaveBeenCalledTimes(1);
    expect(resultadoB.fromCache).toBe(false);
    expect(resultadoB.data).toEqual(['datos-de-b']);
  });

  it('cambiar de scope aborta lo que estaba en vuelo', async () => {
    const runtime = createDataSourceRuntime();
    const pendiente = deferred<string[]>();
    const enVuelo = runtime.query(query(), (_q, context) => {
      context.signal.addEventListener('abort', () => pendiente.reject(new Error('abort')));
      return pendiente.promise;
    });

    runtime.setScope({ userId: 'otro' });
    const resultado = await enVuelo;
    expect(resultado.status).toBe('cancelled');
  });

  it('el mismo scope reutiliza la caché', async () => {
    let now = 0;
    const runtime = createDataSourceRuntime({ cacheTtlMs: 1000, now: () => now });
    runtime.setScope({ userId: 'a' });
    const executor = vi.fn().mockResolvedValue(['x']);
    await runtime.query(query(), executor);
    const segundo = await runtime.query(query(), executor);
    expect(executor).toHaveBeenCalledTimes(1);
    expect(segundo.fromCache).toBe(true);
  });
});

describe('caché y TTL', () => {
  it('la caché caduca', async () => {
    let now = 0;
    const runtime = createDataSourceRuntime({ cacheTtlMs: 100, now: () => now });
    const executor = vi.fn().mockResolvedValue(['x']);
    await runtime.query(query(), executor);
    now = 500;
    await runtime.query(query(), executor);
    expect(executor).toHaveBeenCalledTimes(2);
  });

  it('sin TTL no hay caché', async () => {
    const runtime = createDataSourceRuntime();
    const executor = vi.fn().mockResolvedValue(['x']);
    await runtime.query(query(), executor);
    const segundo = await runtime.query(query(), executor);
    expect(executor).toHaveBeenCalledTimes(2);
    expect(segundo.fromCache).toBe(false);
  });

  it('invalidate limpia por fuente', async () => {
    let now = 0;
    const runtime = createDataSourceRuntime({ cacheTtlMs: 1000, now: () => now });
    await runtime.query(query({ sourceKey: 'a' }), async () => [1]);
    await runtime.query(query({ sourceKey: 'b' }), async () => [2]);
    expect(runtime.invalidate('a')).toBe(1);
    expect(runtime.invalidate()).toBe(1);
  });
});

describe('errores y cleanup', () => {
  it('un fallo se reporta sin romper el runtime', async () => {
    const runtime = createDataSourceRuntime();
    const fallo = await runtime.query(query(), async () => {
      throw new Error('boom');
    });
    expect(fallo.status).toBe('error');
    const reintento = await runtime.query(query(), async () => ['ok']);
    expect(reintento.status).toBe('success');
  });

  it('un error no envenena la caché', async () => {
    let now = 0;
    const runtime = createDataSourceRuntime({ cacheTtlMs: 1000, now: () => now });
    await runtime.query(query(), async () => {
      throw new Error('boom');
    });
    const executor = vi.fn().mockResolvedValue(['ok']);
    await runtime.query(query(), executor);
    expect(executor).toHaveBeenCalledTimes(1);
  });

  it('tras dispose ninguna respuesta pendiente escribe', async () => {
    const runtime = createDataSourceRuntime();
    const pendiente = deferred<string[]>();
    const enVuelo = runtime.query(query(), () => pendiente.promise);
    runtime.dispose();
    pendiente.resolve(['tarde']);
    expect((await enVuelo).status).toBe('cancelled');
    expect((await runtime.query(query(), async () => ['x'])).status).toBe('cancelled');
    expect(runtime.inFlightCount()).toBe(0);
  });
});
