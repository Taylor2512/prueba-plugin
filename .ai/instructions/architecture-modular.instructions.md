# Architecture Modular

Mantén `sisad-pdfme` organizado por módulos con responsabilidades explícitas. No mezcles UI, dominio, snapshot, generator, converter y schemas en un solo archivo. Cada módulo debe exponer contratos claros y evitar dependencias circulares.

## Checklist

- [ ] Respeta aislamiento del fork.
- [ ] No duplica lógica.
- [ ] Mantiene configuración declarativa.
- [ ] Agrega o actualiza tests.
- [ ] Actualiza documentación si cambia contrato.
