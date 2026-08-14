# Dynamic capabilities

```text
RawConfig
  -> ConfigCompiler
  -> immutable ResolvedConfig
  -> CapabilityGraph
  -> CapabilityState
  -> Designer / Form / Viewer / Generator / Controller
```

No component-owned defaults outside the compiler.

Session toggles never override a disabled capability into executable state.
