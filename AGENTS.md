# AGENTS.md — Contrato raíz para agentes

## Inicio obligatorio

Lee únicamente:

1. `.ai/START.md`;
2. `.ai/tasks/ACTIVE.md`;
3. una task-card;
4. el `AGENTS.md` más cercano a la ruta objetivo;
5. una ruta y una skill activada por la tarea.

No cargues todas las carpetas `.ai`, `.agents`, `docs` ni archivos consolidados.

## Principios

- Una task-card, un objetivo verificable y un escritor.
- Evidencia antes de afirmar; test antes de refactor sensible.
- El componente `src/sisad-pdfme` es reutilizable y no implementa negocio del host.
- No modificar Canvas, Moveable, Selecto, Snapshot, Generator o contratos públicos por conveniencia visual.
- No esconder duplicidad propia mediante exclusiones.
- No mantener un modelo costoso después de completar el diagnóstico.
- No continuar una búsqueda sin una nueva evidencia esperada.
- No declarar éxito sin diff, gate o reproducción verificable.

## Estados de conocimiento

Toda conclusión técnica se marca como:

- `CONFIRMADO`: sustentada por código, test, comando o fuente oficial;
- `INFERIDO`: deducción explícita a partir de evidencia;
- `HIPÓTESIS`: pendiente de validación;
- `DESCONOCIDO`: no hay evidencia suficiente.

## Parada inmediata

Detente y entrega un handoff cuando:

- se alcance el presupuesto;
- tres intentos de parche fallen por la misma causa;
- dos rondas de búsqueda no agreguen evidencia;
- el alcance cambie de dominio;
- exista conflicto de ownership;
- se requiera tocar una frontera protegida no declarada.
