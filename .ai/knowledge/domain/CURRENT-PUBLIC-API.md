# API pública de configuración — estado tras CONFIG-001

Barrel `@/sisad-pdfme/config` y `@/sisad-pdfme/integration` (main). Tras CONFIG-001 el host tipa/consume sin imports profundos.

**Valores:** `createSisadPdfmeConfig`, `defaultSisadPdfmeConfig`, `resolveSisadPdfmeConfig`.

**Tipos:** `SisadPdfmeGlobalConfig`, `ResolvedSisadPdfmeConfig`, `SisadPdfmeController`, `SisadPdfmeDocument`, `SisadPdfmeEventName`, `SisadPdfmeEventHandlers`, `SisadPdfmeVisibilityConfig`, `SisadPdfmeUiConfig`, `SisadPdfmeUiClassNamesConfig`, `SisadPdfme{Recipients,Documents,Persistence,SignatureProvider}Adapter`, `SisadPdfmeSignatureProvider`, `SisadPdfmeRecipient`, `SisadPdfmeProviderProps`, `SisadPdfmeProviderValue`.

**Añadido en CONFIG-003:** `configVersion`, `SisadPdfmeConfigMigrationResult`, `migrateSisadPdfmeConfig`, `validateSisadPdfmeConfig`, `SisadPdfmeConfigValidationIssue`.

**Añadido en CONFIG-006/007:** `createSisadPdfmeConfigService`, `SisadPdfmeConfigService`, `SisadPdfmeFeatureState`, `SisadPdfmeActionState`, selectores (`select*`), `classifyConfigChangeImpact`.

Pendiente: no re-exportar internals de UI/Canvas (objetivo plan §20).
