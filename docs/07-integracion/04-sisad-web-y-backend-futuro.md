# SISAD Web incompleto y contratos backend futuros

> Documentación generada para consumo externo de `sisad-pdfme`.

## SISAD Web
Los archivos de SISAD Web son referencia para casos de uso, pero no deben copiarse como fuente de verdad. Sirven para entender:
- integración con flujos existentes;
- ContentCustomForm;
- stepper externo;
- documentos de respaldo;
- firma y generación.

## Adaptador recomendado
```text
SISAD workflow metadata
→ MultiDocumentSession
→ Template + documents + recipients + assignments
→ Designer/Form/Viewer
→ callbacks: onSave, onGenerate, onSignatureRequest
```

## Endpoints futuros
| Endpoint | Uso |
| --- | --- |
| GET/PUT `/templates/:id` | Cargar/guardar plantilla. |
| GET `/documents/:id/pdf` | PDF base. |
| GET/PUT `/sessions/:id/assignments` | Ruteo. |
| GET/POST/PATCH `/sessions/:id/comments` | Comentarios. |
| WS/SSE `/sessions/:id/events` | Sync/presencia. |
| POST `/generator/pdf` | PDF final. |
| GET `/signatures/providers` | Proveedores por tenant. |
| POST `/signatures/transactions` | Crear transacción. |
