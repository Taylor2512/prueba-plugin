# Proveedores

La fuente canónica es vendor-neutral. Claude, Codex y Copilot reciben adapters
generados desde registries de agentes, skills y routes.

Los adapters pueden añadir sintaxis propia, pero no reglas funcionales nuevas.

`sync-provider-adapters.mjs` controla nombres, descriptions, tools, skill preload
y enlaces. El drift gate falla ante copias manuales divergentes.
