# Canvas, Moveable, Selecto y coordenadas

> Documentación generada para consumo externo de `sisad-pdfme`.

## Responsabilidad
El canvas renderiza páginas, schemas y overlays, y coordina selección, drag, resize, rotate, reglas, snap lines y context menu.

## Componentes clave
| Componente | Función |
| --- | --- |
| `Canvas.tsx` | Orquesta eventos, mm↔px, selección, drag/resize/rotate y drop. |
| `Moveable.tsx` | Manipulación de elemento activo. |
| `Selecto.tsx` | Selección por región. |
| `Guides.tsx` | Reglas. |
| `SnapLines.tsx` | Feedback de alineación. |
| `CanvasOverlayManager` | Composición de overlays. |

## Fórmula de coordenadas
```ts
const paperRect = paper.getBoundingClientRect();
const xPx = event.clientX - paperRect.left;
const yPx = event.clientY - paperRect.top;
const xMm = xPx / scale / pxPerMm;
const yMm = yPx / scale / pxPerMm;
```

## Riesgos
- Selecto con `position: fixed` sin descontar scroll.
- Moveable y Selecto activos a la vez.
- Usar un scale distinto en Paper y Renderer.
- Persistir px en vez de mm.
- Cambiar zoom en cada scroll por ResizeObserver.

## Tests obligatorios
- Selección por región en 75/100/150%.
- Selección después de scroll.
- Drag y resize con sidebars abiertos/cerrados.
- Cambio de página/documento limpia selección inválida.
