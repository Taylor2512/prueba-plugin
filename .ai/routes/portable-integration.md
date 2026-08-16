# Route — portable integration

Use this route when the task concerns integration of SISAD-PDFME into an arbitrary consumer.

## Read first

1. `.ai/brain/00-product/PRODUCT-BOUNDARY.md`
2. `.ai/brain/20-contracts/integration/HOST-INDEPENDENCE-CONTRACT.md`
3. `.ai/brain/20-contracts/integration/HOST-EXECUTION-CONTEXT.md`
4. `.ai/brain/45-integrations/PORTABLE-HOST-INTEGRATION.md`
5. `.ai/knowledge/domain/PORTABLE-HOST-USE-CASES.md`
6. `.ai/scrum/views/PRIORITIES.md`

## Skills

- `sisad-portable-host-integration`
- `sisad-public-api-compatibility`
- `sisad-user-runtime`
- `runtime-access-authority`
- `multiuser-form-release`
- `sisad-snapshot-compatibility`
- `sisad-security-privacy`

## Forbidden

- importing a concrete consumer's business model into the reusable;
- consumer-specific routes/endpoints/DTOs in core contracts;
- deep imports from private runtime/UI internals;
- creating a second Form implementation per host workflow shape.
