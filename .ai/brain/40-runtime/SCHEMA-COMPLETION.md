# Schema completion runtime

Pipeline:

```text
interaction
 -> transaction
 -> codec
 -> validation
 -> interaction state
 -> schema completion
 -> User completion
 -> Document completion
 -> Execution completion
```

Computed/visual schemas pueden estar completos sin interacción manual.
Signing/artifact/action schemas usan sus propias completion policies.
