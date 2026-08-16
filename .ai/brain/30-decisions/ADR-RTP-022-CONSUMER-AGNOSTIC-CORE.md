# ADR-RTP-022 — Consumer-agnostic core

## Status

Accepted.

## Context

Consumer-specific integration knowledge had entered canonical Brain, memory, migrations,
task descriptions and generated indexes. This makes future agents treat one consumer's
business workflow as product semantics.

## Decision

SISAD-PDFME canonical architecture describes only generic hosts and public integration
contracts.

Concrete consumer repositories own:

- business process/routing;
- request lifecycle;
- consumer persistence;
- business policies;
- consumer-specific mappings.

SISAD-PDFME owns the reusable PDF runtime and generic integration primitives.

## Consequences

- consumer names are forbidden from canonical product docs and reusable task acceptance;
- host workflows map to one generic execution context;
- consumer-specific notes are kept in the consumer repository;
- legacy source names are migrated independently with compatibility evidence;
- portable consumer tests replace consumer-specific smoke tests in this repository.
