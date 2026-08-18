# Template Runtime Contract (TRC)

Campaign to harden the portable contract end-to-end without creating parallel authorities.

## Rules

- Reconcile before implement: each TRC card must check whether an existing QH/PRT/RTP card already covers the same contract.
- Extend existing authority when overlap is exact; do not fork governance.
- Keep one config compiler, one schema registry projection, one snapshot format, one runtime access authority.
- Status changes must be evidence-driven only.

## Critical path

1. TRC-001
2. TRC-002
3. TRC-003
4. TRC-006, TRC-007, TRC-008
5. TRC-004, TRC-005
6. TRC-014, TRC-015, TRC-016, TRC-045
7. TRC-017, TRC-018, TRC-019
8. TRC-020, TRC-021, TRC-026, TRC-027
9. TRC-009, TRC-010, TRC-011, TRC-036, TRC-037, TRC-038
10. TRC-032
11. TRC-043, TRC-044
12. TRC-046, TRC-047, TRC-048, TRC-049
13. TRC-039, TRC-040, TRC-041, TRC-042
14. TRC-050

## Queue

| Task | Priority | Initial status | Notes |
|---|---|---|---|
| TRC-001 | P0 | READY | Reconcile QH state and evidence before new implementation. |
| TRC-002 | P0 | READY | Define canonical SisadPdfmeWorkspace contract. |
| TRC-003 | P0 | READY | Canonical portable Template JSON contract. |
| TRC-004 | P0 | BACKLOG | Separate schema technical identity from visible name. |
| TRC-005 | P0 | BACKLOG | Registry-driven schema serialization policy. |
| TRC-006 | P0 | READY | Canonical Users registry contract. |
| TRC-007 | P0 | READY | normalizeUsers/indexUsers/validateUsers authority. |
| TRC-008 | P0 | READY | Canonical Assignment registry contract. |
| TRC-009 | P0 | BACKLOG | readOnly propagation to Form/Viewer/Snapshot. |
| TRC-010 | P0 | BACKLOG | positionLocked persistence matrix. |
| TRC-011 | P0 | BACKLOG | Explicit collaboration lock runtime model. |
| TRC-012 | P0 | BACKLOG | Canonical Document registry contract. |
| TRC-013 | P1 | BACKLOG | Flattening portable schemas authority from Schema[][]. |
| TRC-014 | P0 | BACKLOG | InputConfig vs ResolvedConfig contract. |
| TRC-015 | P0 | BACKLOG | Complete SisadPdfmeGlobalConfig namespaces. |
| TRC-016 | P0 | BACKLOG | Config precedence explicit contract. |
| TRC-017 | P0 | BACKLOG | Template JSON preflight validator with structured issues. |
| TRC-018 | P0 | BACKLOG | Fail-closed import and versioned migration pipeline. |
| TRC-019 | P1 | BACKLOG | Deterministic canonical export. |
| TRC-020 | P0 | BACKLOG | Formal separation Template vs Snapshot vs Runtime. |
| TRC-021 | P0 | BACKLOG | Exhaustive snapshot semantic round-trip. |
| TRC-022 | P0 | BACKLOG | Complete group schema identity contract. |
| TRC-023 | P1 | BACKLOG | Schema alias import normalization policy. |
| TRC-024 | P1 | BACKLOG | Registry-owned schema defaults only. |
| TRC-025 | P0 | BACKLOG | Schema codec registry semantics. |
| TRC-026 | P0 | BACKLOG | User x Document x Schema isolation scope. |
| TRC-027 | P0 | BACKLOG | activeUserId/activeDocumentId validation states. |
| TRC-028 | P1 | BACKLOG | Portable package layout. |
| TRC-029 | P1 | BACKLOG | External plugin config policy in portable JSON. |
| TRC-030 | P1 | BACKLOG | Designer import/export preflight UI. |
| TRC-031 | P1 | BACKLOG | Portable comments registry identity. |
| TRC-032 | P0 | BACKLOG | Signature linked to signerUserId registry. |
| TRC-033 | P1 | BACKLOG | Single shortcut registry authority. |
| TRC-034 | P1 | BACKLOG | More menu from capabilities only. |
| TRC-035 | P1 | BACKLOG | Full lock accessibility matrix. |
| TRC-036 | P1 | BACKLOG | Mixed selection lock semantics. |
| TRC-037 | P0 | BACKLOG | Undo/redo semantic boundaries for lock commands. |
| TRC-038 | P0 | BACKLOG | Reload/import lock state persistence. |
| TRC-039 | P0 | BACKLOG | PDF monochrome/raster final gate. |
| TRC-040 | P1 | BACKLOG | Real shortcuts overlay E2E. |
| TRC-041 | P1 | BACKLOG | Axe + keyboard + responsive gate. |
| TRC-042 | P1 | BACKLOG | Stable visual regression matrix. |
| TRC-043 | P0 | BACKLOG | Single canonical full reference JSON fixture. |
| TRC-044 | P0 | BACKLOG | Template JSON contract test matrix. |
| TRC-045 | P0 | BACKLOG | Config contract test matrix. |
| TRC-046 | P1 | BACKLOG | Public API for template/workspace state. |
| TRC-047 | P1 | BACKLOG | Structured workspace change events. |
| TRC-048 | P1 | BACKLOG | Dirty semantics for durable template changes. |
| TRC-049 | P1 | BACKLOG | Semantic template diff projection. |
| TRC-050 | P0 | BACKLOG | Final portable contract closeout gate. |

## Reconciliation guard (mandatory)

Before opening any TRC card, compare against these cards and update overlap notes:

- QH-012, QH-013, QH-014, QH-015, QH-017, QH-019, QH-020, QH-021
- Related PRT/RTP cards touching config, registry, snapshot, runtime-access, import/export

If overlap is exact, append scope to the existing card and link this TRC ID as trace, instead of creating a new parallel implementation card.
