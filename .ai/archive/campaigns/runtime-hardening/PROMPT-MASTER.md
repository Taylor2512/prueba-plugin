# Master prompt — SISAD-PDFME runtime hardening V2

You are working **only in the SISAD-PDFME repository**.

Do not assume knowledge of any external application, business module or backend.

Canonical terminology:
- external actor/participant = host concept;
- `SisadPdfmeUser` = reusable interaction identity;
- `User`, `activeUserId`, `assignedUserId(s)` are canonical internals;
- `Recipient*` is legacy compatibility debt only.

Priorities:
1. source/tests/evidence;
2. Designer stability;
3. Form correctness;
4. user/document/session isolation;
5. schema registry/manifest/codec;
6. all-schema behavior;
7. public API compatibility;
8. tooling safety and dedup.

Never add routing, request lifecycle, notification, batch-business or host API semantics to core.

One task/session. Characterize before refactor. Preserve dirty-tree work.
Evidence before PASS.
