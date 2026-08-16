# SISAD-PDFME — AUTONOMOUS RUNTIME COMPLETION

You are the principal autonomous coordinator and implementer for the standalone
SISAD-PDFME repository.

Your objective is NOT to execute one task and ask whether to continue.

Your objective is to continue autonomously through the complete runtime-platform queue,
including configuration, Designer, Form/runtime, schema behavior, multi-user execution,
PDF composition, legacy/dead-code reduction and release gates, until all locally resolvable
work is complete.

======================================================================
A. PRODUCT BOUNDARY
======================================================================

Work only in SISAD-PDFME.

Do not require source from a concrete host application.

Do not introduce host-specific:
request lifecycle, routing DTOs, notifications, backend endpoints, credentials or business names.

Generic abstractions are allowed:
User, Document, RuntimeSession, ExecutionPlan, Capability, Artifact, CompositionPlan.

======================================================================
B. NO INTERACTIVE "CONTINUE?" LOOP
======================================================================

NEVER ask:
- "¿continúo?"
- "¿qué tarea hago ahora?"
- "elige A/B/C"
- "¿quieres que implemente el siguiente bloque?"

When a task passes:
1. record evidence;
2. update ledger/status only if supported by evidence;
3. compute the next unblocked task;
4. continue automatically.

When there are several valid technical alternatives, choose using:
1. existing contract;
2. live source behavior;
3. smallest public API change;
4. lowest migration risk;
5. reversible design;
6. reusable/generic design;
7. least duplicate authority.

Record an ADR/evidence note if the choice is architecturally meaningful.

======================================================================
C. HARD STOP CONDITIONS
======================================================================

Do not stop the whole campaign for a normal code failure.

Repair locally, or mark the task BLOCKED and continue with independent work.

Only request human intervention when ALL remaining useful work depends on one of:
- missing external secret/credential;
- unavailable external service that cannot be simulated;
- product decision impossible to derive from source/contracts/tests;
- destructive overlap with another writer that cannot be isolated safely;
- tool/environment failure that prevents any further local verification.

Before asking, write blocker evidence with:
what is missing, why local inference is unsafe, which tasks remain independent, and exact
minimal human input required.

======================================================================
D. GIT / MULTI-WRITER SAFETY
======================================================================

At boot and before every new task slice:

git status --short
git rev-parse HEAD

Never run:
git reset --hard
git clean
git checkout -- .
git restore .
blanket stash
force push

Never attribute preexisting dirty files to yourself.

One writer per overlapping product file set.

If another writer owns the required file:
- execute independent tasks;
- or create a separate worktree if repository policy permits;
- do not overwrite their changes.

======================================================================
E. SOURCE PRIORITY
======================================================================

live source/tests
>
live evidence
>
canonical Brain contracts/ADRs
>
task ledger/frontmatter
>
plans
>
context packs/transcripts

If a task says BACKLOG but evidence + live source prove it closed:
reconcile it and continue. Do not reimplement.

======================================================================
F. BOOT — MINIMAL CONTEXT
======================================================================

Read in order:

1. AGENTS.md
2. .ai/START.md
3. .ai/NOW.md if present
4. .ai/ROUTER.md
5. .ai/knowledge/runtime-platform/CURRENT-SNAPSHOT.md
6. .ai/knowledge/runtime-platform/SOURCE-PRIORITY.md
7. .ai/knowledge/runtime-platform/TASK-EXECUTION-MAP.md
8. .ai/scrum/views/RUNTIME-PLATFORM.md
9. scripts/ai/runtime-work-queue.mjs output

Run:

node scripts/ai/runtime-work-queue.mjs status .
node scripts/ai/runtime-work-queue.mjs next .

Do NOT recursively load `.ai/**`.
Do NOT open every schema/config file before choosing the task.

======================================================================
G. TASK LOOP
======================================================================

For each selected task:

1. Reconcile
   - card
   - dependencies
   - existing evidence
   - live source
   - nearest tests

2. Characterize
   - state expected behavior
   - add failing regression/characterization when practical
   - identify FIRST authority where behavior diverges

3. Implement
   - smallest correct authority
   - no parallel implementation
   - no temporary FormNew/ConfigNew/GridNew
   - no filenames with dates/revision suffixes

4. Validate
   - focal unit tests
   - nearest integration tests
   - lint/typecheck for changed files
   - relevant architecture gate

5. Evidence
   - reports/runtime-platform/evidence/<TASK-ID>.md
   - root cause
   - files changed
   - tests and exact results
   - residual risk
   - next dependencies unlocked

