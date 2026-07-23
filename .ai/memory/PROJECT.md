# Memoria estable del proyecto

- SISAD PDFME es un diseñador portable React/TypeScript basado en pdfme.
- Debe soportar múltiples documentos, páginas, destinatarios, ownership, comentarios y assignments.
- Canvas usa Moveable/Selecto y requiere geometría estable.
- Cada schema debe conservar identidad, routing, geometría, ownership y `__designer`.
- La API pública debe evitar imports profundos desde hosts.
- Tailwind es preferente; CSS plano se conserva para tokens y reglas técnicas justificadas.
- El fork `pdf-lib` es vendor y se audita por separado.
