# Checklist de completados protegidos

## Estado protegido

- [x] Config global portable creada (`TASK-ARCH-001`).
- [x] Recipient Registry creado (`TASK-ARCH-002`).
- [x] Reasignación base con persistencia creada (`TASK-PDFME-003`).
- [x] Paridad multidocumento base (`TASK-PDFME-004`).
- [x] Runtime Form preview por recipient (`TASK-PDFME-006`).
- [x] Snapshot persistence contract (`TASK-PDFME-007`).
- [x] Snap-lines y compactación inicial (`TASK-CANVAS-002`).
- [x] Densidad inicial de DetailView (`TASK-INSPECTOR-001`).
- [x] Indicadores DocuSign para option groups (`TASK-SCHEMA-001`).
- [x] Reducción CSS segura a Tailwind inline (`TASK-CSS-012`).
- [x] Controller público sin no-op silencioso (`TASK-PDFME-013`).
- [x] Continuidad de wiring de visibility config (`TASK-PDFME-012`).
- [x] Restaurar conectividad SISAD (`TASK-PDFME-011`).
- [x] Drag preview, scroll canvas y posicionamiento (`TASK-PDFME-010`).
- [x] Proteger overflow/scroll de Canvas post Tailwind (`TASK-CANVAS-001`).

## Política de no regresión

- No reimplementar features completadas desde cero.
- No duplicar lógica en host.
- No añadir carpetas paralelas.
- No tocar PDF-lib, Moveable, Selecto, geometría o snapshot sin task-card explícita.
- No convertir reports/completed en contexto activo.
