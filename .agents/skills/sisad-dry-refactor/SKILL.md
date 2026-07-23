---
name: sisad-dry-refactor
description: Perform a behavior-preserving DRY refactor on a bounded SISAD PDFME clone after characterization. Use for one approved dedup task-card, not for global cleanup.
---

# Dry refactor

1. Describe equivalence and meaningful differences.
2. Characterize both paths.
3. Choose the smallest domain-named abstraction.
4. Migrate callers incrementally.
5. Keep public contracts stable.
6. Reject boolean-heavy generic helpers.
7. Run focal tests and jscpd owned.
8. Record before/after and rollback point.
