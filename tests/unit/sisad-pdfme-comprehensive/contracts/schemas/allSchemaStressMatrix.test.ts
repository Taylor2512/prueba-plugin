/**
 * Matriz de estrés de todos los schemas registrados (RTP-515).
 *
 * Ningún tipo aparece escrito aquí. Todo lo que se ejerce sale del registry
 * vivo, así que registrar un schema nuevo lo somete a estos invariantes sin
 * tocar el test, y un schema que los rompa falla en cuanto se registra.
 *
 * Los cuatro invariantes son de corrección observada en producción:
 * nombres que colisionan entre instancias del mismo tipo, estado de módulo
 * compartido entre montajes, reversión de hermanos al escribir en uno, y
 * familias que conviven en el mismo documento pisándose el valor.
 */
import { describe, expect, it } from 'vitest';
import { collectChangedInputs, mergeFormInputRows } from '../../../../../src/sisad-pdfme/ui/Form';
import { SCHEMA_RUNTIME_FAMILIES } from '../../../../../src/sisad-pdfme/schemas/schemaRuntimeMetadata';
import { getBuiltInFields } from '../../../../../src/sisad-pdfme/schemas';
import { snapshotAdapter } from '../../../../../src/sisad-pdfme/shared/snapshotAdapter';
import {
  buildStressInstances,
  buildStressSnapshotDocument,
  collectStressDiagnostics,
  familyPairwiseMatrix,
  initialInputRow,
  listInteractiveSchemaManifest,
  listRegisteredSchemaManifest,
  mountStressInstance,
  representativesByFamily,
  stressValueFor,
  type StressInstance,
} from '../../helpers/allSchemaStressHarness';

const INSTANCES_PER_TYPE = 3;

const registeredManifest = listRegisteredSchemaManifest();
const interactiveManifest = listInteractiveSchemaManifest();

describe('la matriz se deriva del registry, no de una lista', () => {
  it('cubre exactamente los tipos que el registry publica', () => {
    expect(registeredManifest.map((entry) => entry.type).sort()).toEqual(
      getBuiltInFields().map((definition) => definition.type).sort(),
    );
    expect(registeredManifest.length).toBeGreaterThan(0);
  });

  it('resuelve las implicaciones de runtime de todos los tipos', () => {
    const diagnostics = collectStressDiagnostics(registeredManifest);

    expect(diagnostics.incomplete).toEqual([]);
    expect(diagnostics.totalTypes).toBe(registeredManifest.length);
    expect(diagnostics.interactiveTypes).toBe(interactiveManifest.length);
  });

  it('no deja ninguna familia declarada sin tipo registrado', () => {
    const covered = Object.keys(collectStressDiagnostics(registeredManifest).byFamily);

    // Una familia declarada y sin miembros es taxonomía muerta: nada la ejerce
    // y su comportamiento de runtime nunca se comprueba.
    expect([...SCHEMA_RUNTIME_FAMILIES].sort()).toEqual([...covered].sort());
  });

  it('deja al menos un tipo interactivo por cada familia completable', () => {
    const completable = interactiveManifest.filter((entry) => entry.completion !== 'none');

    expect(completable.length).toBeGreaterThan(0);
    expect(new Set(completable.map((entry) => entry.family)).size).toBeGreaterThan(1);
  });
});

