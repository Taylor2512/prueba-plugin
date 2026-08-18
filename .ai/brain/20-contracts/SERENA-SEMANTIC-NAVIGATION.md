# Serena semantic navigation contract

Serena is the semantic source-navigation layer.

It does not replace durable product knowledge, task state, ADRs, evidence or Git.

## Required workflow

Before broad file reads:

1. get symbol overview;
2. find target symbol;
3. find references;
4. find implementations when relevant;
5. read only the source ranges required.

Before rename/delete/public signature changes:

1. resolve references and implementations;
2. resolve public facade;
3. locate nearest tests;
4. inspect active claims;
5. apply the smallest coherent change;
6. run diagnostics and focused tests.

Filesystem/grep remains a fallback for non-symbol text and unsupported formats.

## Coordination

One writer owns a path set at a time.

Do not overwrite paths claimed by another agent.

## History

Do not encode generations, dates or timestamps in stable path names. Git stores
history.
