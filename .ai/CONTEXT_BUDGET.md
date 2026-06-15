# CONTEXT_BUDGET — Presupuesto de tokens y análisis

## Presupuesto fijo por tarea

```txt
1 task-card
1 contexto
1 regla principal
1 playbook
2 comandos rg máximo
8 archivos abiertos máximo
5 archivos modificados máximo
1 proceso por pasada
```

## Criterio de parada

Detenerse si:

```txt
[ ] La solución requiere más de 5 archivos modificados.
[ ] Hay que abrir más de 8 archivos.
[ ] La causa raíz pertenece a otro proceso.
[ ] Hay que tocar host/negocio.
[ ] Hay que tocar Form/Viewer/Generator como implementación.
[ ] Hay que modificar SnapshotAdapter globalmente.
[ ] Hay que ejecutar suite completa.
[ ] Hay que crear una arquitectura nueva.
```

## Qué hacer al detenerse

Entregar:

```md
# Diagnóstico parcial
## Bloqueo
## Por qué excede presupuesto
## Nueva task-card propuesta
## Archivos sugeridos
```

## Prohibido

- "Voy a revisar todo el proyecto".
- "Voy a cargar todos los Markdown".
- "Voy a hacer una auditoría completa" dentro de una task-card.
- Repetir análisis DocuSign si ya existe contexto.
