# DetailView

Taxonomía:

```txt
identity · content · options · validation · fileRules · signature · action
behavior · box · appearance · dataBindings · comments · collaboration · advanced
```

Todo widget declara `propertyPath`, `read`, `write`, `visibleWhen`,
`disabledWhen`, `validate` y `layout`.

Required vive en validation; readOnly en behavior; ownership/lock en
collaboration. No se renderiza una sección o control sin capability y writer.
