# Análisis funcional DocuSign-like aplicado al diseñador

## Procesos

1. Cargar/preparar documento.
2. Definir recipients.
3. Añadir campos/tabs.
4. Ubicar campos.
5. Configurar propiedades.
6. Validar campos.
7. Completar/firma.
8. Auditar resultado.

## Mapeo funcional

| DocuSign | sisad-pdfme |
|---|---|
| SignHere | signature |
| InitialHere | initials |
| DateSigned | dateSigned |
| Text | text |
| Number | number |
| Checkbox | checkbox |
| Checkbox group | checkboxGroup |
| RadioGroup | radioGroup |
| List | select/dropdown |
| FormulaTab | formula |
| SignerAttachment | attachment |
| Note | note |
| Approve | approve |
| Decline | decline |

## Propiedades comunes

```txt
recipient
required
readOnly/locked
dataLabel
tooltip
validation
appearance
location
autoPlace
permissions
conditional
prefill
dataBindings
audit
```
