# Política de memoria

## Memoria repo

`.ai/memory/` es la memoria durable del equipo y la fuente confiable para decisiones del proyecto.

## Memoria local Codex

Es complementaria, personal y generada. No dependas de editar manualmente `~/.codex/memories/` como control principal y nunca guardes secretos.

## Qué persistir

- decisiones difíciles de revertir;
- invariantes y contratos;
- estado actual resumido;
- riesgos activos;
- métricas de calidad;
- handoff de la última tarea.

## Qué no persistir

- logs completos;
- chain-of-thought;
- archivos temporales;
- hipótesis descartadas;
- credenciales o datos sensibles;
- duplicados del sprint board.

## Actualización

Solo delta. Si el contenido ya existe, reemplaza o enlaza; no lo copies.
