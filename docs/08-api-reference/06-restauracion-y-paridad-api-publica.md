# Restauración y paridad de la API pública

Este documento resume las capacidades eliminadas, aisladas o declaradas sin ejecución. La evidencia completa vive en `reports/restoration/`.

# Paridad de API pública

## Contrato actual que debe corregirse

| Método/área | Tipo público | Implementación actual | Acción |
|---|---|---|---|
| addSchema | Declarado | Stub, devuelve string vacío | Implementar con schemaOperations |
| updateSchema | Declarado | Stub | Implementar |
| removeSchemas | Declarado | Stub | Implementar |
| duplicateSchemas | Declarado | Stub | Implementar |
| setActiveDocument | Declarado | Stub | Implementar con documentController |
| validate | Declarado | Devuelve null | Implementar ValidationResult |
| fitToPage | No declarado | Implementación condicional | Declarar y conectar bridge |
| fitToWidth | No declarado | Implementación condicional | Declarar y conectar bridge |
| setPage | No declarado | Implementación condicional | Declarar y conectar bridge |
| addSchemaByType | No declarado | Implementación condicional | Declarar o fusionar con addSchema |
| onReady | Declarado | Sin productor público completo | Emitir |
| onSelectionChange | Declarado | Sin productor público completo | Emitir |
| onDocumentChange | Declarado | Sin productor público completo | Emitir |
| onSignatureRequest | Declarado | Sin productor público completo | Emitir |

## Regla

Una API pública solo puede estar en uno de estos estados:

1. implementada y probada;
2. opcional y consultable por capability state;
3. deprecada con migración;
4. eliminada en versión mayor.

Nunca debe responder como éxito cuando no hizo nada.
