# Contratos por capa

```text
UI/React
  ↓ comandos, view models, callbacks
Application
  ↓ use cases, policies, orchestration
Domain
  ↓ contracts, strategies, factories, registries
Infrastructure
  ↓ adapters, browser APIs, persistence, providers
```

## Reglas

- UI no adapta payloads remotos.
- Domain no importa React ni APIs del host.
- Infrastructure no decide UX.
- Application coordina, pero no renderiza.
- Hooks conectan React con application; no reemplazan el dominio.
- Registries poseen extensibilidad; no se replican switches en cada superficie.
- Commands son la entrada única de acciones mutables del diseñador.
