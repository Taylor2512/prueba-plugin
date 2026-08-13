# Merge seguro

No sobrescribir automáticamente estado operativo vivo:

```text
.ai/brain/70-memory/CURRENT.md
.ai/brain/70-memory/HANDOFF.md
.ai/brain/80-work/ACTIVE.md
.ai/scrum/PRODUCT-BACKLOG.md
.ai/scrum/RUNTIME-PLATFORM-LEDGER.md
.ai/scrum/task-cards/**
reports/**/evidence/**
```

Los archivos de arquitectura/entrypoints sí pueden reemplazarse tras backup y
diff explícito.

Flujo:

```text
dry-run installer
→ backup
→ overlay de arquitectura/tooling
→ docs:paths:apply
→ docs:index
→ docs:validate
→ review git diff
```
