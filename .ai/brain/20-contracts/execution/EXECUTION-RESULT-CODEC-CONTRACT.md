# Execution result codec contract

Snapshots durables son serializables de forma explícita.

No usar JSON stringify/parse como contrato universal de:
- Uint8Array;
- Blob/File;
- Date;
- Maps/Sets;
- signature binary payloads.

Los bytes PDF/artefactos viven en una capa transitoria o artifact store; el snapshot durable
guarda referencias, hashes y metadata estable.
