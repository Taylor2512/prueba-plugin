# Plan — SISAD-PDFME runtime hardening V2

## Wave 0 — source truth and tooling
- `SPRT-000` live baseline and public API snapshot.
- `SPRT-010` importer/installer/test-installer characterization and safety.
- `SPRT-020` dedup/order/stable-name baseline.

## Wave 1 — identity and assignments
- `SPRT-030` characterize legacy Recipient terminology.
- `SPRT-040` introduce canonical `SisadPdfmeUser`.
- `SPRT-050` normalize `users/activeUserId` at public boundary.
- `SPRT-060` canonical user assignment model.
- `SPRT-070` explicit snapshot migration.

## Wave 2 — Form transaction core
- `SPRT-080` transaction protocol.
- `SPRT-090` host reconciliation with revision/origin.
- `SPRT-100` lifecycle/focus/caret/IME.
- `SPRT-110` interaction/touched/dirty/completion state.

## Wave 3 — schema platform
- `SPRT-120` schema runtime manifest.
- `SPRT-130` value codecs and empty semantics.
- `SPRT-140` text/number/date families.
- `SPRT-150` choice/boolean families.
- `SPRT-160` signature/initials/dateSigned.
- `SPRT-170` artifacts/actions.
- `SPRT-180` table/media/shapes/barcodes.

## Wave 4 — isolation/parity
- `SPRT-190` User × Document × Session isolation.
- `SPRT-200` two-Form/multi-instance concurrency.
- `SPRT-210` pairwise schema interaction harness.
- `SPRT-220` Form/Viewer/Snapshot/PDF parity.
- `SPRT-230` accessibility/performance/leak gate.

## Wave 5 — release and cleanup
- `SPRT-240` public compatibility/deprecation gate.
- `SPRT-250` remove proven duplicate/legacy branches.
- `SPRT-260` regenerate Brain/index/context packs and closeout.
