status: PARTIAL

# Evidence parcial — RTP-220 (regla de roles readonly)

Esto **no** cierra RTP-220. Documenta un hallazgo y una corrección acotada
encontrados al verificar el modelo de acceso por destinatario.

- Branch: `main` — HEAD al iniciar: `66dfd6a` — Fecha: 2026-08-13

## Corrección a una premisa previa

Se había recomendado "cablear `recipientPermissionResolver`" por no tener
consumidores. Verificado en el código: **la premisa era incorrecta en su
conclusión**.

El modelo de acceso del modo formulario sí existe y sí está cableado:
`ui/collaboration/schemaRuntimeAccess.ts` → consumido por
`ui/components/Preview.tsx`, que resuelve visible/editable/readonly por schema
según destinatario activo, ownership y locks.

`recipients/recipientPermissionResolver.ts` responde una pregunta distinta
—`canEditStructure` / `canAssign` / `canUnassign` / `canShare`—, que es permiso
estructural de Designer, no acceso de llenado. Sigue sin consumidores, pero
cablearlo al Form habría sido inventarle un consumidor. No se hizo.

## Hallazgo real — CONFIRMADO

La regla "viewer/reviewer/commenter no editan" estaba escrita tres veces:

| Ubicación | Estado |
|---|---|
| `ui/collaborationContext.ts` | canónica, cableada |
| `recipients/recipientPermissionResolver.ts` | copia, sin consumidores |
| `schemas/signature/propPanel.ts` | copia **divergente**: bloqueaba `viewer` y `reviewer`, dejaba pasar `commenter` |

Es decir, un `commenter` era readonly según la regla canónica pero podía operar
el widget de modo de firma del inspector.

## Cambio aplicado

- `src/sisad-pdfme/common/collaboration.ts` — fuente única:
  `READONLY_RECIPIENT_ROLES` e `isReadonlyRecipientRole`, reexportadas desde
  `common/index.ts`.
- Los tres puntos anteriores pasan a consumirla.

Efecto observable: `commenter` queda bloqueado también en el inspector de firma.
Es la regla canónica aplicada, pero es un cambio de comportamiento.

## Gates ejecutados

```
npx vitest run .../contracts/recipients .../contracts/schemas/schemaValueAdapter.test.ts
  Test Files  2 passed (2) | Tests  49 passed (49)
```

## Pendiente para RTP-220

- decidir el destino de `recipientPermissionResolver`: darle consumidor en los
  flujos de assignment del Designer, o retirarlo;
- unificar el modelo de acceso entre `schemaRuntimeAccess` y el resolver de
  permisos bajo un único contrato, que es lo que la card pide de verdad.


> Estado declarado en reconciliación (RTP-545): **PARTIAL** — el propio documento abre diciendo «Esto **no** cierra RTP-220».
