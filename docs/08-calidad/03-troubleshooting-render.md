# Troubleshooting de render, scroll y canvas en blanco

> Documentación generada para consumo externo de `sisad-pdfme`.

## Síntomas
- Visor crece por intervalos.
- Scroll cambia tamaño del paper.
- Designer no muestra schemas.
- Canvas queda en blanco.
- Warning: Attempted to synchronously unmount a root.

## Causas probables
1. ResizeObserver provoca render loop.
2. Paper usa transform scale pero reserva tamaño incorrecto.
3. Preview recalcula scale desde contenedor inestable.
4. Props se recrean en cada render del host.
5. Multi-documento cambia basePdf sin restaurar schemas.
6. CSS del laboratorio usa layout que cambia medidas.

## Fixes
- Evitar render si size no cambió realmente.
- Reservar tamaño visual escalado en Paper.
- Congelar zoom salvo acción explícita.
- Memoizar template/options/plugins.
- Cleanup con `queueMicrotask`.
- Separar scroll container de paper root.

## Test
```ts
const before = await paper.boundingBox();
await page.mouse.wheel(0, 700);
await page.waitForTimeout(500);
const after = await paper.boundingBox();
expect(Math.abs(after.width - before.width)).toBeLessThan(1);
expect(Math.abs(after.height - before.height)).toBeLessThan(1);
```
