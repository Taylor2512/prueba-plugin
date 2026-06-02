# Regresión — CheckboxGroup, RadioGroup y Dropdown

## Playwright prioritario

1. `checkbox-group-docusign-behavior.spec.ts`
2. `radio-group-docusign-behavior.spec.ts`
3. `standard-fields.spec.ts`
4. `schema-no-overlap.spec.ts`
5. `detail-view-inspector.spec.ts`
6. `snapshot-roundtrip.spec.ts`

## Validaciones visuales

- Borde punteado del grupo.
- Botón + integrado debajo.
- Opciones sin solaparse.
- DetailView sin texto vertical/roto.
- ListView con jerarquía o badges claros.
- Dropdown compacto.

## Validaciones funcionales

- checkboxGroup permite múltiples seleccionados.
- radioGroup solo permite uno.
- dropdown guarda valor seleccionado.
- Form/Viewer/PDF son consistentes.
