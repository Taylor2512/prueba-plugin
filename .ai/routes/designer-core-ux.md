# Ruta — Designer Core UX

## Cuándo usar

- comportamiento perdido;
- evento/callback desconectado;
- acción visible sin handler;
- sidebars/toolbar/inspector;
- access, selection o lifecycle;
- schema family behavior;
- snapshot/runtime parity.

## Contexto mínimo

1. `.ai/START.md`
2. task-card COREUX activa
3. plan maestro COREUX
4. ADR de eventos/efectos o superficies
5. skill específico del dominio
6. máximo un reporte focal

## No cargar

- todos los 150 UC;
- todos los task-cards;
- reportes históricos completos;
- paquetes de examples declarativos salvo dependencia explícita.

## Clasificación obligatoria

```txt
CONFIRMADO
INFERIDO
HIPÓTESIS
DESCONOCIDO
```

## Frontera

Solo `src/sisad-pdfme/**` recibe cambios productivos.
