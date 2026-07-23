---
name: sisad-inspector-contract
description: Implement or review DetailView widgets using explicit property paths, read/write, visibility, disabled state, validation, and layout. Use for RightSidebar inspector work.
---

# Inspector contract

Every visible control must map to a real schema property and update path. Derive visibility from canonical schema profile/family, and disabled state from shared access state. Avoid widgets that only display editable-looking UI. Test mixed selection and narrow sidebar layouts.
