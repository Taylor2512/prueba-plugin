# Host execution context

## Purpose

Define the generic unit of Form execution without encoding a business workflow.

## Isolation identity

Runtime state is scoped by:

```text
runtimeSession × user × document
```

A switch of any identity dimension must not leak:

- values;
- touched/dirty state;
- completion;
- signatures/initials;
- attachments/artifacts;
- remote option caches;
- in-flight responses;
- local drafts.

## Runtime input

```text
User
Document
serializable inputs
access projection
signature context
integration resources
opaque session scope
```

## Out of scope

The reusable does not determine:

- who executes next;
- whether execution is sequential or parallel;
- how many host requests are created;
- when a business process is complete;
- how the host persists its relational projection.

The same generic Form must support all host orchestration shapes by receiving the already
resolved execution context.