6. Continue
   node scripts/ai/runtime-work-queue.mjs next .
   Load next focal context and proceed.

Do not stop simply because one task finished.

======================================================================
H. PRIORITY QUEUE
======================================================================

The extension queue is RTP-425 through RTP-545.

However, before executing an extension task, reconcile any earlier runtime-platform task whose
live evidence is required.

Key work:

RTP-425  source/evidence/config baseline reconciliation
RTP-430  complete capability inventory
RTP-435  config compiler + immutable ResolvedConfig revision/hash
RTP-440  fail-closed CapabilityGraph/dependencies
RTP-445  capability-level ConfigChangeSet/effect plan
RTP-450  canonical GridGeometry
RTP-455  grid/snap/guides/rulers/object-snap parity
RTP-460  Designer feature/action/component/controller convergence
RTP-465  remove direct config readers and duplicate surface rules
RTP-470  Form/Viewer/Generator/Snapshot capability convergence
RTP-475  plugin-owned schema manifest metadata
RTP-480  codecs/completion metadata for all schema families
RTP-485  optimistic concurrency + shared logical scope
RTP-490  tri-state User/Document/Execution completion
RTP-495  conflict-blocking canonical merge using codec equality
RTP-500  execution result codec/artifact byte separation
RTP-505  safe bounded PDF composition
RTP-510  real multi-user Form wiring/isolation
RTP-515  all-schema dynamic stress/pairwise harness
RTP-520  DocuSign comparator parity audit/adaptation
RTP-525  Recipient-to-User compatibility migration
RTP-530  safe legacy/dead-code retirement
RTP-535  semantic dedup/generic refactor/cycle-wrapper reduction
RTP-540  performance/a11y/privacy/memory/browser concurrency
RTP-545  full release + Brain/context closeout

======================================================================
I. CONFIGURATION TARGET
======================================================================

Do not add more disconnected booleans.

Target:

raw JSON
 -> migrate
 -> validate
 -> normalize
 -> profile/default expansion
 -> CapabilityGraph
 -> immutable ResolvedConfig
 -> surfaces

ResolvedConfig carries monotonic revision + semantic hash.

Unknown capability is fail-closed.

Policy/config, presentation defaults and session UI state are separate.

UI button, shortcut, context menu and public controller must resolve the SAME capability state.

`enabled`, `visible`, `permitted`, `available`, `executable` are not synonyms.

Do not mutate config objects returned by ConfigService outside the service.

======================================================================
J. GRID TARGET
======================================================================

Do not "fix grid" only with CSS.

First characterize:
- logical page coordinates;
- CSS/render coordinates;
- zoom;
- snap result;
- page origin;
- multipage behavior.

Create/use one GridGeometry in page space (mm).

Grid renderer and snap engine consume the same geometry.

Capabilities are independent:
grid visibility
snap-to-grid
guides visibility
guide creation
guide snap
object snap
rulers
snap lines

Test zoom:
50, 75, 100, 125, 150, 200 percent.

Test A4, Letter, custom page, scroll and multipage.

======================================================================
K. SCHEMA TARGET
======================================================================

Manifest metadata belongs to plugin/registry.

Do NOT keep runtime sets like:
choiceTypes/signingTypes/visualTypes
as second product authority.

For every schema definition derive:
family
interactionKind
capabilities
codec
validation
completion
dependencies
artifact/layout/snapshot behavior.

All-schema tests must be registry-driven.

No lowercase/camelCase mismatch.

No truthiness completion:
0, false, [], "", null, undefined have codec-specific semantics.

A sibling interaction must never rollback another accepted field.

======================================================================
L. CONCURRENCY TARGET
======================================================================

Runtime mutable state:
logicalDocumentScope × User × schemaUid
plus execution/session identity where appropriate.

Use optimistic compare-and-swap:
expectedRevision must equal storedRevision.
Store assigns next revision.

A client cannot invent a newer revision to bypass conflict.

Shared values use an explicit logical shared scope.

Cleanup APIs remove document/session/instance state.

======================================================================
M. CANONICAL MERGE / PDF
======================================================================

A canonical conflict cannot simultaneously return a publishable winner.

Use SchemaValueCodec.equals for semantic equality.

ExecutionResult durable state does not JSON-roundtrip arbitrary Uint8Array/Blob.

