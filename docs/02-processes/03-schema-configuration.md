# Proceso — Configuración de schema

## Flujo

```txt
schema selected
→ inspector contract
→ widget por section
→ command update
→ snapshot state
→ re-render
```

No mutar schema desde widgets sin command/update centralizado.
