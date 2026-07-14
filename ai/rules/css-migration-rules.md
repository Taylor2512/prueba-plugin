# Reglas CSS/Tailwind

## Fuente única de Tailwind

```txt
src/styles/tailwind.css -> importado por src/main.jsx
```

`src/style.css` permanece neutralizado para evitar doble emisión.

## Mantener como CSS

- `src/sisad-pdfme/ui/styles/tokens.css`
- Variables CSS runtime.
- Moveable/Selecto.
- Geometría PDF/canvas/paper.
- Zoom y transforms críticos.
- Print/PDF.
- Pseudo-elementos complejos.
- Reglas dependientes de mediciones o bounding boxes.

## Migrar a Tailwind inline

- Componentes React con estilos visuales simples.
- Cards, buttons, labels, sidebars, inspector, chips, pills.
- Spacing y tipografía no geométrica.
- Borders y shadows no críticas.

## Proceso

1. Elegir 1 componente.
2. Migrar clases seguras.
3. Eliminar regla CSS solo si queda sin uso.
4. Actualizar ledger.
5. Comparar baseline visual.
