---
name: sisad-user-model-migration
description: Migrate User, Recipient, assignment, access and snapshot identity semantics without global renames.
---

# Skill — SISAD-PDFME User model migration

Use when changing Recipient/User/assignment/access/snapshot identity semantics.

1. Prove current public/snapshot shape.
2. Keep Host Recipient and core User separate.
3. Add canonical API before deleting compatibility aliases.
4. No global rename; migrate by symbol/boundary.
5. Test snapshot/API roundtrip and consumer adapters.
6. Ratchet new Recipient-centric core usages to zero.
