# Migración de templates legacy

Debe existir compatibilidad de lectura para snapshots antiguos.

Reglas:

- normalizar `schemaUid` si falta;
- completar `documentId/pageNumber` si se puede inferir;
- preservar valores existentes;
- no mutar destructivamente sin versión.
