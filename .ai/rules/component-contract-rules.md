# Reglas — Contratos por componente

- Designer orquesta, no duplica runtime.
- Canvas controla page stack, zoom y scroll.
- Renderer controla wrapper root y data attributes.
- Moveable transforma; Selecto selecciona.
- DetailView edita propiedades; ListView navega jerarquía.
- Schema plugins no deben mutar estado global directamente.
- SnapshotAdapter es contrato de persistencia.
- externalForms consume Form/Viewer y snapshot; no renderiza paralelo.
- Si una responsabilidad aparece en dos componentes, consolidar o documentar dueño.
