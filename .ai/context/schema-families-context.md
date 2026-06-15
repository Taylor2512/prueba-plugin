# Schema Families Context

## Familias

```txt
text-like
option-based
boolean
signing-based
action-based
media
shape
table
advanced
```

## Prioridad

- option-based: checkboxGroup, radioGroup, select/dropdown.
- boolean: checkbox.
- signing-based: signature, initials, dateSigned.
- action-based: approve, decline, attachment, note.
- text-like: text, number, date/time, fullName, email, company, title.

## Regla

Cada familia debe compartir factory, renderer, capabilities y value adapter cuando aplique.
