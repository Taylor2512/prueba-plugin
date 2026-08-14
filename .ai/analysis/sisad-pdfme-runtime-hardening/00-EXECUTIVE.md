# SISAD-PDFME runtime hardening — executive

## Product boundary

This campaign is entirely about **SISAD-PDFME**.

No external application, module, backend or business workflow is part of this repository's
canonical knowledge. External systems are represented only through generic host contracts.

## Current direction

Designer is mature enough that the safest strategy is:
- characterize;
- freeze public behavior;
- remove regressions;
- improve internals behind stable public contracts.

Form needs deeper hardening:
- local-first transaction protocol;
- host reconciliation/revisions;
- user/document/session isolation;
- schema value codecs;
- schema manifest/capabilities;
- interaction-state/completion;
- signature/artifact isolation;
- all-schema behavior parity;
- multi-instance concurrency.

## Terminology correction

Canonical reusable identity is `User`, not a business `Recipient`.
Existing Recipient-named internals are legacy migration debt.

## Release principle

A schema is complete only when its declared capabilities pass:
Factory, Designer, Inspector, Form, reset/clear, sibling isolation, access, validation,
touched/dirty, host rerender, Viewer, Snapshot, PDF, keyboard/touch/IME, cleanup,
multi-document and multi-user tests.
