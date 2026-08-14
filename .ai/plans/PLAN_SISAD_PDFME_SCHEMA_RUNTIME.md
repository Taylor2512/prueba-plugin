# Plan — dynamic schema runtime

Derivar un manifest del registry vivo. Cada family aporta codec/validation/capabilities.
Construir un harness `describe.each(registryDerivedCases)` y una matriz pairwise. Resolver
bugs en autoridad común antes de parchear plugins. Un nuevo schema debería requerir:
plugin + manifest/capabilities + codec/validation + tests, no cambios dispersos en Form,
Viewer, Snapshot, Completion y Generator.
