# Arquitectura de producto

```text
Public integration
  SisadPdfmeInstance / config / controller / bundles
        ↓
React surfaces
  Designer / Form / Viewer
        ↓
Runtime protocol
  lifecycle / events / transactions / artifacts / save
        ↓
Schema platform
  plugin registry / family / manifest / codec / validation
        ↓
PDF platform
  Preview / PDF.js conversion / pdf-lib generation / snapshot
        ↓
Host boundaries
  documents / recipients / signatures / persistence providers
```

El host no es dueño de Canvas, Renderer, Inspector, Form internals ni schema semantics.
