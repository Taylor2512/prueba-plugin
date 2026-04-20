# `InlineEditOverlay.tsx`

## Rol

`InlineEditOverlay.tsx` es el reemplazo correcto del `window.prompt` en el editor. Las capturas y la evolución del proyecto muestran que se migró hacia un overlay inline con inputs de Ant Design para editar texto o etiquetas directamente sobre el canvas, con headers que distinguen el target (`Etiqueta` o `Texto`) y una ayuda inline (`Enter guarda · Escape cancela`). fileciteturn19file9turn19file10turn19file14

## Qué resuelve

- mantiene al usuario dentro del contexto visual
- evita romper el flujo con diálogos del navegador
- soporta edición de targets distintos (`name`, `text`)
- permite multiline y autogrow
- se integra con las fases del canvas

## Contrato conceptual

### Inputs
- sesión de edición (`InlineEditSession`)
- dimensiones del overlay
- callbacks de commit/cancel
- valor actual

### Outputs
- commit del nuevo valor
- cancelación
- posible actualización del schema o del label

## Detalles observables en el código

En los snippets disponibles se aprecia:
- clase CSS dedicada `pdfme-ui-inline-edit-overlay` / `sisad-pdfme-ui-inline-edit-overlay`
- header con kicker e hint
- uso de `Input` e `Input.TextArea`
- soporte de `placeholder`
- control de `minHeight` y `width`
- `onMouseDown` para evitar propagación en algunas variantes del archivo fileciteturn19file9turn19file10turn19file14

## Integración recomendada

El overlay no debe decidir por sí solo qué propiedad edita. Debe recibir una sesión claramente tipada:

```ts
type InlineEditTarget = 'name' | 'content' | 'label' | 'placeholder';

type InlineEditSession = {
  target: InlineEditTarget;
  schemaId: string;
  multiline?: boolean;
  initialValue: string;
};
```

## Riesgos

- colisión con drag o select si no se bloquea el canvas
- pérdida de foco si el overlay vive en un árbol que rerenderiza demasiado
- commits prematuros por blur accidental
- inconsistencia si el schema cambia mientras el usuario edita

## Ejemplo de implementación

```tsx
<InlineEditOverlay
  session={{
    target: 'content',
    schemaId: activeSchema.id,
    multiline: true,
    initialValue: activeSchema.content ?? '',
  }}
  dimensions={overlayBounds}
  onCommit={(nextValue) => updateSchema(activeSchema.id, { content: nextValue })}
  onCancel={() => closeInlineEdit()}
/>
```

## Qué mejorar

- documentar el shape exacto de `InlineEditSession`
- diferenciar en docs cuándo se usa para nombre vs texto
- explicar el vínculo con `selectionCommands`
- añadir tabla de comportamiento por teclado
