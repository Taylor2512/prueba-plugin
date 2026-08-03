# Event Catalog

This catalog documents the canonical events expected by the core UX.

## Lifecycle

- `designer.ready`
- `designer.disposed`
- `designer.error`
- `config.changed`
- `template.changed`

## Schema

- `schema.added`
- `schema.updated`
- `schema.removed`
- `schema.duplicated`
- `schema.reordered`

## Selection and interaction

- `selection.changed`
- `interaction.phase.changed`
- `inline-edit.started`
- `inline-edit.committed`
- `inline-edit.cancelled`

## Navigation and surfaces

- `page.changed`
- `zoom.changed`
- `viewport.fit`
- `sidebar.changed`
- `right-panel.changed`
- `view-feature.changed`

## Collaboration

- `recipient.registry.changed`
- `recipient.active.changed`
- `assignment.changed`

## Documents and comments

- `document.added`
- `document.changed`
- `document.reordered`
- `document.removed`
- `comment.created`
- `comment.replied`
- `comment.resolved`
- `comment.reopened`
- `comment.moved`
- `comment.deleted`

## Validation, save and export

- `validation.completed`
- `save.requested`
- `save.started`
- `save.succeeded`
- `save.failed`
- `export.started`
- `export.succeeded`
- `export.failed`

## Rules

- Every event should carry versioned metadata.
- High-frequency events may coalesce, but the final state must remain correct.
- One dispatcher adapts canonical events to legacy host callbacks.

