---
name: sisad-schema-plugin
description: Create or refactor a schema plugin/family while preserving Designer, inspector, Form, Viewer, Generator, snapshot, ownership, groups, and tests. Use for schema implementation work.
---

# Schema plugin workflow

Start from schema family contracts and existing registries. Reuse shared chrome, option behavior and value adapters. Do not create internal options as independent schemas. Preserve schemaUid, document/page routing, owner fields and designer metadata. Validate all runtime surfaces and round-trip.
