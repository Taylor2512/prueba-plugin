# Memory GC

Ejecutar cuando:

- INDEX >180 líneas o 22 KB;
- CURRENT contiene historial;
- HANDOFF describe más de una task;
- decisiones duplicadas;
- TTL vencido;
- source/commit obsoleto.

Acciones: merge, supersede, archive, delete ephemeral, repair links y actualizar
verifiedAt. Nunca borrar una decisión vigente sin registrar supersesión.
