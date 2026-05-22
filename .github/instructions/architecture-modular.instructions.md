# GitHub Copilot — architecture-modular.instructions.md

Mantén `sisad-pdfme` organizado por módulos con responsabilidades explícitas. No mezcles UI, dominio, snapshot, generator, converter y schemas en un solo archivo. Cada módulo debe exponer contratos claros y evitar dependencias circulares.
