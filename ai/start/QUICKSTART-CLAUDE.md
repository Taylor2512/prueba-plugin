# Quickstart — Claude

## Worktree obligatorio

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-claude
branch: ai/claude
port: 5182
```

## Verificación

```bash
pwd
git branch --show-current
git status --short
```

Detente si no coincide.

## Perfil de trabajo

Claude ejecuta preferentemente:

- arquitectura visual;
- RightSidebar;
- DetailView;
- ListView;
- DocumentsRail;
- topbar y Guardar;
- contratos de scroll;
- composición Tailwind;
- resolución semántica de integración cuando actúa en una sesión separada.

## Regla principal

No conviertas una task-card de implementación en otra auditoría general.

## Implementador vs. integrador

Son sesiones distintas:

```txt
Implementador:
  prueba-plugin-claude / ai/claude

Integrador:
  prueba-plugin-merge / ai/integration
```

La sesión implementadora no usa `cherry-pick`, no edita integración y no absorbe cambios de otros agentes.

## Método

1. Leer `START.md`.
2. Cargar una sola task-card.
3. Respetar ownership.
4. Hacer commits pequeños.
5. Ejecutar pruebas focales.
6. Escribir handoff externo.
7. Detenerse.

No continúes polish visual si el gate funcional de la wave anterior está abierto.
