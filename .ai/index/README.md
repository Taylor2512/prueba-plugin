# Índices V8

Los catálogos completos son JSONL y se consultan por script.

| Catálogo | Registros |
|---|---:|
| casos de uso | 334 |
| comportamientos | 334 |
| schemas | 28 |
| eventos | 50 |
| efectos | 26 |
| acciones | 5 |
| métodos/símbolos | 2403 |
| relaciones candidate | 1482 |

Ejemplo:

```bash
node .ai/scripts/query-catalog.mjs schemas --text checkboxGroup
node .ai/scripts/query-catalog.mjs use-cases --domain recipients
node .ai/scripts/query-catalog.mjs methods --text ownerColor --limit 20
```
