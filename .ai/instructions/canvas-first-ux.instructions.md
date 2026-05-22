# Canvas First UX

El canvas es la superficie principal. Cualquier sidebar, rail o overlay debe ayudar al canvas, no competir con él. Las interacciones deben ser compactas, contextuales y no invasivas.

## Reglas de interacción — prioridad (mayo 2026)

```
1. Input/textarea/select/contenteditable activo → bloquear shortcuts y drag/resize/rotate.
2. Inline edit activo → Selecto suspendido, Moveable externo suspendido.
   Escape cierra inline edit antes de limpiar selección global.
3. Resize activo → Selecto suspendido, drag desde catálogo suspendido.
4. Rotation activo → Selecto suspendido, toolbar flotante recalcula posición.
5. Context menu abierto → click externo cierra menú antes de iniciar nueva acción.
6. Schema locked/readonly → puede seleccionarse, no puede moverse/resizarse/rotarse/eliminarse.
```

Fuente de verdad: `shared/interactionGuards.ts` — `canStartInteraction()` + `DesignerInteractionMode`.

## Color del destinatario activo en el catálogo

- Catálogo = schemas a crear → muestra `activeRecipientColor`.
- Schemas ya en canvas → muestran `ownerColor` (inmutable).
- `PluginIcon` recibe `activeRecipientColor` como prop explícita → icono colorea con ese valor.
- CSS variable `--active-recipient-color` en `.sisad-pdfme-designer-root`.

## Checklist

- [ ] Respeta aislamiento del fork.
- [ ] No duplica lógica.
- [ ] Mantiene configuración declarativa.
- [ ] Agrega o actualiza tests.
- [ ] Actualiza documentación si cambia contrato.
- [ ] Interacciones de canvas no violan la tabla de prioridad.
- [ ] `PluginIcon` pasa `activeRecipientColor` desde `LeftSidebar`.
