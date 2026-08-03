# Configuración

Distinguir:

```txt
registered · supported · enabled · visible · permitted · available
active · executable · reason · sources
```

ConfigService/selectors/registries son la fuente única. UI no lee config cruda
ni replica condiciones. Cambios presentacionales son hot updates; cambios
estructurales usan rebuild explícito.
