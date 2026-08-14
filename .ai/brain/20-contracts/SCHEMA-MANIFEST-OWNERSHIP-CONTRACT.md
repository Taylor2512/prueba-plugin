# Schema manifest ownership contract

El plugin/registry es dueño de la metadata del schema.

No mantener listas duplicadas de tipos en runtime.

Cada plugin debe poder declarar/proyectar:

```text
type
aliases
family
interactionKind
capabilities
codec
validation
completion policy
artifact policy
layout policy
dependencies
snapshot behavior
```

`getSchemaRuntimeManifest()` proyecta el registry.

No normalizar a lowercase para luego comparar contra keys camelCase.
