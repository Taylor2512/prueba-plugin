# Skill — SISAD Designer Core UX

## Trigger

Usar para cambios dentro de `src/sisad-pdfme` relacionados con UI, acciones,
eventos, efectos, interacción, inspector, sidebars o schemas.

## Regla central

```txt
Intent → Policy → Command → Mutation → Event → Effect
```

## Protecciones

- no host logic;
- no APIs paralelas;
- no setTimeout;
- no geometry global sin test;
- no CSS host;
- no action visible sin handler/reason;
- preservar metadata crítica.
