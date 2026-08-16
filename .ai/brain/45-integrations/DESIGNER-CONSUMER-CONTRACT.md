# Designer consumer contract

## Consumer owns

- application navigation;
- business data;
- persistence orchestration;
- business authorization;
- consumer-specific metadata;
- mapping from consumer entities into public SISAD-PDFME resources.

## SISAD-PDFME owns

- canvas interaction;
- schemas;
- selection/move/resize/rotate;
- sidebars and inspector behavior;
- document/page interaction;
- assignments and reusable access behavior;
- snapshot/PDF semantics;
- generic events, commands and providers.

## Integration rule

The host configures the public facade. It does not patch internal Canvas, Moveable, Selecto,
schema registries or private stores.

## Acceptance

A consumer-only change must not require a core change unless the reusable contract itself
is missing a generic capability.
