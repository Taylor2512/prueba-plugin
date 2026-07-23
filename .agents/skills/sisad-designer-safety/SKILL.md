---
name: sisad-designer-safety
description: Protect canvas geometry, Moveable, Selecto, multipage routing, overlays, ownership, and interaction invariants during a designer change. Use whenever files under Designer/Canvas or interaction commands are touched.
---

# Designer safety

Trace documentId, pageNumber, scale, scroll, paper rect and schema coordinates. Preserve selection versus transform semantics, modal suspension, locked/readOnly behavior and owner color. Do not use setTimeout or z-index to hide ordering bugs. Require Playwright when layout or pointer behavior changes.
