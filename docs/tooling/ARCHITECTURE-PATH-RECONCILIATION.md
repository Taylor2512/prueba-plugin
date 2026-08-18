# Reconciliación de paths de arquitectura

## Problema

El proyecto ha eliminado versionamiento físico (`-v2`, `-V7`, fechas y sufijos
de revisión) en muchas familias. Parte de la documentación y tooling puede
seguir apuntando a rutas antiguas aunque el archivo nuevo ya exista.

## Política

```text
Git = historial
path = responsabilidad semántica estable
id interno = trazabilidad
```

Un rename no debe borrar contenido divergente.

## Mecanismo

`config/tooling/architecture-path-aliases.json` registra aliases observados:

```json
{
  "from": ".ai/index/runtime-platform",
  "to": ".ai/index/runtime-platform"
}
```

`npm run docs -- paths .`:

- detecta source/target actuales;
- marca moves seguros;
- detecta target divergente;
- conserva aliases ya aplicados para reescribir referencias;
- no toca el repo.

`npm run docs -- paths . --apply`:

- crea backup externo;
- mueve únicamente aliases seguros;
- elimina duplicados idénticos;
- no elimina conflictos divergentes;
- reescribe paths repo-relative y links relativos conocidos.

## Regla de cierre

Después de apply:

```bash
npm run docs -- scan .
npm run docs -- index .
npm run docs -- validate .
git diff --check
git status --short
```

No afirmar que el producto compila o que tests funcionales pasan por una
migración puramente documental/tooling.
