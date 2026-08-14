# Datos remotos y bindings de schemas

## Objetivo

Permitir que schemas reciban información externa sin convertir cada plugin en cliente HTTP.

## Compatibilidad por familia

- text: scalar;
- number: scalar numérico;
- date/time: scalar validado;
- select: collection;
- radio/checkbox groups: collection;
- table: array/object;
- image: referencia/artifact;
- barcode: scalar;
- signature: provider especializado.

La capacidad real se obtiene del schema registry/manifest.

## Opciones

`OptionValue` debe conservar strings, numbers, booleans y null.

Un valor seleccionado que no aparece en la página remota actual no debe reemplazarse por la
primera opción.

## Interaction state

La carga remota no marca touched. Sólo una interacción humana válida marca el schema como
interactuado cuando el contrato del schema así lo define.

## Snapshots

Cuando el label remoto sea necesario para representación offline, guardar `displayValue`
junto al canonical value, no toda la respuesta.
