# Current priorities

> Generated from task-card frontmatter. Historical Runtime Platform 000..420 is provenance, not the active queue.

## Runtime Platform active window

- range: RTP-425..RTP-545
- PASS: 24/25
- unresolved: none

## Portable Runtime

- [PRT-000](../task-cards/portable-runtime/PRT-000.md) — **READY** — P0
- [PRT-010](../task-cards/portable-runtime/PRT-010.md) — **BLOCKED** — P0 — open: PRT-000
- [PRT-020](../task-cards/portable-runtime/PRT-020.md) — **BLOCKED** — P0 — open: PRT-000
- [PRT-030](../task-cards/portable-runtime/PRT-030.md) — **BLOCKED** — P0 — open: PRT-000
- [PRT-040](../task-cards/portable-runtime/PRT-040.md) — **BLOCKED** — P0 — open: PRT-000
- [PRT-050](../task-cards/portable-runtime/PRT-050.md) — **BLOCKED** — P0 — open: PRT-000
- [PRT-060](../task-cards/portable-runtime/PRT-060.md) — **BLOCKED** — P0 — open: PRT-010, PRT-020, PRT-040, PRT-050
- [PRT-070](../task-cards/portable-runtime/PRT-070.md) — **BLOCKED** — P0 — open: PRT-030, PRT-040, PRT-060
- [PRT-080](../task-cards/portable-runtime/PRT-080.md) — **BLOCKED** — P0 — open: PRT-040, PRT-060
- [PRT-090](../task-cards/portable-runtime/PRT-090.md) — **BLOCKED** — P0 — open: PRT-060, PRT-070
- [PRT-100](../task-cards/portable-runtime/PRT-100.md) — **BLOCKED** — P0 — open: PRT-080, PRT-090
- [PRT-110](../task-cards/portable-runtime/PRT-110.md) — **BLOCKED** — P1 — open: PRT-070, PRT-080, PRT-100
- [PRT-120](../task-cards/portable-runtime/PRT-120.md) — **BLOCKED** — P0 — open: PRT-070, PRT-080, PRT-090, PRT-100, PRT-110

## Execution order

1. **PRT-000** — READY — P0
2. **PRT-010** — BLOCKED — P0 — blocked by PRT-000
3. **PRT-020** — BLOCKED — P0 — blocked by PRT-000
4. **PRT-030** — BLOCKED — P0 — blocked by PRT-000
5. **PRT-040** — BLOCKED — P0 — blocked by PRT-000
6. **PRT-050** — BLOCKED — P0 — blocked by PRT-000
7. **PRT-060** — BLOCKED — P0 — blocked by PRT-010, PRT-020, PRT-040, PRT-050
8. **PRT-070** — BLOCKED — P0 — blocked by PRT-030, PRT-040, PRT-060
9. **PRT-080** — BLOCKED — P0 — blocked by PRT-040, PRT-060
10. **PRT-090** — BLOCKED — P0 — blocked by PRT-060, PRT-070
11. **PRT-100** — BLOCKED — P0 — blocked by PRT-080, PRT-090
12. **PRT-120** — BLOCKED — P0 — blocked by PRT-070, PRT-080, PRT-090, PRT-100, PRT-110
13. **RTP-545** — READY — P0
14. **PRT-110** — BLOCKED — P1 — blocked by PRT-070, PRT-080, PRT-100

## Rule

Do not reopen superseded Runtime Platform 000..420 cards merely because they remain in historical storage.

## TRC execution pack

- [TRC campaign](./TEMPLATE-RUNTIME-CONTRACT.md)
- [TRC ready plan (2 weeks)](./TRC-READY-2W.md)
- [TRC day-by-day plan](./TRC-DAY-BY-DAY-2W.md)
- [TRC agent routing](./TRC-AGENT-ROUTING.md)
- [TRC closeout checklist](./TRC-CLOSEOUT-CHECKLIST.md)
