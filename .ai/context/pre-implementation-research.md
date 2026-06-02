# Investigación previa — SISAD PDFME v4

## Fuentes revisadas

- `codigo-sisad-pdfme.txt`: snapshot de código con 456 archivos.
- `documentacion-sisad-pdfme.md`: snapshot documental con 361 archivos Markdown.
- `styles-sisad-dfme.css`: snapshot CSS con 6 archivos.
- Capturas y grabación comparando `localhost:5174/lab/multi-document-routing` con patrones de DocuSign.

## Hallazgos estructurales

1. Ya existe una arquitectura `.ai` con agentes, reglas, prompts, skills, providers y documentación humana.
2. El proyecto ya contiene tests unitarios y Playwright para `checkboxGroup`, DetailView, no-overlap, snapshot y transform.
3. El cambio reciente agregó `checkboxGroup`; no conviene reemplazar la arquitectura, sino actualizarla con contextos y prompts cortos.
4. `sisad-pdfme` debe seguir siendo fork-safe y proveedor-agnóstico.
5. El riesgo principal no es compilar; es asegurar comportamiento de extremo a extremo: Designer -> DetailView/ListView -> Snapshot -> Form/Viewer -> Generator/PDF.

## Decisión de arquitectura documental

- Mantener la arquitectura v3.
- Crear capa v4 especializada en standard fields y grupos.
- No convertir la documentación en un prompt gigante.
- Priorizar casos de uso, contratos, checklists y prompts pequeños.
