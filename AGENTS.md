# AGENTS.md — Contrato de trabajo SISAD PDFME

## Inicio obligatorio

1. Lee `.ai/START.md`.
2. Selecciona una sola task-card activa.
3. Usa `.ai/MODEL-ROUTER.md` para elegir modelo y esfuerzo.
4. Carga como máximo: 1 ruta + 1 regla + 1 playbook + skills estrictamente aplicables.
5. Inspecciona código real antes de proponer abstracciones.

## Reglas permanentes

- Busca antes de crear: helper, hook, adapter, factory, registry, command, tipo o componente.
- No ocultes clones excluyendo código propio del quality gate.
- Un concepto de dominio debe tener un único propietario canónico.
- Distingue duplicidad esencial de coincidencia accidental; no sobre-abstraigas.
- No modifiques Moveable, Selecto, geometría global, snapshot o `pdf-lib` sin task-card específica.
- Preserva `schemaUid`, documento, página, ownership, colores, grupos, opciones y `__designer`.
- No mezcles análisis global con implementación focal.
- No cierres una tarea sin evidencia: diff, lint/build/tests aplicables y riesgos.
- Actualiza memoria solo con deltas durables; nunca pegues logs completos.

## Gates mínimos

```bash
npm run lint
npm run build
npm run quality:duplicates:strict
npm run quality
```

Agrega Vitest y Playwright focales según la superficie modificada.

## Finalización

Entrega: archivos tocados, decisión de patrón, duplicidad retirada, pruebas ejecutadas, riesgos, pendientes y delta de memoria.
