# AGENTS.md — SISAD PDFME V7

Este archivo es un mapa, no un manual.

## Arranque obligatorio

Lee, en este orden:

1. `.ai/START.md`
2. `.ai/scrum/SPRINT-CURRENT.md`
3. una sola task-card
4. el `AGENTS.md` más cercano a la ruta objetivo
5. una ruta
6. una skill

No cargues carpetas completas de `.ai`, `.agents`, `docs`, `reports` ni archivos
consolidados.

## Contrato de trabajo

```txt
una task-card
un writer
un objetivo verificable
un paquete de evidencia
un diff revisable
```

## Estados de conocimiento

`CONFIRMADO · INFERIDO · HIPÓTESIS · DESCONOCIDO`

## Frontera del producto

`src/sisad-pdfme` es reusable. El host entrega configuración, datos, adapters y
callbacks. El core no contiene negocio de DigitalAgreements, Uanataca,
externalForms ni rutas de ejemplos.

## Parada

Detente ante presupuesto agotado, ownership conflictivo, tres parches fallidos,
dos búsquedas sin evidencia nueva, cambio de dominio o frontera protegida no
declarada.
