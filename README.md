# Paquete de task-cards — sisad-pdfme / DigitalAgreements

Este ZIP contiene una propuesta lista para copiar dentro de:

`/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/ai/task-cards`

## Cómo aplicar

Desde la raíz de `prueba-plugin`:

```bash
unzip task-cards-sisad-pdfme-plan.zip -d /tmp/task-cards-sisad-pdfme-plan
cp -R /tmp/task-cards-sisad-pdfme-plan/ai/task-cards/* ai/task-cards/
cp -R /tmp/task-cards-sisad-pdfme-plan/ai/memory/* ai/memory/
cp -R /tmp/task-cards-sisad-pdfme-plan/ai/reports/* ai/reports/
```

## Lectura del estado

- `completed/`: tareas que, según los logs compartidos, pueden cerrarse o casi cerrarse tras confirmar el último resultado de pruebas.
- `active/`: tareas que deben ejecutarse ahora para llegar al objetivo: reasignación funcional, paridad con laboratorio, preview FORM, persistencia y portabilidad a SISAD-WEB.
- `backlog/`: tareas posteriores para endurecer runtime, drag/drop, visual regression y limpieza.

## Nota

No se asume que el repo local quedó modificado desde este entorno. Este ZIP es un paquete de archivos Markdown para que lo copies o lo uses como base con Claude/Codex.
