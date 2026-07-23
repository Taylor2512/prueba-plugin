# Router de modelos y esfuerzo

## Objetivo

Minimizar costo y latencia sin degradar la seguridad del cambio. Los nombres son preferencias; verifica disponibilidad local y usa el fallback funcional.

| Trabajo | Preferido | Esfuerzo | Fallback |
|---|---|---|---|
| inventario, clasificación, reportes, memoria | GPT-5.6 Luna | low | Terra low |
| exploración y refactor claro | GPT-5.6 Terra | low/medium | Sol medium |
| implementación diaria y pruebas | GPT-5.6 Terra | medium | Sol medium |
| arquitectura o bug ambiguo | GPT-5.6 Sol | medium/high | Terra high |
| canvas/snapshot/contrato público complejo | GPT-5.6 Sol | high/xhigh | Sol medium + revisión |
| investigación documental primaria | Terra | medium | Luna low para extracción |
| revisión final de alto riesgo | Sol | high | Terra high |

## Escalamiento

Escala un nivel cuando haya dos o más señales:

- hipótesis contradictorias;
- tres dominios o más;
- falta de pruebas de caracterización;
- migración de snapshot/datos;
- comportamiento visual difícil de reproducir;
- cambio público o de seguridad.

Desescala después del diagnóstico. No uses razonamiento alto para aplicar renombres, actualizar task-cards o ejecutar scripts conocidos.

## Multiagente

Usa subagentes solo si el trabajo es independiente y el resumen ahorra contexto al hilo principal. Evita paralelizar escritura sobre el mismo dominio. `Ultra` o `max` no son configuración habitual; requieren una nota de costo/beneficio en la task-card.
