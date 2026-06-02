# Playbook de implementación segura

1. Clasificar tarea por proceso.
2. Cargar contexto y reglas.
3. Usar `rg` para localizar código real.
4. Crear diagnóstico con evidencia.
5. Escribir test que reproduzca el fallo.
6. Implementar cambio mínimo.
7. Ejecutar build/lint/tests focalizados.
8. Actualizar matriz y memoria.
9. Documentar riesgos residuales.

## Prohibido

- CSS para corregir geometría.
- setTimeout para sincronización.
- manipular DOM externo.
- refactor masivo sin fases.
- marcar cubierto sin test real.
