# Publicación en registry privado y versionado

## 1. Opciones de publicación

### A. npm privado
Buena opción si quieres distribución simple con control por organización.

### B. GitHub Packages
Útil si ya trabajas alrededor de GitHub y CI.

### C. Registry interno tipo Verdaccio / Artifactory / Nexus
Ideal para empresas o white-label con control total.

## 2. Recomendación

Empezar con registry privado y solo luego evaluar npm público.

## 3. Versionado

Usar SemVer real:
- `0.x` mientras estabilizas surface API
- `1.0.0` cuando cierres exports y contratos públicos

## 4. Qué debe disparar major

- rename de exports públicos
- cambio en shape de `SchemaDesignerConfig`
- breaking changes en builder
- cambio en contratos de generator/converter

## 5. Qué debe disparar minor

- nuevos campos en configs opcionales
- nuevos entrypoints
- nuevos schemas built-in
- nuevas utilidades compatibles

## 6. Qué debe disparar patch

- fixes
- rendimiento
- documentación
- tests
- cambios internos sin romper surface API

## 7. Flujo sugerido

1. merge a `main`
2. CI corre tests/build
3. se genera changelog
4. se publica versión canary o beta
5. se valida consumo en `examples/`
6. se promueve a release estable

## 8. Ejemplo de `.npmrc`

```text
@platform:registry=https://npm.my-company.example/
//npm.my-company.example/:_authToken=${NPM_TOKEN}
```

## 9. Release notes mínimas

- cambios de surface API
- breaking changes
- migraciones
- paquetes impactados
- fixes relevantes
