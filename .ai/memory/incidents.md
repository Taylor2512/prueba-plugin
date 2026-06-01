# Incidentes conocidos

## I-001 — Color de catálogo no actualiza

Síntoma: iconos quedan con color de destinatario anterior.

Hipótesis: `activeRecipientColor` no llega a `PluginIcon` o no se refleja como data attr/CSS variable.

## I-002 — ownerColor muta al cambiar destinatario

Síntoma: schemas existentes cambian de color al cambiar usuario activo.

Hipótesis: se resuelve color desde active recipient en vez de schema owner.

## I-003 — Transform colisiona con Selecto o inline edit

Síntoma: resize/rotate dispara selección múltiple, menú o edición.

Hipótesis: falta state machine/guards de interacción.

## I-004 — Snapshot pierde rotation/ownerColor

Síntoma: import/export no restaura el canvas.

Hipótesis: metadata no está normalizada o no se serializa.
