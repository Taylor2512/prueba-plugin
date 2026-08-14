# Plan — same repo, same branch, three agents

## Rule

Parallelize by file ownership, not by branch.

## Work packet shape

Every packet declares:

```text
task
reasoningProfile
writePaths
readPaths
gates
handoff
```

## Current recommended packets

### Packet A — runtime access
Task: RTP-510
Writer: Claude
Paths: access propagation and canonical resolver only.

### Packet B — characterization
Task: RTP-510/RTP-515 preparation
Writer: Codex
Paths: new test files + diagnostics helpers only.

### Packet C — VISUX analysis
Task: VISUX-023/024/034 documentation and contracts
Writer: Copilot
Paths: docs/task refinements or explicitly claimed UI files.

No packet may expand its writePaths without acquiring a new claim.

## Barrier

Before declaring RTP-510 PASS:
all three stop writing;
integrator acquires validation lease;
run focal + E2E + full required gates.
