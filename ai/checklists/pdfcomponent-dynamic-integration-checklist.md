# Checklist — integración dinámica `src/features/pdfcomponent`

## Frontera con core

- [ ] No importar `DesignerEngineBuilder` desde ejemplos.
- [ ] No importar `usePdfmeRuntimeInstance` desde ejemplos.
- [ ] No construir `designerEngineOptions` manualmente en `PdfmeLabPage.jsx`.
- [ ] No construir `commonOptions.collaboration` manualmente en host.
- [ ] No decorar template con collaboration fuera del core/wrapper salvo fixture legacy explícito.

## Datos únicos

- [ ] Recipients existen solo en `example.recipients` o `props.recipients`.
- [ ] Active recipient existe solo como `activeRecipientId`.
- [ ] Documents existen solo en `example.documents` o `props.documents`.
- [ ] Signature providers existen solo en `config.signatures.providers`.
- [ ] Visibility/actions existen solo en `config.visibility` + action registry.

## Acciones

- [ ] Cada botón visible tiene `id`, `label`, `enabled`, `disabledReason`, `run`, `testId`.
- [ ] `CompactControls` renderiza acciones, no las inventa.
- [ ] Las acciones de generator/converter viven en `labArtifactService`.
- [ ] Las acciones del designer usan controller público.

## Pruebas mínimas

- [ ] Cambiar recipient actual actualiza Designer/Form/Viewer sin doble registro.
- [ ] Multi-document routing usa `documents` normalizados una sola vez.
- [ ] Generator/converter funcionan leyendo template/inputs desde el hook.
- [ ] Export bundle conserva recipients/documents/config sin duplicarlos.
