# Config/runtime boundary

JSON contiene comportamiento/capabilities. Estado vivo (`template`, `inputs`, recipients/documents activos, IDs activos) vive en definition/state/resources. Funciones y secretos viven en handlers/providers, nunca en JSON.

<!-- SISAD-PDFME-PORTABLE-INTEGRATION:.ai/brain/20-contracts/configuration/CONFIG-RUNTIME-BOUNDARY.md:START -->
## External integration configuration

Separar:

- configuración JSON portable: sourceKey, bindings, mappings, paging, search, capability;
- runtime resource: cliente HTTP, resolver de headers, provider, font loader;
- secreto host: token/cookie/key.

Los dos últimos no se serializan en template/snapshot.

Una capability deshabilitada impide ejecutar el DataSource/Action/Signature provider aunque exista
configuración declarativa.
<!-- SISAD-PDFME-PORTABLE-INTEGRATION:.ai/brain/20-contracts/configuration/CONFIG-RUNTIME-BOUNDARY.md:END -->
