# Events and effects

```txt
UI intent → Access/Action Policy → Command → Mutation → Domain Event → Effect
```

Los widgets no llaman callbacks del host directamente. Un dispatcher entrega
eventos canónicos a los handlers del contrato actual; no se conservan handlers
históricos ni aliases de callbacks. Los efectos DOM/browser/host tienen owner,
cleanup y rollback. No usar `setTimeout` para coordinación.
