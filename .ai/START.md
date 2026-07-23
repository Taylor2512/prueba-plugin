# START — entrada única

Carga inicial obligatoria:

1. `AGENTS.md`.
2. Esta página.
3. `.ai/scrum/SPRINT-CURRENT.md`.
4. Una task-card.
5. El `AGENTS.md` local de la ruta objetivo.

Después selecciona solo una ruta en `.ai/routes/` y, cuando corresponda, una skill en `.agents/skills/`.

## Flujo compacto

```text
orientar → clasificar → caracterizar → diseñar → implementar → validar → medir → cerrar
```

## Reglas de parada

Detente cuando:

- la Definition of Done esté completa;
- el cambio requiera archivos fuera del alcance;
- falte evidencia para conservar comportamiento;
- aparezca un conflicto con trabajo ajeno;
- sea necesario modificar vendor o una frontera protegida no declarada.

En esos casos, actualiza la task-card como `blocked` y crea una propuesta separada; no expandas silenciosamente el alcance.
