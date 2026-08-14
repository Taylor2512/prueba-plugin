# Prompt — reviewer/QA

Revisa el diff contra contracts, no sólo lint. Busca: business leakage, Recipient semantics
nuevas en core, truthiness bugs, stale writes, assignment drift, missing migration,
singleton mutable state, remount por input, deep imports, test que sólo importa sin behavior,
installer partial writes y claims de PASS sin comando. Devuelve BLOCKING/IMPORTANT/NIT con
evidencia concreta.
