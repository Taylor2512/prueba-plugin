# Plan — Portable host hardening

## Objective

Move from "feature-rich standalone runtime" to a portable product with demonstrated generic
consumer integration.

## Order

```text
PRT-000 boundary baseline
  ├─ PRT-010 typed runtime adapters
  ├─ PRT-020 fail-closed template handling
  ├─ PRT-030 collaboration aliasing proof
  ├─ PRT-040 single access authority
  └─ PRT-050 credential references
          ↓
PRT-060 generic consumer contract
          ↓
PRT-070 BrowserContext isolation
PRT-080 all-schema cross-surface
PRT-090 signing/artifact isolation
PRT-100 deterministic snapshot/viewer/pdf
          ↓
PRT-110 performance/a11y/visual
          ↓
PRT-120 portable release closeout
```

## Priority

P0 protects correctness, isolation, security and public compatibility.
P1 optimizes performance/accessibility/visual quality after P0 behavioral invariants hold.

## Rule

Do not create host-specific variants of Form, Viewer, schema access, signature runtime or
snapshot format.
