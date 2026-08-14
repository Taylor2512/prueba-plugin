# Arquitectura de producto

```text
Public integration
  SisadPdfmeInstance / config / controller / bundles / host adapters
        ↓
Host boundary normalization
  Recipient (host) -> User (SISAD-PDFME) / documents / signatures / persistence
        ↓
React surfaces
  Designer / Form / Viewer
        ↓
Runtime protocol
  lifecycle / events / transactions / revision / artifacts / save
        ↓
Access + assignment
  active User / assigned User(s) / audit User / locks / capabilities
        ↓
Schema platform
  plugin registry / family / manifest / codec / validation / completion
        ↓
PDF platform
  Preview / PDF.js conversion / pdf-lib generation / snapshot + migrations
```

El host no es dueño de Canvas, Renderer, Inspector, Form internals ni schema semantics.
SISAD-PDFME no es dueño de routing/Request/massive/notification rules del host.
