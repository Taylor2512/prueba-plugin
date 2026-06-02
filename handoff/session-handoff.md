# Handoff de sesión — SISAD PDFME v4

## Estado

Se entrega arquitectura MD actualizada para multi proveedores de IA. La estructura base se mantiene y se agregan contextos/prompts/docs para standard fields y grupos.

## Próximo objetivo recomendado

Usar `START_PROMPT.md` y ejecutar una pasada focalizada con Claude sobre:

1. `checkboxGroup` y botón `+`.
2. No-overlap de grupos.
3. Snapshot roundtrip de grupos.
4. DetailView/ListView de grupo.
5. Form/Viewer/Generator parity.

## No hacer

No iniciar por CSS. No reescribir coordenadas. No cambiar Moveable/Selecto sin test.
