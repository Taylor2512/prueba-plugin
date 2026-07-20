# START — Entrada obligatoria

## 1. Identificar la solicitud

Resume la petición en una frase verificable.

```md
Objetivo:
Síntoma:
Comportamiento esperado:
```

## 2. Ejecutar intake

Lee:

```txt
router/TASK-INTAKE.md
router/PRIORITY-MATRIX.md
```

## 3. Seleccionar agente lógico

Usa:

```txt
router/ROUTER.md
agents/registry.md
```

## 4. Cargar contexto mínimo

Lee:

```txt
memory/current-state.md
memory/decisions.md
memory/known-risks.md
tasks/active/<TASK>.md
context/<DOMINIO>.md
rules/<DOMINIO>.md
playbooks/<PROCEDIMIENTO>.md
```

## 5. Declarar decisión de routing

```md
## Router decision
- Tarea:
- Prioridad:
- Agente lógico:
- Revisor:
- Contexto:
- Rules:
- Playbook:
- Owned paths:
- Forbidden paths:
- Criterio de cierre:
```

## 6. Implementar

- Reproducir.
- Identificar causa raíz.
- Modificar lo mínimo.
- Preservar contratos.
- Registrar dependencias.
- No iniciar otra tarea.

## 7. Revisar

Aplicar:

```txt
reviewers/scope-reviewer.md
reviewer del dominio
checklist correspondiente
```

## 8. Entregar

Crear handoff con:

- causa raíz;
- archivos;
- cambios;
- contratos;
- evidencia;
- riesgos;
- pendientes.

## 9. Actualizar memoria

Solo cuando cambie el estado real:

```txt
memory/current-state.md
memory/pending.md
memory/completed.md
memory/changelog.md
```

## 10. Detenerse

La ejecución termina al completar la task-card o encontrar una dependencia fuera de alcance.
