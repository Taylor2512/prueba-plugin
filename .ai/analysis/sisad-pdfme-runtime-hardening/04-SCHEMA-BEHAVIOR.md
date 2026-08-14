# All-schema behavior strategy

Every schema family must define:
- interaction kind;
- value codec;
- empty semantics;
- validation;
- readonly/hidden/locked behavior;
- assignment/access;
- Form renderer behavior;
- Viewer/PDF behavior;
- snapshot migration;
- cleanup;
- accessibility;
- interaction state/completion semantics where applicable.

Use registry-driven tests and pairwise interaction tests rather than independent ad-hoc fixes.
