# Prompt: dividir hook monolítico

Actúa como especialista en arquitectura React.

## Tarea
Tomar un hook grande que mezcla runtime de editor, blobs, conversiones, UI mode y acciones, y dividirlo en hooks especializados.

## Meta
Extraer al menos estas responsabilidades:
- usePdfmeEditorRuntime
- usePdfmeConversionLab
- usePdfmeUiState
- useBlobResourceManager

## Requisitos
- preservar funcionalidad
- reducir side effects implícitos
- eliminar parches tipo setTimeout cuando sea posible
- usar nombres explícitos
- documentar responsabilidades de cada hook

