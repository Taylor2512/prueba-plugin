# Signature contract

`draw`, `image` y P12/local son capacidades nativas/reutilizables. Providers externos implementan un contrato genérico. Secretos/credenciales nunca entran en schema, config JSON o snapshot. La firma digital PDF real no debe simularse con una imagen.

<!-- SISAD-PDFME-PORTABLE-INTEGRATION:.ai/brain/20-contracts/signing/SIGNATURE-CONTRACT.md:START -->
## External signature execution

SignatureProvider puede reutilizar el IntegrationRuntime/HttpClientAdapter para transporte, pero
mantiene lifecycle de firma especializado.

OneShot o cualquier proveedor futuro es un adapter/provider externo; no debe existir lógica
hardcodeada por nombre de proveedor en schemas.

Authorization/credentials se inyectan desde el host y no se persisten.
<!-- SISAD-PDFME-PORTABLE-INTEGRATION:.ai/brain/20-contracts/signing/SIGNATURE-CONTRACT.md:END -->
