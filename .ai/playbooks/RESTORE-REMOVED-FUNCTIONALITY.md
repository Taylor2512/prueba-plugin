# Playbook — Restaurar funcionalidades eliminadas

## Entrada

- Task-card `RESTORE-*` en estado Ready.
- Claim registrado en `.ai/scrum/CLAIMS.md`.
- Worktree propio.
- Commit base registrado.
- Evidencia del comportamiento eliminado o inaccesible.

## Flujo

1. Clasificar la capacidad.
2. Localizar implementación eliminada y equivalente actual.
3. Confirmar si está:
   - eliminada;
   - duplicada;
   - inaccesible;
   - declarada pero no implementada;
   - implementada pero no exportada.
4. Escribir test de contrato o caracterización.
5. Implementar en el módulo propietario.
6. Exponer mediante barrel/API pública.
7. Crear o actualizar ejemplo consumidor.
8. Ejecutar gates focales.
9. Actualizar task-card, handoff y memory delta.
10. Liberar claim.

## Presupuesto

- Máximo 8 archivos iniciales.
- Máximo 5 archivos modificados.
- Máximo 2 búsquedas amplias.
- Máximo 3 parches sobre la misma causa.
- Un writer.
- Hasta dos readers read-only.
- Un dominio por task-card.

## No restaurar

- Rutas específicas del antiguo laboratorio.
- CSS host contra internals.
- Configuración duplicada.
- Endpoints o credenciales.
- Uanataca/OneShot dentro del core.
- Un archivo eliminado completo sin clasificación por símbolo.

## Evidencia de cierre

```txt
métodos antes/después
exports antes/después
test rojo/verde
gates ejecutados
gates no ejecutados
casos UC cubiertos
riesgos residuales
rollback
```
