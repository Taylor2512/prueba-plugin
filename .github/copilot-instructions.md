# GitHub Copilot Instructions — SISAD PDFME v5

- Trabaja con contratos por proceso, no con fixes aislados.
- Antes de sugerir código, identificar proceso y componente dueño.
- No duplicar runtime visual, Canvas, sidebars, renderer, snapshot ni schema plugins.
- Preservar `schemaUid`, owner, documentId, pageNumber y snapshot.
- No tocar CSS global fuera de `.sisad-pdfme-root`.
- No modificar `.moveable-*` ni `.selecto-*` globalmente.
- Mantener `selectionGroup` separado de `schemaGroup`.
- Cada cambio que toque interacción debe considerar Selecto, Moveable, shortcuts y commandBus.
- Cada cambio que toque schema debe considerar Designer, DetailView, Form, Viewer, Generator/PDF y Snapshot.
