# Risk register

## P0

- capability resolution fail-open;
- varias fuentes para feature/action/component/UI visibility;
- grid visual y snap potencialmente en geometrías distintas;
- schema manifest con metadata inferida/hardcodeada en vez de plugin-owned;
- canonical merge que puede emitir conflict y a la vez producir winner;
- Form/runtime integration no totalmente demostrada por utility tests;
- direct config readers que saltan ConfigService;
- shared execution scope sin identidad lógica explícita del documento;
- binary artifacts mezclados con roundtrip JSON genérico.

## P1

- Recipient naming/internal model debt;
- module-level mutable state en algunos renderers;
- oversized components;
- wrappers/reexports;
- duplicate registries/selectors;
- knowledge/documentation drift;
- dead code susceptible de referencias dinámicas;
- PDF composition sin límites claros de memoria.

## P2

- UX density/visual parity;
- generated/context cleanup;
- benchmark/comparator docs mezclados con authority docs.
