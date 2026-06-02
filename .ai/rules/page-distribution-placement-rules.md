# Reglas — Distribución multi-PDF/multi-página y no-overlap

- Ningún schema del mismo owner puede superponerse con otro del mismo owner en el mismo documento/página.
- Si no hay espacio en página actual, buscar página siguiente.
- Si el escenario tiene varios PDFs, distribuir entre PDFs disponibles.
- Si no hay espacio, mostrar feedback claro; no crear fuera de paper.
- `checkboxGroup` y `radioGroup` usan bounding box total.
- Insertar options con `+` no debe sacar el grupo de page bounds.
- Page stack depende de page size, scale y gap estable; no de altura de schemas.
- No resolver huecos fantasma con márgenes negativos.
