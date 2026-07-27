# Presupuesto de contexto y tokens

## Perfil por defecto

| Fase | Objetivo | Límite recomendado |
|---|---|---:|
| orientación | localizar contrato y task-card | 8k tokens / 5 archivos |
| diagnóstico | confirmar causa | 24k / 8 archivos |
| diseño | decidir cambio mínimo | 12k / 4 referencias |
| implementación | editar y revisar | 32k / 5 archivos |
| validación | tests y diff | 16k / salidas resumidas |
| cierre | handoff y memoria | 8k |

Objetivo de contexto activo: ≤48k. Techo operativo: 80k salvo tarea L explícita.

## Marcas de agua

- 60%: compactar resultados y crear `CONTEXT-CHECKPOINT`;
- 75%: detener exploración, cerrar hipótesis y guardar evidencia;
- 85%: no iniciar nuevos cambios; crear handoff o sesión nueva.

## Outputs

- logs >100 líneas se guardan como evidencia y se resumen;
- no pegar archivos completos cuando bastan símbolos/rangos;
- no cargar documentos consolidados;
- procesar reportes con scripts antes de enviarlos al modelo;
- no repetir código sin cambios en el hilo.
