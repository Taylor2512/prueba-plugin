# Migración desde estructura anterior

## Estructuras antiguas detectadas

```txt
.ai/**
docs/**
reports/tailwind-migration/**
README.md
AGENTS.md/CLAUDE.md si existen
```

## Estrategia

1. No borrar nada inicialmente.
2. Copiar contenido útil a `ai/`.
3. Reemplazar adaptadores raíz por archivos delgados.
4. Marcar docs antiguos como históricos.
5. Eliminar duplicidad solo después de validar.

## Mapeo

| Antiguo | Nuevo |
|---|---|
| `.ai/context/*` | `ai/context/*` |
| `.ai/rules/*` | `ai/rules/*` |
| `.ai/playbooks/*` | `ai/playbooks/*` |
| `.ai/task-cards/*` | `ai/task-cards/backlog/*` |
| `docs/*` | `ai/project` o documentación externa estable |
| `reports/*` | conservar como evidencia, no cargar por defecto |
