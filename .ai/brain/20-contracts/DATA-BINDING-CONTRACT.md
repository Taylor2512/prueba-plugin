# Data Binding Contract

## Propósito

Resolver datos externos hacia valores canónicos de schemas mediante configuración
serializable y portable.

## DataPointer

Soportar como mínimo:

```ts
type DataPointer =
  | {
      syntax: 'json-pointer';
      path: string;
    }
  | {
      syntax: 'jsonpath';
      expression: string;
      cardinality?: 'one' | 'first' | 'many';
    };
```

No usar un parser ad hoc de `a.b[0].c` como única sintaxis.

## Resultado tipado

```ts
type ResolvedData =
  | { kind: 'missing' }
  | { kind: 'scalar'; value: string | number | boolean | null }
  | { kind: 'object'; value: Record<string, unknown> }
  | { kind: 'array'; value: unknown[] };
```

Los bindings declaran `expect: scalar | object | array | any`.

## Option source

```ts
type OptionValue = string | number | boolean | null;

type OptionItem = {
  id: string;
  label: string;
  value: OptionValue;
  disabled?: boolean;
  description?: string;
  iconUrl?: string;
  metadata?: Record<string, unknown>;
};
```

Compatibilidad con `string[]` existente mediante adapter/migration.

## Selected value fuera de la página actual

No inferir que el valor dejó de existir.

Política:

```text
keep-stale
invalidate
clear
```

Default recomendado: `keep-stale`.

No seleccionar `options[0]` silenciosamente por no encontrar el valor en la ventana actual.

## Binding por familia

La metadata del registry/plugin declara si soporta:

```text
none
scalar
collection
artifact
```

Ejemplos:

- text → scalar/string;
- number → scalar/number;
- date/time → scalar validado;
- select/dropdown → collection;
- radioGroup → collection;
- checkboxGroup → collection;
- table → array/object mapping;
- image → reference/artifact policy;
- barcode → scalar;
- multiVariableText → bindings múltiples;
- signature → provider/action especializado, no simple DataSource.

No duplicar `switch(schema.type)` como segunda autoridad.

## Transaction semantics

Carga remota:

```text
origin = prefill/system
touched = false
```

Interacción humana:

```text
origin = user
touched = true
dirty = true
```

Una actualización remota no sobrescribe un valor user-dirty salvo política explícita.

Preservar semántica de:

```text
0
false
[]
null
""
undefined
```

según `SchemaValueCodec`.

## Snapshot

Persistir valor canónico y, cuando haga falta para representación determinista:

```json
{
  "value": 25,
  "displayValue": "Elemento 25"
}
```

No persistir por defecto la respuesta API completa.

Viewer/Generator/PDF no reconsultan la API por defecto.
