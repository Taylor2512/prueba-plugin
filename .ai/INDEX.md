# AI Context Index — `sisad-pdfme`

Este archivo es el punto de entrada principal para cualquier asistente IA.

## Fuente de verdad

La carpeta `.ai/` contiene:

- reglas globales;
- contexto estable;
- arquitectura IA;
- agentes;
- skills;
- prompts;
- instrucciones;
- templates.

## Lectura mínima obligatoria

1. `.ai/rules/global-rules.md`
2. `.ai/context/project-overview.md`
3. `.ai/context/code-map.md`
4. `.ai/context/recipient-transform-context.md`
5. `.ai/architecture/assistant-architecture.md`
6. `.ai/architecture/agent-routing.md`

## Prompts prioritarios para esta entrega

1. `.ai/prompts/recipient-transform-master-plan.prompt.md`
2. `.ai/prompts/enforce-recipient-colors-and-icon-sync.prompt.md`
3. `.ai/prompts/add-recipient-color-playwright-tests.prompt.md`
4. `.ai/prompts/stabilize-schema-resize-rotation.prompt.md`
5. `.ai/prompts/fix-results-from-tests-recipient-transform.prompt.md`

## Contratos implementados (mayo 2026)

| Contrato | Módulo | Estado |
|----------|--------|--------|
| `resolveRecipientColor` | `shared/recipientColor.ts` | ✅ implementado + 22 tests |
| `resolveAllRecipientColors` | `shared/recipientColor.ts` | ✅ implementado |
| `PluginIcon.activeRecipientColor` | `Designer/PluginIcon.tsx` | ✅ prop + data attrs |
| `data-recipient-color` en chips | `PageHeader.jsx` | ✅ atributo estable |
| `data-schema-owner-id/color` en canvas | `Renderer.tsx` | ✅ atributos estables |
| `decorateCollaborationUsers` unicidad | `collaborationAppearance.js` | ✅ paleta sin colisión |
| Tests Playwright color | `recipient-colors.spec.ts` | ✅ 5 scenarios |
| Tests Playwright transform | `schema-transform.spec.ts` | ✅ 8 scenarios |

## Sincronización

Si cambias prompts o instructions:

```bash
node scripts/ai/sync-ai-adapters.js
node scripts/ai/check-ai-workspace.js
node scripts/ai/generate-ai-manifest.js
```
