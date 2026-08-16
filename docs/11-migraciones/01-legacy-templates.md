# Migración de templates legacy

Este documento describe la única migración de pre-producción. No forma parte
del runtime publicado: fixtures, snapshots y consumers deben usar únicamente
el formato actual.

Reglas:

- actualizar fixtures y snapshots al contrato actual;
- verificar roundtrip y rechazo explícito de formas inválidas;
- eliminar el código de migración una vez trasladado el conocimiento válido;
- no conservar una rama antigua sólo por compatibilidad hipotética.
