# SISAD-PDFME — AUTONOMOUS CONSOLIDATION TO PRODUCTION

You are operating inside the standalone SISAD-PDFME repository.

The repository may be shared LIVE with Claude, Codex and GitHub Copilot at the same time.

HARD PROJECT CONSTRAINT:

- SAME repository;
- SAME branch;
- SAME working tree;
- NO worktrees;
- NO branch switching.

Your job is not to ask which task to continue.
Your job is to safely finish all locally resolvable work and reach the production objective.

======================================================================
1. BOOT
======================================================================

Run:

git status --short
git branch --show-current
git rev-parse HEAD

node scripts/ai/same-repo-coordinator.mjs status .
node scripts/ai/runtime-work-queue.mjs status .
node scripts/ai/runtime-work-queue.mjs next .

Read minimally:

AGENTS.md
.ai/START.md
.ai/NOW.md if present
.ai/ROUTER.md
.ai/architecture/SAME-REPO-MULTI-AGENT.md
.ai/architecture/PROVIDER-MODEL-POLICY.md
.ai/brain/20-contracts/SAME-REPO-MULTI-AGENT-CONTRACT.md
.ai/brain/20-contracts/PRODUCTION-OBJECTIVE-CONTRACT.md
current task
current evidence
nearest source/tests.

Do not recursively load `.ai/**`.

======================================================================
2. SOURCE OF TRUTH
======================================================================

live source/tests
>
live evidence
>
Brain contracts/ADRs
>
task/ledger
>
plans/prompts
>
old exports/transcripts.

Claude previously completed substantial work.
Do NOT restart RTP-425..505 merely because a card is stale.

The latest known blocker is RTP-510 multi-user Form/access, but confirm live source/evidence.

======================================================================
3. SAME-REPO CLAIM BEFORE WRITE
======================================================================

Before editing any file:

node scripts/ai/same-repo-coordinator.mjs claim . \
  --agent <claude|codex|copilot> \
  --task <TASK-ID> \
  --paths <exact-paths>

If claim fails:
DO NOT EDIT.
Choose disjoint work or reviewer mode.

Never silently expand a claim.

Never overwrite another agent's diff.

======================================================================
4. GIT
======================================================================

Never:

git reset --hard
git clean
git checkout -- .
git restore .
blanket stash
force push.

Do not run `git add .` while other writers are active.

Only the holder of the integrator lease may stage/commit/push.

If you are not integrator:
leave your changes in the working tree, evidence them, and handoff.

======================================================================
5. MODEL PROFILE
======================================================================

Use the strongest reasonable model for the task.

frontier-architecture:
P0, multi-user, access, concurrency, signature, architecture.

balanced-implementation:
normal React/runtime/test implementation.

fast-mechanical:
i18n, repetitive tests, docs, inventories.

The provider-specific model mapping lives in:
.ai/providers/MODEL-ROUTING.json

Model availability changes; do not change product architecture because a model is unavailable.

======================================================================
6. IMMEDIATE PRIORITY — RTP-510
======================================================================

Do not patch assignment blindly.

Prove the first divergence through:

resources.config
-> resolved config/runtime options
-> OptionsContext
-> Preview options
-> collaboration/access context
-> canonical access resolver
-> renderer editable state.

Current requirement:

ownerMode='single'

Alice owns schema A:
Alice editable.
Bob/Carla not editable according to policy.

Bob owns schema B:
Bob editable.
Alice/Carla not editable.

Converge duplicate access resolvers.
Do not preserve two semantic authorities.

Then prove:

Alice -> edit A
Bob -> edit B
Alice -> return
both values isolated/correct.

Also:
multi-document
two Forms same realm
two BrowserContexts
signature/initials/artifact isolation
completion projection
stale event rejection
sibling rollback regression.

Unit tests alone cannot PASS RTP-510.

======================================================================
7. RTP-515
======================================================================

Registry-driven all-schema harness.

Every editable type:
multiple instances.

Required:
text
number
date/time
choice families
signature/initials
attachment/actions
table
media where interactive
remote options
dependent fields.

Pairwise invariant:
interaction with B never reverts A unless a declared dependency explicitly changes A.

Remote:
search
debounce
abort
stale responses
pagination/cursor
large list virtualization
keep-stale
cache isolation
offline after commit.

======================================================================
8. VISUX BACKLOG
======================================================================

Do not create a new visual campaign.

Reconcile VISUX-023..042.

The inspector must become capability/family driven.

Priority:
- User identity, not product-facing Recipient;
- Assignment != Lock != Audit;
- remove UID/mode/internal IDs from normal UX;
- signing inspector depends on selected method/capabilities;
- signature adoption style separate from acquisition method;
- Data connections follow dataBinding;
- no Axios brand in product UI;
- max two-column compact forms;
- read -> write -> persist -> Form -> Viewer -> PDF -> Snapshot parity.

======================================================================
9. SIGNATURE
======================================================================

Separate:

identity
adoption style
acquisition/execution method.

Signature and initials share style profile.

Allowed methods != selected method.

Only provider/P12 surfaces show certificate/provider-specific metadata.

External providers use generic SignatureProvider runtime.
No hardcoded OneShot branch in core.

FontRegistry provides browser/PDF parity.

======================================================================
10. USER MIGRATION
======================================================================

Canonical core language: User.

Recipient exists only as compatibility/host boundary.

No global rename.

Migrate symbol by symbol.

Do not claim RTP-525 fully closed while live core still has Recipient-centric semantic authorities
that affect runtime behavior.

======================================================================
11. LEGACY / DEAD / DEDUP
======================================================================

After functional gates:

RTP-530
RTP-535.

Classify before removal:
dead
public-compat
dynamic-registry
generated
test-only
unknown.

Knip/JSCPD are signals, not deletion authority.

Single access authority is part of semantic dedup.

======================================================================
12. QUALITY
======================================================================

The historical TSC baseline around 148 is NOT green.

No task may introduce new TypeScript errors.

Final production closeout target:
project-owned TypeScript errors = 0.

Also:
lint
build
unit
integration
E2E
BrowserContexts
performance
memory
a11y
security
docs
direct config reader gate
dead-code/dedup/cycle ratchets.

======================================================================
13. MEMORY / EVIDENCE
======================================================================

After each task:

1. evidence;
2. task/ledger;
3. CURRENT delta;
4. HANDOFF only if continuity changed;
5. durable Brain only for stable facts.

Never store a suspected root cause as durable fact.

If interrupted:
write factual handoff and preserve claim state.

======================================================================
14. AUTONOMY
======================================================================

Never ask:
"¿continúo?"
"¿qué task hago ahora?"
"elige una opción".

After a task:
release claim when safe
run queue next
claim next disjoint task
continue.

A blocked task does not stop independent work.

======================================================================
15. FINAL STOP
======================================================================

Stop only when:

- all locally resolvable RTP/VISUX work is evidenced;
- production objective contract passes;
- no active writer claims remain;
- release validation barrier passes;
- Brain/current/handoff are consistent;
- final report lists any truly external blocker.

Otherwise:
CONTINUE.
