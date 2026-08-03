# SISAD PDFME — Arquitectura IA V8 Lean

Destino:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
```

## Contenido

- baseline actual: 320 archivos IA detectados;
- 334 casos de uso consolidados;
- 334 comportamientos;
- 28 contratos de familias/tipos;
- 50 eventos;
- 26 efectos;
- 2403 métodos/símbolos del código más reciente;
- 1482 relaciones candidate;
- 12 routes, 18 skills canónicas y 10 roles;
- 18 tareas de migración;
- scripts para query, context packs, memory, provider drift y task lifecycle.

## Principio

```txt
hot path pequeño
→ context pack por tarea
→ knowledge JSONL consultable
→ patch/test
→ trace delta
→ memory delta
```

No modifica código productivo y no sobrescribe estado Scrum/memory.
