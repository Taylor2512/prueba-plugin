# Contexto — Patrones UX inspirados en DocuSign/Wix/Figma

## Alcance

Usar patrones generales de editores de documentos profesionales. No copiar marca, CSS propietario ni nombres internos.

## Observaciones recolectadas

### Catálogo izquierdo

DocuSign muestra campos estándar simples con icono + label: Texto, Número, Casilla de verificación, Menú desplegable, Opción. SISAD debe mantener nombres legibles: no `checkboxGroup`, `radioGroup`, `select` crudo.

### Campos en canvas

- Campo individual pequeño.
- Color de destinatario visible pero sutil.
- El documento PDF sigue siendo protagonista.
- Estado seleccionado claro, sin invadir.
- Toolbar contextual compacta.

### RadioGroup / Opción

```txt
┌ - - - - - ┐
│  ◯        │
│  ◯        │
│  ◯        │
└ - - - - - ┘
     +
```

- Borde punteado del owner.
- Botón `+` debajo integrado.
- Solo una opción seleccionable en Form.
- Inspector derecho muestra propiedades del grupo.

### CheckboxGroup

```txt
┌ - - - - - ┐
│  ☐        │
│  ☐        │
│  ☐        │
└ - - - - - ┘
     +
```

- Multi-selección.
- `+` agrega casilla.
- `minSelected`/`maxSelected` en DetailView.

### Dropdown

```txt
┌──────────────▾┐
│ Seleccionar   │
└──────────────▾┘
```

## Diseño SISAD esperado

- Fondo de schema ownerColor 6–10%.
- Borde 1px idle, máximo 1.5px selected.
- Handles pequeños.
- Grupos con dash suave.
- Botón `+` pequeño, no seleccionable por Selecto.
- Labels técnicos solo en DetailView avanzado.
