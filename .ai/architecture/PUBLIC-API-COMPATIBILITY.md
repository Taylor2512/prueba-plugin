# Compatibilidad de API pública

## Protegido

- exports de paquete;
- props de Designer/Form/Viewer;
- tipos de config;
- adapters;
- snapshots;
- eventos;
- plugins.

## Reglas

- no usar imports profundos en ejemplos;
- agregar deprecations antes de eliminar;
- documentar precedencia de aliases;
- pruebas de compilación para consumidores;
- changelog por breaking change;
- semver;
- no exponer clases internas por accidente;
- verificar `.js` extensions y tipos en build ESM.
