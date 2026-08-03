# Modelo de conocimiento

IDs:

```txt
UC caso de uso
BHV comportamiento
SCH contrato de schema
ACT acción
EVT evento
FX efecto
MTH método/símbolo
TST prueba
TSK tarea
ADR decisión
RISK riesgo
```

Aristas:

```txt
UC requires BHV
BHV implemented-by MTH
BHV emits EVT
EVT triggers FX
MTH covered-by TST
TSK changes MTH
TSK validates UC
ADR constrains TSK/MTH
```

Las relaciones automáticas son `candidate`; review o test las promueve a
`verified`.
