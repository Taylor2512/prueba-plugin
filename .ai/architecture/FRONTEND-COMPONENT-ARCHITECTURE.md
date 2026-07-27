# Arquitectura de componente frontend reutilizable

## Requisitos

- API pública tipada y estable;
- configuración unificada;
- adapters para host;
- estilos scoped y tokens;
- soporte responsive;
- accesibilidad;
- eventos aislados;
- múltiples instancias en una página;
- browser/SSR safe;
- lazy loading cuando sea útil;
- errores recuperables;
- snapshot versionado;
- tree-shaking y side effects controlados.

## Diseño

Prefiere composición, hooks con contrato, reducers para estado complejo, registries para plugins y policies para permisos/visibilidad.

Evita singletons globales, imports profundos del host, estilos globales y side effects al importar.
