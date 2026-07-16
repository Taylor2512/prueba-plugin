# Reglas — continuidad visual y Tailwind

1. Una tarjeta por ejecución; una región visual o un contrato funcional por tarjeta.
2. Máximo 8 archivos abiertos y 5 archivos de producto modificados por pasada.
3. Inventariar selectores, consumidores y estados antes de eliminar una regla.
4. No cambiar el DOM, orden de capas, `z-index`, `overflow`, `position` o medidas del canvas sin una tarjeta de canvas.
5. `tokens.css` es una capa semántica permitida; no convertir tokens en clases duplicadas.
6. Las clases procedentes de `constants.ts` deben ser cadenas completas y detectables por Tailwind; evitar concatenación parcial.
7. Los estilos calculados por datos (`left`, `top`, `width`, `height`, transformaciones y color de propietario) pueden permanecer en `style` si no admiten clase estática.
8. No retirar CSS hasta verificar estado normal, hover, focus-visible, disabled, activo, colapsado y responsive aplicables.
9. Prohibido usar `!important` nuevo salvo contrato documentado de tercero.
10. Registrar conteos antes/después de `@apply`, estilos inline y selectores eliminados.
11. Si aparece una regresión fuera del alcance, crear tarjeta nueva; no ampliar silenciosamente la activa.
12. Todo cambio termina con typecheck, lint focalizado, tests focalizados y evidencia visual en la ruta objetivo.
