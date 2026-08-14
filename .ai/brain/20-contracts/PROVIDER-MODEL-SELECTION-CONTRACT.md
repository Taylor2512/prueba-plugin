# Provider model selection contract

Model names are operational configuration.

Tasks declare a `reasoningProfile`:

```text
frontier-architecture
balanced-implementation
fast-mechanical
review-only
```

Provider adapters map profile -> currently available model.

A task card should not depend on a specific vendor model ID.

When a preferred model is unavailable, use the next fallback in
`.ai/providers/MODEL-ROUTING.json`.

Model choice never changes functional contracts.
