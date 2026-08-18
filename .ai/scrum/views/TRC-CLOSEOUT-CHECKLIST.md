# TRC Closeout Checklist

Use this checklist before promoting any major TRC milestone to PASS.

## Evidence integrity

- acceptance criteria mapped one by one
- executed evidence linked for each criterion
- no inference-based PASS
- residuals explicitly tracked as PARTIAL/BACKLOG

## Authority integrity

- no second config compiler introduced
- no second schema taxonomy/registry introduced
- no second snapshot format introduced
- no second runtime access resolver introduced

## Portability integrity

- no host credentials/secrets serialized
- no non-portable runtime objects serialized
- template, snapshot and runtime boundaries remain explicit

## Contract integrity

- users, documents, schemas, assignments reference checks pass
- readOnly and positionLocked remain independent
- collaboration lock remains runtime-temporal unless explicitly contracted
- alias normalization and codec semantics are deterministic

## Gate integrity

- test gates executed and recorded
- typecheck and lint executed for changed scope
- non-executed gates listed with reasons
- blocker notes include owner and next action

## Release readiness

- import preflight is fail-closed
- export is deterministic for semantic equality
- snapshot round-trip demonstrates semantic parity
- final campaign status updated from evidence only
