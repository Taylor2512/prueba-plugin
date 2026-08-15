# Events and effects

```txt
UI intent → Access/Action Policy → Command → Mutation → Domain Event → Effect
```

Los widgets no llaman callbacks del host directamente. Un dispatcher adapta
eventos canónicos a handlers legacy. Los efectos DOM/browser/host tienen owner,
cleanup y rollback. No usar `setTimeout` para coordinación.
