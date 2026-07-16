# TASK-CANVAS-003 — Eliminar bloque negro de guías/reglas

## Objetivo

Diagnosticar y corregir la superficie negra o capa opaca observada junto a las reglas y guías sin modificar la geometría del documento.

## Alcance

- Identificar nodo, pseudo-elemento o capa responsable.
- Revisar background, overflow, stacking context, transform y dimensiones.
- Corregir el mínimo contrato visual.

## Fuera de alcance

Migración CSS general, color de propietario, drag/resize y rediseño de reglas.

## Archivos candidatos

Máximo 5: componente de reglas, componente de guías, stylesheet consumidor, fixture del lab y una prueba visual; confirmar rutas.

## Archivos prohibidos

Coordenadas de schemas, Moveable, Selecto, snapshot, generator y `pdf-lib`.

## Pasos

1. Reproducir a zoom y viewport de la captura.
2. Inspeccionar elemento y stacking contexts.
3. Diferenciar bug CSS de dato/medida inválida.
4. Aplicar corrección mínima y probar varios zooms/páginas.

## Validación

Capturas a 75/100/125 %, scroll multipágina y pruebas existentes de canvas.

## Criterio de parada

Detenerse si la causa reside en cálculo geométrico o librería de terceros; crear tarjeta especializada.

## Entrega final

Causa raíz, nodo afectado, corrección y matriz de zoom/scroll.

## Cierre (2026-07-15, Claude)

### Causa raíz

`src/sisad-pdfme/ui/components/Designer/Canvas/Guides.tsx` renderizaba las
reglas de `@scena/react-guides` con tema OSCURO obsoleto: default
`backgroundColor/cornerBackground = '#2d2d2d'`, `textColor` blanco y clases
`bg-slate-800 border-slate-700/90`. El resto del diseñador es light y el token
`--sisad-pdfme-guides-corner-bg` ya era `#f1f5f9`. Canvas pasa `palette` desde
`styleOverrides.guides` (undefined por defecto), así que caía al default oscuro
→ franja/bloque negro junto a reglas y esquina.

### Nodo afectado y corrección (mínima, sin geometría)

- Paleta por defecto a light: `backgroundColor '#f8fafc'`, `lineColor '#cbd5e1'`,
  `textColor 'rgba(15,23,42,0.55)'` (legible sobre claro), `cornerBackground '#f1f5f9'`.
- Clases JSX de corner y reglas de `bg-slate-800 border-slate-700/90` → light
  (`bg-slate-100`/`bg-slate-50`, `border-slate-200/80`); corner recibe además el
  `cornerBackground` inline para no depender del orden de carga del token.
- Sin tocar coordenadas, tamaños, `RULER_HEIGHT`, zoom ni Moveable/Selecto.

### Validación

- `npm run build` → dist generado sin errores; `eslint Guides.tsx` → 0.
- Probe de color computado: corner `rgb(241,245,249)` lum 244; reglas
  `rgb(248,250,252)` lum 250 (claras). Captura confirma números legibles
  (0-50 horizontal, ticks verticales) sin bloque negro.
- Regresión canvas en verde: `canvas-overflow-regression`,
  `canvas-interactions` (incl. guides/padding toggles), `drag-preview-and-canvas-scroll`.

### Matriz zoom/scroll

Verificado en viewport 1400×900 sobre `/lab/multi-document-routing` (multipágina,
14 esquinas de regla renderizadas). Los colores son estáticos por token → estables
a cualquier zoom/scroll (no dependen de medida ni de cálculo geométrico).
