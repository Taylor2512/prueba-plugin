# Grid geometry contract

Grid visual y snapping comparten exactamente una geometría.

```ts
type GridGeometry = {
  spacingMm: number;
  majorEvery: number;
  originMm: { x: number; y: number };
  snapEnabled: boolean;
  snapThresholdMm: number;
};
```

## Coordinate ownership

Grid se define en page space, no en viewport/canvas-scroll space.

Cada página posee origen lógico `(0mm, 0mm)`.

Zoom transforma la representación, nunca el valor lógico.

## Separation

Capacidades distintas:
- grid visible;
- snap to grid;
- guides visible;
- create guides;
- snap to guides;
- object snap;
- rulers visible;
- snap lines visible.

Una no implica automáticamente las otras.
