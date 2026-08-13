# Investigación oficial — runtime PDF

Fecha: 2026-08-13.

## PDF.js

- PDFDocumentProxy cleanup: https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib-PDFDocumentProxy.html
- pdfjsLib loading/range/stream options: https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html
- API source / RenderTask lifecycle: https://mozilla.github.io/pdf.js/api/draft/api.js.html

Implicaciones SISAD-PDFME:
- no ejecutar cleanup mientras una página se está renderizando;
- caracterizar cancelación/destrucción antes de eliminar timers existentes;
- streaming/range/autofetch deben ser opciones de performance, no hacks globales;
- conversiones grandes necesitan límites de concurrencia y cleanup explícito.

## pdf-lib

- PDFForm: https://pdf-lib.js.org/docs/api/classes/pdfform
- PDFDocument: https://pdf-lib.js.org/docs/api/classes/pdfdocument
- PDFSignature: https://pdf-lib.js.org/docs/api/classes/pdfsignature

Implicaciones:
- pdf-lib soporta varias familias AcroForm, pero SISAD-PDFME usa su propio schema/runtime;
- `PDFSignature` no proporciona una API especializada para crear firmas digitales criptográficas;
  por eso el provider de firma sigue siendo un boundary separado.

## React

- Preserving and Resetting State: https://react.dev/learn/preserving-and-resetting-state
- useState: https://react.dev/reference/react/useState
- Updating Objects in State: https://react.dev/learn/updating-objects-in-state

Implicaciones:
- identity/key inestable puede remontear Form y destruir drafts/caret;
- runtime input state debe conservar identidad y actualizarse inmutably en la fachada React.

## Web platform

- File API: https://www.w3.org/TR/FileAPI/
- Pointer Events: https://www.w3.org/TR/pointerevents/

Implicaciones:
- object URLs deben revocarse cuando termina su uso;
- pointer events permiten un contrato mouse/touch/pen común para Designer/Form.

## Accesibilidad

- APG: https://www.w3.org/WAI/ARIA/apg/
- Checkbox: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
- Radio: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- Combobox: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

Los schemas interactivos deben respetar keyboard semantics equivalentes sin hacer que el
Designer cambie valores con un click destinado únicamente a selección.
