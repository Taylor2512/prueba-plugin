# Config/runtime boundary

JSON contiene comportamiento/capabilities. Estado vivo (`template`, `inputs`, users,
documents, activeUserId, activeDocumentId, sessionScopeKey) vive en definition/state/resources.
Funciones y secretos viven en handlers/providers, nunca en JSON.

Compatibility inputs `recipients/activeRecipientId` pueden aceptarse en boundary durante la
migración, pero deben normalizarse una sola vez hacia User semantics.
