# Portable host use cases

This matrix describes reusable requirements without assuming a concrete host product.

| Area | Required cases |
|---|---|
| Host adapter | zero/one/many Users; stable identity; capabilities; opaque host reference |
| Documents | one/many documents; page navigation; rapid document switching |
| Assignments | assign/reassign/unassign; editable/readOnly/hidden/locked |
| Designer | drag/drop, select, multi-select, move, resize, rotate, duplicate, delete, clipboard, align |
| Form | prefill, edit, validation, touched/dirty, completion, restore |
| Viewer | read-only parity; no mutation |
| Values | empty/default/prefill/restore; `0`, `false`, `[]`, `null`, `""` distinguished |
| Choice | select, checkbox, radio, option groups, min/max selections |
| Signing | signature, initials, date signed, style adoption, external provider |
| Actions | attachment, note, approve, decline and declared action schemas |
| Remote data | search, debounce, abort, stale response, paging, dependencies, keep-stale |
| Multi-user | same document with isolated values and artifacts |
| Multi-document | same user across documents; independent state |
| Concurrency | two Forms same realm; multiple BrowserContexts |
| Snapshot | serialize, restore, migrate, semantic equality |
| PDF | deterministic output from canonical committed values |
| Error | invalid template, provider error, remote error, timeout, stale event |
| Lifecycle | mount, rerender, unmount, remount, dispose |
| Accessibility | keyboard, focus, screen reader semantics, reduced motion |
| Input methods | mouse, keyboard, touch, IME |
| Performance | large pages/schema counts; typing latency; no presentation remount storms |

## Orchestration neutrality

Sequential, parallel, mixed and bulk host workflows are **host orchestration shapes**.
They do not create separate Form implementations.

The reusable requirement is the same: correctly execute one isolated User × Document
context.
