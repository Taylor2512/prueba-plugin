# Glosario

- **Schema**: campo/objeto declarativo del documento.
- **Runtime**: ejecución interactiva o de lectura de schemas sobre páginas PDF.
- **Surface**: Designer, Form o Viewer.
- **User**: identidad interna de SISAD-PDFME que interactúa con un documento.
- **Recipient**: entidad de negocio de un host (por ejemplo DigitalAgreements); puede adaptarse a User, no es sinónimo.
- **Active User**: actor actual de una instancia.
- **Assigned User**: actor autorizado/esperado para un schema.
- **Audit User**: actor que creó/modificó/bloqueó.
- **Manifest**: metadata/capabilities runtime derivada del registry, no un registry paralelo.
- **Codec**: semántica canónica read/normalize/write/serialize/equality por familia.
- **Transaction**: cambio local atómico con origin/revision/phase/transactionId.
- **Artifact**: archivo/binario efímero que requiere resolución host antes de snapshot estable.
- **Snapshot**: estado portable/versionado del documento/runtime con migrations explícitas.
- **Host**: aplicación consumidora; no forma parte del core reusable.
