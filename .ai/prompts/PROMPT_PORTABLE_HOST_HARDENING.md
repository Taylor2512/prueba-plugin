# Prompt — Portable host hardening

Work only on SISAD-PDFME as a standalone reusable product.

Before implementation:

1. read `.ai/brain/00-product/PRODUCT-BOUNDARY.md`;
2. read `.ai/scrum/views/PRIORITIES.md`;
3. claim only the exact files required;
4. reconcile live source/tests/evidence;
5. characterize the first divergence.

Do not load or assume source from a concrete consumer application.

Use generic vocabulary: User, Document, host, consumer, runtimeSession, access projection,
resource/provider and artifact.

Do not add business routing modes to Form. Host orchestration is outside the reusable.

For each task:

- smallest correct authority;
- characterization/regression first for high-risk behavior;
- focal tests;
- nearest integration tests;
- appropriate browser gate;
- evidence;
- update task frontmatter only from executed facts.

Never use destructive Git commands. One writer per overlapping file set. Only the
integrator stages/commits/pushes shared work.
