# Agent Registry

- `designer-runtime-agent.md` — Designer Runtime Agent: Mantiene el flujo principal Designer/Paper/Renderer sin mezclar negocio externo.
- `canvas-agent.md` — Canvas Agent: Gestiona multipágina, papers, scroll, grilla, rulers y overlays sin tocar Moveable/Selecto sin permiso.
- `interaction-agent.md` — Interaction Agent: Protege Selecto, Moveable, shortcuts, selección, drag/resize/rotate y hit-testing.
- `css-tailwind-agent.md` — CSS Tailwind Agent: Migra estilos por capas, conserva tokens, bridge y CSS legacy crítico.
- `visual-baseline-agent.md` — Visual Baseline Agent: Compara estado actual contra public/img-version y detecta regresiones visuales.
- `schema-agent.md` — Schema Agent: Gestiona familias de schemas, option groups, text-like, actions, media, table y signing.
- `inspector-agent.md` — Inspector Agent: Mantiene DetailView/ListView, secciones, widgets y edición por CommandBus.
- `snapshot-agent.md` — Snapshot Agent: Protege snapshot roundtrip, metadata, import/export y migraciones.
- `lab-shell-agent.md` — Lab Shell Agent: Gestiona src/features/pdfcomponent, landing, labs, ResultsPanel y shell canvas-first.
- `docs-architecture-agent.md` — Docs Architecture Agent: Mantiene ai/ sin duplicidad, memoria, reglas, prompts y task-cards.
