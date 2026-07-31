# Grafo de conocimiento y trazabilidad

## Identificadores

```txt
UC- / VIS- / CMD- ...  caso de uso
BHV- comportamiento
EVT- evento
FX- efecto
MTH- método/símbolo
ADR- decisión
TSK- task-card
TST- test/evidencia
RISK- riesgo
```

## Aristas

```txt
UC requires BHV
BHV implemented-by MTH
BHV emits EVT
EVT triggers FX
MTH covered-by TST
TSK changes MTH
TSK validates UC
ADR constrains MTH/TSK
RISK threatens UC/TSK
```

Toda arista automática se marca `candidate`; solo una prueba, review o decisión
puede promoverla a `verified`.
