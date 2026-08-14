# Prompt — schema completion

Deriva los schemas desde registry.

Para cada schema determina:
family, interactionKind, editableInForm, codec, empty semantics, validation, access,
completion policy, dependencies y parity.

No crear switches duplicados por type.

Probar:
prefill, edit, clear, 0, false, [], required, readonly, owner/access, sibling interaction,
host rerender, Viewer, Snapshot, PDF, multi-document y multi-user.

Completion nunca se resuelve con `Boolean(value)`.