describe('multi-instancia: varias instancias de cada tipo registrado', () => {
  const instances = buildStressInstances(registeredManifest, INSTANCES_PER_TYPE);

  it(`crea ${INSTANCES_PER_TYPE} instancias de cada tipo`, () => {
    expect(instances).toHaveLength(registeredManifest.length * INSTANCES_PER_TYPE);
  });

  it('no repite el nombre entre hermanas del mismo tipo', () => {
    // Dos campos con el mismo nombre comparten entrada en Form: escribir en uno
    // escribe en el otro. Es el fallo que sólo aparece con más de una instancia.
    const names = instances.map((instance) => instance.name);

    expect(new Set(names).size).toBe(names.length);
  });

  it('no repite el uid entre instancias', () => {
    const uids = instances.map((instance) => instance.schema.schemaUid);

    expect(new Set(uids).size).toBe(uids.length);
  });

  it('da a cada instancia su propio objeto de schema', () => {
    const byType = new Map<string, StressInstance[]>();
    instances.forEach((instance) => {
      byType.set(instance.type, [...(byType.get(instance.type) ?? []), instance]);
    });

    byType.forEach((siblings, type) => {
      const [first, ...rest] = siblings;
      rest.forEach((sibling) => {
        expect(sibling.schema, `${type} comparte objeto entre instancias`).not.toBe(first.schema);
        expect(sibling.schema.position, `${type} comparte position entre instancias`).not.toBe(
          first.schema.position,
        );
      });
    });
  });

  it('mutar una instancia no alcanza a sus hermanas', () => {
    const mutated = buildStressInstances(registeredManifest, INSTANCES_PER_TYPE);
    const byType = new Map<string, StressInstance[]>();
    mutated.forEach((instance) => {
      byType.set(instance.type, [...(byType.get(instance.type) ?? []), instance]);
    });

    byType.forEach((siblings) => {
      siblings[0].schema.width = 123.45;
      siblings[0].schema.position.x = 67.89;
    });

    byType.forEach((siblings, type) => {
      siblings.slice(1).forEach((sibling) => {
        expect(sibling.schema.width, `${type} propagó width a una hermana`).not.toBe(123.45);
        expect(sibling.schema.position.x, `${type} propagó position a una hermana`).not.toBe(67.89);
      });
    });
  });
});

describe('sin fuga de estado de módulo entre montajes', () => {
  const instances = buildStressInstances(interactiveManifest, 2);

  for (const type of new Set(instances.map((instance) => instance.type))) {
    it(`${type} monta dos instancias independientes en form`, async () => {
      const siblings = instances.filter((instance) => instance.type === type);
      const first = await mountStressInstance(siblings[0], 'form');
      const second = await mountStressInstance(siblings[1], 'form');

      expect(first.root).not.toBe(second.root);
      // Montar la segunda no puede vaciar ni reescribir la primera: si un plugin
      // guardara su raíz en el módulo, el segundo montaje se llevaría la del primero.
      expect(first.root.isConnected).toBe(second.root.isConnected);

      // Un montaje puede emitir cambios propios —`table` se autoajusta la altura—,
      // pero dos montajes idénticos deben emitir lo mismo. Si el segundo emitiera
      // de más, estaría arrastrando estado de módulo del primero.
      expect(second.changes).toEqual(first.changes);
      // Y cada cambio tiene que haber llegado a su propio `onChange`.
      expect(first.changes.length).toBe(second.changes.length);
    });
  }
});

describe('no-rollback: escribir en una instancia no revierte a las demás', () => {
  const instances = buildStressInstances(interactiveManifest, INSTANCES_PER_TYPE);

  it('conserva todos los valores ya escritos tras la última escritura', () => {
    let rows = [initialInputRow(instances)];
    const committed: Record<string, string> = {};

    instances.forEach((instance) => {
      const value = stressValueFor(instance);
      // Form entrega parches de un solo campo, no la fila entera: el bug de
      // rollback consistía en tratar los campos ausentes del parche como vacíos.
      rows = mergeFormInputRows(rows, [{ [instance.name]: value }]);
      committed[instance.name] = value;
    });

    expect(rows[0]).toEqual(committed);
  });

  it('reporta exactamente un cambio por escritura', () => {
    let rows = [initialInputRow(instances)];

    instances.forEach((instance) => {
      const next = mergeFormInputRows(rows, [{ [instance.name]: stressValueFor(instance) }]);
      const changed = collectChangedInputs(rows, next);

      expect(changed, `${instance.name} arrastró cambios de hermanos`).toEqual([
        { index: 0, name: instance.name, value: stressValueFor(instance) },
      ]);
      rows = next;
    });
  });

  it('permite vaciar un campo explícitamente sin tocar a los demás', () => {
    const rows = [initialInputRow(instances)];
    const target = instances[0];
    const filled = mergeFormInputRows(rows, [
      Object.fromEntries(instances.map((instance) => [instance.name, stressValueFor(instance)])),
    ]);

    const cleared = mergeFormInputRows(filled, [{ [target.name]: '' }]);

    expect(cleared[0][target.name]).toBe('');
    instances.slice(1).forEach((instance) => {
      expect(cleared[0][instance.name]).toBe(stressValueFor(instance));
    });
  });
});

