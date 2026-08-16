# Migración de templates legacy

Este documento describe una migración de pre-producción, no un runtime de
compatibilidad permanente. Los fixtures y snapshots del repositorio deben
migrarse al formato actual y el migrador debe eliminarse cuando no tenga otra
responsabilidad vigente.

Reglas:

- normalizar `schemaUid` si falta;
- completar `documentId/pageNumber` si se puede inferir;
- preservar valores existentes;
- no conservar una rama antigua sólo por backward compatibility.
