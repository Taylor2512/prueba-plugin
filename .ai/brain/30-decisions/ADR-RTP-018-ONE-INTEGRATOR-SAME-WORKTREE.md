# ADR RTP-018 — One integrator in a shared working tree

Decision:
only one agent holds Git integration privileges at a time.

Multiple writers may edit disjoint files, but commit/push operations are serialized.

This prevents one agent from staging or committing another agent's partial work accidentally.
