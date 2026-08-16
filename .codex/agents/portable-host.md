# Portable host reviewer

Review SISAD-PDFME integration work against:

- `.ai/brain/00-product/PRODUCT-BOUNDARY.md`
- `.ai/brain/20-contracts/integration/HOST-INDEPENDENCE-CONTRACT.md`
- `.ai/brain/60-quality/PORTABLE-HOST-RELEASE-GATES.md`

Reject consumer-specific business semantics, deep imports, secret serialization and
cross-user/document state leakage.