describe('paridad de snapshot con el documento de estrés completo', () => {
  const instances = buildStressInstances(registeredManifest, INSTANCES_PER_TYPE);

  const roundTrip = () => {
    const document = buildStressSnapshotDocument(instances);
    const inputs = [
      Object.fromEntries(instances.map((instance) => [instance.name, stressValueFor(instance)])),
    ];
    const snapshot = snapshotAdapter.serialize(
      {
        templateSchemaVersion: '2.0.0',
        activeDocumentId: document.documentId,
        documents: [document] as never,
        recipients: [],
        assignments: [],
        inputs,
        signatureConfig: { defaultMode: 'draw', allowedModes: ['draw'] },
        providerConfig: { defaultProvider: 'draw', allowedProviders: ['draw'] },
      } as never,
      { name: 'stress', createdByUserId: 'harness' },
    );
    return snapshotAdapter.deserialize(snapshot);
  };

  it('no pierde ni funde ninguna instancia al serializar y restaurar', () => {
    const restored = roundTrip();
    const schemas = restored.documents[0].pages[0].schemas;

    expect(schemas).toHaveLength(instances.length);
    expect(new Set(schemas.map((schema) => schema.__designer.schemaUid)).size).toBe(instances.length);
  });

  it('conserva tipo, nombre y uid de cada instancia', () => {
    const restored = roundTrip();
    const byUid = new Map(
      restored.documents[0].pages[0].schemas.map((schema) => [schema.__designer.schemaUid, schema]),
    );

    instances.forEach((instance) => {
      const schema = byUid.get(String(instance.schema.schemaUid));

      expect(schema, `${instance.name} desapareció del snapshot`).toBeDefined();
      expect(schema?.name).toBe(instance.name);
      expect(schema?.type).toBe(instance.schema.type);
    });
  });

  it('conserva el valor comprometido de cada instancia', () => {
    const restored = roundTrip();

    instances.forEach((instance) => {
      expect(restored.inputs?.[0]?.[instance.name]).toBe(stressValueFor(instance));
    });
  });
});

describe('pairwise: cada par de familias conviviendo en el mismo documento', () => {
  const pairs = familyPairwiseMatrix(interactiveManifest);

  it('genera la matriz completa de pares de familias', () => {
    const families = representativesByFamily(interactiveManifest).length;

    expect(pairs).toHaveLength((families * (families - 1)) / 2);
    expect(pairs.length).toBeGreaterThan(0);
  });

  for (const [left, right] of pairs) {
    it(`${left.family} y ${right.family} no se pisan el valor`, () => {
      const instances = buildStressInstances([left, right], 2);
      const rows = [initialInputRow(instances)];

      // Se escribe en las dos familias en orden alterno: si una reconstruyera la
      // fila desde su propio snapshot, la otra volvería a su valor de plantilla.
      const afterFirst = mergeFormInputRows(rows, [{ [instances[0].name]: stressValueFor(instances[0]) }]);
      const afterSecond = mergeFormInputRows(afterFirst, [
        { [instances[2].name]: stressValueFor(instances[2]) },
      ]);
      const afterThird = mergeFormInputRows(afterSecond, [
        { [instances[1].name]: stressValueFor(instances[1]) },
      ]);

      expect(afterThird[0][instances[0].name]).toBe(stressValueFor(instances[0]));
      expect(afterThird[0][instances[2].name]).toBe(stressValueFor(instances[2]));
      expect(afterThird[0][instances[1].name]).toBe(stressValueFor(instances[1]));
      expect(afterThird[0][instances[3].name]).toBe(String(instances[3].schema.content ?? ''));
    });
  }
});
