# Plan — autonomous completion

Coordinator loops through RTP cards by dependencies.

Each card remains small, evidence-based and bounded.

The coordinator does not stop between cards. It refreshes only the context required for the
next card.

Blocked independent work is skipped temporarily.

The campaign ends when:
- all applicable tasks are PASS/SKIPPED with evidence; and
- release gates pass; or
- remaining tasks are all external blockers with explicit evidence.
