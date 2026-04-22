# PDFME Extension Instructions

## Objetivo
Extender sisad-pdfme modificado sin convertir la integración en una caja negra frágil.

## Reglas
- envolver APIs internas detrás de adaptadores locales
- no acoplar la app a detalles de implementación inestables
- centralizar registro de toolbar configs
- centralizar integración de plugins
- documentar diferencias respecto a sisad-pdfme upstream

## Debes promover
- createRuntimeApi
- adapters
- event maps
- selection helpers
- page helpers
- schema operations desacopladas

