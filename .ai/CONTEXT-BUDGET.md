# Presupuesto de contexto

## Carga base

- `AGENTS.md` + `START.md`: siempre.
- Una task-card: siempre.
- Una ruta, una regla y un playbook: máximo por defecto.
- Skills: solo las que disparen por descripción.

## Tamaño de tarea

| Clase | Archivos iniciales | Modificaciones esperadas | Agentes | Modelo base |
|---|---:|---:|---:|---|
| S | 3–5 | 1–4 | 1 | Luna low / Terra low |
| M | 6–10 | 3–10 | 1 | Terra medium |
| L | 10–20 | 8–20 | 2–3 | Sol medium/high + subagentes |
| XL | >20 | transversal | dividir epic | no ejecutar como una sola task |

## Límites operativos

- Máximo dos rondas de búsqueda antes de decidir o dividir.
- No cargar archivos consolidados completos si existen rutas y símbolos precisos.
- Subagentes devuelven resumen estructurado; no vuelcan logs al hilo principal.
- No usar Ultra para tareas S/M; los subagentes consumen más tokens.
- Mantener `AGENTS.md` corto; el conocimiento especializado pertenece a skills y rutas.
