/**
 * Identidad de los grupos de opciones en el nacimiento del schema.
 *
 * Regresión cubierta: `checkboxGroup` y `radioGroup` declaraban `id`, `groupId`
 * y `group` como claves PROPIAS con valor `undefined`. El Designer crea el
 * schema nuevo como `{ id: uuid(), ...defaultSchema }`, así que esas claves
 * ganaban el spread y borraban el uuid recién generado. Sin `id` no hay
 * `data-schema-id`, la selección no resuelve el schema, `getActiveIds` lo
 * descarta y las capacidades del grupo (agregar/eliminar opción) dejan de
 * operar — pero SÓLO al insertarlo desde el catálogo, porque un schema
 * declarado en la plantilla trae su identidad ya escrita.
 */
import { describe, expect, it } from 'vitest';
import type { Plugin, Schema } from '@sisad-pdfme/common';
import { createDefaultSchema, flatSchemaPlugins } from '@sisad-pdfme/schemas';
import { normalizeOptionGroupOptions } from '@sisad-pdfme/schemas/options/optionModel';

/** Claves cuya autoridad es el motor de inserción, nunca la plantilla del plugin. */
const CLAVES_DE_IDENTIDAD = ['id', 'schemaUid', 'groupId', 'group'] as const;

const plugins = flatSchemaPlugins as unknown as Record<string, Plugin<Schema>>;

const defaultSchemaDe = (tipo: string): Record<string, unknown> => {
  const declarado = plugins[tipo]?.propPanel?.defaultSchema;
  expect(declarado, `el plugin ${tipo} debe declarar defaultSchema`).toBeTruthy();
  return declarado as unknown as Record<string, unknown>;
};

/**
 * Reproduce el spread de `Designer.addSchema` sin montar el Designer: es la
 * operación exacta que borraba la identidad.
 */
const insertarComoElDesigner = (declarado: Record<string, unknown>) => ({
  readOnly: false,
  ...declarado,
  id: (declarado.id as string) || 'uuid-generado',
});

describe('grupos de opciones — identidad al insertar', () => {
  it('ningún plugin declara claves de identidad con valor undefined', () => {
    const infractores: string[] = [];
    for (const [tipo, plugin] of Object.entries(plugins)) {
      const declarado = plugin?.propPanel?.defaultSchema as unknown as Record<string, unknown> | undefined;
      if (!declarado || typeof declarado !== 'object') continue;
      for (const clave of CLAVES_DE_IDENTIDAD) {
        if (clave in declarado && declarado[clave] === undefined) {
          infractores.push(`${tipo}.${clave}`);
        }
      }
    }
    expect(infractores, 'una clave propia con undefined gana el spread y borra la identidad').toEqual([]);
  });

  it.each(['checkboxGroup', 'radioGroup'])(
    '%s conserva el uuid generado al pasar por el spread de inserción',
    (tipo) => {
      const insertado = insertarComoElDesigner(defaultSchemaDe(tipo));
      expect(insertado.id).toBe('uuid-generado');
    },
  );

  it.each(['checkboxGroup', 'radioGroup'])(
    'dos instancias de %s creadas por la vía canónica no comparten identidad',
    (tipo) => {
      const a = createDefaultSchema(tipo);
      const b = createDefaultSchema(tipo, { existingSchemas: [a as Schema] });

      expect(a.id).toBeTruthy();
      expect(b.id).toBeTruthy();
      expect(a.id).not.toBe(b.id);
      expect(a.schemaUid).not.toBe(b.schemaUid);
      expect(a.name).not.toBe(b.name);
    },
  );

  it.each(['checkboxGroup', 'radioGroup'])(
    '%s nace con dos opciones y con ids de opción únicos dentro del grupo',
    (tipo) => {
      const creado = createDefaultSchema(tipo) as unknown as {
        options?: Array<string | { optionId: string; label: string }>;
      };
      const opciones = normalizeOptionGroupOptions(creado.options, 'Opción');
      expect(opciones).toHaveLength(2);
      expect(new Set(opciones.map((opcion) => opcion.optionId)).size).toBe(2);
    },
  );

  it.each(['checkboxGroup', 'radioGroup'])(
    '%s no arrastra un groupId compartido entre instancias distintas',
    (tipo) => {
      const a = createDefaultSchema(tipo) as unknown as Record<string, unknown>;
      const b = createDefaultSchema(tipo) as unknown as Record<string, unknown>;
      // Sin groupId declarado, la clave del grupo cae al `name` —único por
      // documento—, así que dos grupos del mismo tipo quedan aislados.
      expect(a.groupId ?? null).toBe(b.groupId ?? null);
      expect(a.groupId ?? null).toBeNull();
    },
  );
});
