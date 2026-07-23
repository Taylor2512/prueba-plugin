# Alcance SISAD PDFME

## Incluido

- Designer, Canvas, sidebars, inspector, comandos y overlays.
- Schemas, familias, plugins, Form, Viewer y Generator.
- Multipágina, multidocumento, recipients, assignments y colaboración.
- Snapshot, migración, adapters, configuración y API pública.
- Laboratorio que valida el componente reusable.
- Calidad: duplicidad, dead code, wrappers, tipos, rendimiento y pruebas.

## Excluido salvo task-card explícita

- Reglas de negocio específicas del host SISAD Web.
- APIs reales de Uanataca, workflows o credenciales.
- Fork `src/sisad-pdfme/pdf-lib/**` como objetivo de deduplicación propia.
- Backups, reportes generados y artefactos históricos.

## Invariantes

- `schemaUid` es identidad técnica estable.
- Documento y página sobreviven a move, resize, copy/paste y snapshot.
- Ownership y color persistido no cambian al cambiar el usuario activo.
- Opciones internas no son schemas independientes.
- Form/Viewer/Generator consumen el mismo contrato serializable.
