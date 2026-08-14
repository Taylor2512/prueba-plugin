# Plan — final SISAD-PDFME consolidation

## Phase 0 — reconcile, do not restart

- inspect live queue/evidence;
- preserve completed RTP work;
- preserve partial Claude changes;
- detect active claims;
- establish integrator.

## Phase 1 — close functional P0

1. RTP-510:
   - trace `resources.config -> OptionsContext -> Preview -> accessCtx`;
   - converge access authority;
   - prove single assignment;
   - multi-document;
   - two Forms;
   - BrowserContexts;
   - signature/initials;
   - completion observability.

2. RTP-515:
   - registry-driven all-schema;
   - pairwise;
   - remote options;
   - large list;
   - DataSource race/cache.

## Phase 2 — finish visual/inspector backlog

Reconcile and execute VISUX-023..042.

Priority:
- DetailView identity/taxonomy;
- family capability profiles;
- signing inspector;
- action/media;
- i18n/debug leakage;
- property->runtime->PDF->snapshot;
- assignment/readonly;
- multi-document;
- responsive/performance;
- visual release.

## Phase 3 — portability/integrations

- remote data UI and bindings;
- host HTTP injection;
- no Axios leakage;
- signature provider runtime;
- FontRegistry;
- deterministic snapshot/PDF.

## Phase 4 — legacy/dedup

- RTP-525 semantic User migration completion;
- RTP-530 safe dead/legacy retirement;
- RTP-535 dedup + single access authority + plugin metadata;
- remove obsolete adapters only after compatibility evidence.

## Phase 5 — hardening

- RTP-540;
- grid browser matrix;
- performance/memory;
- keyboard/touch/IME/a11y;
- privacy/security;
- cross-origin Authorization;
- BrowserContexts.

## Phase 6 — release

RTP-545 + VISUX-042:
- project-owned TypeScript zero;
- full tests;
- build;
- lint;
- docs;
- Brain/current/handoff;
- no active claims;
- final production evidence.