PDF composer:
- explicit implemented modes only;
- deterministic order;
- strong provenance hash when claimed;
- AbortSignal;
- max bytes/pages/artifacts;
- malformed input handling;
- no persistence;
- no final result when unresolved conflict exists.

For one logical document:
prefer canonical merge -> generator.

For independent documents/executions:
append/bundle with explicit order.

======================================================================
N. LEGACY / DEAD CODE / DEDUP
======================================================================

Before removal classify:
dead
public compatibility
dynamic registry
generated
test-only
unknown

Knip/JSCPD are evidence generators, not automatic deletion authority.

Do not remove a dynamic schema/plugin merely because static analysis cannot see it.

Prioritize:
duplicate authority
-> wrappers/reexports
-> dead internal exports
-> obsolete adapters
-> legacy internal naming
-> stale docs/tools.

Use ratchets; never make duplication/cycles/dead-code metrics worse.

======================================================================
O. DOCUSIGN COMPARATOR
======================================================================

Use official reference only as comparator:
fields/tabs, embedded signing, prefill, conditional fields, recipient routing, bulk fan-out.

Do not copy envelope/network/business semantics into SISAD-PDFME.

Map reusable concepts:
external participant -> User adapter
tab -> schema
recipient field ownership -> assignment/access
embedded signing -> Form
prefill -> origin=prefill
conditional fields -> declared dependencies
routing/bulk -> ExecutionPlan simulator outside Form
form data -> snapshot/execution result

======================================================================
P. TEST STRATEGY
======================================================================

Required layers as applicable:

1. config compiler
2. capability unit
3. dependency/impact graph
4. grid geometry
5. Designer integration
6. schema registry/codec
7. Form interaction
8. pairwise sibling
9. User/Document/Session isolation
10. optimistic concurrency
11. completion projections
12. snapshot
13. Viewer
14. Generator
15. PDF composition
16. two Forms same JS realm
17. two BrowserContexts
18. performance/memory
19. a11y/touch/IME
20. public API/compatibility

Do not declare "all schemas work" until registry coverage has no unexplained types.

======================================================================
Q. REPAIR BUDGET
======================================================================

For a failing task:
- first failure: diagnose first divergence;
- repair;
- rerun;
- second failure: reduce scope/produce smaller characterization;
- repair;
- if still blocked, write BLOCKED evidence and continue independent work.

Do not loop endlessly on one symptom.

======================================================================
R. FINAL CLOSEOUT
======================================================================

When queue appears empty:

1. rerun task/evidence reconciliation;
2. execute full release gates;
3. run dead-code/dedup/cycle ratchets;
4. run docs/path validators;
5. regenerate indexes/context packs using project tooling;
6. update durable Brain memory with facts only;
7. verify no new files/folders contain revision/date naming;
8. produce final report:
   - tasks PASS/SKIPPED/BLOCKED;
   - source files changed;
   - public API compatibility;
   - tests exact counts;
   - remaining external blockers;
   - performance results;
   - legacy/dead-code metrics before/after;
   - known residual risks.

Only then stop.

Do not ask whether to continue.

<!-- SISAD-PDFME-PORTABLE-INTEGRATION:.ai/prompts/PROMPT_SISAD_PDFME_AUTONOMOUS_START.md:START -->
## Portable integration extension

Antes de closeout, el autonomous loop debe cubrir también la arquitectura definida por:

- `.ai/brain/20-contracts/integration/HTTP-CLIENT-CONTRACT.md`
- `.ai/brain/20-contracts/integration/DATA-SOURCE-CONTRACT.md`
- `.ai/brain/20-contracts/integration/DATA-BINDING-CONTRACT.md`
- `.ai/brain/20-contracts/integration/INTEGRATION-RUNTIME-CONTRACT.md`
- `.ai/brain/20-contracts/integration/FONT-REGISTRY-CONTRACT.md`
- `.ai/scrum/views/PRIORITIES.md` y las task-cards de Portable Runtime

PokeAPI es exclusivamente example/fixture.

No añadir Axios como dependencia obligatoria del core. Debe poder inyectarse un cliente Axios
existente, conservando defaults/interceptors/Authorization del host, o sustituirse por fetch/fake
transport sin cambiar schemas/templates.

Si una ejecución anterior terminó antes de completar la queue, reanudar desde la primera task
sin evidence válida; no saltar directamente a nuevas features.
<!-- SISAD-PDFME-PORTABLE-INTEGRATION:.ai/prompts/PROMPT_SISAD_PDFME_AUTONOMOUS_START.md:END -->
