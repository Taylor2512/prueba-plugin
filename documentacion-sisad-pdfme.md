# Documentación Markdown Unificada

**Carpeta origen:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin`  
**Fecha de generación:** `2026-06-01T20:36:35.433Z`  
**Total de archivos incluidos:** `361`  
**Extensiones incluidas:** `.md`

---

# Tabla de contenidos

0001. [AGENTS.md](#archivo-0001)
0002. [CLAUDE.md](#archivo-0002)
0003. [CODEX.md](#archivo-0003)
0004. [COPILOT.md](#archivo-0004)
0005. [CURRENT_STATE.md](#archivo-0005)
0006. [GEMINI.md](#archivo-0006)
0007. [GUARDRAILS.md](#archivo-0007)
0008. [INSTALL_MAC.md](#archivo-0008)
0009. [MANIFEST.md](#archivo-0009)
0010. [MIGRATION_GUIDE.md](#archivo-0010)
0011. [PACKAGE_SUMMARY.md](#archivo-0011)
0012. [package-scripts-sugeridos.md](#archivo-0012)
0013. [README.md](#archivo-0013)
0014. [.ai/agent-loop.md](#archivo-0014)
0015. [.ai/context-map.md](#archivo-0015)
0016. [.ai/INDEX.md](#archivo-0016)
0017. [.ai/README.md](#archivo-0017)
0018. [.claude/README.md](#archivo-0018)
0019. [.codex/README.md](#archivo-0019)
0020. [.gemini/README.md](#archivo-0020)
0021. [.github/copilot-instructions.md](#archivo-0021)
0022. [debug/breakpoints-criticos.md](#archivo-0022)
0023. [debug/hardtrace-playbook.md](#archivo-0023)
0024. [handoff/plan-ejecucion-fases.md](#archivo-0024)
0025. [handoff/README.md](#archivo-0025)
0026. [handoff/riesgos-residuales.md](#archivo-0026)
0027. [handoff/session-handoff.md](#archivo-0027)
0028. [handoff/tickets-sugeridos.md](#archivo-0028)
0029. [tests/matriz-pruebas-regresion-designer.md](#archivo-0029)
0030. [tests/matriz-pruebas-regresion-externalforms.md](#archivo-0030)
0031. [tests/plan-playwright.md](#archivo-0031)
0032. [tests/plan-vitest-unitario.md](#archivo-0032)
0033. [tests/README.md](#archivo-0033)
0034. [tests/testing-gaps.md](#archivo-0034)
0035. [.ai/agents/canvas-runtime-agent.md](#archivo-0035)
0036. [.ai/agents/collaboration-lock-agent.md](#archivo-0036)
0037. [.ai/agents/command-bus-agent.md](#archivo-0037)
0038. [.ai/agents/content-custom-form-agent.md](#archivo-0038)
0039. [.ai/agents/css-agent.md](#archivo-0039)
0040. [.ai/agents/debugging-agent.md](#archivo-0040)
0041. [.ai/agents/designer-engine-agent.md](#archivo-0041)
0042. [.ai/agents/docs-governance-agent.md](#archivo-0042)
0043. [.ai/agents/external-forms-agent.md](#archivo-0043)
0044. [.ai/agents/frontend-architect-agent.md](#archivo-0044)
0045. [.ai/agents/generator-converter-agent.md](#archivo-0045)
0046. [.ai/agents/left-sidebar-catalog-agent.md](#archivo-0046)
0047. [.ai/agents/legacy-cleanup-agent.md](#archivo-0047)
0048. [.ai/agents/moveable-selecto-agent.md](#archivo-0048)
0049. [.ai/agents/provider-sync-agent.md](#archivo-0049)
0050. [.ai/agents/quality-agent.md](#archivo-0050)
0051. [.ai/agents/recipient-color-agent.md](#archivo-0051)
0052. [.ai/agents/registry.md](#archivo-0052)
0053. [.ai/agents/release-agent.md](#archivo-0053)
0054. [.ai/agents/right-sidebar-inspector-agent.md](#archivo-0054)
0055. [.ai/agents/root-orchestrator-agent.md](#archivo-0055)
0056. [.ai/agents/schema-icon-sync-agent.md](#archivo-0056)
0057. [.ai/agents/schema-registry-agent.md](#archivo-0057)
0058. [.ai/agents/security-agent.md](#archivo-0058)
0059. [.ai/agents/sisad-pdfme-runtime-agent.md](#archivo-0059)
0060. [.ai/agents/snapshot-agent.md](#archivo-0060)
0061. [.ai/agents/testing-regression-agent.md](#archivo-0061)
0062. [.ai/agents/token-economy-agent.md](#archivo-0062)
0063. [.ai/agents/ui-ux-agent.md](#archivo-0063)
0064. [.ai/architecture/agent-routing.md](#archivo-0064)
0065. [.ai/architecture/assistant-architecture.md](#archivo-0065)
0066. [.ai/architecture/context-loading-ladder.md](#archivo-0066)
0067. [.ai/architecture/fork-safe-evolution.md](#archivo-0067)
0068. [.ai/architecture/module-boundaries.md](#archivo-0068)
0069. [.ai/architecture/provider-model.md](#archivo-0069)
0070. [.ai/architecture/quality-gate-model.md](#archivo-0070)
0071. [.ai/architecture/runtime-ownership.md](#archivo-0071)
0072. [.ai/checklists/before-change.md](#archivo-0072)
0073. [.ai/checklists/before-merge.md](#archivo-0073)
0074. [.ai/checklists/css-boundaries.md](#archivo-0074)
0075. [.ai/checklists/external-forms.md](#archivo-0075)
0076. [.ai/checklists/provider-sync.md](#archivo-0076)
0077. [.ai/checklists/quality-gates.md](#archivo-0077)
0078. [.ai/checklists/recipient-color.md](#archivo-0078)
0079. [.ai/checklists/release.md](#archivo-0079)
0080. [.ai/checklists/schema-transform.md](#archivo-0080)
0081. [.ai/checklists/snapshot-roundtrip.md](#archivo-0081)
0082. [.ai/context/canvas-coordinates-context.md](#archivo-0082)
0083. [.ai/context/code-map.md](#archivo-0083)
0084. [.ai/context/collaboration-locks-context.md](#archivo-0084)
0085. [.ai/context/command-bus-context.md](#archivo-0085)
0086. [.ai/context/content-custom-form-integration-context.md](#archivo-0086)
0087. [.ai/context/css-design-system-context.md](#archivo-0087)
0088. [.ai/context/css-map.md](#archivo-0088)
0089. [.ai/context/designer-engine-context.md](#archivo-0089)
0090. [.ai/context/docs-map.md](#archivo-0090)
0091. [.ai/context/external-forms-runner-context.md](#archivo-0091)
0092. [.ai/context/generator-converter-context.md](#archivo-0092)
0093. [.ai/context/integration-host-boundaries-context.md](#archivo-0093)
0094. [.ai/context/legacy-cleanup-context.md](#archivo-0094)
0095. [.ai/context/module-map.md](#archivo-0095)
0096. [.ai/context/moveable-selecto-context.md](#archivo-0096)
0097. [.ai/context/project-overview.md](#archivo-0097)
0098. [.ai/context/provider-compatibility-context.md](#archivo-0098)
0099. [.ai/context/recipient-color-context.md](#archivo-0099)
0100. [.ai/context/schema-icon-sync-context.md](#archivo-0100)
0101. [.ai/context/schema-owner-persistence-context.md](#archivo-0101)
0102. [.ai/context/schema-registry-context.md](#archivo-0102)
0103. [.ai/context/security-privacy-context.md](#archivo-0103)
0104. [.ai/context/selection-shortcuts-context.md](#archivo-0104)
0105. [.ai/context/sidebars-inspector-context.md](#archivo-0105)
0106. [.ai/context/sisad-pdfme-runtime-context.md](#archivo-0106)
0107. [.ai/context/snapshot-contract-context.md](#archivo-0107)
0108. [.ai/context/tests-quality-context.md](#archivo-0108)
0109. [.ai/context/transform-controls-context.md](#archivo-0109)
0110. [.ai/context/ui-ux-compact-context.md](#archivo-0110)
0111. [.ai/memory/decisions.md](#archivo-0111)
0112. [.ai/memory/incidents.md](#archivo-0112)
0113. [.ai/memory/project-memory.md](#archivo-0113)
0114. [.ai/memory/session-handoff.md](#archivo-0114)
0115. [.ai/memory/update-protocol.md](#archivo-0115)
0116. [.ai/prompts/audit-css-boundaries.prompt.md](#archivo-0116)
0117. [.ai/prompts/audit-legacy-runtime-reduction.prompt.md](#archivo-0117)
0118. [.ai/prompts/audit-platform-boundaries.prompt.md](#archivo-0118)
0119. [.ai/prompts/build-regression-test-matrix.prompt.md](#archivo-0119)
0120. [.ai/prompts/create-playwright-canvas-scenarios.prompt.md](#archivo-0120)
0121. [.ai/prompts/create-test-fixtures-multi-recipient-colors.prompt.md](#archivo-0121)
0122. [.ai/prompts/fix-keyboard-shortcut-collisions.prompt.md](#archivo-0122)
0123. [.ai/prompts/generate-final-implementation-report.prompt.md](#archivo-0123)
0124. [.ai/prompts/harden-moveable-selecto-guards.prompt.md](#archivo-0124)
0125. [.ai/prompts/implement-unique-recipient-palette.prompt.md](#archivo-0125)
0126. [.ai/prompts/INDEX.md](#archivo-0126)
0127. [.ai/prompts/inspect-failed-test-results.prompt.md](#archivo-0127)
0128. [.ai/prompts/normalize-selection-transform-state-machine.prompt.md](#archivo-0128)
0129. [.ai/prompts/preserve-owner-color-on-existing-schemas.prompt.md](#archivo-0129)
0130. [.ai/prompts/protect-inline-edit-from-transform.prompt.md](#archivo-0130)
0131. [.ai/prompts/recipient-transform-master-plan.prompt.md](#archivo-0131)
0132. [.ai/prompts/refactor-left-rail-catalog.prompt.md](#archivo-0132)
0133. [.ai/prompts/refactor-right-inspector-layout.prompt.md](#archivo-0133)
0134. [.ai/prompts/refactor-transform-geometry-utils.prompt.md](#archivo-0134)
0135. [.ai/prompts/repair-contentcustomform-integration.prompt.md](#archivo-0135)
0136. [.ai/prompts/repair-external-forms-runner.prompt.md](#archivo-0136)
0137. [.ai/prompts/repair-floating-toolbar-position.prompt.md](#archivo-0137)
0138. [.ai/prompts/repair-recipient-color-sync.prompt.md](#archivo-0138)
0139. [.ai/prompts/repair-schema-icon-color-sync.prompt.md](#archivo-0139)
0140. [.ai/prompts/repair-sidebars-inspector.prompt.md](#archivo-0140)
0141. [.ai/prompts/repair-snapshot-roundtrip.prompt.md](#archivo-0141)
0142. [.ai/prompts/repair-transform-collisions.prompt.md](#archivo-0142)
0143. [.ai/prompts/review-css-for-transform-handle-breaks.prompt.md](#archivo-0143)
0144. [.ai/prompts/stabilize-designer-engine-api.prompt.md](#archivo-0144)
0145. [.ai/prompts/stabilize-schema-resize-rotation.prompt.md](#archivo-0145)
0146. [.ai/prompts/standardize-data-attributes-for-colors.prompt.md](#archivo-0146)
0147. [.ai/prompts/unify-css-architecture.prompt.md](#archivo-0147)
0148. [.ai/prompts/update-docs-recipient-transform.prompt.md](#archivo-0148)
0149. [.ai/prompts/validate-ci-flow-recipient-transform.prompt.md](#archivo-0149)
0150. [.ai/providers/claude-adapter.md](#archivo-0150)
0151. [.ai/providers/codex-adapter.md](#archivo-0151)
0152. [.ai/providers/gemini-adapter.md](#archivo-0152)
0153. [.ai/providers/generic-provider-adapter.md](#archivo-0153)
0154. [.ai/providers/github-copilot-adapter.md](#archivo-0154)
0155. [.ai/providers/provider-contract.md](#archivo-0155)
0156. [.ai/rules/collaboration-lock-rules.md](#archivo-0156)
0157. [.ai/rules/command-bus-rules.md](#archivo-0157)
0158. [.ai/rules/context-loading-ladder-rules.md](#archivo-0158)
0159. [.ai/rules/css-boundary-rules.md](#archivo-0159)
0160. [.ai/rules/docs-governance-rules.md](#archivo-0160)
0161. [.ai/rules/external-forms-runner-rules.md](#archivo-0161)
0162. [.ai/rules/generator-converter-rules.md](#archivo-0162)
0163. [.ai/rules/global-rules.md](#archivo-0163)
0164. [.ai/rules/host-runtime-boundary-rules.md](#archivo-0164)
0165. [.ai/rules/legacy-reduction-rules.md](#archivo-0165)
0166. [.ai/rules/moveable-selecto-rules.md](#archivo-0166)
0167. [.ai/rules/provider-adapter-rules.md](#archivo-0167)
0168. [.ai/rules/public-api-rules.md](#archivo-0168)
0169. [.ai/rules/schema-icon-color-rules.md](#archivo-0169)
0170. [.ai/rules/schema-ownership-rules.md](#archivo-0170)
0171. [.ai/rules/security-privacy-rules.md](#archivo-0171)
0172. [.ai/rules/sidebars-inspector-rules.md](#archivo-0172)
0173. [.ai/rules/snapshot-contract-rules.md](#archivo-0173)
0174. [.ai/rules/testing-quality-rules.md](#archivo-0174)
0175. [.ai/rules/token-budget-rules.md](#archivo-0175)
0176. [.ai/rules/transform-interaction-rules.md](#archivo-0176)
0177. [.ai/subagents/active-recipient-color-subagent.md](#archivo-0177)
0178. [.ai/subagents/assignments-filtering-subagent.md](#archivo-0178)
0179. [.ai/subagents/canvas-coordinate-subagent.md](#archivo-0179)
0180. [.ai/subagents/collaboration-locks-subagent.md](#archivo-0180)
0181. [.ai/subagents/command-bus-transform-subagent.md](#archivo-0181)
0182. [.ai/subagents/comments-overlay-subagent.md](#archivo-0182)
0183. [.ai/subagents/context-menu-guard-subagent.md](#archivo-0183)
0184. [.ai/subagents/converter-browser-node-subagent.md](#archivo-0184)
0185. [.ai/subagents/css-token-subagent.md](#archivo-0185)
0186. [.ai/subagents/css-transform-handle-subagent.md](#archivo-0186)
0187. [.ai/subagents/custom-plugin-contract-subagent.md](#archivo-0187)
0188. [.ai/subagents/detail-widgets-subagent.md](#archivo-0188)
0189. [.ai/subagents/docs-migration-subagent.md](#archivo-0189)
0190. [.ai/subagents/external-form-runner-subagent.md](#archivo-0190)
0191. [.ai/subagents/floating-toolbar-position-subagent.md](#archivo-0191)
0192. [.ai/subagents/form-viewer-parity-subagent.md](#archivo-0192)
0193. [.ai/subagents/generator-helper-subagent.md](#archivo-0193)
0194. [.ai/subagents/inline-edit-guard-subagent.md](#archivo-0194)
0195. [.ai/subagents/keyboard-shortcut-guard-subagent.md](#archivo-0195)
0196. [.ai/subagents/left-sidebar-catalog-color-subagent.md](#archivo-0196)
0197. [.ai/subagents/legacy-wrapper-subagent.md](#archivo-0197)
0198. [.ai/subagents/moveable-resize-subagent.md](#archivo-0198)
0199. [.ai/subagents/moveable-rotation-subagent.md](#archivo-0199)
0200. [.ai/subagents/overlay-manager-subagent.md](#archivo-0200)
0201. [.ai/subagents/owner-color-persistence-subagent.md](#archivo-0201)
0202. [.ai/subagents/paper-scale-layer-subagent.md](#archivo-0202)
0203. [.ai/subagents/playwright-canvas-subagent.md](#archivo-0203)
0204. [.ai/subagents/playwright-recipient-color-subagent.md](#archivo-0204)
0205. [.ai/subagents/plugin-icon-fallback-subagent.md](#archivo-0205)
0206. [.ai/subagents/prompt-catalog-subagent.md](#archivo-0206)
0207. [.ai/subagents/provider-drift-subagent.md](#archivo-0207)
0208. [.ai/subagents/public-api-surface-subagent.md](#archivo-0208)
0209. [.ai/subagents/right-inspector-transform-subagent.md](#archivo-0209)
0210. [.ai/subagents/schema-registry-extension-subagent.md](#archivo-0210)
0211. [.ai/subagents/schema-tone-resolution-subagent.md](#archivo-0211)
0212. [.ai/subagents/selecto-lifecycle-subagent.md](#archivo-0212)
0213. [.ai/subagents/snapshot-legacy-compat-subagent.md](#archivo-0213)
0214. [.ai/subagents/snapshot-roundtrip-subagent.md](#archivo-0214)
0215. [.ai/subagents/token-budget-subagent.md](#archivo-0215)
0216. [.ai/subagents/unique-palette-subagent.md](#archivo-0216)
0217. [.ai/subagents/visual-regression-css-subagent.md](#archivo-0217)
0218. [.ai/subagents/vitest-contract-subagent.md](#archivo-0218)
0219. [.ai/templates/agent-report.md](#archivo-0219)
0220. [.ai/templates/architecture-decision-record.md](#archivo-0220)
0221. [.ai/templates/bug-ticket.md](#archivo-0221)
0222. [.ai/templates/handoff.md](#archivo-0222)
0223. [.ai/templates/qa-report.md](#archivo-0223)
0224. [.ai/templates/refactor-report.md](#archivo-0224)
0225. [.ai/templates/test-failure-analysis.md](#archivo-0225)
0226. [.claude/commands/audit-css-boundaries.md](#archivo-0226)
0227. [.claude/commands/local-selective-scan.md](#archivo-0227)
0228. [.claude/commands/repair-recipient-color.md](#archivo-0228)
0229. [.claude/commands/repair-snapshot-roundtrip.md](#archivo-0229)
0230. [.claude/commands/repair-transform-collisions.md](#archivo-0230)
0231. [.claude/commands/startup.md](#archivo-0231)
0232. [.claude/commands/update-memory.md](#archivo-0232)
0233. [.codex/tasks/atomic-fix.md](#archivo-0233)
0234. [.codex/tasks/legacy-cleanup-step.md](#archivo-0234)
0235. [.codex/tasks/quality-gates.md](#archivo-0235)
0236. [.codex/tasks/recipient-transform-implementation.md](#archivo-0236)
0237. [.codex/tasks/refactor-safe.md](#archivo-0237)
0238. [.gemini/prompts/audit-architecture.md](#archivo-0238)
0239. [.gemini/prompts/audit-docs-vs-code.md](#archivo-0239)
0240. [.gemini/prompts/audit-recipient-transform.md](#archivo-0240)
0241. [.gemini/prompts/audit-token-budget.md](#archivo-0241)
0242. [.github/instructions/architecture-boundaries.instructions.md](#archivo-0242)
0243. [.github/instructions/canvas-transform-safety.instructions.md](#archivo-0243)
0244. [.github/instructions/css-boundaries.instructions.md](#archivo-0244)
0245. [.github/instructions/external-forms-runner.instructions.md](#archivo-0245)
0246. [.github/instructions/recipient-color-system.instructions.md](#archivo-0246)
0247. [.github/instructions/snapshot-contract.instructions.md](#archivo-0247)
0248. [.github/instructions/testing-quality.instructions.md](#archivo-0248)
0249. [.github/prompts/audit-css-boundaries.prompt.md](#archivo-0249)
0250. [.github/prompts/audit-legacy-runtime-reduction.prompt.md](#archivo-0250)
0251. [.github/prompts/build-regression-test-matrix.prompt.md](#archivo-0251)
0252. [.github/prompts/fix-keyboard-shortcut-collisions.prompt.md](#archivo-0252)
0253. [.github/prompts/harden-moveable-selecto-guards.prompt.md](#archivo-0253)
0254. [.github/prompts/implement-unique-recipient-palette.prompt.md](#archivo-0254)
0255. [.github/prompts/inspect-failed-test-results.prompt.md](#archivo-0255)
0256. [.github/prompts/preserve-owner-color-on-existing-schemas.prompt.md](#archivo-0256)
0257. [.github/prompts/protect-inline-edit-from-transform.prompt.md](#archivo-0257)
0258. [.github/prompts/recipient-transform-master-plan.prompt.md](#archivo-0258)
0259. [.github/prompts/repair-external-forms-runner.prompt.md](#archivo-0259)
0260. [.github/prompts/repair-floating-toolbar-position.prompt.md](#archivo-0260)
0261. [.github/prompts/repair-recipient-color-sync.prompt.md](#archivo-0261)
0262. [.github/prompts/repair-schema-icon-color-sync.prompt.md](#archivo-0262)
0263. [.github/prompts/repair-snapshot-roundtrip.prompt.md](#archivo-0263)
0264. [.github/prompts/repair-transform-collisions.prompt.md](#archivo-0264)
0265. [.github/prompts/stabilize-designer-engine-api.prompt.md](#archivo-0265)
0266. [.github/prompts/stabilize-schema-resize-rotation.prompt.md](#archivo-0266)
0267. [.github/prompts/unify-css-architecture.prompt.md](#archivo-0267)
0268. [.github/prompts/update-docs-recipient-transform.prompt.md](#archivo-0268)
0269. [docs/00-indice/README.md](#archivo-0269)
0270. [docs/01-producto-y-vision/01-vision-producto.md](#archivo-0270)
0271. [docs/01-producto-y-vision/02-actores.md](#archivo-0271)
0272. [docs/01-producto-y-vision/03-objetivos.md](#archivo-0272)
0273. [docs/01-producto-y-vision/04-no-objetivos.md](#archivo-0273)
0274. [docs/02-mapa-modulos/01-inventario-codigo.md](#archivo-0274)
0275. [docs/02-mapa-modulos/02-ui-designer-form-viewer.md](#archivo-0275)
0276. [docs/02-mapa-modulos/03-schemas-y-plugin-registry.md](#archivo-0276)
0277. [docs/02-mapa-modulos/04-generator-converter-pdflib.md](#archivo-0277)
0278. [docs/02-mapa-modulos/05-tests-playwright-vitest.md](#archivo-0278)
0279. [docs/03-arquitectura/01-boundaries-host-runtime.md](#archivo-0279)
0280. [docs/03-arquitectura/02-runtime-visual.md](#archivo-0280)
0281. [docs/03-arquitectura/03-command-bus-events.md](#archivo-0281)
0282. [docs/03-arquitectura/04-snapshot-contract.md](#archivo-0282)
0283. [docs/03-arquitectura/05-external-forms-contract.md](#archivo-0283)
0284. [docs/03-arquitectura/06-collaboration-locks.md](#archivo-0284)
0285. [docs/03-arquitectura/07-public-api.md](#archivo-0285)
0286. [docs/03-arquitectura/08-fork-safe-evolution.md](#archivo-0286)
0287. [docs/04-recipient-transform/01-recipient-color-behavior.md](#archivo-0287)
0288. [docs/04-recipient-transform/02-schema-icon-color-sync.md](#archivo-0288)
0289. [docs/04-recipient-transform/03-owner-color-persistence.md](#archivo-0289)
0290. [docs/04-recipient-transform/04-transform-state-machine.md](#archivo-0290)
0291. [docs/04-recipient-transform/05-moveable-selecto.md](#archivo-0291)
0292. [docs/04-recipient-transform/06-shortcuts-and-inline-edit.md](#archivo-0292)
0293. [docs/04-recipient-transform/07-accessibility-colors.md](#archivo-0293)
0294. [docs/05-ui-ux/01-left-sidebar-catalog.md](#archivo-0294)
0295. [docs/05-ui-ux/02-right-sidebar-inspector.md](#archivo-0295)
0296. [docs/05-ui-ux/03-floating-toolbar.md](#archivo-0296)
0297. [docs/05-ui-ux/04-canvas-overlays.md](#archivo-0297)
0298. [docs/05-ui-ux/05-compact-header-host.md](#archivo-0298)
0299. [docs/05-ui-ux/06-responsive.md](#archivo-0299)
0300. [docs/06-css/01-css-boundaries.md](#archivo-0300)
0301. [docs/06-css/02-token-system.md](#archivo-0301)
0302. [docs/06-css/03-transform-handle-safety.md](#archivo-0302)
0303. [docs/06-css/04-visual-regression.md](#archivo-0303)
0304. [docs/07-calidad/01-comandos-validacion.md](#archivo-0304)
0305. [docs/07-calidad/02-matriz-regresion.md](#archivo-0305)
0306. [docs/07-calidad/03-testing-gaps.md](#archivo-0306)
0307. [docs/07-calidad/04-test-results-forensics.md](#archivo-0307)
0308. [docs/08-ia-agentes/01-arquitectura-asistente.md](#archivo-0308)
0309. [docs/08-ia-agentes/02-catalogo-agentes.md](#archivo-0309)
0310. [docs/08-ia-agentes/03-catalogo-prompts.md](#archivo-0310)
0311. [docs/08-ia-agentes/04-economia-tokens.md](#archivo-0311)
0312. [docs/08-ia-agentes/05-providers.md](#archivo-0312)
0313. [docs/09-operacion-debug/01-breakpoints-criticos.md](#archivo-0313)
0314. [docs/09-operacion-debug/02-hardtrace-playbook.md](#archivo-0314)
0315. [docs/09-operacion-debug/03-troubleshooting.md](#archivo-0315)
0316. [docs/10-handoff/01-handoff-sesion.md](#archivo-0316)
0317. [docs/10-handoff/02-plan-fases.md](#archivo-0317)
0318. [docs/10-handoff/03-tickets-sugeridos.md](#archivo-0318)
0319. [docs/99-archivo/README.md](#archivo-0319)
0320. [reports/current-snapshot/analysis-summary.md](#archivo-0320)
0321. [reports/current-snapshot/css-summary.md](#archivo-0321)
0322. [reports/current-snapshot/docs-summary.md](#archivo-0322)
0323. [reports/current-snapshot/module-inventory.md](#archivo-0323)
0324. [reports/current-snapshot/risk-summary.md](#archivo-0324)
0325. [test-results/pdfme-editor-pdfme-editor--485d3--position-and-supports-undo-chromium/error-context.md](#archivo-0325)
0326. [.ai/skills/active-recipient-color-contract/SKILL.md](#archivo-0326)
0327. [.ai/skills/canvas-geometry-scaling/SKILL.md](#archivo-0327)
0328. [.ai/skills/command-bus-transform-actions/SKILL.md](#archivo-0328)
0329. [.ai/skills/component-composition/SKILL.md](#archivo-0329)
0330. [.ai/skills/context-budget/SKILL.md](#archivo-0330)
0331. [.ai/skills/context-menu-transform-guard/SKILL.md](#archivo-0331)
0332. [.ai/skills/css-layering-and-overrides/SKILL.md](#archivo-0332)
0333. [.ai/skills/css-recipient-color-tokens/SKILL.md](#archivo-0333)
0334. [.ai/skills/css-transform-handle-safety/SKILL.md](#archivo-0334)
0335. [.ai/skills/custom-schema-contracts/SKILL.md](#archivo-0335)
0336. [.ai/skills/documentation-traceability/SKILL.md](#archivo-0336)
0337. [.ai/skills/external-forms-runtime/SKILL.md](#archivo-0337)
0338. [.ai/skills/floating-toolbar-transform-position/SKILL.md](#archivo-0338)
0339. [.ai/skills/fork-safe-pdfme-evolution/SKILL.md](#archivo-0339)
0340. [.ai/skills/form-viewer-generator-parity/SKILL.md](#archivo-0340)
0341. [.ai/skills/inline-edit-transform-guard/SKILL.md](#archivo-0341)
0342. [.ai/skills/keyboard-shortcut-transform-safety/SKILL.md](#archivo-0342)
0343. [.ai/skills/legacy-runtime-reduction/SKILL.md](#archivo-0343)
0344. [.ai/skills/moveable-selecto-integration/SKILL.md](#archivo-0344)
0345. [.ai/skills/moveable-selecto-resize-rotate/SKILL.md](#archivo-0345)
0346. [.ai/skills/playwright-canvas-diagnostics/SKILL.md](#archivo-0346)
0347. [.ai/skills/playwright-recipient-color-regression/SKILL.md](#archivo-0347)
0348. [.ai/skills/playwright-transform-regression/SKILL.md](#archivo-0348)
0349. [.ai/skills/public-api-surface-design/SKILL.md](#archivo-0349)
0350. [.ai/skills/quality-gates/SKILL.md](#archivo-0350)
0351. [.ai/skills/schema-icon-color-sync/SKILL.md](#archivo-0351)
0352. [.ai/skills/schema-owner-color-persistence/SKILL.md](#archivo-0352)
0353. [.ai/skills/schema-registry-extension/SKILL.md](#archivo-0353)
0354. [.ai/skills/schema-tone-resolution/SKILL.md](#archivo-0354)
0355. [.ai/skills/snapshot-transform-roundtrip/SKILL.md](#archivo-0355)
0356. [.ai/skills/test-results-forensics/SKILL.md](#archivo-0356)
0357. [.ai/skills/transform-interaction-state-machine/SKILL.md](#archivo-0357)
0358. [.ai/skills/unique-recipient-palette/SKILL.md](#archivo-0358)
0359. [.ai/skills/unit-recipient-color-contracts/SKILL.md](#archivo-0359)
0360. [.ai/skills/unit-transform-state-contracts/SKILL.md](#archivo-0360)
0361. [src/sisad-pdfme/ui/designerEngine.api.md](#archivo-0361)

---

# Contenido consolidado

---

<a id="archivo-0001"></a>
## Archivo #1: AGENTS.md

- **Ruta relativa:** `AGENTS.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/AGENTS.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `44`

### Contenido original

# AGENTS.md — Router neutral IA para SISAD PDFME

## Inicio obligatorio

1. Leer `.ai/INDEX.md`.
2. Leer `.ai/memory/project-memory.md`.
3. Leer `.ai/context-map.md`.
4. Seleccionar agente en `.ai/agents/registry.md`.
5. Cargar máximo 1 contexto principal + 2 reglas + 1 prompt al inicio.
6. Inspeccionar código real con `rg` antes de proponer cambios.

## Prioridad del proyecto

- Cada destinatario/usuario debe tener color único y accesible.
- El catálogo de schemas debe tomar el color del destinatario activo.
- Los schemas ya creados deben conservar color/owner original.
- Resize, rotate, drag y selección deben convivir sin colisiones.
- El snapshot debe preservar documentos, schemas, recipients, assignments, ownerColor, rotation, comments y firma.
- `externalForms` debe consumir `Form`/`Viewer` desde `sisad-pdfme`.
- `ContentCustomForm` debe actuar como host de negocio, no como runtime visual.

## Guardrails no negociables

- No acoplar el fork `sisad-pdfme` a lógica SISAD no genérica.
- No duplicar runtime de canvas, sidebars, inspector, snapshot engine ni schemas.
- No manipular DOM interno del diseñador desde hosts externos.
- Mantener CSS dentro de `.sisad-pdfme-root`.
- No romper geometría de canvas, zoom, scroll, Moveable o Selecto.
- No convertir `externalForms` en renderer paralelo si `Form`/`Viewer` ya cubren el caso.
- Si cambia API pública, agregar docs y tests.
- Si hay contradicción entre proveedores, prevalece `.ai/`.

## Formato de cierre

```md
## Contexto usado
## Agente/subagente
## Diagnóstico
## Cambios realizados/propuestos
## Validación
## Riesgos residuales
## Documentación/memoria actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0002"></a>
## Archivo #2: CLAUDE.md

- **Ruta relativa:** `CLAUDE.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/CLAUDE.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `32`

### Contenido original

# CLAUDE.md — Adaptador Claude

Claude debe trabajar por contexto progresivo y no leer snapshots completos salvo auditoría global explícita.

## Startup

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. `.ai/agents/registry.md`

## Modo de trabajo

- Nivel 1: cambio puntual, leer contexto + regla + prompt.
- Nivel 2: bug/feature de dominio, sumar subagente y skill.
- Nivel 3: auditoría global, justificar lectura de reportes o snapshots.

## Comandos sugeridos

- `/startup`
- `/local-selective-scan`
- `/repair-recipient-color`
- `/repair-transform-collisions`
- `/repair-snapshot-roundtrip`
- `/audit-css-boundaries`
- `/update-memory`

## Restricción

No aplicar refactor masivo sin plan por fases y validación incremental.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0003"></a>
## Archivo #3: CODEX.md

- **Ruta relativa:** `CODEX.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/CODEX.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `32`

### Contenido original

# CODEX.md — Adaptador Codex

Codex se usa para cambios atómicos, verificables y con bajo riesgo.

## Método

```txt
leer contexto mínimo -> localizar con rg -> modificar poco -> validar -> reportar rollback
```

## Tareas ideales

- Ajustar una función de color, owner o snapshot.
- Corregir guard de Moveable/Selecto.
- Crear test unitario cercano.
- Eliminar wrapper o alias sin valor.
- Ajustar prompt/doc puntual.

## Validación mínima

```bash
npm run build -- --mode development
npm run lint
```

Para canvas/transform/color visual:

```bash
npx vitest run tests/unit/recipientColor.test.ts tests/unit/schemaTone.test.ts
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0004"></a>
## Archivo #4: COPILOT.md

- **Ruta relativa:** `COPILOT.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/COPILOT.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `21`

### Contenido original

# COPILOT.md — Adaptador GitHub Copilot

Copilot debe actuar con instrucciones pequeñas y reutilizables.

## Inicio

1. Leer `.github/copilot-instructions.md`.
2. Leer `.ai/INDEX.md`.
3. Usar `.github/prompts/*` como wrappers de `.ai/prompts/*`.

## Regla

`.github/prompts` no debe contener lógica divergente. Debe apuntar o copiar de forma controlada la fuente `.ai/prompts`.

## Foco recomendado

- Cambios puntuales de UI.
- Tests cercanos al cambio.
- Refactor local.
- Normalización de nombres y contratos.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0005"></a>
## Archivo #5: CURRENT_STATE.md

- **Ruta relativa:** `CURRENT_STATE.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/CURRENT_STATE.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `24`

### Contenido original

# CURRENT_STATE.md — Estado actual operativo

## Producto

Fork/paquete `sisad-pdfme` para diseño, edición y ejecución de documentos PDF con schemas, recipients, ownership, colaboración, comentarios, sidebars, generator, converter y runtime `Designer/Form/Viewer`.

## Inventario analizado

- Código consolidado: `510` archivos.
- Tests: `83` unitarios y `11` Playwright detectados en TOC.
- UI runtime: `121` archivos.
- Schemas: `56` archivos.
- PDF-lib integrado: `154` archivos.
- CSS consolidado: `6` archivos.

## Prioridad actual

1. Blindar color único por destinatario.
2. Sincronizar catálogo con destinatario activo.
3. Preservar ownerColor de schemas existentes.
4. Estabilizar resize/rotate/drag/selection.
5. Proteger snapshot round-trip.
6. Evitar duplicidad entre host, runtime y externalForms.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0006"></a>
## Archivo #6: GEMINI.md

- **Ruta relativa:** `GEMINI.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/GEMINI.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `17`

### Contenido original

# GEMINI.md — Adaptador Gemini

Gemini se usa para auditoría, contraste y documentación.

## Buenas tareas

- Auditar consistencia entre docs, prompts y código.
- Revisar drift entre `.ai` y `.github`.
- Analizar resultados de tests.
- Proponer matrices de regresión.
- Detectar duplicidad arquitectónica.

## No usar para

- Cambios directos grandes sin plan.
- Sustituir build/lint/test.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0007"></a>
## Archivo #7: GUARDRAILS.md

- **Ruta relativa:** `GUARDRAILS.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/GUARDRAILS.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `12`

### Contenido original

# GUARDRAILS.md — Guardrails del proyecto

1. No acoplar `sisad-pdfme` a reglas de negocio SISAD que deban vivir en adaptadores.
2. No duplicar sidebars, canvas, inspector, command bus, snapshot engine ni renderers.
3. No modificar DOM interno desde `ContentCustomForm` o hosts externos.
4. No romper `.sisad-pdfme-root` como frontera CSS.
5. No usar delays arbitrarios para resolver race conditions de canvas o tests.
6. No perder `schemaUid`, `ownerId`, `ownerColor`, `rotation` ni metadata `__designer`.
7. No ejecutar shortcuts cuando hay input/textarea/select/contenteditable activo.
8. No permitir transform en schemas locked/readonly.
9. No cerrar cambios sin build/lint o bloqueo documentado.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0008"></a>
## Archivo #8: INSTALL_MAC.md

- **Ruta relativa:** `INSTALL_MAC.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/INSTALL_MAC.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `22`

### Contenido original

# INSTALL_MAC.md — Instalación en macOS

Desde la raíz del proyecto:

```bash
unzip sisad-pdfme-agentic-md-architecture-v3.zip -d /tmp/sisad-pdfme-ai-v3
rsync -av /tmp/sisad-pdfme-ai-v3/ ./
```

Validación de estructura:

```bash
find .ai docs handoff tests reports .claude .codex .github .gemini -name "*.md" | wc -l
```

Validación del proyecto si ya tienes dependencias instaladas:

```bash
npm run build -- --mode development
npm run lint
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0009"></a>
## Archivo #9: MANIFEST.md

- **Ruta relativa:** `MANIFEST.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/MANIFEST.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `368`

### Contenido original

# Manifest — SISAD PDFME Agentic MD v3

Generado: `2026-06-01T18:47:53Z`

Total Markdown: `359`

| Archivo | Líneas | SHA-256 corto |
|---|---:|---|
| `.ai/INDEX.md` | 41 | `b950e39fbbf1a8cb` |
| `.ai/README.md` | 15 | `493de1dd63d2e964` |
| `.ai/agent-loop.md` | 37 | `6d76734d9e514138` |
| `.ai/agents/canvas-runtime-agent.md` | 31 | `587a9cfe2ac0c356` |
| `.ai/agents/collaboration-lock-agent.md` | 31 | `e26723ab6a7fd023` |
| `.ai/agents/command-bus-agent.md` | 31 | `ea3a358fa0048822` |
| `.ai/agents/content-custom-form-agent.md` | 31 | `d8bb6ac160e82091` |
| `.ai/agents/css-agent.md` | 31 | `f4bd747065c43d1c` |
| `.ai/agents/debugging-agent.md` | 31 | `05158fd78ca0b3d1` |
| `.ai/agents/designer-engine-agent.md` | 31 | `63688569dd5d6fa3` |
| `.ai/agents/docs-governance-agent.md` | 31 | `9ae5f21b9e438401` |
| `.ai/agents/external-forms-agent.md` | 31 | `547baf000b950a3b` |
| `.ai/agents/frontend-architect-agent.md` | 31 | `09c5d83805f39517` |
| `.ai/agents/generator-converter-agent.md` | 31 | `0c6d16933a6777aa` |
| `.ai/agents/left-sidebar-catalog-agent.md` | 31 | `4e4287a2e4ae3ec3` |
| `.ai/agents/legacy-cleanup-agent.md` | 31 | `b0b51df6bd142547` |
| `.ai/agents/moveable-selecto-agent.md` | 31 | `2291a601ed8718a3` |
| `.ai/agents/provider-sync-agent.md` | 31 | `cc8412cdd1c82f4f` |
| `.ai/agents/quality-agent.md` | 31 | `c8a9b7b6050ed993` |
| `.ai/agents/recipient-color-agent.md` | 31 | `ee917cc6f9dd7f48` |
| `.ai/agents/registry.md` | 33 | `7e3313b122905aa2` |
| `.ai/agents/release-agent.md` | 31 | `a013d94fbb89d622` |
| `.ai/agents/right-sidebar-inspector-agent.md` | 31 | `2fad1bc7ea422521` |
| `.ai/agents/root-orchestrator-agent.md` | 31 | `40ab64eade3a7184` |
| `.ai/agents/schema-icon-sync-agent.md` | 31 | `18139c161f69f56f` |
| `.ai/agents/schema-registry-agent.md` | 31 | `32495dc1ae923882` |
| `.ai/agents/security-agent.md` | 31 | `d00863f86a370cd4` |
| `.ai/agents/sisad-pdfme-runtime-agent.md` | 31 | `304e5030881bc0b8` |
| `.ai/agents/snapshot-agent.md` | 31 | `5e6504f75112b0c8` |
| `.ai/agents/testing-regression-agent.md` | 31 | `e1b311f5cb81394e` |
| `.ai/agents/token-economy-agent.md` | 31 | `e8f056eae485b59f` |
| `.ai/agents/ui-ux-agent.md` | 31 | `777616a264fd2ab3` |
| `.ai/architecture/agent-routing.md` | 23 | `8224108ecd77efe5` |
| `.ai/architecture/assistant-architecture.md` | 23 | `f6157527edc778e0` |
| `.ai/architecture/context-loading-ladder.md` | 23 | `832e1bdf9b4c318d` |
| `.ai/architecture/fork-safe-evolution.md` | 23 | `d9d58ce60937c32a` |
| `.ai/architecture/module-boundaries.md` | 23 | `965aab3e3d3039d0` |
| `.ai/architecture/provider-model.md` | 23 | `7fd2d794afef4cfe` |
| `.ai/architecture/quality-gate-model.md` | 23 | `3f2411604ff7d005` |
| `.ai/architecture/runtime-ownership.md` | 23 | `64947ebabf85f27f` |
| `.ai/checklists/before-change.md` | 7 | `a01eefdc6c471b90` |
| `.ai/checklists/before-merge.md` | 7 | `399e5b9b449d8bc7` |
| `.ai/checklists/css-boundaries.md` | 6 | `e15bfc0272a7cbbc` |
| `.ai/checklists/external-forms.md` | 7 | `d606f5031bd4c07d` |
| `.ai/checklists/provider-sync.md` | 6 | `bda3bb85fd856bbf` |
| `.ai/checklists/quality-gates.md` | 7 | `92ae6a0b7b670ca6` |
| `.ai/checklists/recipient-color.md` | 7 | `4e378796b9602b89` |
| `.ai/checklists/release.md` | 7 | `678530d87aee6479` |
| `.ai/checklists/schema-transform.md` | 8 | `590a185ae06719d6` |
| `.ai/checklists/snapshot-roundtrip.md` | 9 | `a880f2e02c510edd` |
| `.ai/context/canvas-coordinates-context.md` | 6 | `77b82a6938e44d26` |
| `.ai/context/code-map.md` | 13 | `c373121cb2d84a13` |
| `.ai/context/collaboration-locks-context.md` | 6 | `74665df8c09a8319` |
| `.ai/context/command-bus-context.md` | 6 | `7618fe8f24c54106` |
| `.ai/context/content-custom-form-integration-context.md` | 6 | `2298c2134d901a04` |
| `.ai/context/css-design-system-context.md` | 6 | `2ecd37022b933d1d` |
| `.ai/context/css-map.md` | 13 | `2a18fe0a24227838` |
| `.ai/context/designer-engine-context.md` | 6 | `2e76fe8ba8e2e831` |
| `.ai/context/docs-map.md` | 6 | `191c6ede5fb6bf31` |
| `.ai/context/external-forms-runner-context.md` | 6 | `740d002f291045b2` |
| `.ai/context/generator-converter-context.md` | 6 | `691b8d9aae0baa1f` |
| `.ai/context/integration-host-boundaries-context.md` | 6 | `287bce12fde2837e` |
| `.ai/context/legacy-cleanup-context.md` | 6 | `8aeca29cb5ff97d8` |
| `.ai/context/module-map.md` | 15 | `1d788694f8f62b6a` |
| `.ai/context/moveable-selecto-context.md` | 6 | `4db169325775a3f3` |
| `.ai/context/project-overview.md` | 6 | `2b0ac44fb52588b1` |
| `.ai/context/provider-compatibility-context.md` | 6 | `db6dc9c3ef7a6bda` |
| `.ai/context/recipient-color-context.md` | 6 | `d2a19089b35144d1` |
| `.ai/context/schema-icon-sync-context.md` | 6 | `ccf5b1b714355ea5` |
| `.ai/context/schema-owner-persistence-context.md` | 6 | `ee5b0c867071e3d8` |
| `.ai/context/schema-registry-context.md` | 6 | `63d15f4c82d92afa` |
| `.ai/context/security-privacy-context.md` | 6 | `9f16d56d81ef7707` |
| `.ai/context/selection-shortcuts-context.md` | 6 | `274ff5d16c25f912` |
| `.ai/context/sidebars-inspector-context.md` | 6 | `9f43bc920a763746` |
| `.ai/context/sisad-pdfme-runtime-context.md` | 6 | `747259138b9deca1` |
| `.ai/context/snapshot-contract-context.md` | 6 | `d914e24f58f229be` |
| `.ai/context/tests-quality-context.md` | 6 | `2e0ce561956e7425` |
| `.ai/context/transform-controls-context.md` | 6 | `07124c41637a6dc2` |
| `.ai/context/ui-ux-compact-context.md` | 6 | `0995e633c6c532d9` |
| `.ai/context-map.md` | 27 | `246057668678e987` |
| `.ai/memory/decisions.md` | 18 | `1d6db9c46e34df6c` |
| `.ai/memory/incidents.md` | 26 | `defb197580bd6f53` |
| `.ai/memory/project-memory.md` | 21 | `20172d452e5e0862` |
| `.ai/memory/session-handoff.md` | 21 | `f74a6ccc78121d86` |
| `.ai/memory/update-protocol.md` | 17 | `2b033e1926c2f258` |
| `.ai/prompts/INDEX.md` | 34 | `451ed1fd1154afa7` |
| `.ai/prompts/audit-css-boundaries.prompt.md` | 59 | `ba0354fa260b5900` |
| `.ai/prompts/audit-legacy-runtime-reduction.prompt.md` | 57 | `4ed2018175cf0b9e` |
| `.ai/prompts/audit-platform-boundaries.prompt.md` | 58 | `a3c9aae37017a438` |
| `.ai/prompts/build-regression-test-matrix.prompt.md` | 58 | `f22b3b93bde7e75b` |
| `.ai/prompts/create-playwright-canvas-scenarios.prompt.md` | 57 | `e51a47fdc4e6fded` |
| `.ai/prompts/create-test-fixtures-multi-recipient-colors.prompt.md` | 58 | `b0ab9222d06e691e` |
| `.ai/prompts/fix-keyboard-shortcut-collisions.prompt.md` | 58 | `e13fa24c15245937` |
| `.ai/prompts/generate-final-implementation-report.prompt.md` | 57 | `d449df5cf5226626` |
| `.ai/prompts/harden-moveable-selecto-guards.prompt.md` | 59 | `466b407c578fde81` |
| `.ai/prompts/implement-unique-recipient-palette.prompt.md` | 58 | `ad44af46fca46af3` |
| `.ai/prompts/inspect-failed-test-results.prompt.md` | 58 | `8350680a17318389` |
| `.ai/prompts/normalize-selection-transform-state-machine.prompt.md` | 58 | `831bc23ad2c08885` |
| `.ai/prompts/preserve-owner-color-on-existing-schemas.prompt.md` | 59 | `f15616def95da51e` |
| `.ai/prompts/protect-inline-edit-from-transform.prompt.md` | 58 | `65315ca2c7ede639` |
| `.ai/prompts/recipient-transform-master-plan.prompt.md` | 62 | `9c23aec04ffe23b2` |
| `.ai/prompts/refactor-left-rail-catalog.prompt.md` | 58 | `9885acce27a801dc` |
| `.ai/prompts/refactor-right-inspector-layout.prompt.md` | 58 | `f2c8c4c771eec161` |
| `.ai/prompts/refactor-transform-geometry-utils.prompt.md` | 58 | `c5c3c7cc7d978392` |
| `.ai/prompts/repair-contentcustomform-integration.prompt.md` | 46 | `2b5e392fd78715d6` |
| `.ai/prompts/repair-external-forms-runner.prompt.md` | 59 | `6bd7ec9709f0363c` |
| `.ai/prompts/repair-floating-toolbar-position.prompt.md` | 58 | `4309f34dd57130cb` |
| `.ai/prompts/repair-recipient-color-sync.prompt.md` | 60 | `64ea9b4dfd972496` |
| `.ai/prompts/repair-schema-icon-color-sync.prompt.md` | 59 | `b578254e20864ba9` |
| `.ai/prompts/repair-sidebars-inspector.prompt.md` | 47 | `e8cb91fbf9ed3fe4` |
| `.ai/prompts/repair-snapshot-roundtrip.prompt.md` | 59 | `fa5ddc812d29d141` |
| `.ai/prompts/repair-transform-collisions.prompt.md` | 59 | `2196fd53e8780978` |
| `.ai/prompts/review-css-for-transform-handle-breaks.prompt.md` | 57 | `bfc9d469bc731091` |
| `.ai/prompts/stabilize-designer-engine-api.prompt.md` | 58 | `cdee78aaf4f09445` |
| `.ai/prompts/stabilize-schema-resize-rotation.prompt.md` | 58 | `e926fee0479dbb3a` |
| `.ai/prompts/standardize-data-attributes-for-colors.prompt.md` | 58 | `22c1b7563a54def7` |
| `.ai/prompts/unify-css-architecture.prompt.md` | 58 | `7cfeaa321e2f2060` |
| `.ai/prompts/update-docs-recipient-transform.prompt.md` | 58 | `20156b5e65386f6a` |
| `.ai/prompts/validate-ci-flow-recipient-transform.prompt.md` | 59 | `355d72abf09521e7` |
| `.ai/providers/claude-adapter.md` | 6 | `33ce1929a9a2e355` |
| `.ai/providers/codex-adapter.md` | 6 | `92f76417b24e5047` |
| `.ai/providers/gemini-adapter.md` | 6 | `c38ba3c6da7cd2e8` |
| `.ai/providers/generic-provider-adapter.md` | 6 | `85487697f4407d5e` |
| `.ai/providers/github-copilot-adapter.md` | 6 | `cc3dcb868482a2c0` |
| `.ai/providers/provider-contract.md` | 6 | `f3786e697052a922` |
| `.ai/rules/collaboration-lock-rules.md` | 15 | `d974603b8626e0f3` |
| `.ai/rules/command-bus-rules.md` | 14 | `d10532312ec97501` |
| `.ai/rules/context-loading-ladder-rules.md` | 15 | `200655fc87d8f52a` |
| `.ai/rules/css-boundary-rules.md` | 15 | `a5d36dc0e1ba9569` |
| `.ai/rules/docs-governance-rules.md` | 15 | `3023a116e52eceaf` |
| `.ai/rules/external-forms-runner-rules.md` | 15 | `83c0518fd0d27820` |
| `.ai/rules/generator-converter-rules.md` | 15 | `6bfdd8330b73ba4a` |
| `.ai/rules/global-rules.md` | 16 | `911e389086b6af67` |
| `.ai/rules/host-runtime-boundary-rules.md` | 15 | `33b1aed2e71c22f7` |
| `.ai/rules/legacy-reduction-rules.md` | 15 | `b02cdea7c07bd285` |
| `.ai/rules/moveable-selecto-rules.md` | 15 | `d0f1cac39f2c63f7` |
| `.ai/rules/provider-adapter-rules.md` | 14 | `6f6abf789c59ec30` |
| `.ai/rules/public-api-rules.md` | 15 | `5a4be394ecfd4cca` |
| `.ai/rules/schema-icon-color-rules.md` | 15 | `c4cf6c73d37f4b16` |
| `.ai/rules/schema-ownership-rules.md` | 15 | `53683f21d050c1dd` |
| `.ai/rules/security-privacy-rules.md` | 15 | `673d9e2cc98bcbf8` |
| `.ai/rules/sidebars-inspector-rules.md` | 15 | `cdc1899427ee8265` |
| `.ai/rules/snapshot-contract-rules.md` | 15 | `5cb40986989b0a1a` |
| `.ai/rules/testing-quality-rules.md` | 15 | `9890e8b15c44f26c` |
| `.ai/rules/token-budget-rules.md` | 15 | `be80c3acec2bfd19` |
| `.ai/rules/transform-interaction-rules.md` | 15 | `21d0853849213f38` |
| `.ai/skills/active-recipient-color-contract/SKILL.md` | 31 | `572108c7d259df80` |
| `.ai/skills/canvas-geometry-scaling/SKILL.md` | 31 | `0fd2aae4a4990bbe` |
| `.ai/skills/command-bus-transform-actions/SKILL.md` | 31 | `3fbbb9caef07d8e1` |
| `.ai/skills/component-composition/SKILL.md` | 31 | `902bf77808b010fd` |
| `.ai/skills/context-budget/SKILL.md` | 31 | `1bf577bc79f1ac6a` |
| `.ai/skills/context-menu-transform-guard/SKILL.md` | 31 | `5621b57398beeb2d` |
| `.ai/skills/css-layering-and-overrides/SKILL.md` | 31 | `2aa14e4229287b18` |
| `.ai/skills/css-recipient-color-tokens/SKILL.md` | 31 | `dd0eb445fd4794b8` |
| `.ai/skills/css-transform-handle-safety/SKILL.md` | 31 | `b3d604845a8b5e36` |
| `.ai/skills/custom-schema-contracts/SKILL.md` | 31 | `82dc045047bab83f` |
| `.ai/skills/documentation-traceability/SKILL.md` | 31 | `99ecb99ecacc7097` |
| `.ai/skills/external-forms-runtime/SKILL.md` | 31 | `2d154091ca3b730d` |
| `.ai/skills/floating-toolbar-transform-position/SKILL.md` | 31 | `3f4d313ff846efc7` |
| `.ai/skills/fork-safe-pdfme-evolution/SKILL.md` | 31 | `3279f6c63b2911cf` |
| `.ai/skills/form-viewer-generator-parity/SKILL.md` | 31 | `b6e2fe39a38896bf` |
| `.ai/skills/inline-edit-transform-guard/SKILL.md` | 31 | `af63296503ad0dda` |
| `.ai/skills/keyboard-shortcut-transform-safety/SKILL.md` | 31 | `bc0361dcf99e49a9` |
| `.ai/skills/legacy-runtime-reduction/SKILL.md` | 31 | `25c1f1df8f1bd291` |
| `.ai/skills/moveable-selecto-integration/SKILL.md` | 31 | `b155c763e3efcf37` |
| `.ai/skills/moveable-selecto-resize-rotate/SKILL.md` | 31 | `7158dbbca443b3c0` |
| `.ai/skills/playwright-canvas-diagnostics/SKILL.md` | 31 | `d6bca019cd03e3ab` |
| `.ai/skills/playwright-recipient-color-regression/SKILL.md` | 31 | `4dab7af3f995bd07` |
| `.ai/skills/playwright-transform-regression/SKILL.md` | 31 | `4cccf5f986499260` |
| `.ai/skills/public-api-surface-design/SKILL.md` | 31 | `22a2d02434d4c59a` |
| `.ai/skills/quality-gates/SKILL.md` | 31 | `f9e29456675bc862` |
| `.ai/skills/schema-icon-color-sync/SKILL.md` | 31 | `8bbcf63acfd6046c` |
| `.ai/skills/schema-owner-color-persistence/SKILL.md` | 31 | `61d5f53783587654` |
| `.ai/skills/schema-registry-extension/SKILL.md` | 31 | `23ba245312d44be9` |
| `.ai/skills/schema-tone-resolution/SKILL.md` | 31 | `c32ff7e91f9b2790` |
| `.ai/skills/snapshot-transform-roundtrip/SKILL.md` | 31 | `810a0960b8fea3f5` |
| `.ai/skills/test-results-forensics/SKILL.md` | 31 | `291cd9da4aac4c88` |
| `.ai/skills/transform-interaction-state-machine/SKILL.md` | 31 | `f7f58f85e7d2d7b0` |
| `.ai/skills/unique-recipient-palette/SKILL.md` | 31 | `48b1e93c631c6831` |
| `.ai/skills/unit-recipient-color-contracts/SKILL.md` | 31 | `b677d3ca6766cbdc` |
| `.ai/skills/unit-transform-state-contracts/SKILL.md` | 31 | `9c12660041db30ea` |
| `.ai/subagents/active-recipient-color-subagent.md` | 18 | `ebafbac25e780fec` |
| `.ai/subagents/assignments-filtering-subagent.md` | 18 | `7fb0c1c75a991410` |
| `.ai/subagents/canvas-coordinate-subagent.md` | 18 | `fad7ff6159fa6f39` |
| `.ai/subagents/collaboration-locks-subagent.md` | 18 | `5a1b40f9dd80832e` |
| `.ai/subagents/command-bus-transform-subagent.md` | 18 | `02abdaa63029d9b5` |
| `.ai/subagents/comments-overlay-subagent.md` | 18 | `21a856ce991c13bf` |
| `.ai/subagents/context-menu-guard-subagent.md` | 18 | `c74db7aedfd43631` |
| `.ai/subagents/converter-browser-node-subagent.md` | 18 | `37ee09deb2748a95` |
| `.ai/subagents/css-token-subagent.md` | 18 | `975abc20566f89af` |
| `.ai/subagents/css-transform-handle-subagent.md` | 18 | `002c84b7188bec23` |
| `.ai/subagents/custom-plugin-contract-subagent.md` | 18 | `cd43b9646fcb92b6` |
| `.ai/subagents/detail-widgets-subagent.md` | 18 | `1652e5f33204a159` |
| `.ai/subagents/docs-migration-subagent.md` | 18 | `2049f1edd538c84a` |
| `.ai/subagents/external-form-runner-subagent.md` | 18 | `ad425316663a9d34` |
| `.ai/subagents/floating-toolbar-position-subagent.md` | 18 | `290bc1ab26ba22cc` |
| `.ai/subagents/form-viewer-parity-subagent.md` | 18 | `a5c50d04e44f2e4a` |
| `.ai/subagents/generator-helper-subagent.md` | 18 | `10e4a7e5ccf41a97` |
| `.ai/subagents/inline-edit-guard-subagent.md` | 18 | `1fae9202d76dd746` |
| `.ai/subagents/keyboard-shortcut-guard-subagent.md` | 18 | `e55f0fd2bbff292b` |
| `.ai/subagents/left-sidebar-catalog-color-subagent.md` | 18 | `903e5a7e70af720e` |
| `.ai/subagents/legacy-wrapper-subagent.md` | 18 | `634f6610d71a37ab` |
| `.ai/subagents/moveable-resize-subagent.md` | 18 | `411011a10e0a9314` |
| `.ai/subagents/moveable-rotation-subagent.md` | 18 | `8e39cd157cf6f52c` |
| `.ai/subagents/overlay-manager-subagent.md` | 18 | `baaa0c331f7f52da` |
| `.ai/subagents/owner-color-persistence-subagent.md` | 18 | `ce0c545314523237` |
| `.ai/subagents/paper-scale-layer-subagent.md` | 18 | `24e3bba5ea740da0` |
| `.ai/subagents/playwright-canvas-subagent.md` | 18 | `165f2de3d47cf55a` |
| `.ai/subagents/playwright-recipient-color-subagent.md` | 18 | `fd89eefc63516986` |
| `.ai/subagents/plugin-icon-fallback-subagent.md` | 18 | `7e526c896b08a7c8` |
| `.ai/subagents/prompt-catalog-subagent.md` | 18 | `b1257845c7131793` |
| `.ai/subagents/provider-drift-subagent.md` | 18 | `25ae04d290492124` |
| `.ai/subagents/public-api-surface-subagent.md` | 18 | `171ca08d26bd0a50` |
| `.ai/subagents/right-inspector-transform-subagent.md` | 18 | `fe70ca11999a4837` |
| `.ai/subagents/schema-registry-extension-subagent.md` | 18 | `2c3373940e10bc41` |
| `.ai/subagents/schema-tone-resolution-subagent.md` | 18 | `8f83aa654c8a79f0` |
| `.ai/subagents/selecto-lifecycle-subagent.md` | 18 | `214af79163ff1cd6` |
| `.ai/subagents/snapshot-legacy-compat-subagent.md` | 18 | `815ac84872d9119d` |
| `.ai/subagents/snapshot-roundtrip-subagent.md` | 18 | `3ed06a86c870738f` |
| `.ai/subagents/token-budget-subagent.md` | 18 | `635c3510fa5f7e08` |
| `.ai/subagents/unique-palette-subagent.md` | 18 | `58590a10a408ff51` |
| `.ai/subagents/visual-regression-css-subagent.md` | 18 | `ad8c86f500b0cfc0` |
| `.ai/subagents/vitest-contract-subagent.md` | 18 | `d192ed983b9b1f13` |
| `.ai/templates/agent-report.md` | 9 | `f726d05bcde133bb` |
| `.ai/templates/architecture-decision-record.md` | 8 | `a1091564bf0670e0` |
| `.ai/templates/bug-ticket.md` | 8 | `38a455384c762ed6` |
| `.ai/templates/handoff.md` | 8 | `4d8ffe414c3b8476` |
| `.ai/templates/qa-report.md` | 8 | `10e28cb66346c8eb` |
| `.ai/templates/refactor-report.md` | 8 | `644635d9f6a0312a` |
| `.ai/templates/test-failure-analysis.md` | 8 | `3ceb0cb0e72357fb` |
| `.claude/README.md` | 4 | `b002b075b2713058` |
| `.claude/commands/audit-css-boundaries.md` | 4 | `2bbb84a1ce83fed0` |
| `.claude/commands/local-selective-scan.md` | 4 | `cfbbce967e26fbe3` |
| `.claude/commands/repair-recipient-color.md` | 4 | `922dbf68062e51a6` |
| `.claude/commands/repair-snapshot-roundtrip.md` | 4 | `e24d21ade9bbcb03` |
| `.claude/commands/repair-transform-collisions.md` | 4 | `e861cc58a793a9cd` |
| `.claude/commands/startup.md` | 4 | `708ba6b6039209be` |
| `.claude/commands/update-memory.md` | 4 | `5fe9697acee85f72` |
| `.codex/README.md` | 4 | `795556862ce9a68c` |
| `.codex/tasks/atomic-fix.md` | 4 | `f5bc2271dfe3a1f8` |
| `.codex/tasks/legacy-cleanup-step.md` | 4 | `2ef5a3128c2705ab` |
| `.codex/tasks/quality-gates.md` | 4 | `abbd0d55a28dda5b` |
| `.codex/tasks/recipient-transform-implementation.md` | 4 | `57ddd1e051aa048d` |
| `.codex/tasks/refactor-safe.md` | 4 | `3a88ed437137c54c` |
| `.gemini/README.md` | 4 | `a488a53bcd6341d6` |
| `.gemini/prompts/audit-architecture.md` | 4 | `5bf9ca88b0677ab4` |
| `.gemini/prompts/audit-docs-vs-code.md` | 4 | `8576f911e9a92f39` |
| `.gemini/prompts/audit-recipient-transform.md` | 4 | `e3502e883474a005` |
| `.gemini/prompts/audit-token-budget.md` | 4 | `dc67b44a06154514` |
| `.github/copilot-instructions.md` | 18 | `60a0d8f616ddfb94` |
| `.github/instructions/architecture-boundaries.instructions.md` | 4 | `d368bde61ede056e` |
| `.github/instructions/canvas-transform-safety.instructions.md` | 4 | `be7b93028756e647` |
| `.github/instructions/css-boundaries.instructions.md` | 4 | `165be064bfee46e7` |
| `.github/instructions/external-forms-runner.instructions.md` | 4 | `d49d14b26c6f2336` |
| `.github/instructions/recipient-color-system.instructions.md` | 4 | `53e1391ea187eca9` |
| `.github/instructions/snapshot-contract.instructions.md` | 4 | `bfeb8f63770fd0da` |
| `.github/instructions/testing-quality.instructions.md` | 4 | `9bfcad559120dc70` |
| `.github/prompts/audit-css-boundaries.prompt.md` | 6 | `964d93f3dbb3f30b` |
| `.github/prompts/audit-legacy-runtime-reduction.prompt.md` | 6 | `cbbb73ba4bc03055` |
| `.github/prompts/build-regression-test-matrix.prompt.md` | 6 | `4f0de8bcd26e96f5` |
| `.github/prompts/fix-keyboard-shortcut-collisions.prompt.md` | 6 | `e23fc0ace76c4fca` |
| `.github/prompts/harden-moveable-selecto-guards.prompt.md` | 6 | `5ea40d3e1d6c3011` |
| `.github/prompts/implement-unique-recipient-palette.prompt.md` | 6 | `15ec8b7b93b21908` |
| `.github/prompts/inspect-failed-test-results.prompt.md` | 6 | `e57be533a5357a1f` |
| `.github/prompts/preserve-owner-color-on-existing-schemas.prompt.md` | 6 | `57d34502180757f4` |
| `.github/prompts/protect-inline-edit-from-transform.prompt.md` | 6 | `0de58c6ed509e92f` |
| `.github/prompts/recipient-transform-master-plan.prompt.md` | 6 | `f34ba2ca543ee259` |
| `.github/prompts/repair-external-forms-runner.prompt.md` | 6 | `b78114c3d772d3d0` |
| `.github/prompts/repair-floating-toolbar-position.prompt.md` | 6 | `29668cd39a80a182` |
| `.github/prompts/repair-recipient-color-sync.prompt.md` | 6 | `d4c7027d46777add` |
| `.github/prompts/repair-schema-icon-color-sync.prompt.md` | 6 | `b03fd4d2dbbb62cf` |
| `.github/prompts/repair-snapshot-roundtrip.prompt.md` | 6 | `38c3aff2d8215576` |
| `.github/prompts/repair-transform-collisions.prompt.md` | 6 | `e312251d44116b27` |
| `.github/prompts/stabilize-designer-engine-api.prompt.md` | 6 | `fd47545cac364e2e` |
| `.github/prompts/stabilize-schema-resize-rotation.prompt.md` | 6 | `99a72ac1acc7dc7f` |
| `.github/prompts/unify-css-architecture.prompt.md` | 6 | `7db41972d7b86c04` |
| `.github/prompts/update-docs-recipient-transform.prompt.md` | 6 | `e873306d5f266ced` |
| `AGENTS.md` | 44 | `e07b0ba0295d86a5` |
| `CLAUDE.md` | 32 | `2c9190513312b7b4` |
| `CODEX.md` | 32 | `567d5f0f6ac24992` |
| `COPILOT.md` | 21 | `c4ef94a9c8fc8beb` |
| `CURRENT_STATE.md` | 24 | `d7fcdec47322765f` |
| `GEMINI.md` | 17 | `0846309abf0de487` |
| `GUARDRAILS.md` | 12 | `5563c45ceb167264` |
| `INSTALL_MAC.md` | 22 | `5506473d4683ab1e` |
| `MANIFEST.md` | 365 | `7722dbcd56a95444` |
| `MIGRATION_GUIDE.md` | 22 | `2597800e65531811` |
| `PACKAGE_SUMMARY.md` | 12 | `84c4a13601b6936d` |
| `README.md` | 63 | `b916202f2ff8f2c4` |
| `debug/breakpoints-criticos.md` | 28 | `d7e3398ab4cc2966` |
| `debug/hardtrace-playbook.md` | 17 | `b887e393b5c23713` |
| `docs/00-indice/README.md` | 4 | `48528c7d5bb44a2f` |
| `docs/01-producto-y-vision/01-vision-producto.md` | 4 | `b099b9134b154e1b` |
| `docs/01-producto-y-vision/02-actores.md` | 4 | `a76428fc3ee5a15a` |
| `docs/01-producto-y-vision/03-objetivos.md` | 4 | `3ebb4a971bbd68ba` |
| `docs/01-producto-y-vision/04-no-objetivos.md` | 4 | `b3dfb3232d4f24fd` |
| `docs/02-mapa-modulos/01-inventario-codigo.md` | 15 | `104cf5e6280eadc7` |
| `docs/02-mapa-modulos/02-ui-designer-form-viewer.md` | 4 | `bb8018c4d07d547a` |
| `docs/02-mapa-modulos/03-schemas-y-plugin-registry.md` | 4 | `c124bffa5a748051` |
| `docs/02-mapa-modulos/04-generator-converter-pdflib.md` | 4 | `94ba4c32a7881bf0` |
| `docs/02-mapa-modulos/05-tests-playwright-vitest.md` | 4 | `c8911a164928576a` |
| `docs/03-arquitectura/01-boundaries-host-runtime.md` | 4 | `73dedf99f7c9259a` |
| `docs/03-arquitectura/02-runtime-visual.md` | 4 | `ee49aa8f8344ce7d` |
| `docs/03-arquitectura/03-command-bus-events.md` | 4 | `21bc47d3762efab0` |
| `docs/03-arquitectura/04-snapshot-contract.md` | 4 | `5813f6ca220b1f99` |
| `docs/03-arquitectura/05-external-forms-contract.md` | 4 | `804be83e7dc04d62` |
| `docs/03-arquitectura/06-collaboration-locks.md` | 4 | `2215811ac1f38e37` |
| `docs/03-arquitectura/07-public-api.md` | 4 | `8a6c6ce4061e0b7e` |
| `docs/03-arquitectura/08-fork-safe-evolution.md` | 4 | `74d96b8cc18437fa` |
| `docs/04-recipient-transform/01-recipient-color-behavior.md` | 4 | `01f367178e996d7c` |
| `docs/04-recipient-transform/02-schema-icon-color-sync.md` | 4 | `2e59ebd56c9e57eb` |
| `docs/04-recipient-transform/03-owner-color-persistence.md` | 4 | `acc256dbaa52d307` |
| `docs/04-recipient-transform/04-transform-state-machine.md` | 4 | `4be84b22fd88e56f` |
| `docs/04-recipient-transform/05-moveable-selecto.md` | 4 | `1a1ae3fb4fd5074e` |
| `docs/04-recipient-transform/06-shortcuts-and-inline-edit.md` | 4 | `5fab9132164ad572` |
| `docs/04-recipient-transform/07-accessibility-colors.md` | 4 | `0d18e0725eb31311` |
| `docs/05-ui-ux/01-left-sidebar-catalog.md` | 4 | `bd95da41e2cda0f0` |
| `docs/05-ui-ux/02-right-sidebar-inspector.md` | 4 | `32744afe2d89205a` |
| `docs/05-ui-ux/03-floating-toolbar.md` | 4 | `6c58be7133d26831` |
| `docs/05-ui-ux/04-canvas-overlays.md` | 4 | `0aabc86fb30c7ee3` |
| `docs/05-ui-ux/05-compact-header-host.md` | 4 | `fb2f72098a23cb87` |
| `docs/05-ui-ux/06-responsive.md` | 4 | `1d53ad1a7d30cc1c` |
| `docs/06-css/01-css-boundaries.md` | 4 | `349876819767bb43` |
| `docs/06-css/02-token-system.md` | 4 | `df6411d1b566c93a` |
| `docs/06-css/03-transform-handle-safety.md` | 4 | `c35962df6465f843` |
| `docs/06-css/04-visual-regression.md` | 4 | `54e3b2884a3583ac` |
| `docs/07-calidad/01-comandos-validacion.md` | 4 | `405e546926c212a3` |
| `docs/07-calidad/02-matriz-regresion.md` | 4 | `3e15ddca072b3596` |
| `docs/07-calidad/03-testing-gaps.md` | 4 | `89988fd2983a7ae4` |
| `docs/07-calidad/04-test-results-forensics.md` | 4 | `b47bc933903d5fc7` |
| `docs/08-ia-agentes/01-arquitectura-asistente.md` | 4 | `0e91afb254b4c0fc` |
| `docs/08-ia-agentes/02-catalogo-agentes.md` | 4 | `f45953cc4f1fc861` |
| `docs/08-ia-agentes/03-catalogo-prompts.md` | 4 | `654c01d30cd0d187` |
| `docs/08-ia-agentes/04-economia-tokens.md` | 4 | `cb9d91e6f67f5712` |
| `docs/08-ia-agentes/05-providers.md` | 4 | `09c006485e5899e1` |
| `docs/09-operacion-debug/01-breakpoints-criticos.md` | 4 | `e2378dab33018ddc` |
| `docs/09-operacion-debug/02-hardtrace-playbook.md` | 4 | `1e8f56f959ea9476` |
| `docs/09-operacion-debug/03-troubleshooting.md` | 4 | `a49f38cf9de0eacb` |
| `docs/10-handoff/01-handoff-sesion.md` | 4 | `0b8fec9200ebe2a7` |
| `docs/10-handoff/02-plan-fases.md` | 4 | `f7c57267643445f0` |
| `docs/10-handoff/03-tickets-sugeridos.md` | 4 | `bfff91db64b3ebc0` |
| `docs/99-archivo/README.md` | 4 | `18f1dd886cb3e619` |
| `handoff/README.md` | 4 | `6bfc4e95177b8cf4` |
| `handoff/plan-ejecucion-fases.md` | 26 | `4c7737cbf2fecd15` |
| `handoff/riesgos-residuales.md` | 7 | `d5c9c90ab19fdb14` |
| `handoff/session-handoff.md` | 4 | `223cb0c9253bca37` |
| `handoff/tickets-sugeridos.md` | 11 | `cd1a435d04ff45ac` |
| `package-scripts-sugeridos.md` | 14 | `fe5cfde7df09922a` |
| `reports/current-snapshot/analysis-summary.md` | 60 | `51cc5c0b167c503c` |
| `reports/current-snapshot/css-summary.md` | 9 | `6690b39334a45df2` |
| `reports/current-snapshot/docs-summary.md` | 23 | `392d51314caf7f56` |
| `reports/current-snapshot/module-inventory.md` | 15 | `a5aec36925c78914` |
| `reports/current-snapshot/risk-summary.md` | 10 | `6529647e3564f5b0` |
| `tests/README.md` | 4 | `7c3acb5f7807504c` |
| `tests/matriz-pruebas-regresion-designer.md` | 12 | `7fcf247f8181c63f` |
| `tests/matriz-pruebas-regresion-externalforms.md` | 11 | `05036041b1bc21bf` |
| `tests/plan-playwright.md` | 10 | `e9b2db75afacf11c` |
| `tests/plan-vitest-unitario.md` | 12 | `fc787c1318ef1aa9` |
| `tests/testing-gaps.md` | 10 | `e89554487ad940ac` |

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0010"></a>
## Archivo #10: MIGRATION_GUIDE.md

- **Ruta relativa:** `MIGRATION_GUIDE.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/MIGRATION_GUIDE.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `22`

### Contenido original

# MIGRATION_GUIDE.md — Guía de migración

## Objetivo

Migrar desde una arquitectura Markdown parcial o dispersa hacia una arquitectura agentic centralizada.

## Pasos

1. Respaldar `AGENTS.md`, `.ai`, `docs`, `.github`, `.claude`, `.codex`, `.gemini`.
2. Copiar este paquete sobre la raíz.
3. Revisar `MANIFEST.md`.
4. Mantener `.ai` como fuente de verdad.
5. Mover docs obsoletos a `docs/99-archivo`.
6. Mantener stubs en providers; no duplicar reglas largas.
7. Ajustar prompts con rutas reales si el proyecto cambia de carpeta.

## No hacer

- No mover documentación viva a `src`.
- No crear prompts gigantes con snapshots completos.
- No mantener dos reglas activas para el mismo flujo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0011"></a>
## Archivo #11: PACKAGE_SUMMARY.md

- **Ruta relativa:** `PACKAGE_SUMMARY.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/PACKAGE_SUMMARY.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `12`

### Contenido original

# Resumen del paquete

- **generated_at**: `2026-06-01T18:47:53Z`
- **markdown_files**: `359`
- **json_files**: `4`
- **root**: `13`
- **ai**: `230`
- **docs**: `51`
- **tests**: `6`
- **handoff**: `5`
- **providers**: `47`

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0012"></a>
## Archivo #12: package-scripts-sugeridos.md

- **Ruta relativa:** `package-scripts-sugeridos.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/package-scripts-sugeridos.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `14`

### Contenido original

# Scripts sugeridos

```json
{
  "scripts": {
    "quality:recipient-transform-workspace": "node scripts/ai/check-recipient-transform-workspace.js",
    "test:recipient-colors": "npx playwright test tests/playwright/recipient-colors.spec.ts --project=chromium",
    "test:schema-transform": "npx playwright test tests/playwright/schema-transform.spec.ts --project=chromium",
    "test:unit:recipient": "npx vitest run tests/unit/recipientColor.test.ts tests/unit/schemaTone.test.ts",
    "test:unit:snapshot": "npx vitest run tests/unit/sisad-snapshotAdapter.test.ts tests/unit/sisad-v3Contract.test.ts"
  }
}
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0013"></a>
## Archivo #13: README.md

- **Ruta relativa:** `README.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/README.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `63`

### Contenido original

# SISAD PDFME — Arquitectura Markdown Agentic v3

Generado: `2026-06-01T18:47:53Z`

Este paquete reemplaza y ordena la arquitectura Markdown del workspace `sisad-pdfme`, tomando como referencia la arquitectura amplia de Inverneg pero ajustándola al contexto actual del proyecto: editor PDF, canvas, schemas, destinatarios, colores, transformaciones, snapshots, externalForms, generator/converter, UI/UX y pruebas.

## Diagnóstico base

El análisis cruzó:

- `510` archivos de código JS/TS/JSX/TSX.
- `323` archivos Markdown existentes.
- `6` archivos CSS consolidados.
- Referencia de arquitectura Inverneg/SISAD para adoptar `.ai`, `docs`, `handoff`, `tests`, providers, agentes, subagentes, skills, prompts, reglas y economía de tokens.

## Principio rector

```txt
ContentCustomForm = host de negocio
sisad-pdfme = runtime visual y funcional del PDF
externalForms = runner del snapshot usando Form/Viewer
.ai = memoria y ejecución para asistentes IA
docs = documentación humana y técnica
tests = matrices documentales y planes de validación
```

## Uso recomendado

1. Copiar este paquete en la raíz del proyecto.
2. Leer `AGENTS.md`.
3. Ejecutar el flujo de inicio según el proveedor:
   - Claude: `CLAUDE.md`
   - Codex: `CODEX.md`
   - Copilot: `.github/copilot-instructions.md`
   - Gemini: `GEMINI.md`
4. No cargar todo el snapshot: usar `.ai/INDEX.md` y `.ai/context-map.md`.
5. Validar cambios con build, lint, Vitest dirigido y Playwright cuando toque canvas/visual.

## Capas

```txt
AGENTS.md / CLAUDE.md / CODEX.md / COPILOT.md / GEMINI.md
  -> adaptadores pequeños por proveedor

.ai/
  -> router, memoria, contexto, reglas, agentes, prompts, skills y checklists

docs/
  -> documentación humana y técnica

handoff/
  -> continuidad de sesión, plan y tickets

tests/
  -> matrices de regresión y gaps

reports/
  -> análisis actual, inventarios y riesgos

metadata/
  -> inventarios JSON para futuras herramientas
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0014"></a>
## Archivo #14: .ai/agent-loop.md

- **Ruta relativa:** `.ai/agent-loop.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agent-loop.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `37`

### Contenido original

# Arquitectura del agente

## Loop

```txt
Perceive:
  entender petición, dominio y riesgo.

Retrieve:
  cargar contexto mínimo.

Plan:
  elegir agente/subagente, archivos objetivo y validación.

Act:
  modificar código o generar propuesta.

Observe:
  revisar build/lint/tests/HAR/logs.

Guardrail:
  seguridad, CSS, snapshot, canvas, token budget, no duplicidad.

Memory:
  actualizar memoria si hay decisión permanente.
```

## Herramientas esperadas

- `rg`
- lectura de archivos puntuales
- Vitest dirigido
- Playwright para canvas/visual
- build/lint
- scripts quality
- reportes compactos

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0015"></a>
## Archivo #15: .ai/context-map.md

- **Ruta relativa:** `.ai/context-map.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context-map.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `27`

### Contenido original

# Context map

| Dominio | Contexto | Regla | Prompt |
|---|---|---|---|
| Colores y ownership por destinatario | `.ai/context/recipient-color-context.md` | `.ai/rules/schema-ownership-rules.md` | `.ai/prompts/repair-recipient-color-sync.prompt.md` |
| Iconos del catálogo y color activo | `.ai/context/schema-icon-sync-context.md` | `.ai/rules/schema-icon-color-rules.md` | `.ai/prompts/repair-schema-icon-color-sync.prompt.md` |
| Resize, rotate, drag y selección | `.ai/context/transform-controls-context.md` | `.ai/rules/transform-interaction-rules.md` | `.ai/prompts/repair-transform-collisions.prompt.md` |
| Moveable y Selecto | `.ai/context/moveable-selecto-context.md` | `.ai/rules/moveable-selecto-rules.md` | `.ai/prompts/harden-moveable-selecto-guards.prompt.md` |
| Snapshot y round-trip | `.ai/context/snapshot-contract-context.md` | `.ai/rules/snapshot-contract-rules.md` | `.ai/prompts/repair-snapshot-roundtrip.prompt.md` |
| Runner externalForms | `.ai/context/external-forms-runner-context.md` | `.ai/rules/external-forms-runner-rules.md` | `.ai/prompts/repair-external-forms-runner.prompt.md` |
| Designer engine y API pública | `.ai/context/designer-engine-context.md` | `.ai/rules/public-api-rules.md` | `.ai/prompts/stabilize-designer-engine-api.prompt.md` |
| Left/Right sidebar e inspector | `.ai/context/sidebars-inspector-context.md` | `.ai/rules/sidebars-inspector-rules.md` | `.ai/prompts/repair-sidebars-inspector.prompt.md` |
| CSS, tokens y boundaries | `.ai/context/css-design-system-context.md` | `.ai/rules/css-boundary-rules.md` | `.ai/prompts/audit-css-boundaries.prompt.md` |
| Vitest/Playwright | `.ai/context/tests-quality-context.md` | `.ai/rules/testing-quality-rules.md` | `.ai/prompts/build-regression-test-matrix.prompt.md` |
| Legacy y wrappers | `.ai/context/legacy-cleanup-context.md` | `.ai/rules/legacy-reduction-rules.md` | `.ai/prompts/audit-legacy-runtime-reduction.prompt.md` |
| Integración ContentCustomForm | `.ai/context/content-custom-form-integration-context.md` | `.ai/rules/host-runtime-boundary-rules.md` | `.ai/prompts/repair-contentcustomform-integration.prompt.md` |

## Regla de carga

Un asistente puede cargar al inicio:

```txt
1 contexto principal + 2 reglas + 1 prompt + archivos reales localizados con rg
```

Si necesita más, debe justificarlo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0016"></a>
## Archivo #16: .ai/INDEX.md

- **Ruta relativa:** `.ai/INDEX.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/INDEX.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `41`

### Contenido original

# .ai/INDEX.md — Router de contexto

## Carga inicial obligatoria

1. `.ai/memory/project-memory.md`
2. `.ai/context-map.md`
3. `.ai/rules/context-loading-ladder-rules.md`
4. `.ai/agents/registry.md`

## Loop

```txt
Perceive -> Retrieve -> Plan -> Act -> Observe -> Guardrail -> Memory
```

## Rutas por tarea

| Tarea | Contexto | Regla | Prompt |
|---|---|---|---|
| `recipient-color` | `recipient-color-context.md` | `schema-ownership-rules.md` | `repair-recipient-color-sync.prompt.md` |
| `schema-icon-sync` | `schema-icon-sync-context.md` | `schema-icon-color-rules.md` | `repair-schema-icon-color-sync.prompt.md` |
| `transform-controls` | `transform-controls-context.md` | `transform-interaction-rules.md` | `repair-transform-collisions.prompt.md` |
| `moveable-selecto` | `moveable-selecto-context.md` | `moveable-selecto-rules.md` | `harden-moveable-selecto-guards.prompt.md` |
| `snapshot` | `snapshot-contract-context.md` | `snapshot-contract-rules.md` | `repair-snapshot-roundtrip.prompt.md` |
| `external-forms` | `external-forms-runner-context.md` | `external-forms-runner-rules.md` | `repair-external-forms-runner.prompt.md` |
| `designer-engine` | `designer-engine-context.md` | `public-api-rules.md` | `stabilize-designer-engine-api.prompt.md` |
| `sidebars` | `sidebars-inspector-context.md` | `sidebars-inspector-rules.md` | `repair-sidebars-inspector.prompt.md` |
| `css` | `css-design-system-context.md` | `css-boundary-rules.md` | `audit-css-boundaries.prompt.md` |
| `tests` | `tests-quality-context.md` | `testing-quality-rules.md` | `build-regression-test-matrix.prompt.md` |
| `legacy` | `legacy-cleanup-context.md` | `legacy-reduction-rules.md` | `audit-legacy-runtime-reduction.prompt.md` |
| `content-custom-form` | `content-custom-form-integration-context.md` | `host-runtime-boundary-rules.md` | `repair-contentcustomform-integration.prompt.md` |

## No cargar por defecto

- snapshots completos;
- código unificado completo;
- CSS completo;
- todos los prompts;
- todos los docs;
- reportes grandes.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0017"></a>
## Archivo #17: .ai/README.md

- **Ruta relativa:** `.ai/README.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/README.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# .ai — Memoria operativa para asistentes

`.ai/` contiene el router, memoria, reglas, agentes, subagentes, prompts, skills, plantillas y checklists.

## Política

- `.ai/INDEX.md` enruta el contexto.
- `.ai/context-map.md` resuelve dominio → contexto/reglas/prompts.
- `.ai/memory` guarda decisiones persistentes.
- `.ai/prompts` contiene tareas ejecutables.
- `.ai/rules` contiene guardrails vivos.
- `.ai/skills` contiene procedimientos reutilizables.

No cargar todo `.ai` al inicio.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0018"></a>
## Archivo #18: .claude/README.md

- **Ruta relativa:** `.claude/README.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.claude/README.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Claude workspace

Leer `CLAUDE.md` y `.ai/INDEX.md`.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0019"></a>
## Archivo #19: .codex/README.md

- **Ruta relativa:** `.codex/README.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.codex/README.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Codex workspace

Leer `CODEX.md` y `.ai/INDEX.md`. Cambios pequeños y testeables.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0020"></a>
## Archivo #20: .gemini/README.md

- **Ruta relativa:** `.gemini/README.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.gemini/README.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Gemini workspace

Leer `GEMINI.md` y `.ai/INDEX.md`. Auditar consistencia.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0021"></a>
## Archivo #21: .github/copilot-instructions.md

- **Ruta relativa:** `.github/copilot-instructions.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/copilot-instructions.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# GitHub Copilot Instructions — SISAD PDFME

Fuente de verdad: `.ai/`.

## Inicio

1. Revisar `AGENTS.md`.
2. Revisar `.ai/INDEX.md`.
3. Aplicar `.ai/rules/global-rules.md`.
4. Para colors/transform, leer `.ai/context/recipient-color-context.md` y `.ai/context/transform-controls-context.md`.

## Reglas críticas

- No duplicar runtime.
- No manipular DOM interno.
- No romper CSS scope.
- Agregar tests si cambia contrato.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0022"></a>
## Archivo #22: debug/breakpoints-criticos.md

- **Ruta relativa:** `debug/breakpoints-criticos.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/debug/breakpoints-criticos.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `28`

### Contenido original

# Breakpoints críticos

## Color

- `RecipientContext.ts`
- `recipientColor.ts`
- `PluginIcon.tsx`
- `LeftSidebar.tsx`

## Transform

- `Moveable.tsx`
- `Selecto.tsx`
- `interactionGuards.ts`
- `interactionState.ts`

## Snapshot

- `snapshot.ts`
- `snapshotAdapter.ts`
- `templateValidator.ts`

## externalForms

- `externalFormRunner.ts`
- `Form.tsx`
- `Viewer.tsx`

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0023"></a>
## Archivo #23: debug/hardtrace-playbook.md

- **Ruta relativa:** `debug/hardtrace-playbook.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/debug/hardtrace-playbook.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `17`

### Contenido original

# HardTrace playbook

Eventos sugeridos:

- `recipient.active.changed`
- `catalog.icon.color.resolved`
- `schema.owner.assigned`
- `schema.transform.started`
- `schema.transform.committed`
- `selecto.suspended`
- `inlineEdit.blockedByTransform`
- `snapshot.export.start/success`
- `snapshot.import.start/success`
- `externalForms.runner.rendered`

No loggear PDFs, base64 ni datos sensibles.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0024"></a>
## Archivo #24: handoff/plan-ejecucion-fases.md

- **Ruta relativa:** `handoff/plan-ejecucion-fases.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/handoff/plan-ejecucion-fases.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `26`

### Contenido original

# Plan de ejecución por fases

## Fase 1 — Aplicar arquitectura MD
Copiar paquete y validar estructura.

## Fase 2 — Auditoría recipient colors
Revisar contexto, rules y prompt dedicado.

## Fase 3 — Transform controls
Auditar Moveable/Selecto/guards.

## Fase 4 — Snapshot round-trip
Preservar ownerColor/rotation.

## Fase 5 — ExternalForms
Validar runner `Form`/`Viewer`.

## Fase 6 — CSS boundaries
Auditar overrides y tokens.

## Fase 7 — Legacy cleanup
Eliminar duplicidad sin romper contratos.

## Fase 8 — QA
Build/lint/Vitest/Playwright.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0025"></a>
## Archivo #25: handoff/README.md

- **Ruta relativa:** `handoff/README.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/handoff/README.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Handoff

Usar esta carpeta para continuidad entre sesiones y asistentes.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0026"></a>
## Archivo #26: handoff/riesgos-residuales.md

- **Ruta relativa:** `handoff/riesgos-residuales.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/handoff/riesgos-residuales.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `7`

### Contenido original

# Riesgos residuales

- Los archivos unificados no permiten ejecutar tests aquí.
- Puede existir código fuera del snapshot que requiera adaptar rutas.
- Algunos providers pueden mantener prompts previos divergentes.
- CSS visual requiere navegador real para confirmar.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0027"></a>
## Archivo #27: handoff/session-handoff.md

- **Ruta relativa:** `handoff/session-handoff.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/handoff/session-handoff.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Handoff de sesión

Arquitectura generada. Siguiente acción: aplicar paquete, revisar manifest y ejecutar validaciones.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0028"></a>
## Archivo #28: handoff/tickets-sugeridos.md

- **Ruta relativa:** `handoff/tickets-sugeridos.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/handoff/tickets-sugeridos.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `11`

### Contenido original

# Tickets sugeridos

1. Auditar `PluginIcon` y data attrs de active recipient.
2. Consolidar `recipientColor.ts` como fuente única de paleta.
3. Fortalecer guards de `Moveable.tsx` y `Selecto.tsx`.
4. Validar `snapshotAdapter.ts` con ownerColor/rotation.
5. Crear regression Playwright para schema creado y cambio de recipient.
6. Auditar CSS de compact cards y transform handles.
7. Revisar `externalFormRunner.ts` contra Form/Viewer.
8. Eliminar wrappers de provider docs que dupliquen `.ai`.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0029"></a>
## Archivo #29: tests/matriz-pruebas-regresion-designer.md

- **Ruta relativa:** `tests/matriz-pruebas-regresion-designer.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/tests/matriz-pruebas-regresion-designer.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `12`

### Contenido original

# Matriz de regresión designer

| Caso | Esperado |
|---|---|
| Cambiar destinatario activo | Catálogo cambia color |
| Schema existente | Mantiene ownerColor |
| Resize | No dispara Selecto |
| Rotate | Toolbar recalcula |
| Inline edit | Bloquea transform |
| Context menu | No inicia drag |
| Snapshot import/export | Preserva ownerColor y rotation |

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0030"></a>
## Archivo #30: tests/matriz-pruebas-regresion-externalforms.md

- **Ruta relativa:** `tests/matriz-pruebas-regresion-externalforms.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/tests/matriz-pruebas-regresion-externalforms.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `11`

### Contenido original

# Matriz externalForms

| Caso | Esperado |
|---|---|
| Cargar snapshot | Reconoce versión |
| Filtrar recipient | Solo campos visibles/editables |
| Render Form | No renderer manual paralelo |
| Render Viewer | Solo lectura |
| Guardar inputs | Por schemaUid |
| Generar PDF | Respeta schema values |

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0031"></a>
## Archivo #31: tests/plan-playwright.md

- **Ruta relativa:** `tests/plan-playwright.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/tests/plan-playwright.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `10`

### Contenido original

# Plan Playwright

Prioridad:

1. `recipient-colors.spec.ts`
2. `schema-transform.spec.ts`
3. `canvas-interactions.spec.ts`
4. `multiuser-collaboration.spec.ts`
5. `pdfme-editor.spec.ts`

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0032"></a>
## Archivo #32: tests/plan-vitest-unitario.md

- **Ruta relativa:** `tests/plan-vitest-unitario.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/tests/plan-vitest-unitario.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `12`

### Contenido original

# Plan Vitest unitario

Prioridad:

1. `recipientColor`
2. `schemaTone`
3. `snapshotAdapter`
4. `interactionGuards`
5. `selectionCommands`
6. `designerCoordinateService`
7. `externalFormRunner`

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0033"></a>
## Archivo #33: tests/README.md

- **Ruta relativa:** `tests/README.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/tests/README.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Tests documentales

Matrices y planes de prueba. Los tests ejecutables viven en `tests/unit` y `tests/playwright`.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0034"></a>
## Archivo #34: tests/testing-gaps.md

- **Ruta relativa:** `tests/testing-gaps.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/tests/testing-gaps.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `10`

### Contenido original

# Testing gaps

## Gaps prioritarios

- Snapshot round-trip visual completo.
- Transform con zoom + scroll + multi-page.
- ExternalForms con múltiples recipients.
- CSS regression para handles.
- Accesibilidad de paleta de colores.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0035"></a>
## Archivo #35: .ai/agents/canvas-runtime-agent.md

- **Ruta relativa:** `.ai/agents/canvas-runtime-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/canvas-runtime-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Canvas Runtime Agent

## Rol

Controla canvas, paper, zoom y scroll.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0036"></a>
## Archivo #36: .ai/agents/collaboration-lock-agent.md

- **Ruta relativa:** `.ai/agents/collaboration-lock-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/collaboration-lock-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Collaboration Lock Agent

## Rol

Controla locks, readonly y ownership.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0037"></a>
## Archivo #37: .ai/agents/command-bus-agent.md

- **Ruta relativa:** `.ai/agents/command-bus-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/command-bus-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Command Bus Agent

## Rol

Controla comandos/eventos.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0038"></a>
## Archivo #38: .ai/agents/content-custom-form-agent.md

- **Ruta relativa:** `.ai/agents/content-custom-form-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/content-custom-form-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Content Custom Form Agent

## Rol

Controla host de negocio e integración.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0039"></a>
## Archivo #39: .ai/agents/css-agent.md

- **Ruta relativa:** `.ai/agents/css-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/css-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Css Agent

## Rol

Controla CSS, tokens y boundaries.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0040"></a>
## Archivo #40: .ai/agents/debugging-agent.md

- **Ruta relativa:** `.ai/agents/debugging-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/debugging-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Debugging Agent

## Rol

Analiza incidentes y trazas.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0041"></a>
## Archivo #41: .ai/agents/designer-engine-agent.md

- **Ruta relativa:** `.ai/agents/designer-engine-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/designer-engine-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Designer Engine Agent

## Rol

Controla API pública del engine.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0042"></a>
## Archivo #42: .ai/agents/docs-governance-agent.md

- **Ruta relativa:** `.ai/agents/docs-governance-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/docs-governance-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Docs Governance Agent

## Rol

Mantiene documentación.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0043"></a>
## Archivo #43: .ai/agents/external-forms-agent.md

- **Ruta relativa:** `.ai/agents/external-forms-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/external-forms-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# External Forms Agent

## Rol

Controla runner externalForms.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0044"></a>
## Archivo #44: .ai/agents/frontend-architect-agent.md

- **Ruta relativa:** `.ai/agents/frontend-architect-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/frontend-architect-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Frontend Architect Agent

## Rol

Protege arquitectura React, módulos y límites.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0045"></a>
## Archivo #45: .ai/agents/generator-converter-agent.md

- **Ruta relativa:** `.ai/agents/generator-converter-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/generator-converter-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Generator Converter Agent

## Rol

Controla generación y conversión.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0046"></a>
## Archivo #46: .ai/agents/left-sidebar-catalog-agent.md

- **Ruta relativa:** `.ai/agents/left-sidebar-catalog-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/left-sidebar-catalog-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Left Sidebar Catalog Agent

## Rol

Controla catálogo izquierdo.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0047"></a>
## Archivo #47: .ai/agents/legacy-cleanup-agent.md

- **Ruta relativa:** `.ai/agents/legacy-cleanup-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/legacy-cleanup-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Legacy Cleanup Agent

## Rol

Reduce wrappers y deuda.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0048"></a>
## Archivo #48: .ai/agents/moveable-selecto-agent.md

- **Ruta relativa:** `.ai/agents/moveable-selecto-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/moveable-selecto-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Moveable Selecto Agent

## Rol

Controla transformaciones y selección.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0049"></a>
## Archivo #49: .ai/agents/provider-sync-agent.md

- **Ruta relativa:** `.ai/agents/provider-sync-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/provider-sync-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Provider Sync Agent

## Rol

Sincroniza Claude/Codex/Copilot/Gemini.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0050"></a>
## Archivo #50: .ai/agents/quality-agent.md

- **Ruta relativa:** `.ai/agents/quality-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/quality-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Quality Agent

## Rol

Valida build/lint/tests.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0051"></a>
## Archivo #51: .ai/agents/recipient-color-agent.md

- **Ruta relativa:** `.ai/agents/recipient-color-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/recipient-color-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Recipient Color Agent

## Rol

Controla colores por destinatario.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0052"></a>
## Archivo #52: .ai/agents/registry.md

- **Ruta relativa:** `.ai/agents/registry.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/registry.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `33`

### Contenido original

# Registry de agentes

| Agente | Archivo | Responsabilidad |
|---|---|---|
| Root Orchestrator Agent | `.ai/agents/root-orchestrator-agent.md` | Orquesta tareas, contexto y validación. |
| Frontend Architect Agent | `.ai/agents/frontend-architect-agent.md` | Protege arquitectura React, módulos y límites. |
| Content Custom Form Agent | `.ai/agents/content-custom-form-agent.md` | Controla host de negocio e integración. |
| Sisad Pdfme Runtime Agent | `.ai/agents/sisad-pdfme-runtime-agent.md` | Controla runtime Designer/Form/Viewer. |
| Designer Engine Agent | `.ai/agents/designer-engine-agent.md` | Controla API pública del engine. |
| Canvas Runtime Agent | `.ai/agents/canvas-runtime-agent.md` | Controla canvas, paper, zoom y scroll. |
| Moveable Selecto Agent | `.ai/agents/moveable-selecto-agent.md` | Controla transformaciones y selección. |
| Recipient Color Agent | `.ai/agents/recipient-color-agent.md` | Controla colores por destinatario. |
| Schema Icon Sync Agent | `.ai/agents/schema-icon-sync-agent.md` | Controla iconos y catálogo. |
| Schema Registry Agent | `.ai/agents/schema-registry-agent.md` | Controla plugins y schemas custom. |
| Snapshot Agent | `.ai/agents/snapshot-agent.md` | Controla import/export y round-trip. |
| External Forms Agent | `.ai/agents/external-forms-agent.md` | Controla runner externalForms. |
| Command Bus Agent | `.ai/agents/command-bus-agent.md` | Controla comandos/eventos. |
| Right Sidebar Inspector Agent | `.ai/agents/right-sidebar-inspector-agent.md` | Controla inspector y panel derecho. |
| Left Sidebar Catalog Agent | `.ai/agents/left-sidebar-catalog-agent.md` | Controla catálogo izquierdo. |
| Collaboration Lock Agent | `.ai/agents/collaboration-lock-agent.md` | Controla locks, readonly y ownership. |
| Generator Converter Agent | `.ai/agents/generator-converter-agent.md` | Controla generación y conversión. |
| Css Agent | `.ai/agents/css-agent.md` | Controla CSS, tokens y boundaries. |
| Ui Ux Agent | `.ai/agents/ui-ux-agent.md` | Controla distribución visual. |
| Legacy Cleanup Agent | `.ai/agents/legacy-cleanup-agent.md` | Reduce wrappers y deuda. |
| Quality Agent | `.ai/agents/quality-agent.md` | Valida build/lint/tests. |
| Docs Governance Agent | `.ai/agents/docs-governance-agent.md` | Mantiene documentación. |
| Security Agent | `.ai/agents/security-agent.md` | Protege datos sensibles. |
| Token Economy Agent | `.ai/agents/token-economy-agent.md` | Controla consumo de contexto. |
| Provider Sync Agent | `.ai/agents/provider-sync-agent.md` | Sincroniza Claude/Codex/Copilot/Gemini. |
| Debugging Agent | `.ai/agents/debugging-agent.md` | Analiza incidentes y trazas. |
| Testing Regression Agent | `.ai/agents/testing-regression-agent.md` | Diseña matriz de pruebas. |
| Release Agent | `.ai/agents/release-agent.md` | Prepara checklist release. |

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0053"></a>
## Archivo #53: .ai/agents/release-agent.md

- **Ruta relativa:** `.ai/agents/release-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/release-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Release Agent

## Rol

Prepara checklist release.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0054"></a>
## Archivo #54: .ai/agents/right-sidebar-inspector-agent.md

- **Ruta relativa:** `.ai/agents/right-sidebar-inspector-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/right-sidebar-inspector-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Right Sidebar Inspector Agent

## Rol

Controla inspector y panel derecho.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0055"></a>
## Archivo #55: .ai/agents/root-orchestrator-agent.md

- **Ruta relativa:** `.ai/agents/root-orchestrator-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/root-orchestrator-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Root Orchestrator Agent

## Rol

Orquesta tareas, contexto y validación.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0056"></a>
## Archivo #56: .ai/agents/schema-icon-sync-agent.md

- **Ruta relativa:** `.ai/agents/schema-icon-sync-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/schema-icon-sync-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Schema Icon Sync Agent

## Rol

Controla iconos y catálogo.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0057"></a>
## Archivo #57: .ai/agents/schema-registry-agent.md

- **Ruta relativa:** `.ai/agents/schema-registry-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/schema-registry-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Schema Registry Agent

## Rol

Controla plugins y schemas custom.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0058"></a>
## Archivo #58: .ai/agents/security-agent.md

- **Ruta relativa:** `.ai/agents/security-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/security-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Security Agent

## Rol

Protege datos sensibles.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0059"></a>
## Archivo #59: .ai/agents/sisad-pdfme-runtime-agent.md

- **Ruta relativa:** `.ai/agents/sisad-pdfme-runtime-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/sisad-pdfme-runtime-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Sisad Pdfme Runtime Agent

## Rol

Controla runtime Designer/Form/Viewer.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0060"></a>
## Archivo #60: .ai/agents/snapshot-agent.md

- **Ruta relativa:** `.ai/agents/snapshot-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/snapshot-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Snapshot Agent

## Rol

Controla import/export y round-trip.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0061"></a>
## Archivo #61: .ai/agents/testing-regression-agent.md

- **Ruta relativa:** `.ai/agents/testing-regression-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/testing-regression-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Testing Regression Agent

## Rol

Diseña matriz de pruebas.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0062"></a>
## Archivo #62: .ai/agents/token-economy-agent.md

- **Ruta relativa:** `.ai/agents/token-economy-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/token-economy-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Token Economy Agent

## Rol

Controla consumo de contexto.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0063"></a>
## Archivo #63: .ai/agents/ui-ux-agent.md

- **Ruta relativa:** `.ai/agents/ui-ux-agent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/agents/ui-ux-agent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# Ui Ux Agent

## Rol

Controla distribución visual.

## Entrada mínima

- `.ai/INDEX.md`
- `.ai/memory/project-memory.md`
- `.ai/context-map.md`
- Contexto y regla del dominio.

## Responsabilidades

- Clasificar alcance.
- Identificar archivos objetivo.
- Evitar duplicidad.
- Definir validación.
- Reportar riesgos.

## Salida

```md
## Contexto usado
## Plan
## Archivos objetivo
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0064"></a>
## Archivo #64: .ai/architecture/agent-routing.md

- **Ruta relativa:** `.ai/architecture/agent-routing.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/architecture/agent-routing.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `23`

### Contenido original

# Agent Routing

## Propósito

Mapa de intención a agente principal, subagentes y validación.

## Reglas

- Documentar contratos, no snapshots completos.
- Preferir adaptadores a forks acoplados.
- Evitar duplicidad entre provider adapters.
- Cualquier cambio público debe tener prompt, regla, test y doc.

## Salida esperada

```md
## Decisión
## Impacto
## Archivos afectados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0065"></a>
## Archivo #65: .ai/architecture/assistant-architecture.md

- **Ruta relativa:** `.ai/architecture/assistant-architecture.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/architecture/assistant-architecture.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `23`

### Contenido original

# Assistant Architecture

## Propósito

Define cómo un asistente debe cargar contexto, escoger agente, actuar y cerrar.

## Reglas

- Documentar contratos, no snapshots completos.
- Preferir adaptadores a forks acoplados.
- Evitar duplicidad entre provider adapters.
- Cualquier cambio público debe tener prompt, regla, test y doc.

## Salida esperada

```md
## Decisión
## Impacto
## Archivos afectados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0066"></a>
## Archivo #66: .ai/architecture/context-loading-ladder.md

- **Ruta relativa:** `.ai/architecture/context-loading-ladder.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/architecture/context-loading-ladder.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `23`

### Contenido original

# Context Loading Ladder

## Propósito

Escalera de contexto y presupuesto de tokens.

## Reglas

- Documentar contratos, no snapshots completos.
- Preferir adaptadores a forks acoplados.
- Evitar duplicidad entre provider adapters.
- Cualquier cambio público debe tener prompt, regla, test y doc.

## Salida esperada

```md
## Decisión
## Impacto
## Archivos afectados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0067"></a>
## Archivo #67: .ai/architecture/fork-safe-evolution.md

- **Ruta relativa:** `.ai/architecture/fork-safe-evolution.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/architecture/fork-safe-evolution.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `23`

### Contenido original

# Fork Safe Evolution

## Propósito

Cómo evolucionar sisad-pdfme sin acoplarlo al host SISAD.

## Reglas

- Documentar contratos, no snapshots completos.
- Preferir adaptadores a forks acoplados.
- Evitar duplicidad entre provider adapters.
- Cualquier cambio público debe tener prompt, regla, test y doc.

## Salida esperada

```md
## Decisión
## Impacto
## Archivos afectados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0068"></a>
## Archivo #68: .ai/architecture/module-boundaries.md

- **Ruta relativa:** `.ai/architecture/module-boundaries.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/architecture/module-boundaries.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `23`

### Contenido original

# Module Boundaries

## Propósito

Fronteras entre ContentCustomForm, sisad-pdfme, externalForms y adaptadores.

## Reglas

- Documentar contratos, no snapshots completos.
- Preferir adaptadores a forks acoplados.
- Evitar duplicidad entre provider adapters.
- Cualquier cambio público debe tener prompt, regla, test y doc.

## Salida esperada

```md
## Decisión
## Impacto
## Archivos afectados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0069"></a>
## Archivo #69: .ai/architecture/provider-model.md

- **Ruta relativa:** `.ai/architecture/provider-model.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/architecture/provider-model.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `23`

### Contenido original

# Provider Model

## Propósito

Modelo de proveedores: Claude, Codex, Copilot, Gemini y genérico.

## Reglas

- Documentar contratos, no snapshots completos.
- Preferir adaptadores a forks acoplados.
- Evitar duplicidad entre provider adapters.
- Cualquier cambio público debe tener prompt, regla, test y doc.

## Salida esperada

```md
## Decisión
## Impacto
## Archivos afectados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0070"></a>
## Archivo #70: .ai/architecture/quality-gate-model.md

- **Ruta relativa:** `.ai/architecture/quality-gate-model.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/architecture/quality-gate-model.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `23`

### Contenido original

# Quality Gate Model

## Propósito

Gates mínimos por tipo de cambio.

## Reglas

- Documentar contratos, no snapshots completos.
- Preferir adaptadores a forks acoplados.
- Evitar duplicidad entre provider adapters.
- Cualquier cambio público debe tener prompt, regla, test y doc.

## Salida esperada

```md
## Decisión
## Impacto
## Archivos afectados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0071"></a>
## Archivo #71: .ai/architecture/runtime-ownership.md

- **Ruta relativa:** `.ai/architecture/runtime-ownership.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/architecture/runtime-ownership.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `23`

### Contenido original

# Runtime Ownership

## Propósito

Propiedad de canvas, sidebars, inspector, command bus, snapshots y UI.

## Reglas

- Documentar contratos, no snapshots completos.
- Preferir adaptadores a forks acoplados.
- Evitar duplicidad entre provider adapters.
- Cualquier cambio público debe tener prompt, regla, test y doc.

## Salida esperada

```md
## Decisión
## Impacto
## Archivos afectados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0072"></a>
## Archivo #72: .ai/checklists/before-change.md

- **Ruta relativa:** `.ai/checklists/before-change.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/checklists/before-change.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `7`

### Contenido original

# Before Change

- [ ] ¿Leí contexto mínimo?
- [ ] ¿Identifiqué dueño correcto?
- [ ] ¿Localicé con rg?
- [ ] ¿Hay test cercano?

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0073"></a>
## Archivo #73: .ai/checklists/before-merge.md

- **Ruta relativa:** `.ai/checklists/before-merge.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/checklists/before-merge.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `7`

### Contenido original

# Before Merge

- [ ] Build/lint ejecutados
- [ ] Tests dirigidos
- [ ] Docs actualizadas
- [ ] Riesgos registrados

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0074"></a>
## Archivo #74: .ai/checklists/css-boundaries.md

- **Ruta relativa:** `.ai/checklists/css-boundaries.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/checklists/css-boundaries.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Css Boundaries

- [ ] Scope root
- [ ] No moveable/selecto host override
- [ ] No overflow/transform invasivo

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0075"></a>
## Archivo #75: .ai/checklists/external-forms.md

- **Ruta relativa:** `.ai/checklists/external-forms.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/checklists/external-forms.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `7`

### Contenido original

# External Forms

- [ ] Usa Form/Viewer
- [ ] Filtra por recipient
- [ ] Persiste por schemaUid
- [ ] No renderer paralelo

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0076"></a>
## Archivo #76: .ai/checklists/provider-sync.md

- **Ruta relativa:** `.ai/checklists/provider-sync.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/checklists/provider-sync.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Provider Sync

- [ ] .github apunta a .ai
- [ ] Claude/Codex/Gemini no divergen
- [ ] Prompts sincronizados

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0077"></a>
## Archivo #77: .ai/checklists/quality-gates.md

- **Ruta relativa:** `.ai/checklists/quality-gates.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/checklists/quality-gates.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `7`

### Contenido original

# Quality Gates

- [ ] npm run build
- [ ] npm run lint
- [ ] Vitest dirigido
- [ ] Playwright si visual

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0078"></a>
## Archivo #78: .ai/checklists/recipient-color.md

- **Ruta relativa:** `.ai/checklists/recipient-color.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/checklists/recipient-color.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `7`

### Contenido original

# Recipient Color

- [ ] Colores únicos
- [ ] Catálogo cambia con active recipient
- [ ] Canvas conserva ownerColor
- [ ] Data attrs visibles

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0079"></a>
## Archivo #79: .ai/checklists/release.md

- **Ruta relativa:** `.ai/checklists/release.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/checklists/release.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `7`

### Contenido original

# Release

- [ ] Manifest
- [ ] Package summary
- [ ] Migration guide
- [ ] Riesgos residuales

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0080"></a>
## Archivo #80: .ai/checklists/schema-transform.md

- **Ruta relativa:** `.ai/checklists/schema-transform.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/checklists/schema-transform.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `8`

### Contenido original

# Schema Transform

- [ ] Resize
- [ ] Rotate
- [ ] Drag
- [ ] Selecto suspendido
- [ ] Inline edit protegido

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0081"></a>
## Archivo #81: .ai/checklists/snapshot-roundtrip.md

- **Ruta relativa:** `.ai/checklists/snapshot-roundtrip.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/checklists/snapshot-roundtrip.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `9`

### Contenido original

# Snapshot Roundtrip

- [ ] schemaUid
- [ ] ownerId
- [ ] ownerColor
- [ ] rotation
- [ ] comments
- [ ] signature

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0082"></a>
## Archivo #82: .ai/context/canvas-coordinates-context.md

- **Ruta relativa:** `.ai/context/canvas-coordinates-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/canvas-coordinates-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Canvas Coordinates Context

## Contexto

Las coordenadas dependen de paper root, scale layer, scroll, zoom, bounds y transform-origin. No modificar `getBoundingClientRect`, `overflow`, `position` o transform desde CSS host.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0083"></a>
## Archivo #83: .ai/context/code-map.md

- **Ruta relativa:** `.ai/context/code-map.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/code-map.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `13`

### Contenido original

# Code Map

## Mapa

- `src/sisad-pdfme/ui`: Designer/Form/Viewer y componentes.
- `src/sisad-pdfme/schemas`: plugins y renderers.
- `src/sisad-pdfme/shared`: snapshot, shortcuts, guards y storage.
- `src/sisad-pdfme/common`: tipos base y helpers.
- `src/sisad-pdfme/generator`: generación PDF.
- `src/sisad-pdfme/converter`: conversión PDF/imagen.
- `tests/unit`: contratos puros.
- `tests/playwright`: regresión visual/canvas.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0084"></a>
## Archivo #84: .ai/context/collaboration-locks-context.md

- **Ruta relativa:** `.ai/context/collaboration-locks-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/collaboration-locks-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Collaboration Locks Context

## Contexto

Locks y readonly permiten seleccionar pero bloquean cambios destructivos o transformaciones.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0085"></a>
## Archivo #85: .ai/context/command-bus-context.md

- **Ruta relativa:** `.ai/context/command-bus-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/command-bus-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Command Bus Context

## Contexto

El command bus es la vía para acciones externas seguras: selection, duplicate, delete, group, transform, zoom, page y panels.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0086"></a>
## Archivo #86: .ai/context/content-custom-form-integration-context.md

- **Ruta relativa:** `.ai/context/content-custom-form-integration-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/content-custom-form-integration-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Content Custom Form Integration Context

## Contexto

`ContentCustomForm` debe ser host de negocio: destinatarios, acciones, persistencia, guardar/descargar/importar y generación de solicitud. No debe poseer canvas, sidebars ni transform controls.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0087"></a>
## Archivo #87: .ai/context/css-design-system-context.md

- **Ruta relativa:** `.ai/context/css-design-system-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/css-design-system-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Css Design System Context

## Contexto

Tokens, variables y capas CSS deben evitar sobrescribir geometry handles. Todo bajo `.sisad-pdfme-root`.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0088"></a>
## Archivo #88: .ai/context/css-map.md

- **Ruta relativa:** `.ai/context/css-map.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/css-map.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `13`

### Contenido original

# Css Map

## CSS analizado

- `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css`
- `src/features/pdfcomponent/labRoutes.css`
- `src/sisad-pdfme/ui/styles/canvas-interactions.css`
- `src/sisad-pdfme/ui/styles/sisad-pdfme-demo.css`
- `src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css`
- `src/sisad-pdfme/ui/styles/tokens.css`

La frontera CSS es `.sisad-pdfme-root`.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0089"></a>
## Archivo #89: .ai/context/designer-engine-context.md

- **Ruta relativa:** `.ai/context/designer-engine-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/designer-engine-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Designer Engine Context

## Contexto

`designerEngine` debe exponer API pública estable para comandos, eventos, import/export y cambios controlados. Evitar que hosts lean estados internos frágiles.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0090"></a>
## Archivo #90: .ai/context/docs-map.md

- **Ruta relativa:** `.ai/context/docs-map.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/docs-map.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Docs Map

## Docs previos

La documentación previa contiene agentes, prompts, skills, instructions y docs humanas. La v3 consolida rutas, elimina duplicidad y agrega contexto de integración host/runtime.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0091"></a>
## Archivo #91: .ai/context/external-forms-runner-context.md

- **Ruta relativa:** `.ai/context/external-forms-runner-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/external-forms-runner-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# External Forms Runner Context

## Contexto

externalForms debe consumir snapshot, seleccionar documento/destinatario y renderizar con `Form`/`Viewer`.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0092"></a>
## Archivo #92: .ai/context/generator-converter-context.md

- **Ruta relativa:** `.ai/context/generator-converter-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/generator-converter-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Generator Converter Context

## Contexto

Generator y converter deben mantener paridad con Designer/Form/Viewer y no depender de DOM host.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0093"></a>
## Archivo #93: .ai/context/integration-host-boundaries-context.md

- **Ruta relativa:** `.ai/context/integration-host-boundaries-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/integration-host-boundaries-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Integration Host Boundaries Context

## Contexto

Host y runtime se comunican con props, commands, events y snapshot. Nunca por DOM interno.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0094"></a>
## Archivo #94: .ai/context/legacy-cleanup-context.md

- **Ruta relativa:** `.ai/context/legacy-cleanup-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/legacy-cleanup-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Legacy Cleanup Context

## Contexto

Eliminar wrappers/aliases sin valor, pero mantener bridges explícitos si hay contrato público.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0095"></a>
## Archivo #95: .ai/context/module-map.md

- **Ruta relativa:** `.ai/context/module-map.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/module-map.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Module Map

- `tests/playwright`: 11 archivos
- `tests/unit`: 83 archivos
- `src/sisad-pdfme/ui`: 121 archivos
- `src/sisad-pdfme/schemas`: 56 archivos
- `src/sisad-pdfme/pdf-lib`: 154 archivos
- `src/sisad-pdfme/generator`: 5 archivos
- `src/sisad-pdfme/converter`: 8 archivos
- `src/sisad-pdfme/shared`: 13 archivos
- `src/sisad-pdfme/common`: 11 archivos
- `src/sisad-pdfme/collaboration`: 3 archivos
- `src/sisad-pdfme/externalForms`: 1 archivos
- `src/features/pdfcomponent`: 18 archivos

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0096"></a>
## Archivo #96: .ai/context/moveable-selecto-context.md

- **Ruta relativa:** `.ai/context/moveable-selecto-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/moveable-selecto-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Moveable Selecto Context

## Contexto

Moveable maneja resize/rotate/drag. Selecto maneja selección. Deben suspenderse mutuamente según modo de interacción.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0097"></a>
## Archivo #97: .ai/context/project-overview.md

- **Ruta relativa:** `.ai/context/project-overview.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/project-overview.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Project Overview

## Resumen

Runtime `sisad-pdfme` analizado desde 510 archivos de código, 323 Markdown y 6 CSS. El objetivo actual es estabilizar recipient colors, transform controls, snapshots, externalForms y arquitectura IA.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0098"></a>
## Archivo #98: .ai/context/provider-compatibility-context.md

- **Ruta relativa:** `.ai/context/provider-compatibility-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/provider-compatibility-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Provider Compatibility Context

## Contexto

Claude/Codex/Copilot/Gemini deben leer `.ai` y no divergir.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0099"></a>
## Archivo #99: .ai/context/recipient-color-context.md

- **Ruta relativa:** `.ai/context/recipient-color-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/recipient-color-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Recipient Color Context

## Contexto

Catálogo = activeRecipientColor. Canvas = schema ownerColor. Los recipients deben resolver color único desde explícito, paleta o fallback.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0100"></a>
## Archivo #100: .ai/context/schema-icon-sync-context.md

- **Ruta relativa:** `.ai/context/schema-icon-sync-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/schema-icon-sync-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Schema Icon Sync Context

## Contexto

`PluginIcon` debe recibir `activeRecipientColor` explícito y exponer `data-active-recipient-color` para pruebas visuales.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0101"></a>
## Archivo #101: .ai/context/schema-owner-persistence-context.md

- **Ruta relativa:** `.ai/context/schema-owner-persistence-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/schema-owner-persistence-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Schema Owner Persistence Context

## Contexto

Cada schema necesita identidad estable, ownerId, ownerColor, assignment, página, documento y metadata serializable.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0102"></a>
## Archivo #102: .ai/context/schema-registry-context.md

- **Ruta relativa:** `.ai/context/schema-registry-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/schema-registry-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Schema Registry Context

## Contexto

El registry debe permitir built-in y custom plugins sin romper Form/Viewer/generator. Los schemas custom guardan metadata avanzada en `__designer`.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0103"></a>
## Archivo #103: .ai/context/security-privacy-context.md

- **Ruta relativa:** `.ai/context/security-privacy-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/security-privacy-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Security Privacy Context

## Contexto

No loggear PDFs, base64, PII, tokens ni payloads sensibles. Los fixtures deben usar datos sintéticos.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0104"></a>
## Archivo #104: .ai/context/selection-shortcuts-context.md

- **Ruta relativa:** `.ai/context/selection-shortcuts-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/selection-shortcuts-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Selection Shortcuts Context

## Contexto

Shortcuts deben respetar foco editable. `Mod+A`, Delete, Escape, group/ungroup no deben ejecutar sobre canvas si el usuario escribe.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0105"></a>
## Archivo #105: .ai/context/sidebars-inspector-context.md

- **Ruta relativa:** `.ai/context/sidebars-inspector-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/sidebars-inspector-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Sidebars Inspector Context

## Contexto

LeftSidebar muestra catálogo. RightSidebar muestra lista, docs, comments e inspector. Hosts no deben duplicar sus controles.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0106"></a>
## Archivo #106: .ai/context/sisad-pdfme-runtime-context.md

- **Ruta relativa:** `.ai/context/sisad-pdfme-runtime-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/sisad-pdfme-runtime-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Sisad Pdfme Runtime Context

## Contexto

`sisad-pdfme` es runtime visual y funcional. Controla `Designer`, `Form`, `Viewer`, canvas, sidebars, inspector, toolbar, comments, docs rail, command bus y rendering.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0107"></a>
## Archivo #107: .ai/context/snapshot-contract-context.md

- **Ruta relativa:** `.ai/context/snapshot-contract-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/snapshot-contract-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Snapshot Contract Context

## Contexto

Snapshot round-trip debe preservar recipients, assignments, colors, owner, schemas, rotation, comments, signature config y versiones.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0108"></a>
## Archivo #108: .ai/context/tests-quality-context.md

- **Ruta relativa:** `.ai/context/tests-quality-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/tests-quality-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Tests Quality Context

## Contexto

Vitest cubre contratos puros; Playwright cubre canvas, color visual, keyboard, transform y snapshots en navegador.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0109"></a>
## Archivo #109: .ai/context/transform-controls-context.md

- **Ruta relativa:** `.ai/context/transform-controls-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/transform-controls-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Transform Controls Context

## Contexto

Resize/rotate/drag deben funcionar al seleccionar schema, pero no durante inline edit, input focus, context menu, comments o schema locked.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0110"></a>
## Archivo #110: .ai/context/ui-ux-compact-context.md

- **Ruta relativa:** `.ai/context/ui-ux-compact-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/context/ui-ux-compact-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Ui Ux Compact Context

## Contexto

UI compacta tipo DocuSign/Wix: catálogo con icono + nombre, header mínimo, inspector derecho para detalle.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0111"></a>
## Archivo #111: .ai/memory/decisions.md

- **Ruta relativa:** `.ai/memory/decisions.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/memory/decisions.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Decisiones arquitectónicas

## ADR-001 — `.ai` como fuente de verdad

Los adaptadores de proveedor apuntan a `.ai` y no duplican reglas largas.

## ADR-002 — Color activo vs ownerColor

El catálogo representa el destinatario activo; los schemas existentes representan su owner original.

## ADR-003 — Runtime canvas aislado

Moveable, Selecto, canvas, toolbar e inspector pertenecen al runtime `sisad-pdfme`.

## ADR-004 — Snapshot como contrato

El snapshot preserva identidad, documento, página, recipient, owner, color, rotation, comments y firma.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0112"></a>
## Archivo #112: .ai/memory/incidents.md

- **Ruta relativa:** `.ai/memory/incidents.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/memory/incidents.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `26`

### Contenido original

# Incidentes conocidos

## I-001 — Color de catálogo no actualiza

Síntoma: iconos quedan con color de destinatario anterior.

Hipótesis: `activeRecipientColor` no llega a `PluginIcon` o no se refleja como data attr/CSS variable.

## I-002 — ownerColor muta al cambiar destinatario

Síntoma: schemas existentes cambian de color al cambiar usuario activo.

Hipótesis: se resuelve color desde active recipient en vez de schema owner.

## I-003 — Transform colisiona con Selecto o inline edit

Síntoma: resize/rotate dispara selección múltiple, menú o edición.

Hipótesis: falta state machine/guards de interacción.

## I-004 — Snapshot pierde rotation/ownerColor

Síntoma: import/export no restaura el canvas.

Hipótesis: metadata no está normalizada o no se serializa.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0113"></a>
## Archivo #113: .ai/memory/project-memory.md

- **Ruta relativa:** `.ai/memory/project-memory.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/memory/project-memory.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `21`

### Contenido original

# Memoria del proyecto

## Contexto permanente

`sisad-pdfme` es un runtime de edición y generación PDF con `Designer`, `Form`, `Viewer`, schemas, colaboración, recipients, ownership, comments, snapshots, generator y converter.

## Decisiones activas

- `.ai` es fuente de verdad para asistentes.
- El catálogo usa color de destinatario activo.
- El canvas usa ownerColor persistente por schema.
- Transformaciones deben pasar por guards y command bus.
- CSS debe permanecer bajo `.sisad-pdfme-root`.
- externalForms debe consumir snapshot y runtime, no duplicar renderer.

## Inventario base

- Código analizado: `510` archivos.
- Markdown previo: `323` archivos.
- CSS: `6` archivos.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0114"></a>
## Archivo #114: .ai/memory/session-handoff.md

- **Ruta relativa:** `.ai/memory/session-handoff.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/memory/session-handoff.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `21`

### Contenido original

# Session handoff

## Estado

Arquitectura Markdown v3 generada para ordenar agentes, prompts, reglas, docs y validación.

## Próximo paso recomendado

Aplicar el paquete y ejecutar auditoría selectiva sobre:

1. `RecipientContext.ts`
2. `PluginIcon.tsx`
3. `LeftSidebar.tsx`
4. `recipientColor.ts`
5. `schemaTone.ts`
6. `Moveable.tsx`
7. `Selecto.tsx`
8. `snapshotAdapter.ts`
9. `externalFormRunner.ts`
10. CSS de catálogo y transform handles

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0115"></a>
## Archivo #115: .ai/memory/update-protocol.md

- **Ruta relativa:** `.ai/memory/update-protocol.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/memory/update-protocol.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `17`

### Contenido original

# Protocolo de actualización de memoria

Actualizar memoria solo si existe una decisión permanente, incidente recurrente o cambio de contrato.

## Formato

```md
## Fecha
## Dominio
## Decisión o incidente
## Evidencia
## Impacto
## Archivos relacionados
```

No guardar logs con datos sensibles ni snapshots completos.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0116"></a>
## Archivo #116: .ai/prompts/audit-css-boundaries.prompt.md

- **Ruta relativa:** `.ai/prompts/audit-css-boundaries.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/audit-css-boundaries.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `59`

### Contenido original

# Prompt: audit-css-boundaries

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Auditar CSS invasivo.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `sisad-pdfme-global.css`
- `canvas-interactions.css`
- `tokens.css`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0117"></a>
## Archivo #117: .ai/prompts/audit-legacy-runtime-reduction.prompt.md

- **Ruta relativa:** `.ai/prompts/audit-legacy-runtime-reduction.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/audit-legacy-runtime-reduction.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `57`

### Contenido original

# Prompt: audit-legacy-runtime-reduction

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Eliminar wrappers/aliases.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `src/sisad-pdfme/**`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0118"></a>
## Archivo #118: .ai/prompts/audit-platform-boundaries.prompt.md

- **Ruta relativa:** `.ai/prompts/audit-platform-boundaries.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/audit-platform-boundaries.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: audit-platform-boundaries

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Auditar frontera fork vs host.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `src/sisad-pdfme`
- `src/features`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0119"></a>
## Archivo #119: .ai/prompts/build-regression-test-matrix.prompt.md

- **Ruta relativa:** `.ai/prompts/build-regression-test-matrix.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/build-regression-test-matrix.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: build-regression-test-matrix

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Crear matriz test.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `tests/playwright`
- `tests/unit`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0120"></a>
## Archivo #120: .ai/prompts/create-playwright-canvas-scenarios.prompt.md

- **Ruta relativa:** `.ai/prompts/create-playwright-canvas-scenarios.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/create-playwright-canvas-scenarios.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `57`

### Contenido original

# Prompt: create-playwright-canvas-scenarios

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Escenarios Playwright canvas.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `tests/playwright`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0121"></a>
## Archivo #121: .ai/prompts/create-test-fixtures-multi-recipient-colors.prompt.md

- **Ruta relativa:** `.ai/prompts/create-test-fixtures-multi-recipient-colors.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/create-test-fixtures-multi-recipient-colors.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: create-test-fixtures-multi-recipient-colors

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Fixtures multi recipient.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `labExamples.js`
- `recipientFactory.ts`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0122"></a>
## Archivo #122: .ai/prompts/fix-keyboard-shortcut-collisions.prompt.md

- **Ruta relativa:** `.ai/prompts/fix-keyboard-shortcut-collisions.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/fix-keyboard-shortcut-collisions.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: fix-keyboard-shortcut-collisions

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Bloquear shortcuts en inputs.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `keyboardShortcuts.ts`
- `useDesignerKeyboardShortcuts.ts`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0123"></a>
## Archivo #123: .ai/prompts/generate-final-implementation-report.prompt.md

- **Ruta relativa:** `.ai/prompts/generate-final-implementation-report.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/generate-final-implementation-report.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `57`

### Contenido original

# Prompt: generate-final-implementation-report

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Reporte final.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `reports`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0124"></a>
## Archivo #124: .ai/prompts/harden-moveable-selecto-guards.prompt.md

- **Ruta relativa:** `.ai/prompts/harden-moveable-selecto-guards.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/harden-moveable-selecto-guards.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `59`

### Contenido original

# Prompt: harden-moveable-selecto-guards

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Endurecer guards Moveable/Selecto.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `Moveable.tsx`
- `Selecto.tsx`
- `interactionState.ts`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0125"></a>
## Archivo #125: .ai/prompts/implement-unique-recipient-palette.prompt.md

- **Ruta relativa:** `.ai/prompts/implement-unique-recipient-palette.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/implement-unique-recipient-palette.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: implement-unique-recipient-palette

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Paleta única y accesible.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `recipientColor.ts`
- `recipientColor.test.ts`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0126"></a>
## Archivo #126: .ai/prompts/INDEX.md

- **Ruta relativa:** `.ai/prompts/INDEX.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/INDEX.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `34`

### Contenido original

# Índice de prompts

- `.ai/prompts/recipient-transform-master-plan.prompt.md` — Plan maestro para colors + transform controls
- `.ai/prompts/repair-recipient-color-sync.prompt.md` — Corregir sincronización active recipient color
- `.ai/prompts/repair-schema-icon-color-sync.prompt.md` — Asegurar iconos de catálogo con color activo
- `.ai/prompts/preserve-owner-color-on-existing-schemas.prompt.md` — Preservar ownerColor de schemas creados
- `.ai/prompts/implement-unique-recipient-palette.prompt.md` — Paleta única y accesible
- `.ai/prompts/repair-transform-collisions.prompt.md` — Eliminar colisiones resize/rotate/selection
- `.ai/prompts/harden-moveable-selecto-guards.prompt.md` — Endurecer guards Moveable/Selecto
- `.ai/prompts/stabilize-schema-resize-rotation.prompt.md` — Estabilizar resize y rotation
- `.ai/prompts/protect-inline-edit-from-transform.prompt.md` — Evitar inline edit durante transform
- `.ai/prompts/fix-keyboard-shortcut-collisions.prompt.md` — Bloquear shortcuts en inputs
- `.ai/prompts/repair-floating-toolbar-position.prompt.md` — Recalcular toolbar tras transform
- `.ai/prompts/repair-snapshot-roundtrip.prompt.md` — Preservar ownerColor/rotation en snapshot
- `.ai/prompts/repair-external-forms-runner.prompt.md` — ExternalForms como runner real
- `.ai/prompts/stabilize-designer-engine-api.prompt.md` — Estabilizar API pública del engine
- `.ai/prompts/audit-css-boundaries.prompt.md` — Auditar CSS invasivo
- `.ai/prompts/unify-css-architecture.prompt.md` — Unificar CSS y tokens
- `.ai/prompts/audit-legacy-runtime-reduction.prompt.md` — Eliminar wrappers/aliases
- `.ai/prompts/build-regression-test-matrix.prompt.md` — Crear matriz test
- `.ai/prompts/inspect-failed-test-results.prompt.md` — Analizar fallos de test
- `.ai/prompts/update-docs-recipient-transform.prompt.md` — Actualizar docs de color y transform
- `.ai/prompts/generate-final-implementation-report.prompt.md` — Reporte final
- `.ai/prompts/audit-platform-boundaries.prompt.md` — Auditar frontera fork vs host
- `.ai/prompts/normalize-selection-transform-state-machine.prompt.md` — Normalizar state machine
- `.ai/prompts/standardize-data-attributes-for-colors.prompt.md` — Estandarizar data attrs
- `.ai/prompts/create-playwright-canvas-scenarios.prompt.md` — Escenarios Playwright canvas
- `.ai/prompts/create-test-fixtures-multi-recipient-colors.prompt.md` — Fixtures multi recipient
- `.ai/prompts/refactor-left-rail-catalog.prompt.md` — Refactor catálogo
- `.ai/prompts/refactor-right-inspector-layout.prompt.md` — Refactor inspector
- `.ai/prompts/refactor-transform-geometry-utils.prompt.md` — Extraer geometry utils
- `.ai/prompts/review-css-for-transform-handle-breaks.prompt.md` — Revisar CSS que rompe handles
- `.ai/prompts/validate-ci-flow-recipient-transform.prompt.md` — Validar flujo CI

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0127"></a>
## Archivo #127: .ai/prompts/inspect-failed-test-results.prompt.md

- **Ruta relativa:** `.ai/prompts/inspect-failed-test-results.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/inspect-failed-test-results.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: inspect-failed-test-results

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Analizar fallos de test.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `test-results`
- `trace`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0128"></a>
## Archivo #128: .ai/prompts/normalize-selection-transform-state-machine.prompt.md

- **Ruta relativa:** `.ai/prompts/normalize-selection-transform-state-machine.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/normalize-selection-transform-state-machine.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: normalize-selection-transform-state-machine

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Normalizar state machine.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `interactionState.ts`
- `interactionGuards.ts`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0129"></a>
## Archivo #129: .ai/prompts/preserve-owner-color-on-existing-schemas.prompt.md

- **Ruta relativa:** `.ai/prompts/preserve-owner-color-on-existing-schemas.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/preserve-owner-color-on-existing-schemas.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `59`

### Contenido original

# Prompt: preserve-owner-color-on-existing-schemas

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Preservar ownerColor de schemas creados.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `schemaTone.ts`
- `snapshotAdapter.ts`
- `schemaDesignerMeta.ts`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0130"></a>
## Archivo #130: .ai/prompts/protect-inline-edit-from-transform.prompt.md

- **Ruta relativa:** `.ai/prompts/protect-inline-edit-from-transform.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/protect-inline-edit-from-transform.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: protect-inline-edit-from-transform

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Evitar inline edit durante transform.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `InlineEditOverlay.tsx`
- `interactionGuards.ts`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0131"></a>
## Archivo #131: .ai/prompts/recipient-transform-master-plan.prompt.md

- **Ruta relativa:** `.ai/prompts/recipient-transform-master-plan.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/recipient-transform-master-plan.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `62`

### Contenido original

# Prompt: recipient-transform-master-plan

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Plan maestro para colors + transform controls.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `RecipientContext.ts`
- `PluginIcon.tsx`
- `LeftSidebar.tsx`
- `recipientColor.ts`
- `Moveable.tsx`
- `Selecto.tsx`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0132"></a>
## Archivo #132: .ai/prompts/refactor-left-rail-catalog.prompt.md

- **Ruta relativa:** `.ai/prompts/refactor-left-rail-catalog.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/refactor-left-rail-catalog.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: refactor-left-rail-catalog

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Refactor catálogo.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `LeftSidebar.tsx`
- `LeftSidebarGroup.tsx`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0133"></a>
## Archivo #133: .ai/prompts/refactor-right-inspector-layout.prompt.md

- **Ruta relativa:** `.ai/prompts/refactor-right-inspector-layout.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/refactor-right-inspector-layout.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: refactor-right-inspector-layout

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Refactor inspector.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `RightSidebar.tsx`
- `DetailView.tsx`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0134"></a>
## Archivo #134: .ai/prompts/refactor-transform-geometry-utils.prompt.md

- **Ruta relativa:** `.ai/prompts/refactor-transform-geometry-utils.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/refactor-transform-geometry-utils.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: refactor-transform-geometry-utils

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Extraer geometry utils.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `coordinateMath.ts`
- `designerCoordinateService.ts`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0135"></a>
## Archivo #135: .ai/prompts/repair-contentcustomform-integration.prompt.md

- **Ruta relativa:** `.ai/prompts/repair-contentcustomform-integration.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/repair-contentcustomform-integration.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `46`

### Contenido original

# Prompt: repair-contentcustomform-integration

## Rol

Actúa como arquitecto frontend senior experto en React, Vite, pdfme y diseño de editores PDF.

## Objetivo

Alinear ContentCustomForm como host de negocio y sisad-pdfme como runtime visual.

## Contexto obligatorio

- `AGENTS.md`
- `.ai/INDEX.md`
- `.ai/context-map.md`
- `.ai/rules/global-rules.md`

## Archivos candidatos

- `src/features/ContentCustomForm/**`
- `src/sisad-pdfme/ui/Designer.tsx`
- `src/sisad-pdfme/ui/index.ts`

## Reglas

- No duplicar runtime interno.
- No manipular DOM del designer.
- No romper snapshot.
- Mantener cambios pequeños y verificables.

## Validación

```bash
npm run build -- --mode development
npm run lint
```

## Entregable

```md
## Diagnóstico
## Cambios
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0136"></a>
## Archivo #136: .ai/prompts/repair-external-forms-runner.prompt.md

- **Ruta relativa:** `.ai/prompts/repair-external-forms-runner.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/repair-external-forms-runner.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `59`

### Contenido original

# Prompt: repair-external-forms-runner

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

ExternalForms como runner real.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `externalFormRunner.ts`
- `Form.tsx`
- `Viewer.tsx`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0137"></a>
## Archivo #137: .ai/prompts/repair-floating-toolbar-position.prompt.md

- **Ruta relativa:** `.ai/prompts/repair-floating-toolbar-position.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/repair-floating-toolbar-position.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: repair-floating-toolbar-position

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Recalcular toolbar tras transform.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `useFloatingToolbarPosition.ts`
- `SelectionContextToolbar.tsx`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0138"></a>
## Archivo #138: .ai/prompts/repair-recipient-color-sync.prompt.md

- **Ruta relativa:** `.ai/prompts/repair-recipient-color-sync.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/repair-recipient-color-sync.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `60`

### Contenido original

# Prompt: repair-recipient-color-sync

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Corregir sincronización active recipient color.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `RecipientContext.ts`
- `PluginIcon.tsx`
- `LeftSidebar.tsx`
- `recipientColor.ts`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0139"></a>
## Archivo #139: .ai/prompts/repair-schema-icon-color-sync.prompt.md

- **Ruta relativa:** `.ai/prompts/repair-schema-icon-color-sync.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/repair-schema-icon-color-sync.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `59`

### Contenido original

# Prompt: repair-schema-icon-color-sync

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Asegurar iconos de catálogo con color activo.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `PluginIcon.tsx`
- `LeftSidebarGroup.tsx`
- `sisad-pdfme-global.css`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0140"></a>
## Archivo #140: .ai/prompts/repair-sidebars-inspector.prompt.md

- **Ruta relativa:** `.ai/prompts/repair-sidebars-inspector.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/repair-sidebars-inspector.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `47`

### Contenido original

# Prompt: repair-sidebars-inspector

## Rol

Actúa como arquitecto frontend senior experto en React, Vite, pdfme y diseño de editores PDF.

## Objetivo

Corregir sidebars e inspector sin duplicar controles del runtime.

## Contexto obligatorio

- `AGENTS.md`
- `.ai/INDEX.md`
- `.ai/context-map.md`
- `.ai/rules/global-rules.md`

## Archivos candidatos

- `LeftSidebar.tsx`
- `RightSidebar.tsx`
- `DetailView.tsx`
- `SidebarSurfacePrimitives.tsx`

## Reglas

- No duplicar runtime interno.
- No manipular DOM del designer.
- No romper snapshot.
- Mantener cambios pequeños y verificables.

## Validación

```bash
npm run build -- --mode development
npm run lint
```

## Entregable

```md
## Diagnóstico
## Cambios
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0141"></a>
## Archivo #141: .ai/prompts/repair-snapshot-roundtrip.prompt.md

- **Ruta relativa:** `.ai/prompts/repair-snapshot-roundtrip.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/repair-snapshot-roundtrip.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `59`

### Contenido original

# Prompt: repair-snapshot-roundtrip

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Preservar ownerColor/rotation en snapshot.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `snapshot.ts`
- `snapshotAdapter.ts`
- `templateValidator.ts`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0142"></a>
## Archivo #142: .ai/prompts/repair-transform-collisions.prompt.md

- **Ruta relativa:** `.ai/prompts/repair-transform-collisions.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/repair-transform-collisions.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `59`

### Contenido original

# Prompt: repair-transform-collisions

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Eliminar colisiones resize/rotate/selection.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `Moveable.tsx`
- `Selecto.tsx`
- `interactionGuards.ts`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0143"></a>
## Archivo #143: .ai/prompts/review-css-for-transform-handle-breaks.prompt.md

- **Ruta relativa:** `.ai/prompts/review-css-for-transform-handle-breaks.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/review-css-for-transform-handle-breaks.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `57`

### Contenido original

# Prompt: review-css-for-transform-handle-breaks

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Revisar CSS que rompe handles.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `sisad-pdfme-global.css`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0144"></a>
## Archivo #144: .ai/prompts/stabilize-designer-engine-api.prompt.md

- **Ruta relativa:** `.ai/prompts/stabilize-designer-engine-api.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/stabilize-designer-engine-api.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: stabilize-designer-engine-api

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Estabilizar API pública del engine.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `designerEngine.ts`
- `designerEngine.api.md`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0145"></a>
## Archivo #145: .ai/prompts/stabilize-schema-resize-rotation.prompt.md

- **Ruta relativa:** `.ai/prompts/stabilize-schema-resize-rotation.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/stabilize-schema-resize-rotation.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: stabilize-schema-resize-rotation

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Estabilizar resize y rotation.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `Moveable.tsx`
- `rotation-geometry-contract`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0146"></a>
## Archivo #146: .ai/prompts/standardize-data-attributes-for-colors.prompt.md

- **Ruta relativa:** `.ai/prompts/standardize-data-attributes-for-colors.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/standardize-data-attributes-for-colors.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: standardize-data-attributes-for-colors

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Estandarizar data attrs.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `PluginIcon.tsx`
- `Canvas.tsx`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0147"></a>
## Archivo #147: .ai/prompts/unify-css-architecture.prompt.md

- **Ruta relativa:** `.ai/prompts/unify-css-architecture.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/unify-css-architecture.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: unify-css-architecture

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Unificar CSS y tokens.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `tokens.css`
- `sisad-pdfme-global.css`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0148"></a>
## Archivo #148: .ai/prompts/update-docs-recipient-transform.prompt.md

- **Ruta relativa:** `.ai/prompts/update-docs-recipient-transform.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/update-docs-recipient-transform.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `58`

### Contenido original

# Prompt: update-docs-recipient-transform

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Actualizar docs de color y transform.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `docs/06-funcionalidades`
- `.ai/context`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0149"></a>
## Archivo #149: .ai/prompts/validate-ci-flow-recipient-transform.prompt.md

- **Ruta relativa:** `.ai/prompts/validate-ci-flow-recipient-transform.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/prompts/validate-ci-flow-recipient-transform.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `59`

### Contenido original

# Prompt: validate-ci-flow-recipient-transform

## Rol

Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, pdfme, canvas interactions, Moveable, Selecto, Vitest, Playwright y diseño de sistemas configurables.

## Objetivo

Validar flujo CI.

## Contexto obligatorio

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. Regla del dominio según `.ai/context-map.md`

## Archivos candidatos

- `package.json`
- `playwright.config.ts`
- `vitest.config.ts`

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper snapshot.
- No usar delays arbitrarios.
- Mantener CSS scope.
- Agregar test si cambia comportamiento.

## Validación sugerida

```bash
npm run build -- --mode development
npm run lint
npx vitest run
```

Para canvas/visual:

```bash
npx playwright test tests/playwright/recipient-colors.spec.ts tests/playwright/schema-transform.spec.ts --project=chromium
```

## Entregable obligatorio

```md
# Resultado
## Diagnóstico
## Cambios realizados
## Tests agregados o actualizados
## Comandos ejecutados
## Riesgos residuales
## Documentación actualizada
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0150"></a>
## Archivo #150: .ai/providers/claude-adapter.md

- **Ruta relativa:** `.ai/providers/claude-adapter.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/providers/claude-adapter.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Claude Adapter

Claude: contexto progresivo, plan y verificación.

No duplicar reglas largas.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0151"></a>
## Archivo #151: .ai/providers/codex-adapter.md

- **Ruta relativa:** `.ai/providers/codex-adapter.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/providers/codex-adapter.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Codex Adapter

Codex: cambios atómicos y tests cercanos.

No duplicar reglas largas.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0152"></a>
## Archivo #152: .ai/providers/gemini-adapter.md

- **Ruta relativa:** `.ai/providers/gemini-adapter.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/providers/gemini-adapter.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Gemini Adapter

Gemini: auditoría, contraste y documentación.

No duplicar reglas largas.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0153"></a>
## Archivo #153: .ai/providers/generic-provider-adapter.md

- **Ruta relativa:** `.ai/providers/generic-provider-adapter.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/providers/generic-provider-adapter.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Generic Provider Adapter

Genérico: usar AGENTS.md + .ai/INDEX.md.

No duplicar reglas largas.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0154"></a>
## Archivo #154: .ai/providers/github-copilot-adapter.md

- **Ruta relativa:** `.ai/providers/github-copilot-adapter.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/providers/github-copilot-adapter.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Github Copilot Adapter

Copilot: instrucciones cortas y prompts wrapper.

No duplicar reglas largas.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0155"></a>
## Archivo #155: .ai/providers/provider-contract.md

- **Ruta relativa:** `.ai/providers/provider-contract.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/providers/provider-contract.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# Provider Contract

Todos los proveedores leen `.ai` como fuente de verdad.

No duplicar reglas largas.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0156"></a>
## Archivo #156: .ai/rules/collaboration-lock-rules.md

- **Ruta relativa:** `.ai/rules/collaboration-lock-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/collaboration-lock-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Collaboration Lock Rules

## Reglas

- Locked seleccionable.
- Locked no transformable.
- Conflictos con mensaje.
- Owner y assignment auditables.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0157"></a>
## Archivo #157: .ai/rules/command-bus-rules.md

- **Ruta relativa:** `.ai/rules/command-bus-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/command-bus-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `14`

### Contenido original

# Command Bus Rules

## Reglas

- Acciones externas por command bus.
- No DOM dispatch no documentado.
- Comandos idempotentes cuando aplique.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0158"></a>
## Archivo #158: .ai/rules/context-loading-ladder-rules.md

- **Ruta relativa:** `.ai/rules/context-loading-ladder-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/context-loading-ladder-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Context Loading Ladder Rules

## Reglas

- Cargar mínimo.
- Usar rg antes de cambios.
- Snapshots solo bajo justificación.
- No pegar archivos completos en prompts.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0159"></a>
## Archivo #159: .ai/rules/css-boundary-rules.md

- **Ruta relativa:** `.ai/rules/css-boundary-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/css-boundary-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Css Boundary Rules

## Reglas

- Scope bajo .sisad-pdfme-root.
- No tocar .moveable-* desde host.
- No tocar .selecto-* desde host.
- No alterar transform/overflow de canvas.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0160"></a>
## Archivo #160: .ai/rules/docs-governance-rules.md

- **Ruta relativa:** `.ai/rules/docs-governance-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/docs-governance-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Docs Governance Rules

## Reglas

- Docs humanas en docs.
- IA en .ai.
- Históricos en docs/99-archivo.
- Manifest actualizado.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0161"></a>
## Archivo #161: .ai/rules/external-forms-runner-rules.md

- **Ruta relativa:** `.ai/rules/external-forms-runner-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/external-forms-runner-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# External Forms Runner Rules

## Reglas

- Usar Form/Viewer.
- Filtrar por recipient/document/page.
- Persistir por schemaUid.
- No renderer paralelo.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0162"></a>
## Archivo #162: .ai/rules/generator-converter-rules.md

- **Ruta relativa:** `.ai/rules/generator-converter-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/generator-converter-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Generator Converter Rules

## Reglas

- Paridad con Viewer.
- No dependencia del host.
- Manejo de PDF cifrado documentado.
- Errores recuperables.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0163"></a>
## Archivo #163: .ai/rules/global-rules.md

- **Ruta relativa:** `.ai/rules/global-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/global-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `16`

### Contenido original

# Global Rules

## Reglas

- No duplicar runtime.
- No manipular DOM interno.
- No romper CSS scope.
- No perder schema identity.
- Validar cambios.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0164"></a>
## Archivo #164: .ai/rules/host-runtime-boundary-rules.md

- **Ruta relativa:** `.ai/rules/host-runtime-boundary-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/host-runtime-boundary-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Host Runtime Boundary Rules

## Reglas

- Host controla negocio.
- Runtime controla canvas.
- Adaptadores conectan ambos.
- No estado paralelo de sidebars.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0165"></a>
## Archivo #165: .ai/rules/legacy-reduction-rules.md

- **Ruta relativa:** `.ai/rules/legacy-reduction-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/legacy-reduction-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Legacy Reduction Rules

## Reglas

- Eliminar wrappers sin valor.
- Mantener bridges documentados.
- No renombres masivos sin equivalencia.
- Validar por lote.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0166"></a>
## Archivo #166: .ai/rules/moveable-selecto-rules.md

- **Ruta relativa:** `.ai/rules/moveable-selecto-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/moveable-selecto-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Moveable Selecto Rules

## Reglas

- Un solo modo activo.
- No delays arbitrarios.
- Recalcular toolbar tras rotate.
- No manipular bounds desde CSS externo.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0167"></a>
## Archivo #167: .ai/rules/provider-adapter-rules.md

- **Ruta relativa:** `.ai/rules/provider-adapter-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/provider-adapter-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `14`

### Contenido original

# Provider Adapter Rules

## Reglas

- Providers apuntan a .ai.
- No duplicar reglas largas.
- Prompts wrappers auto-actualizables.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0168"></a>
## Archivo #168: .ai/rules/public-api-rules.md

- **Ruta relativa:** `.ai/rules/public-api-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/public-api-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Public Api Rules

## Reglas

- Exponer comandos/eventos.
- Evitar acceso a internals.
- Versionar contratos.
- Documentar breaking changes.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0169"></a>
## Archivo #169: .ai/rules/schema-icon-color-rules.md

- **Ruta relativa:** `.ai/rules/schema-icon-color-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/schema-icon-color-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Schema Icon Color Rules

## Reglas

- PluginIcon recibe activeRecipientColor.
- Data attrs para tests.
- Fallback visible.
- Sin hardcode fuera de paleta.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0170"></a>
## Archivo #170: .ai/rules/schema-ownership-rules.md

- **Ruta relativa:** `.ai/rules/schema-ownership-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/schema-ownership-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Schema Ownership Rules

## Reglas

- ownerColor inmutable.
- activeRecipientColor solo catálogo.
- schemaUid estable.
- readonly bloquea cambios.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0171"></a>
## Archivo #171: .ai/rules/security-privacy-rules.md

- **Ruta relativa:** `.ai/rules/security-privacy-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/security-privacy-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Security Privacy Rules

## Reglas

- No PII.
- No base64/PDF logs.
- No tokens.
- Datos sintéticos en tests.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0172"></a>
## Archivo #172: .ai/rules/sidebars-inspector-rules.md

- **Ruta relativa:** `.ai/rules/sidebars-inspector-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/sidebars-inspector-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Sidebars Inspector Rules

## Reglas

- LeftSidebar catálogo.
- RightSidebar inspector/docs/comments.
- Host no duplica collapse.
- Detail vive en inspector.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0173"></a>
## Archivo #173: .ai/rules/snapshot-contract-rules.md

- **Ruta relativa:** `.ai/rules/snapshot-contract-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/snapshot-contract-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Snapshot Contract Rules

## Reglas

- Preservar versión.
- Preservar ownerColor/rotation.
- Compatibilidad legacy.
- Tests round-trip.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0174"></a>
## Archivo #174: .ai/rules/testing-quality-rules.md

- **Ruta relativa:** `.ai/rules/testing-quality-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/testing-quality-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Testing Quality Rules

## Reglas

- Vitest para lógica.
- Playwright para visual/canvas.
- No skip sin motivo.
- No test.only.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0175"></a>
## Archivo #175: .ai/rules/token-budget-rules.md

- **Ruta relativa:** `.ai/rules/token-budget-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/token-budget-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Token Budget Rules

## Reglas

- No full scan por defecto.
- Contextos cortos.
- Reportes bajo demanda.
- Cierre compacto.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0176"></a>
## Archivo #176: .ai/rules/transform-interaction-rules.md

- **Ruta relativa:** `.ai/rules/transform-interaction-rules.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/rules/transform-interaction-rules.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Transform Interaction Rules

## Reglas

- Input activo bloquea shortcuts.
- Inline edit suspende Selecto/Moveable.
- Resize/rotation suspenden Selecto.
- Context menu bloquea nueva acción.

## Validación

- Citar archivos reales.
- Indicar riesgos residuales.
- Ejecutar gate mínimo o explicar bloqueo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0177"></a>
## Archivo #177: .ai/subagents/active-recipient-color-subagent.md

- **Ruta relativa:** `.ai/subagents/active-recipient-color-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/active-recipient-color-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Active Recipient Color Subagent

## Especialidad

active recipient color subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0178"></a>
## Archivo #178: .ai/subagents/assignments-filtering-subagent.md

- **Ruta relativa:** `.ai/subagents/assignments-filtering-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/assignments-filtering-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Assignments Filtering Subagent

## Especialidad

assignments filtering subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0179"></a>
## Archivo #179: .ai/subagents/canvas-coordinate-subagent.md

- **Ruta relativa:** `.ai/subagents/canvas-coordinate-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/canvas-coordinate-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Canvas Coordinate Subagent

## Especialidad

canvas coordinate subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0180"></a>
## Archivo #180: .ai/subagents/collaboration-locks-subagent.md

- **Ruta relativa:** `.ai/subagents/collaboration-locks-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/collaboration-locks-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Collaboration Locks Subagent

## Especialidad

collaboration locks subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0181"></a>
## Archivo #181: .ai/subagents/command-bus-transform-subagent.md

- **Ruta relativa:** `.ai/subagents/command-bus-transform-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/command-bus-transform-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Command Bus Transform Subagent

## Especialidad

command bus transform subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0182"></a>
## Archivo #182: .ai/subagents/comments-overlay-subagent.md

- **Ruta relativa:** `.ai/subagents/comments-overlay-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/comments-overlay-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Comments Overlay Subagent

## Especialidad

comments overlay subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0183"></a>
## Archivo #183: .ai/subagents/context-menu-guard-subagent.md

- **Ruta relativa:** `.ai/subagents/context-menu-guard-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/context-menu-guard-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Context Menu Guard Subagent

## Especialidad

context menu guard subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0184"></a>
## Archivo #184: .ai/subagents/converter-browser-node-subagent.md

- **Ruta relativa:** `.ai/subagents/converter-browser-node-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/converter-browser-node-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Converter Browser Node Subagent

## Especialidad

converter browser node subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0185"></a>
## Archivo #185: .ai/subagents/css-token-subagent.md

- **Ruta relativa:** `.ai/subagents/css-token-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/css-token-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Css Token Subagent

## Especialidad

css token subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0186"></a>
## Archivo #186: .ai/subagents/css-transform-handle-subagent.md

- **Ruta relativa:** `.ai/subagents/css-transform-handle-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/css-transform-handle-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Css Transform Handle Subagent

## Especialidad

css transform handle subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0187"></a>
## Archivo #187: .ai/subagents/custom-plugin-contract-subagent.md

- **Ruta relativa:** `.ai/subagents/custom-plugin-contract-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/custom-plugin-contract-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Custom Plugin Contract Subagent

## Especialidad

custom plugin contract subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0188"></a>
## Archivo #188: .ai/subagents/detail-widgets-subagent.md

- **Ruta relativa:** `.ai/subagents/detail-widgets-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/detail-widgets-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Detail Widgets Subagent

## Especialidad

detail widgets subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0189"></a>
## Archivo #189: .ai/subagents/docs-migration-subagent.md

- **Ruta relativa:** `.ai/subagents/docs-migration-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/docs-migration-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Docs Migration Subagent

## Especialidad

docs migration subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0190"></a>
## Archivo #190: .ai/subagents/external-form-runner-subagent.md

- **Ruta relativa:** `.ai/subagents/external-form-runner-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/external-form-runner-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# External Form Runner Subagent

## Especialidad

external form runner subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0191"></a>
## Archivo #191: .ai/subagents/floating-toolbar-position-subagent.md

- **Ruta relativa:** `.ai/subagents/floating-toolbar-position-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/floating-toolbar-position-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Floating Toolbar Position Subagent

## Especialidad

floating toolbar position subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0192"></a>
## Archivo #192: .ai/subagents/form-viewer-parity-subagent.md

- **Ruta relativa:** `.ai/subagents/form-viewer-parity-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/form-viewer-parity-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Form Viewer Parity Subagent

## Especialidad

form viewer parity subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0193"></a>
## Archivo #193: .ai/subagents/generator-helper-subagent.md

- **Ruta relativa:** `.ai/subagents/generator-helper-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/generator-helper-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Generator Helper Subagent

## Especialidad

generator helper subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0194"></a>
## Archivo #194: .ai/subagents/inline-edit-guard-subagent.md

- **Ruta relativa:** `.ai/subagents/inline-edit-guard-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/inline-edit-guard-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Inline Edit Guard Subagent

## Especialidad

inline edit guard subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0195"></a>
## Archivo #195: .ai/subagents/keyboard-shortcut-guard-subagent.md

- **Ruta relativa:** `.ai/subagents/keyboard-shortcut-guard-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/keyboard-shortcut-guard-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Keyboard Shortcut Guard Subagent

## Especialidad

keyboard shortcut guard subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0196"></a>
## Archivo #196: .ai/subagents/left-sidebar-catalog-color-subagent.md

- **Ruta relativa:** `.ai/subagents/left-sidebar-catalog-color-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/left-sidebar-catalog-color-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Left Sidebar Catalog Color Subagent

## Especialidad

left sidebar catalog color subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0197"></a>
## Archivo #197: .ai/subagents/legacy-wrapper-subagent.md

- **Ruta relativa:** `.ai/subagents/legacy-wrapper-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/legacy-wrapper-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Legacy Wrapper Subagent

## Especialidad

legacy wrapper subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0198"></a>
## Archivo #198: .ai/subagents/moveable-resize-subagent.md

- **Ruta relativa:** `.ai/subagents/moveable-resize-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/moveable-resize-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Moveable Resize Subagent

## Especialidad

moveable resize subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0199"></a>
## Archivo #199: .ai/subagents/moveable-rotation-subagent.md

- **Ruta relativa:** `.ai/subagents/moveable-rotation-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/moveable-rotation-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Moveable Rotation Subagent

## Especialidad

moveable rotation subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0200"></a>
## Archivo #200: .ai/subagents/overlay-manager-subagent.md

- **Ruta relativa:** `.ai/subagents/overlay-manager-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/overlay-manager-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Overlay Manager Subagent

## Especialidad

overlay manager subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0201"></a>
## Archivo #201: .ai/subagents/owner-color-persistence-subagent.md

- **Ruta relativa:** `.ai/subagents/owner-color-persistence-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/owner-color-persistence-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Owner Color Persistence Subagent

## Especialidad

owner color persistence subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0202"></a>
## Archivo #202: .ai/subagents/paper-scale-layer-subagent.md

- **Ruta relativa:** `.ai/subagents/paper-scale-layer-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/paper-scale-layer-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Paper Scale Layer Subagent

## Especialidad

paper scale layer subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0203"></a>
## Archivo #203: .ai/subagents/playwright-canvas-subagent.md

- **Ruta relativa:** `.ai/subagents/playwright-canvas-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/playwright-canvas-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Playwright Canvas Subagent

## Especialidad

playwright canvas subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0204"></a>
## Archivo #204: .ai/subagents/playwright-recipient-color-subagent.md

- **Ruta relativa:** `.ai/subagents/playwright-recipient-color-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/playwright-recipient-color-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Playwright Recipient Color Subagent

## Especialidad

playwright recipient color subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0205"></a>
## Archivo #205: .ai/subagents/plugin-icon-fallback-subagent.md

- **Ruta relativa:** `.ai/subagents/plugin-icon-fallback-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/plugin-icon-fallback-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Plugin Icon Fallback Subagent

## Especialidad

plugin icon fallback subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0206"></a>
## Archivo #206: .ai/subagents/prompt-catalog-subagent.md

- **Ruta relativa:** `.ai/subagents/prompt-catalog-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/prompt-catalog-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Prompt Catalog Subagent

## Especialidad

prompt catalog subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0207"></a>
## Archivo #207: .ai/subagents/provider-drift-subagent.md

- **Ruta relativa:** `.ai/subagents/provider-drift-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/provider-drift-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Provider Drift Subagent

## Especialidad

provider drift subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0208"></a>
## Archivo #208: .ai/subagents/public-api-surface-subagent.md

- **Ruta relativa:** `.ai/subagents/public-api-surface-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/public-api-surface-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Public Api Surface Subagent

## Especialidad

public api surface subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0209"></a>
## Archivo #209: .ai/subagents/right-inspector-transform-subagent.md

- **Ruta relativa:** `.ai/subagents/right-inspector-transform-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/right-inspector-transform-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Right Inspector Transform Subagent

## Especialidad

right inspector transform subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0210"></a>
## Archivo #210: .ai/subagents/schema-registry-extension-subagent.md

- **Ruta relativa:** `.ai/subagents/schema-registry-extension-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/schema-registry-extension-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Schema Registry Extension Subagent

## Especialidad

schema registry extension subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0211"></a>
## Archivo #211: .ai/subagents/schema-tone-resolution-subagent.md

- **Ruta relativa:** `.ai/subagents/schema-tone-resolution-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/schema-tone-resolution-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Schema Tone Resolution Subagent

## Especialidad

schema tone resolution subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0212"></a>
## Archivo #212: .ai/subagents/selecto-lifecycle-subagent.md

- **Ruta relativa:** `.ai/subagents/selecto-lifecycle-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/selecto-lifecycle-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Selecto Lifecycle Subagent

## Especialidad

selecto lifecycle subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0213"></a>
## Archivo #213: .ai/subagents/snapshot-legacy-compat-subagent.md

- **Ruta relativa:** `.ai/subagents/snapshot-legacy-compat-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/snapshot-legacy-compat-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Snapshot Legacy Compat Subagent

## Especialidad

snapshot legacy compat subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0214"></a>
## Archivo #214: .ai/subagents/snapshot-roundtrip-subagent.md

- **Ruta relativa:** `.ai/subagents/snapshot-roundtrip-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/snapshot-roundtrip-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Snapshot Roundtrip Subagent

## Especialidad

snapshot roundtrip subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0215"></a>
## Archivo #215: .ai/subagents/token-budget-subagent.md

- **Ruta relativa:** `.ai/subagents/token-budget-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/token-budget-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Token Budget Subagent

## Especialidad

token budget subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0216"></a>
## Archivo #216: .ai/subagents/unique-palette-subagent.md

- **Ruta relativa:** `.ai/subagents/unique-palette-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/unique-palette-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Unique Palette Subagent

## Especialidad

unique palette subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0217"></a>
## Archivo #217: .ai/subagents/visual-regression-css-subagent.md

- **Ruta relativa:** `.ai/subagents/visual-regression-css-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/visual-regression-css-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Visual Regression Css Subagent

## Especialidad

visual regression css subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0218"></a>
## Archivo #218: .ai/subagents/vitest-contract-subagent.md

- **Ruta relativa:** `.ai/subagents/vitest-contract-subagent.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/subagents/vitest-contract-subagent.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `18`

### Contenido original

# Vitest Contract Subagent

## Especialidad

vitest contract subagent.

## Cuándo usarlo

Cuando la tarea toque este dominio específico y exista riesgo de regresión o duplicidad.

## Checklist mínimo

- Leer contexto y regla del dominio.
- Localizar código real con `rg`.
- Cambiar solo lo necesario.
- Añadir test o justificar por qué no aplica.
- Documentar riesgo residual.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0219"></a>
## Archivo #219: .ai/templates/agent-report.md

- **Ruta relativa:** `.ai/templates/agent-report.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/templates/agent-report.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `9`

### Contenido original

# Agent Report

## Contexto usado
## Agente
## Diagnóstico
## Plan
## Validación
## Riesgos

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0220"></a>
## Archivo #220: .ai/templates/architecture-decision-record.md

- **Ruta relativa:** `.ai/templates/architecture-decision-record.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/templates/architecture-decision-record.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `8`

### Contenido original

# Architecture Decision Record

## Decisión
## Contexto
## Alternativas
## Consecuencias
## Fecha

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0221"></a>
## Archivo #221: .ai/templates/bug-ticket.md

- **Ruta relativa:** `.ai/templates/bug-ticket.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/templates/bug-ticket.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `8`

### Contenido original

# Bug Ticket

## Síntoma
## Causa probable
## Archivos
## Reproducción
## Criterios de aceptación

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0222"></a>
## Archivo #222: .ai/templates/handoff.md

- **Ruta relativa:** `.ai/templates/handoff.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/templates/handoff.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `8`

### Contenido original

# Handoff

## Contexto
## Archivos
## Decisiones
## Pendientes
## Riesgos

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0223"></a>
## Archivo #223: .ai/templates/qa-report.md

- **Ruta relativa:** `.ai/templates/qa-report.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/templates/qa-report.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `8`

### Contenido original

# Qa Report

## Comandos
## Resultado
## Evidencia
## Bloqueos
## Siguiente acción

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0224"></a>
## Archivo #224: .ai/templates/refactor-report.md

- **Ruta relativa:** `.ai/templates/refactor-report.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/templates/refactor-report.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `8`

### Contenido original

# Refactor Report

## Antes
## Después
## Contratos preservados
## Tests
## Riesgos

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0225"></a>
## Archivo #225: .ai/templates/test-failure-analysis.md

- **Ruta relativa:** `.ai/templates/test-failure-analysis.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/templates/test-failure-analysis.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `8`

### Contenido original

# Test Failure Analysis

## Test
## Falla
## Hipótesis
## Evidencia
## Fix propuesto

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0226"></a>
## Archivo #226: .claude/commands/audit-css-boundaries.md

- **Ruta relativa:** `.claude/commands/audit-css-boundaries.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.claude/commands/audit-css-boundaries.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Comando audit-css-boundaries

Ejecutar flujo `audit-css-boundaries` usando `.ai/INDEX.md`, `.ai/context-map.md` y prompts correspondientes.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0227"></a>
## Archivo #227: .claude/commands/local-selective-scan.md

- **Ruta relativa:** `.claude/commands/local-selective-scan.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.claude/commands/local-selective-scan.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Comando local-selective-scan

Ejecutar flujo `local-selective-scan` usando `.ai/INDEX.md`, `.ai/context-map.md` y prompts correspondientes.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0228"></a>
## Archivo #228: .claude/commands/repair-recipient-color.md

- **Ruta relativa:** `.claude/commands/repair-recipient-color.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.claude/commands/repair-recipient-color.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Comando repair-recipient-color

Ejecutar flujo `repair-recipient-color` usando `.ai/INDEX.md`, `.ai/context-map.md` y prompts correspondientes.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0229"></a>
## Archivo #229: .claude/commands/repair-snapshot-roundtrip.md

- **Ruta relativa:** `.claude/commands/repair-snapshot-roundtrip.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.claude/commands/repair-snapshot-roundtrip.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Comando repair-snapshot-roundtrip

Ejecutar flujo `repair-snapshot-roundtrip` usando `.ai/INDEX.md`, `.ai/context-map.md` y prompts correspondientes.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0230"></a>
## Archivo #230: .claude/commands/repair-transform-collisions.md

- **Ruta relativa:** `.claude/commands/repair-transform-collisions.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.claude/commands/repair-transform-collisions.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Comando repair-transform-collisions

Ejecutar flujo `repair-transform-collisions` usando `.ai/INDEX.md`, `.ai/context-map.md` y prompts correspondientes.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0231"></a>
## Archivo #231: .claude/commands/startup.md

- **Ruta relativa:** `.claude/commands/startup.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.claude/commands/startup.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Comando startup

Ejecutar flujo `startup` usando `.ai/INDEX.md`, `.ai/context-map.md` y prompts correspondientes.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0232"></a>
## Archivo #232: .claude/commands/update-memory.md

- **Ruta relativa:** `.claude/commands/update-memory.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.claude/commands/update-memory.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Comando update-memory

Ejecutar flujo `update-memory` usando `.ai/INDEX.md`, `.ai/context-map.md` y prompts correspondientes.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0233"></a>
## Archivo #233: .codex/tasks/atomic-fix.md

- **Ruta relativa:** `.codex/tasks/atomic-fix.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.codex/tasks/atomic-fix.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Tarea atomic-fix

Usar contexto mínimo, aplicar cambio pequeño, validar y reportar riesgos.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0234"></a>
## Archivo #234: .codex/tasks/legacy-cleanup-step.md

- **Ruta relativa:** `.codex/tasks/legacy-cleanup-step.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.codex/tasks/legacy-cleanup-step.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Tarea legacy-cleanup-step

Usar contexto mínimo, aplicar cambio pequeño, validar y reportar riesgos.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0235"></a>
## Archivo #235: .codex/tasks/quality-gates.md

- **Ruta relativa:** `.codex/tasks/quality-gates.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.codex/tasks/quality-gates.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Tarea quality-gates

Usar contexto mínimo, aplicar cambio pequeño, validar y reportar riesgos.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0236"></a>
## Archivo #236: .codex/tasks/recipient-transform-implementation.md

- **Ruta relativa:** `.codex/tasks/recipient-transform-implementation.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.codex/tasks/recipient-transform-implementation.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Tarea recipient-transform-implementation

Usar contexto mínimo, aplicar cambio pequeño, validar y reportar riesgos.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0237"></a>
## Archivo #237: .codex/tasks/refactor-safe.md

- **Ruta relativa:** `.codex/tasks/refactor-safe.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.codex/tasks/refactor-safe.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Tarea refactor-safe

Usar contexto mínimo, aplicar cambio pequeño, validar y reportar riesgos.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0238"></a>
## Archivo #238: .gemini/prompts/audit-architecture.md

- **Ruta relativa:** `.gemini/prompts/audit-architecture.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.gemini/prompts/audit-architecture.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Gemini audit-architecture

Auditar y reportar inconsistencias sin modificar código.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0239"></a>
## Archivo #239: .gemini/prompts/audit-docs-vs-code.md

- **Ruta relativa:** `.gemini/prompts/audit-docs-vs-code.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.gemini/prompts/audit-docs-vs-code.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Gemini audit-docs-vs-code

Auditar y reportar inconsistencias sin modificar código.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0240"></a>
## Archivo #240: .gemini/prompts/audit-recipient-transform.md

- **Ruta relativa:** `.gemini/prompts/audit-recipient-transform.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.gemini/prompts/audit-recipient-transform.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Gemini audit-recipient-transform

Auditar y reportar inconsistencias sin modificar código.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0241"></a>
## Archivo #241: .gemini/prompts/audit-token-budget.md

- **Ruta relativa:** `.gemini/prompts/audit-token-budget.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.gemini/prompts/audit-token-budget.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Gemini audit-token-budget

Auditar y reportar inconsistencias sin modificar código.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0242"></a>
## Archivo #242: .github/instructions/architecture-boundaries.instructions.md

- **Ruta relativa:** `.github/instructions/architecture-boundaries.instructions.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/instructions/architecture-boundaries.instructions.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Architecture Boundaries

Wrapper para `.ai/rules/architecture-boundaries-rules.md` cuando exista. Si no existe, usar `.ai/context-map.md`.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0243"></a>
## Archivo #243: .github/instructions/canvas-transform-safety.instructions.md

- **Ruta relativa:** `.github/instructions/canvas-transform-safety.instructions.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/instructions/canvas-transform-safety.instructions.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Canvas Transform Safety

Wrapper para `.ai/rules/canvas-transform-safety-rules.md` cuando exista. Si no existe, usar `.ai/context-map.md`.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0244"></a>
## Archivo #244: .github/instructions/css-boundaries.instructions.md

- **Ruta relativa:** `.github/instructions/css-boundaries.instructions.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/instructions/css-boundaries.instructions.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Css Boundaries

Wrapper para `.ai/rules/css-boundaries-rules.md` cuando exista. Si no existe, usar `.ai/context-map.md`.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0245"></a>
## Archivo #245: .github/instructions/external-forms-runner.instructions.md

- **Ruta relativa:** `.github/instructions/external-forms-runner.instructions.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/instructions/external-forms-runner.instructions.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# External Forms Runner

Wrapper para `.ai/rules/external-forms-runner-rules.md` cuando exista. Si no existe, usar `.ai/context-map.md`.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0246"></a>
## Archivo #246: .github/instructions/recipient-color-system.instructions.md

- **Ruta relativa:** `.github/instructions/recipient-color-system.instructions.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/instructions/recipient-color-system.instructions.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Recipient Color System

Wrapper para `.ai/rules/recipient-color-system-rules.md` cuando exista. Si no existe, usar `.ai/context-map.md`.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0247"></a>
## Archivo #247: .github/instructions/snapshot-contract.instructions.md

- **Ruta relativa:** `.github/instructions/snapshot-contract.instructions.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/instructions/snapshot-contract.instructions.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Snapshot Contract

Wrapper para `.ai/rules/snapshot-contract-rules.md` cuando exista. Si no existe, usar `.ai/context-map.md`.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0248"></a>
## Archivo #248: .github/instructions/testing-quality.instructions.md

- **Ruta relativa:** `.github/instructions/testing-quality.instructions.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/instructions/testing-quality.instructions.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Testing Quality

Wrapper para `.ai/rules/testing-quality-rules.md` cuando exista. Si no existe, usar `.ai/context-map.md`.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0249"></a>
## Archivo #249: .github/prompts/audit-css-boundaries.prompt.md

- **Ruta relativa:** `.github/prompts/audit-css-boundaries.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/audit-css-boundaries.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — audit-css-boundaries.prompt.md

Fuente de verdad: `.ai/prompts/audit-css-boundaries.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0250"></a>
## Archivo #250: .github/prompts/audit-legacy-runtime-reduction.prompt.md

- **Ruta relativa:** `.github/prompts/audit-legacy-runtime-reduction.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/audit-legacy-runtime-reduction.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — audit-legacy-runtime-reduction.prompt.md

Fuente de verdad: `.ai/prompts/audit-legacy-runtime-reduction.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0251"></a>
## Archivo #251: .github/prompts/build-regression-test-matrix.prompt.md

- **Ruta relativa:** `.github/prompts/build-regression-test-matrix.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/build-regression-test-matrix.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — build-regression-test-matrix.prompt.md

Fuente de verdad: `.ai/prompts/build-regression-test-matrix.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0252"></a>
## Archivo #252: .github/prompts/fix-keyboard-shortcut-collisions.prompt.md

- **Ruta relativa:** `.github/prompts/fix-keyboard-shortcut-collisions.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/fix-keyboard-shortcut-collisions.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — fix-keyboard-shortcut-collisions.prompt.md

Fuente de verdad: `.ai/prompts/fix-keyboard-shortcut-collisions.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0253"></a>
## Archivo #253: .github/prompts/harden-moveable-selecto-guards.prompt.md

- **Ruta relativa:** `.github/prompts/harden-moveable-selecto-guards.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/harden-moveable-selecto-guards.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — harden-moveable-selecto-guards.prompt.md

Fuente de verdad: `.ai/prompts/harden-moveable-selecto-guards.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0254"></a>
## Archivo #254: .github/prompts/implement-unique-recipient-palette.prompt.md

- **Ruta relativa:** `.github/prompts/implement-unique-recipient-palette.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/implement-unique-recipient-palette.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — implement-unique-recipient-palette.prompt.md

Fuente de verdad: `.ai/prompts/implement-unique-recipient-palette.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0255"></a>
## Archivo #255: .github/prompts/inspect-failed-test-results.prompt.md

- **Ruta relativa:** `.github/prompts/inspect-failed-test-results.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/inspect-failed-test-results.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — inspect-failed-test-results.prompt.md

Fuente de verdad: `.ai/prompts/inspect-failed-test-results.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0256"></a>
## Archivo #256: .github/prompts/preserve-owner-color-on-existing-schemas.prompt.md

- **Ruta relativa:** `.github/prompts/preserve-owner-color-on-existing-schemas.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/preserve-owner-color-on-existing-schemas.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — preserve-owner-color-on-existing-schemas.prompt.md

Fuente de verdad: `.ai/prompts/preserve-owner-color-on-existing-schemas.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0257"></a>
## Archivo #257: .github/prompts/protect-inline-edit-from-transform.prompt.md

- **Ruta relativa:** `.github/prompts/protect-inline-edit-from-transform.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/protect-inline-edit-from-transform.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — protect-inline-edit-from-transform.prompt.md

Fuente de verdad: `.ai/prompts/protect-inline-edit-from-transform.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0258"></a>
## Archivo #258: .github/prompts/recipient-transform-master-plan.prompt.md

- **Ruta relativa:** `.github/prompts/recipient-transform-master-plan.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/recipient-transform-master-plan.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — recipient-transform-master-plan.prompt.md

Fuente de verdad: `.ai/prompts/recipient-transform-master-plan.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0259"></a>
## Archivo #259: .github/prompts/repair-external-forms-runner.prompt.md

- **Ruta relativa:** `.github/prompts/repair-external-forms-runner.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/repair-external-forms-runner.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — repair-external-forms-runner.prompt.md

Fuente de verdad: `.ai/prompts/repair-external-forms-runner.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0260"></a>
## Archivo #260: .github/prompts/repair-floating-toolbar-position.prompt.md

- **Ruta relativa:** `.github/prompts/repair-floating-toolbar-position.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/repair-floating-toolbar-position.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — repair-floating-toolbar-position.prompt.md

Fuente de verdad: `.ai/prompts/repair-floating-toolbar-position.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0261"></a>
## Archivo #261: .github/prompts/repair-recipient-color-sync.prompt.md

- **Ruta relativa:** `.github/prompts/repair-recipient-color-sync.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/repair-recipient-color-sync.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — repair-recipient-color-sync.prompt.md

Fuente de verdad: `.ai/prompts/repair-recipient-color-sync.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0262"></a>
## Archivo #262: .github/prompts/repair-schema-icon-color-sync.prompt.md

- **Ruta relativa:** `.github/prompts/repair-schema-icon-color-sync.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/repair-schema-icon-color-sync.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — repair-schema-icon-color-sync.prompt.md

Fuente de verdad: `.ai/prompts/repair-schema-icon-color-sync.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0263"></a>
## Archivo #263: .github/prompts/repair-snapshot-roundtrip.prompt.md

- **Ruta relativa:** `.github/prompts/repair-snapshot-roundtrip.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/repair-snapshot-roundtrip.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — repair-snapshot-roundtrip.prompt.md

Fuente de verdad: `.ai/prompts/repair-snapshot-roundtrip.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0264"></a>
## Archivo #264: .github/prompts/repair-transform-collisions.prompt.md

- **Ruta relativa:** `.github/prompts/repair-transform-collisions.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/repair-transform-collisions.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — repair-transform-collisions.prompt.md

Fuente de verdad: `.ai/prompts/repair-transform-collisions.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0265"></a>
## Archivo #265: .github/prompts/stabilize-designer-engine-api.prompt.md

- **Ruta relativa:** `.github/prompts/stabilize-designer-engine-api.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/stabilize-designer-engine-api.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — stabilize-designer-engine-api.prompt.md

Fuente de verdad: `.ai/prompts/stabilize-designer-engine-api.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0266"></a>
## Archivo #266: .github/prompts/stabilize-schema-resize-rotation.prompt.md

- **Ruta relativa:** `.github/prompts/stabilize-schema-resize-rotation.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/stabilize-schema-resize-rotation.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — stabilize-schema-resize-rotation.prompt.md

Fuente de verdad: `.ai/prompts/stabilize-schema-resize-rotation.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0267"></a>
## Archivo #267: .github/prompts/unify-css-architecture.prompt.md

- **Ruta relativa:** `.github/prompts/unify-css-architecture.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/unify-css-architecture.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — unify-css-architecture.prompt.md

Fuente de verdad: `.ai/prompts/unify-css-architecture.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0268"></a>
## Archivo #268: .github/prompts/update-docs-recipient-transform.prompt.md

- **Ruta relativa:** `.github/prompts/update-docs-recipient-transform.prompt.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.github/prompts/update-docs-recipient-transform.prompt.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `6`

### Contenido original

# GitHub wrapper — update-docs-recipient-transform.prompt.md

Fuente de verdad: `.ai/prompts/update-docs-recipient-transform.prompt.md`.

Usar ese prompt y no modificar este wrapper salvo sincronización controlada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0269"></a>
## Archivo #269: docs/00-indice/README.md

- **Ruta relativa:** `docs/00-indice/README.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/00-indice/README.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Readme

Índice general de documentación humana.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0270"></a>
## Archivo #270: docs/01-producto-y-vision/01-vision-producto.md

- **Ruta relativa:** `docs/01-producto-y-vision/01-vision-producto.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/01-producto-y-vision/01-vision-producto.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 01 Vision Producto

Visión del editor SISAD PDFME como runtime de documentos PDF tipo DocuSign.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0271"></a>
## Archivo #271: docs/01-producto-y-vision/02-actores.md

- **Ruta relativa:** `docs/01-producto-y-vision/02-actores.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/01-producto-y-vision/02-actores.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 02 Actores

Actores: diseñador, destinatario, revisor, sistema host, externalForms, proveedor de firma.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0272"></a>
## Archivo #272: docs/01-producto-y-vision/03-objetivos.md

- **Ruta relativa:** `docs/01-producto-y-vision/03-objetivos.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/01-producto-y-vision/03-objetivos.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 03 Objetivos

Objetivos: multi-documento, multi-recipient, colores, ownership, snapshot, firma y ejecución.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0273"></a>
## Archivo #273: docs/01-producto-y-vision/04-no-objetivos.md

- **Ruta relativa:** `docs/01-producto-y-vision/04-no-objetivos.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/01-producto-y-vision/04-no-objetivos.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 04 No Objetivos

No objetivos: acoplar fork a SISAD, duplicar renderer, manipular DOM interno.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0274"></a>
## Archivo #274: docs/02-mapa-modulos/01-inventario-codigo.md

- **Ruta relativa:** `docs/02-mapa-modulos/01-inventario-codigo.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/02-mapa-modulos/01-inventario-codigo.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# 01 Inventario Codigo

- `tests/playwright`: 11 archivos
- `tests/unit`: 83 archivos
- `src/sisad-pdfme/ui`: 121 archivos
- `src/sisad-pdfme/schemas`: 56 archivos
- `src/sisad-pdfme/pdf-lib`: 154 archivos
- `src/sisad-pdfme/generator`: 5 archivos
- `src/sisad-pdfme/converter`: 8 archivos
- `src/sisad-pdfme/shared`: 13 archivos
- `src/sisad-pdfme/common`: 11 archivos
- `src/sisad-pdfme/collaboration`: 3 archivos
- `src/sisad-pdfme/externalForms`: 1 archivos
- `src/features/pdfcomponent`: 18 archivos

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0275"></a>
## Archivo #275: docs/02-mapa-modulos/02-ui-designer-form-viewer.md

- **Ruta relativa:** `docs/02-mapa-modulos/02-ui-designer-form-viewer.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/02-mapa-modulos/02-ui-designer-form-viewer.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 02 Ui Designer Form Viewer

Designer, Form y Viewer son entrypoints principales de runtime.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0276"></a>
## Archivo #276: docs/02-mapa-modulos/03-schemas-y-plugin-registry.md

- **Ruta relativa:** `docs/02-mapa-modulos/03-schemas-y-plugin-registry.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/02-mapa-modulos/03-schemas-y-plugin-registry.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 03 Schemas Y Plugin Registry

Schemas built-in y custom deben pasar por registry y contratos compartidos.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0277"></a>
## Archivo #277: docs/02-mapa-modulos/04-generator-converter-pdflib.md

- **Ruta relativa:** `docs/02-mapa-modulos/04-generator-converter-pdflib.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/02-mapa-modulos/04-generator-converter-pdflib.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 04 Generator Converter Pdflib

Generator/converter/pdf-lib deben permanecer desacoplados de host.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0278"></a>
## Archivo #278: docs/02-mapa-modulos/05-tests-playwright-vitest.md

- **Ruta relativa:** `docs/02-mapa-modulos/05-tests-playwright-vitest.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/02-mapa-modulos/05-tests-playwright-vitest.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 05 Tests Playwright Vitest

Inventario: 83 unitarios y 11 Playwright detectados.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0279"></a>
## Archivo #279: docs/03-arquitectura/01-boundaries-host-runtime.md

- **Ruta relativa:** `docs/03-arquitectura/01-boundaries-host-runtime.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/03-arquitectura/01-boundaries-host-runtime.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 01 Boundaries Host Runtime

ContentCustomForm host; sisad-pdfme runtime; adapters traducen contexto.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0280"></a>
## Archivo #280: docs/03-arquitectura/02-runtime-visual.md

- **Ruta relativa:** `docs/03-arquitectura/02-runtime-visual.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/03-arquitectura/02-runtime-visual.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 02 Runtime Visual

Canvas, sidebars, inspector, comments y docs rail pertenecen a runtime.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0281"></a>
## Archivo #281: docs/03-arquitectura/03-command-bus-events.md

- **Ruta relativa:** `docs/03-arquitectura/03-command-bus-events.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/03-arquitectura/03-command-bus-events.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 03 Command Bus Events

Comandos/eventos reemplazan manipulación de DOM.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0282"></a>
## Archivo #282: docs/03-arquitectura/04-snapshot-contract.md

- **Ruta relativa:** `docs/03-arquitectura/04-snapshot-contract.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/03-arquitectura/04-snapshot-contract.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 04 Snapshot Contract

Snapshot preserva identidad, color, owner, rotation y metadata.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0283"></a>
## Archivo #283: docs/03-arquitectura/05-external-forms-contract.md

- **Ruta relativa:** `docs/03-arquitectura/05-external-forms-contract.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/03-arquitectura/05-external-forms-contract.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 05 External Forms Contract

externalForms consume snapshot con Form/Viewer.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0284"></a>
## Archivo #284: docs/03-arquitectura/06-collaboration-locks.md

- **Ruta relativa:** `docs/03-arquitectura/06-collaboration-locks.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/03-arquitectura/06-collaboration-locks.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 06 Collaboration Locks

Locks y readonly bloquean transformaciones pero permiten visibilidad.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0285"></a>
## Archivo #285: docs/03-arquitectura/07-public-api.md

- **Ruta relativa:** `docs/03-arquitectura/07-public-api.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/03-arquitectura/07-public-api.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 07 Public Api

API pública versionada y documentada.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0286"></a>
## Archivo #286: docs/03-arquitectura/08-fork-safe-evolution.md

- **Ruta relativa:** `docs/03-arquitectura/08-fork-safe-evolution.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/03-arquitectura/08-fork-safe-evolution.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 08 Fork Safe Evolution

Evolución segura del fork.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0287"></a>
## Archivo #287: docs/04-recipient-transform/01-recipient-color-behavior.md

- **Ruta relativa:** `docs/04-recipient-transform/01-recipient-color-behavior.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/04-recipient-transform/01-recipient-color-behavior.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 01 Recipient Color Behavior

Catálogo usa activeRecipientColor; canvas usa ownerColor persistido.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0288"></a>
## Archivo #288: docs/04-recipient-transform/02-schema-icon-color-sync.md

- **Ruta relativa:** `docs/04-recipient-transform/02-schema-icon-color-sync.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/04-recipient-transform/02-schema-icon-color-sync.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 02 Schema Icon Color Sync

PluginIcon debe exponer color activo y fallback visible.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0289"></a>
## Archivo #289: docs/04-recipient-transform/03-owner-color-persistence.md

- **Ruta relativa:** `docs/04-recipient-transform/03-owner-color-persistence.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/04-recipient-transform/03-owner-color-persistence.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 03 Owner Color Persistence

ownerColor no cambia al cambiar destinatario activo.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0290"></a>
## Archivo #290: docs/04-recipient-transform/04-transform-state-machine.md

- **Ruta relativa:** `docs/04-recipient-transform/04-transform-state-machine.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/04-recipient-transform/04-transform-state-machine.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 04 Transform State Machine

State machine para idle/selecting/dragging/resizing/rotating/editing/menu.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0291"></a>
## Archivo #291: docs/04-recipient-transform/05-moveable-selecto.md

- **Ruta relativa:** `docs/04-recipient-transform/05-moveable-selecto.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/04-recipient-transform/05-moveable-selecto.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 05 Moveable Selecto

Moveable y Selecto no operan simultáneamente.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0292"></a>
## Archivo #292: docs/04-recipient-transform/06-shortcuts-and-inline-edit.md

- **Ruta relativa:** `docs/04-recipient-transform/06-shortcuts-and-inline-edit.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/04-recipient-transform/06-shortcuts-and-inline-edit.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 06 Shortcuts And Inline Edit

Inputs y editores bloquean shortcuts globales.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0293"></a>
## Archivo #293: docs/04-recipient-transform/07-accessibility-colors.md

- **Ruta relativa:** `docs/04-recipient-transform/07-accessibility-colors.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/04-recipient-transform/07-accessibility-colors.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 07 Accessibility Colors

Paleta legible, contraste y fallback.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0294"></a>
## Archivo #294: docs/05-ui-ux/01-left-sidebar-catalog.md

- **Ruta relativa:** `docs/05-ui-ux/01-left-sidebar-catalog.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/05-ui-ux/01-left-sidebar-catalog.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 01 Left Sidebar Catalog

Catálogo compacto: icono + nombre, detalle en inspector.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0295"></a>
## Archivo #295: docs/05-ui-ux/02-right-sidebar-inspector.md

- **Ruta relativa:** `docs/05-ui-ux/02-right-sidebar-inspector.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/05-ui-ux/02-right-sidebar-inspector.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 02 Right Sidebar Inspector

Inspector con secciones y widgets.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0296"></a>
## Archivo #296: docs/05-ui-ux/03-floating-toolbar.md

- **Ruta relativa:** `docs/05-ui-ux/03-floating-toolbar.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/05-ui-ux/03-floating-toolbar.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 03 Floating Toolbar

Toolbar contextual debe recalcular con scroll/zoom/rotate.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0297"></a>
## Archivo #297: docs/05-ui-ux/04-canvas-overlays.md

- **Ruta relativa:** `docs/05-ui-ux/04-canvas-overlays.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/05-ui-ux/04-canvas-overlays.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 04 Canvas Overlays

Overlays no deben robar eventos indebidamente.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0298"></a>
## Archivo #298: docs/05-ui-ux/05-compact-header-host.md

- **Ruta relativa:** `docs/05-ui-ux/05-compact-header-host.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/05-ui-ux/05-compact-header-host.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 05 Compact Header Host

Host puede tener header mínimo; no duplicar toolbar del runtime.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0299"></a>
## Archivo #299: docs/05-ui-ux/06-responsive.md

- **Ruta relativa:** `docs/05-ui-ux/06-responsive.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/05-ui-ux/06-responsive.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 06 Responsive

Responsive sin romper geometry.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0300"></a>
## Archivo #300: docs/06-css/01-css-boundaries.md

- **Ruta relativa:** `docs/06-css/01-css-boundaries.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/06-css/01-css-boundaries.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 01 Css Boundaries

CSS bajo `.sisad-pdfme-root`; hosts no alteran internals.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0301"></a>
## Archivo #301: docs/06-css/02-token-system.md

- **Ruta relativa:** `docs/06-css/02-token-system.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/06-css/02-token-system.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 02 Token System

Tokens de color, espacio, radius y shadow.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0302"></a>
## Archivo #302: docs/06-css/03-transform-handle-safety.md

- **Ruta relativa:** `docs/06-css/03-transform-handle-safety.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/06-css/03-transform-handle-safety.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 03 Transform Handle Safety

No romper handles Moveable/Selecto.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0303"></a>
## Archivo #303: docs/06-css/04-visual-regression.md

- **Ruta relativa:** `docs/06-css/04-visual-regression.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/06-css/04-visual-regression.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 04 Visual Regression

Pruebas visuales para color y transform.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0304"></a>
## Archivo #304: docs/07-calidad/01-comandos-validacion.md

- **Ruta relativa:** `docs/07-calidad/01-comandos-validacion.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/07-calidad/01-comandos-validacion.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 01 Comandos Validacion

Build, lint, vitest y playwright por dominio.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0305"></a>
## Archivo #305: docs/07-calidad/02-matriz-regresion.md

- **Ruta relativa:** `docs/07-calidad/02-matriz-regresion.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/07-calidad/02-matriz-regresion.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 02 Matriz Regresion

Matriz general de regresión.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0306"></a>
## Archivo #306: docs/07-calidad/03-testing-gaps.md

- **Ruta relativa:** `docs/07-calidad/03-testing-gaps.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/07-calidad/03-testing-gaps.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 03 Testing Gaps

Gaps y prioridades de cobertura.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0307"></a>
## Archivo #307: docs/07-calidad/04-test-results-forensics.md

- **Ruta relativa:** `docs/07-calidad/04-test-results-forensics.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/07-calidad/04-test-results-forensics.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 04 Test Results Forensics

Cómo analizar resultados fallidos.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0308"></a>
## Archivo #308: docs/08-ia-agentes/01-arquitectura-asistente.md

- **Ruta relativa:** `docs/08-ia-agentes/01-arquitectura-asistente.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/08-ia-agentes/01-arquitectura-asistente.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 01 Arquitectura Asistente

Cómo usar esta arquitectura con asistentes.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0309"></a>
## Archivo #309: docs/08-ia-agentes/02-catalogo-agentes.md

- **Ruta relativa:** `docs/08-ia-agentes/02-catalogo-agentes.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/08-ia-agentes/02-catalogo-agentes.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 02 Catalogo Agentes

Catálogo de agentes y subagentes.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0310"></a>
## Archivo #310: docs/08-ia-agentes/03-catalogo-prompts.md

- **Ruta relativa:** `docs/08-ia-agentes/03-catalogo-prompts.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/08-ia-agentes/03-catalogo-prompts.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 03 Catalogo Prompts

Prompts ejecutables por dominio.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0311"></a>
## Archivo #311: docs/08-ia-agentes/04-economia-tokens.md

- **Ruta relativa:** `docs/08-ia-agentes/04-economia-tokens.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/08-ia-agentes/04-economia-tokens.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 04 Economia Tokens

Escalera de contexto.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0312"></a>
## Archivo #312: docs/08-ia-agentes/05-providers.md

- **Ruta relativa:** `docs/08-ia-agentes/05-providers.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/08-ia-agentes/05-providers.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 05 Providers

Uso con Claude, Codex, Copilot y Gemini.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0313"></a>
## Archivo #313: docs/09-operacion-debug/01-breakpoints-criticos.md

- **Ruta relativa:** `docs/09-operacion-debug/01-breakpoints-criticos.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/09-operacion-debug/01-breakpoints-criticos.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 01 Breakpoints Criticos

Breakpoints en color, transform, snapshot y render.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0314"></a>
## Archivo #314: docs/09-operacion-debug/02-hardtrace-playbook.md

- **Ruta relativa:** `docs/09-operacion-debug/02-hardtrace-playbook.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/09-operacion-debug/02-hardtrace-playbook.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 02 Hardtrace Playbook

Trazas seguras para runtime.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0315"></a>
## Archivo #315: docs/09-operacion-debug/03-troubleshooting.md

- **Ruta relativa:** `docs/09-operacion-debug/03-troubleshooting.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/09-operacion-debug/03-troubleshooting.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 03 Troubleshooting

Guía de problemas frecuentes.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0316"></a>
## Archivo #316: docs/10-handoff/01-handoff-sesion.md

- **Ruta relativa:** `docs/10-handoff/01-handoff-sesion.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/10-handoff/01-handoff-sesion.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 01 Handoff Sesion

Formato de continuidad entre sesiones.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0317"></a>
## Archivo #317: docs/10-handoff/02-plan-fases.md

- **Ruta relativa:** `docs/10-handoff/02-plan-fases.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/10-handoff/02-plan-fases.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 02 Plan Fases

Plan por fases.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0318"></a>
## Archivo #318: docs/10-handoff/03-tickets-sugeridos.md

- **Ruta relativa:** `docs/10-handoff/03-tickets-sugeridos.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/10-handoff/03-tickets-sugeridos.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# 03 Tickets Sugeridos

Tickets sugeridos.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0319"></a>
## Archivo #319: docs/99-archivo/README.md

- **Ruta relativa:** `docs/99-archivo/README.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/docs/99-archivo/README.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `4`

### Contenido original

# Readme

Archivo histórico; no usar como contexto inicial.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0320"></a>
## Archivo #320: reports/current-snapshot/analysis-summary.md

- **Ruta relativa:** `reports/current-snapshot/analysis-summary.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/reports/current-snapshot/analysis-summary.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `60`

### Contenido original

# Análisis completo — SISAD PDFME

Generado: `2026-06-01T18:47:53Z`

## Fuentes analizadas

| Fuente | Métrica |
|---|---:|
| Código unificado | 510 archivos |
| Markdown unificado | 323 archivos |
| CSS unificado | 6 archivos |
| Líneas de código consolidado | 104352 |
| Líneas CSS consolidadas | 13735 |
| Líneas docs sisad-pdfme | 24037 |
| Líneas referencia Inverneg | 16626 |

## Módulos de código detectados

- `tests/playwright`: 11 archivos
- `tests/unit`: 83 archivos
- `src/sisad-pdfme/ui`: 121 archivos
- `src/sisad-pdfme/schemas`: 56 archivos
- `src/sisad-pdfme/pdf-lib`: 154 archivos
- `src/sisad-pdfme/generator`: 5 archivos
- `src/sisad-pdfme/converter`: 8 archivos
- `src/sisad-pdfme/shared`: 13 archivos
- `src/sisad-pdfme/common`: 11 archivos
- `src/sisad-pdfme/collaboration`: 3 archivos
- `src/sisad-pdfme/externalForms`: 1 archivos
- `src/features/pdfcomponent`: 18 archivos

## CSS detectado

- `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css`
- `src/features/pdfcomponent/labRoutes.css`
- `src/sisad-pdfme/ui/styles/canvas-interactions.css`
- `src/sisad-pdfme/ui/styles/sisad-pdfme-demo.css`
- `src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css`
- `src/sisad-pdfme/ui/styles/tokens.css`

## Objetivos deducidos

- active recipient color must drive catalog icons
- existing schema ownerColor must remain immutable after recipient switch
- Moveable/Selecto resize/rotate must not collide with selection, inline edit, context menu, comments, or shortcuts
- snapshot round-trip must preserve recipient color, owner, rotation and designer metadata
- externalForms must consume sisad-pdfme Form/Viewer and avoid manual schema renderer duplication
- ContentCustomForm must remain business host; sisad-pdfme must own canvas/runtime details
- CSS must stay scoped to .sisad-pdfme-root and not break geometry handles

## Decisión de arquitectura

La arquitectura v3 combina:

1. El modelo `.ai/docs/handoff/tests/providers` de Inverneg.
2. La especialización del fork `sisad-pdfme`.
3. La necesidad actual de recipient colors + transform controls.
4. La futura integración con `ContentCustomForm` y `externalForms`.
5. La reducción de duplicidad entre runtime, host y documentación.

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0321"></a>
## Archivo #321: reports/current-snapshot/css-summary.md

- **Ruta relativa:** `reports/current-snapshot/css-summary.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/reports/current-snapshot/css-summary.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `9`

### Contenido original

# Resumen CSS

- `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css`
- `src/features/pdfcomponent/labRoutes.css`
- `src/sisad-pdfme/ui/styles/canvas-interactions.css`
- `src/sisad-pdfme/ui/styles/sisad-pdfme-demo.css`
- `src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css`
- `src/sisad-pdfme/ui/styles/tokens.css`

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0322"></a>
## Archivo #322: reports/current-snapshot/docs-summary.md

- **Ruta relativa:** `reports/current-snapshot/docs-summary.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/reports/current-snapshot/docs-summary.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `23`

### Contenido original

# Resumen docs previas

- `.ai/prompts`: 54
- `.github/prompts`: 54
- `docs`: 53
- `.ai/skills`: 49
- `.ai/agents`: 33
- `.ai/instructions`: 22
- `.github/instructions`: 22
- `.ai/context`: 5
- `.claude/commands`: 5
- `.ai/templates`: 4
- `.ai/architecture`: 3
- `.codex/tasks`: 2
- `.gemini/prompts`: 2
- `AGENTS.md`: 1
- `CLAUDE.md`: 1
- `CODEX.md`: 1
- `GEMINI.md`: 1
- `MANIFEST.md`: 1
- `README.md`: 1
- `.ai/INDEX.md`: 1

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0323"></a>
## Archivo #323: reports/current-snapshot/module-inventory.md

- **Ruta relativa:** `reports/current-snapshot/module-inventory.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/reports/current-snapshot/module-inventory.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `15`

### Contenido original

# Inventario de módulos

- `tests/playwright`: 11
- `tests/unit`: 83
- `src/sisad-pdfme/ui`: 121
- `src/sisad-pdfme/schemas`: 56
- `src/sisad-pdfme/pdf-lib`: 154
- `src/sisad-pdfme/generator`: 5
- `src/sisad-pdfme/converter`: 8
- `src/sisad-pdfme/shared`: 13
- `src/sisad-pdfme/common`: 11
- `src/sisad-pdfme/collaboration`: 3
- `src/sisad-pdfme/externalForms`: 1
- `src/features/pdfcomponent`: 18

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0324"></a>
## Archivo #324: reports/current-snapshot/risk-summary.md

- **Ruta relativa:** `reports/current-snapshot/risk-summary.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/reports/current-snapshot/risk-summary.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `10`

### Contenido original

# Resumen de riesgos

- active recipient color must drive catalog icons
- existing schema ownerColor must remain immutable after recipient switch
- Moveable/Selecto resize/rotate must not collide with selection, inline edit, context menu, comments, or shortcuts
- snapshot round-trip must preserve recipient color, owner, rotation and designer metadata
- externalForms must consume sisad-pdfme Form/Viewer and avoid manual schema renderer duplication
- ContentCustomForm must remain business host; sisad-pdfme must own canvas/runtime details
- CSS must stay scoped to .sisad-pdfme-root and not break geometry handles

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0325"></a>
## Archivo #325: test-results/pdfme-editor-pdfme-editor--485d3--position-and-supports-undo-chromium/error-context.md

- **Ruta relativa:** `test-results/pdfme-editor-pdfme-editor--485d3--position-and-supports-undo-chromium/error-context.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/test-results/pdfme-editor-pdfme-editor--485d3--position-and-supports-undo-chromium/error-context.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `493`

### Contenido original

# Page snapshot

```yaml
- main [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - generic [ref=e8]: Lab
          - generic [ref=e9]: Diseñador
        - heading "Multidocumento integral" [level=1] [ref=e10]
        - paragraph [ref=e11]: Ruta integral para asignaciones por documento, página y destinatario con carga de múltiples PDFs y handoff entre archivos.
      - generic [ref=e13]:
        - generic [ref=e14]: Página 1 / 2
        - link "Volver al índice" [ref=e16] [cursor=pointer]:
          - /url: /
        - button "Descargar plantilla Multidocumento integral" [ref=e18]: Descargar plantilla
        - button "Controles" [ref=e21] [cursor=pointer]:
          - img [ref=e22]
    - region "Colaboración del ejemplo" [ref=e25]:
      - generic [ref=e26]:
        - generic [ref=e27]:
          - generic [ref=e28]: Participantes
          - generic [ref=e29]: "3"
        - list "Participantes del ejemplo" [ref=e30]:
          - listitem [ref=e31]:
            - button "Cliente Principal" [pressed] [ref=e32] [cursor=pointer]
          - listitem [ref=e33]:
            - button "Avalista" [ref=e34] [cursor=pointer]
          - listitem [ref=e35]:
            - button "Mesa de entrega" [ref=e36] [cursor=pointer]
        - generic "Resumen de colaboración" [ref=e37] [cursor=pointer]:
          - generic [ref=e38]: "Visibles: 2"
          - generic [ref=e39]: "Editables: 2"
          - generic [ref=e40]: "Bloqueados: 0"
          - generic [ref=e41]: "Comentarios: 0"
      - generic [ref=e42]:
        - generic [ref=e43]:
          - generic [ref=e44]: Activo
          - combobox "Seleccionar usuario activo" [ref=e45]:
            - option "Cliente Principal" [selected]
            - option "Avalista"
            - option "Mesa de entrega"
        - generic [ref=e46]:
          - generic [ref=e47]: Vista
          - combobox "Seleccionar vista activa" [ref=e48]:
            - option "Usuario activo" [selected]
            - option "Global"
    - group [ref=e49]:
      - generic "Detalles técnicos Metadatos y estado" [ref=e50] [cursor=pointer]:
        - generic [ref=e51]: Detalles técnicos
        - generic [ref=e52]: Metadatos y estado
  - region "Canvas" [ref=e53]:
    - generic [ref=e54]:
      - heading "Canvas" [level=2] [ref=e55]
      - paragraph [ref=e56]:
        - text: La superficie de edición se monta dentro del runtime de
        - code [ref=e57]: sisad-pdfme
        - text: .
    - generic [ref=e61]:
      - generic [ref=e62]:
        - generic [ref=e63]:
          - button "Cerrar catálogo de campos" [expanded] [ref=e64] [cursor=pointer]:
            - img [ref=e65]
          - generic [ref=e69]:
            - generic [ref=e70]:
              - generic [ref=e71]: Diseñador
              - generic [ref=e72]:
                - generic [ref=e73]: Campos
                - 'generic "Color del destinatario activo #2563EB" [ref=e74]'
            - generic [ref=e75]:
              - tablist "Tipos de campo" [ref=e76]:
                - tab "Campos estándar" [selected] [ref=e77] [cursor=pointer]:
                  - img [ref=e78]
                - tab "Campos personalizados" [ref=e80] [cursor=pointer]:
                  - img [ref=e81]
                - tab "Herramientas de prerrellenado" [ref=e84] [cursor=pointer]:
                  - img [ref=e85]
              - generic [ref=e88]:
                - generic [ref=e89]:
                  - img [ref=e91]
                  - textbox "Buscar campos" [ref=e94]
                - generic [ref=e96]:
                  - button "Todos" [ref=e97] [cursor=pointer]:
                    - generic [ref=e98]: Todos
                  - button "Favoritos (0)" [ref=e99] [cursor=pointer]:
                    - generic [ref=e100]: Favoritos (0)
                  - button "Recientes (0)" [ref=e101] [cursor=pointer]:
                    - generic [ref=e102]: Recientes (0)
                  - button "Vista detalle (lista)" [ref=e103] [cursor=pointer]:
                    - img [ref=e105]
            - generic [ref=e106]:
              - generic [ref=e107]:
                - button "Alternar categoría Firmas" [expanded] [ref=e108] [cursor=pointer]:
                  - generic [ref=e109]: Firmas
                  - generic [ref=e110]: "1"
                - generic [ref=e114]:
                  - button "Firma" [ref=e115]:
                    - generic "Firma" [ref=e117]:
                      - img [ref=e118]
                    - generic [ref=e121]: Firma
                  - button "Marcar favorito": ★
              - generic [ref=e122]:
                - button "Alternar categoría Texto" [expanded] [ref=e123] [cursor=pointer]:
                  - generic [ref=e124]: Texto
                  - generic [ref=e125]: "1"
                - generic [ref=e129]:
                  - button "Texto" [ref=e130]:
                    - generic "Texto" [ref=e132]:
                      - img [ref=e133]
                    - generic [ref=e139]: Texto
                  - button "Marcar favorito": ★
              - generic [ref=e140]:
                - button "Alternar categoría Imagen y medios" [expanded] [ref=e141] [cursor=pointer]:
                  - generic [ref=e142]: Imagen y medios
                  - generic [ref=e143]: "2"
                - generic [ref=e144]:
                  - generic [ref=e147]:
                    - button "Imagen" [ref=e148]:
                      - generic "Imagen" [ref=e150]:
                        - img [ref=e151]
                      - generic [ref=e156]: Imagen
                    - button "Marcar favorito": ★
                  - generic [ref=e159]:
                    - button "SVG" [ref=e160]:
                      - generic "SVG" [ref=e162]:
                        - img [ref=e163]
                      - generic [ref=e168]: SVG
                    - button "Marcar favorito": ★
              - generic [ref=e169]:
                - button "Alternar categoría Selecciones" [expanded] [ref=e170] [cursor=pointer]:
                  - generic [ref=e171]: Selecciones
                  - generic [ref=e172]: "3"
                - generic [ref=e173]:
                  - generic [ref=e176]:
                    - button "Casilla" [ref=e177]:
                      - generic "Casilla" [ref=e179]:
                        - img [ref=e180]
                      - generic [ref=e184]: Casilla
                    - button "Marcar favorito": ★
                  - generic [ref=e187]:
                    - button "Opción única" [ref=e188]:
                      - generic "Opción única" [ref=e190]:
                        - img [ref=e191]
                      - generic [ref=e195]: Opción única
                    - button "Marcar favorito": ★
                  - generic [ref=e198]:
                    - button "Lista desplegable" [ref=e199]:
                      - generic "Lista desplegable" [ref=e201]:
                        - img [ref=e202]
                      - generic [ref=e205]: Lista desplegable
                    - button "Marcar favorito": ★
              - generic [ref=e206]:
                - button "Alternar categoría Fecha y Hora" [expanded] [ref=e207] [cursor=pointer]:
                  - generic [ref=e208]: Fecha y Hora
                  - generic [ref=e209]: "3"
                - generic [ref=e210]:
                  - generic [ref=e213]:
                    - button "Fecha" [ref=e214]:
                      - generic "Fecha" [ref=e216]:
                        - img [ref=e217]
                      - generic [ref=e220]: Fecha
                    - button "Marcar favorito": ★
                  - generic [ref=e223]:
                    - button "Fecha y hora" [ref=e224]:
                      - generic "Fecha y hora" [ref=e226]:
                        - img [ref=e227]
                      - generic [ref=e232]: Fecha y hora
                    - button "Marcar favorito": ★
                  - generic [ref=e235]:
                    - button "Hora" [ref=e236]:
                      - generic "Hora" [ref=e238]:
                        - img [ref=e239]
                      - generic [ref=e243]: Hora
                    - button "Marcar favorito": ★
              - generic [ref=e244]:
                - button "Alternar categoría QR y Códigos" [expanded] [ref=e245] [cursor=pointer]:
                  - generic [ref=e246]: QR y Códigos
                  - generic [ref=e247]: "12"
                - generic [ref=e248]:
                  - generic [ref=e251]:
                    - button "Código de barras" [ref=e252]:
                      - generic "Código de barras" [ref=e254]:
                        - img [ref=e255]
                      - generic [ref=e257]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e260]:
                    - button "Código de barras" [ref=e261]:
                      - generic "Código de barras" [ref=e263]:
                        - img [ref=e264]
                      - generic [ref=e266]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e269]:
                    - button "Código de barras" [ref=e270]:
                      - generic "Código de barras" [ref=e272]:
                        - img [ref=e273]
                      - generic [ref=e275]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e278]:
                    - button "Código de barras" [ref=e279]:
                      - generic "Código de barras" [ref=e281]:
                        - img [ref=e282]
                      - generic [ref=e284]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e287]:
                    - button "DataMatrix" [ref=e288]:
                      - generic "DataMatrix" [ref=e290]:
                        - img [ref=e291]
                      - generic [ref=e293]: DataMatrix
                    - button "Marcar favorito": ★
                  - generic [ref=e296]:
                    - button "Código de barras" [ref=e297]:
                      - generic "Código de barras" [ref=e299]:
                        - img [ref=e300]
                      - generic [ref=e302]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e305]:
                    - button "Japan Post" [ref=e306]:
                      - generic "Japan Post" [ref=e308]:
                        - img [ref=e309]
                      - generic [ref=e311]: Japan Post
                    - button "Marcar favorito": ★
                  - generic [ref=e314]:
                    - button "NW7" [ref=e315]:
                      - generic "NW7" [ref=e317]:
                        - img [ref=e318]
                      - generic [ref=e320]: NW7
                    - button "Marcar favorito": ★
                  - generic [ref=e323]:
                    - button "PDF417" [ref=e324]:
                      - generic "PDF417" [ref=e326]:
                        - img [ref=e327]
                      - generic [ref=e329]: PDF417
                    - button "Marcar favorito": ★
                  - generic [ref=e332]:
                    - button "Código QR" [ref=e333]:
                      - generic "Código QR" [ref=e335]:
                        - img [ref=e336]
                      - generic [ref=e343]: Código QR
                    - button "Marcar favorito": ★
                  - generic [ref=e346]:
                    - button "Código de barras" [ref=e347]:
                      - generic "Código de barras" [ref=e349]:
                        - img [ref=e350]
                      - generic [ref=e352]: Código de barras
                    - button "Marcar favorito": ★
                  - generic [ref=e355]:
                    - button "Código de barras" [ref=e356]:
                      - generic "Código de barras" [ref=e358]:
                        - img [ref=e359]
                      - generic [ref=e361]: Código de barras
                    - button "Marcar favorito": ★
              - generic [ref=e362]:
                - button "Alternar categoría Estructura" [expanded] [ref=e363] [cursor=pointer]:
                  - generic [ref=e364]: Estructura
                  - generic [ref=e365]: "4"
                - generic [ref=e366]:
                  - generic [ref=e369]:
                    - button "Óvalo" [ref=e370]:
                      - generic "Óvalo" [ref=e372]:
                        - img [ref=e373]
                      - generic [ref=e376]: Óvalo
                    - button "Marcar favorito": ★
                  - generic [ref=e379]:
                    - button "Línea" [ref=e380]:
                      - generic "Línea" [ref=e382]:
                        - img [ref=e383]
                      - generic [ref=e385]: Línea
                    - button "Marcar favorito": ★
                  - generic [ref=e388]:
                    - button "Rectángulo" [ref=e389]:
                      - generic "Rectángulo" [ref=e391]:
                        - img [ref=e392]
                      - generic [ref=e395]: Rectángulo
                    - button "Marcar favorito": ★
                  - generic [ref=e398]:
                    - button "Tabla" [ref=e399]:
                      - generic "Tabla" [ref=e401]:
                        - img [ref=e402]
                      - generic [ref=e405]: Tabla
                    - button "Marcar favorito": ★
        - generic [ref=e406]:
          - generic:
            - generic [ref=e408]:
              - generic "Listo" [ref=e409]
              - generic [ref=e410]: Doc · Pág 1/2 · Sel 1
            - generic [ref=e412]:
              - button "Página anterior" [disabled] [ref=e413]:
                - generic:
                  - img
              - button "Pág 1/2" [ref=e414] [cursor=pointer]:
                - generic [ref=e415]: Pág 1/2
              - button "Página siguiente" [ref=e416] [cursor=pointer]:
                - img [ref=e418]
            - generic [ref=e421]:
              - button "Guardar" [ref=e422] [cursor=pointer]:
                - img [ref=e424]
                - generic [ref=e428]: Guardar
              - button "Más acciones" [ref=e429] [cursor=pointer]:
                - img [ref=e431]
            - generic [ref=e436]:
              - button "Deshacer" [ref=e437] [cursor=pointer]:
                - img [ref=e439]
              - button "Rehacer" [ref=e442] [cursor=pointer]:
                - img [ref=e444]
              - button "Ajustar página" [ref=e447] [cursor=pointer]:
                - img [ref=e449]
              - generic [ref=e454]:
                - button "Reducir zoom" [ref=e455] [cursor=pointer]:
                  - img [ref=e457]
                - generic [ref=e458] [cursor=pointer]:
                  - generic [ref=e460]:
                    - combobox [ref=e462]
                    - generic "100%" [ref=e463]
                  - generic:
                    - img:
                      - img
                - button "Aumentar zoom" [ref=e464] [cursor=pointer]:
                  - img [ref=e466]
          - button "Ocultar panel derecho" [pressed] [ref=e467]:
            - img [ref=e468]
          - complementary "Panel derecho del diseñador" [ref=e471]:
            - generic [ref=e472]:
              - tablist "Panel derecho" [ref=e474]:
                - tab "Abrir panel Campos" [ref=e475] [cursor=pointer]:
                  - img [ref=e478]
                - tab "Abrir panel Detalle" [selected] [ref=e482] [cursor=pointer]:
                  - img [ref=e485]
                - tab "Abrir panel Comentarios" [ref=e486] [cursor=pointer]:
                  - img [ref=e489]
                - tab "Abrir panel Docs" [ref=e491] [cursor=pointer]:
                  - img [ref=e494]
              - generic "Secciones del detalle del campo" [ref=e499]:
                - generic [ref=e506]:
                  - strong [ref=e508]: contract_date
                  - generic [ref=e509]:
                    - 'generic "UID: multi-contract-date Creado por: routing-user-1 Modificado: recipient-1 Propietario: recipient-1 Modo de propiedad: single" [ref=e510]': Guardar
                    - 'generic "UID: multi-contract-date Creado por: routing-user-1 Modificado: recipient-1 Propietario: recipient-1 Modo de propiedad: single" [ref=e511]': "+1"
                - generic [ref=e512]:
                  - generic [ref=e513]:
                    - button "Colapsar sección Identidad" [expanded] [ref=e514] [cursor=pointer]:
                      - generic [ref=e515]:
                        - generic [ref=e516]: Identidad
                        - generic [ref=e517]: Nombre, identidad y metadatos esenciales.
                      - img [ref=e519]
                    - generic [ref=e524]:
                      - generic [ref=e527]:
                        - generic "Nombre del campo" [ref=e529]: "* Nombre del campo"
                        - textbox "* Nombre del campo" [ref=e533]: contract_date
                      - generic [ref=e535]:
                        - button "Renombrar campo" [ref=e536] [cursor=pointer]:
                          - img [ref=e538]
                          - generic [ref=e541]: Renombrar campo
                        - button "Editar texto" [ref=e542] [cursor=pointer]:
                          - img [ref=e544]
                          - generic [ref=e546]: Editar texto
                  - generic [ref=e553]:
                    - button "Colapsar sección Caja" [expanded] [ref=e554] [cursor=pointer]:
                      - generic [ref=e555]:
                        - generic [ref=e556]: Caja
                        - generic [ref=e557]: Posición, tamaño y orden espacial.
                      - img [ref=e559]
                    - generic [ref=e564]:
                      - generic [ref=e567]:
                        - generic "Alineación" [ref=e569]
                        - generic [ref=e573]:
                          - button "Alinear a la izquierda" [ref=e574] [cursor=pointer]:
                            - img [ref=e576]
                          - button "Centrar horizontalmente" [ref=e579] [cursor=pointer]:
                            - img [ref=e581]
                          - button "Alinear a la derecha" [ref=e586] [cursor=pointer]:
                            - img [ref=e588]
                          - button "Alinear arriba" [ref=e591] [cursor=pointer]:
                            - img [ref=e593]
                          - button "Centrar verticalmente" [ref=e596] [cursor=pointer]:
                            - img [ref=e598]
                          - button "Alinear abajo" [ref=e603] [cursor=pointer]:
                            - img [ref=e605]
                          - button "Distribuir verticalmente" [disabled] [ref=e608]:
                            - generic:
                              - img
                          - button "Distribuir horizontalmente" [disabled] [ref=e609]:
                            - generic:
                              - img
                      - generic [ref=e612]:
                        - generic [ref=e615]:
                          - generic "X" [ref=e617]: "* X"
                          - generic [ref=e621]:
                            - generic:
                              - button "Increase Value" [ref=e622] [cursor=pointer]:
                                - img "up" [ref=e623]:
                                  - img [ref=e624]
                              - button "Decrease Value" [ref=e626] [cursor=pointer]:
                                - img "down" [ref=e627]:
                                  - img [ref=e628]
                            - spinbutton "* X" [ref=e631]: "18"
                        - generic [ref=e634]:
                          - generic "Y" [ref=e636]: "* Y"
                          - generic [ref=e640]:
                            - generic:
                              - button "Increase Value" [ref=e641] [cursor=pointer]:
                                - img "up" [ref=e642]:
                                  - img [ref=e643]
                              - button "Decrease Value" [ref=e645] [cursor=pointer]:
                                - img "down" [ref=e646]:
                                  - img [ref=e647]
                            - spinbutton "* Y" [ref=e650]: "24"
                      - generic [ref=e653]:
                        - generic "Anchura" [ref=e655]: "* Anchura"
                        - generic [ref=e659]:
                          - generic:
                            - button "Increase Value" [ref=e660] [cursor=pointer]:
                              - img "up" [ref=e661]:
                                - img [ref=e662]
                            - button "Decrease Value" [ref=e664] [cursor=pointer]:
                              - img "down" [ref=e665]:
                                - img [ref=e666]
                          - spinbutton "* Anchura" [ref=e669]: "92"
                      - generic [ref=e672]:
                        - generic "Altura" [ref=e674]: "* Altura"
                        - generic [ref=e678]:
                          - generic:
                            - button "Increase Value" [ref=e679] [cursor=pointer]:
                              - img "up" [ref=e680]:
                                - img [ref=e681]
                            - button "Decrease Value" [ref=e683] [cursor=pointer]:
                              - img "down" [ref=e684]:
                                - img [ref=e685]
                          - spinbutton "* Altura" [ref=e688]: "12"
                  - button "Expandir sección Apariencia" [ref=e696] [cursor=pointer]:
                    - generic [ref=e697]:
                      - generic [ref=e698]: Apariencia
                      - generic [ref=e699]: Tratamiento visual específico de la familia.
                    - img [ref=e701]
                  - generic [ref=e703]:
                    - button "Colapsar sección Comportamiento" [expanded] [ref=e704] [cursor=pointer]:
                      - generic [ref=e705]:
                        - generic [ref=e706]: Comportamiento
                        - generic [ref=e707]: Semántica, reglas y opciones del campo.
                      - img [ref=e709]
                    - generic [ref=e714]:
                      - generic [ref=e720]:
                        - checkbox [checked] [ref=e723] [cursor=pointer]
                        - generic [ref=e725]: Editable
                      - generic [ref=e731]:
                        - checkbox [ref=e734] [cursor=pointer]
                        - generic [ref=e736]: Requerido
                  - button "Expandir sección Datos conectados" [ref=e744] [cursor=pointer]:
                    - generic [ref=e745]:
                      - generic [ref=e746]: Datos conectados
                      - generic [ref=e747]: Persistencia, JSON y API.
                    - img [ref=e749]
                  - button "Expandir sección Colaboración" [ref=e752] [cursor=pointer]:
                    - generic [ref=e753]:
                      - generic [ref=e754]: Colaboración
                      - generic [ref=e755]: Owner, bloqueo y trazabilidad.
                    - img [ref=e757]
                  - button "Expandir sección Avanzado" [ref=e760] [cursor=pointer]:
                    - generic [ref=e761]:
                      - generic [ref=e762]: Avanzado
                      - generic [ref=e763]: Propiedades poco frecuentes o de bajo nivel.
                    - img [ref=e765]
          - generic [ref=e767]:
            - generic [ref=e770]:
              - generic "contract_name" [ref=e788] [cursor=pointer]:
                - generic [ref=e791]: Contrato principal
                - text: text
              - generic "contract_date" [ref=e792] [cursor=pointer]:
                - generic:
                  - generic:
                    - generic: 2026-05-01
                - text: text
            - generic:
              - toolbar "Barra contextual de edición" [ref=e795]:
                - group "Acciones rápidas" [ref=e796]:
                  - button "Editar texto" [ref=e797] [cursor=pointer]:
                    - img [ref=e799]
                    - generic [ref=e801]: Editar texto
                  - button "Duplicar" [ref=e802] [cursor=pointer]:
                    - img [ref=e804]
                    - generic [ref=e807]: Duplicar
                  - button "Más acciones" [ref=e808] [cursor=pointer]:
                    - img [ref=e810]
                    - generic [ref=e814]: Más
              - generic: 153px × 20px
      - status [ref=e815]
  - group "Resultados" [ref=e816]:
    - generic "Resultados Abre esta sección para revisar salidas de generación y conversión. Colapsado" [ref=e817] [cursor=pointer]:
      - generic [ref=e818]:
        - heading "Resultados" [level=2] [ref=e819]
        - paragraph [ref=e820]: Abre esta sección para revisar salidas de generación y conversión.
      - generic [ref=e821]: Colapsado
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0326"></a>
## Archivo #326: .ai/skills/active-recipient-color-contract/SKILL.md

- **Ruta relativa:** `.ai/skills/active-recipient-color-contract/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/active-recipient-color-contract/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Active Recipient Color Contract

## Objetivo

Aplicar procedimiento reutilizable para `active-recipient-color-contract`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0327"></a>
## Archivo #327: .ai/skills/canvas-geometry-scaling/SKILL.md

- **Ruta relativa:** `.ai/skills/canvas-geometry-scaling/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/canvas-geometry-scaling/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Canvas Geometry Scaling

## Objetivo

Aplicar procedimiento reutilizable para `canvas-geometry-scaling`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0328"></a>
## Archivo #328: .ai/skills/command-bus-transform-actions/SKILL.md

- **Ruta relativa:** `.ai/skills/command-bus-transform-actions/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/command-bus-transform-actions/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Command Bus Transform Actions

## Objetivo

Aplicar procedimiento reutilizable para `command-bus-transform-actions`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0329"></a>
## Archivo #329: .ai/skills/component-composition/SKILL.md

- **Ruta relativa:** `.ai/skills/component-composition/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/component-composition/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Component Composition

## Objetivo

Aplicar procedimiento reutilizable para `component-composition`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0330"></a>
## Archivo #330: .ai/skills/context-budget/SKILL.md

- **Ruta relativa:** `.ai/skills/context-budget/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/context-budget/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Context Budget

## Objetivo

Aplicar procedimiento reutilizable para `context-budget`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0331"></a>
## Archivo #331: .ai/skills/context-menu-transform-guard/SKILL.md

- **Ruta relativa:** `.ai/skills/context-menu-transform-guard/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/context-menu-transform-guard/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Context Menu Transform Guard

## Objetivo

Aplicar procedimiento reutilizable para `context-menu-transform-guard`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0332"></a>
## Archivo #332: .ai/skills/css-layering-and-overrides/SKILL.md

- **Ruta relativa:** `.ai/skills/css-layering-and-overrides/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/css-layering-and-overrides/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Css Layering And Overrides

## Objetivo

Aplicar procedimiento reutilizable para `css-layering-and-overrides`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0333"></a>
## Archivo #333: .ai/skills/css-recipient-color-tokens/SKILL.md

- **Ruta relativa:** `.ai/skills/css-recipient-color-tokens/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/css-recipient-color-tokens/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Css Recipient Color Tokens

## Objetivo

Aplicar procedimiento reutilizable para `css-recipient-color-tokens`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0334"></a>
## Archivo #334: .ai/skills/css-transform-handle-safety/SKILL.md

- **Ruta relativa:** `.ai/skills/css-transform-handle-safety/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/css-transform-handle-safety/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Css Transform Handle Safety

## Objetivo

Aplicar procedimiento reutilizable para `css-transform-handle-safety`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0335"></a>
## Archivo #335: .ai/skills/custom-schema-contracts/SKILL.md

- **Ruta relativa:** `.ai/skills/custom-schema-contracts/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/custom-schema-contracts/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Custom Schema Contracts

## Objetivo

Aplicar procedimiento reutilizable para `custom-schema-contracts`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0336"></a>
## Archivo #336: .ai/skills/documentation-traceability/SKILL.md

- **Ruta relativa:** `.ai/skills/documentation-traceability/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/documentation-traceability/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Documentation Traceability

## Objetivo

Aplicar procedimiento reutilizable para `documentation-traceability`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0337"></a>
## Archivo #337: .ai/skills/external-forms-runtime/SKILL.md

- **Ruta relativa:** `.ai/skills/external-forms-runtime/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/external-forms-runtime/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — External Forms Runtime

## Objetivo

Aplicar procedimiento reutilizable para `external-forms-runtime`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0338"></a>
## Archivo #338: .ai/skills/floating-toolbar-transform-position/SKILL.md

- **Ruta relativa:** `.ai/skills/floating-toolbar-transform-position/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/floating-toolbar-transform-position/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Floating Toolbar Transform Position

## Objetivo

Aplicar procedimiento reutilizable para `floating-toolbar-transform-position`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0339"></a>
## Archivo #339: .ai/skills/fork-safe-pdfme-evolution/SKILL.md

- **Ruta relativa:** `.ai/skills/fork-safe-pdfme-evolution/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/fork-safe-pdfme-evolution/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Fork Safe Pdfme Evolution

## Objetivo

Aplicar procedimiento reutilizable para `fork-safe-pdfme-evolution`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0340"></a>
## Archivo #340: .ai/skills/form-viewer-generator-parity/SKILL.md

- **Ruta relativa:** `.ai/skills/form-viewer-generator-parity/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/form-viewer-generator-parity/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Form Viewer Generator Parity

## Objetivo

Aplicar procedimiento reutilizable para `form-viewer-generator-parity`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0341"></a>
## Archivo #341: .ai/skills/inline-edit-transform-guard/SKILL.md

- **Ruta relativa:** `.ai/skills/inline-edit-transform-guard/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/inline-edit-transform-guard/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Inline Edit Transform Guard

## Objetivo

Aplicar procedimiento reutilizable para `inline-edit-transform-guard`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0342"></a>
## Archivo #342: .ai/skills/keyboard-shortcut-transform-safety/SKILL.md

- **Ruta relativa:** `.ai/skills/keyboard-shortcut-transform-safety/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/keyboard-shortcut-transform-safety/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Keyboard Shortcut Transform Safety

## Objetivo

Aplicar procedimiento reutilizable para `keyboard-shortcut-transform-safety`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0343"></a>
## Archivo #343: .ai/skills/legacy-runtime-reduction/SKILL.md

- **Ruta relativa:** `.ai/skills/legacy-runtime-reduction/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/legacy-runtime-reduction/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Legacy Runtime Reduction

## Objetivo

Aplicar procedimiento reutilizable para `legacy-runtime-reduction`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0344"></a>
## Archivo #344: .ai/skills/moveable-selecto-integration/SKILL.md

- **Ruta relativa:** `.ai/skills/moveable-selecto-integration/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/moveable-selecto-integration/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Moveable Selecto Integration

## Objetivo

Aplicar procedimiento reutilizable para `moveable-selecto-integration`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0345"></a>
## Archivo #345: .ai/skills/moveable-selecto-resize-rotate/SKILL.md

- **Ruta relativa:** `.ai/skills/moveable-selecto-resize-rotate/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/moveable-selecto-resize-rotate/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Moveable Selecto Resize Rotate

## Objetivo

Aplicar procedimiento reutilizable para `moveable-selecto-resize-rotate`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0346"></a>
## Archivo #346: .ai/skills/playwright-canvas-diagnostics/SKILL.md

- **Ruta relativa:** `.ai/skills/playwright-canvas-diagnostics/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/playwright-canvas-diagnostics/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Playwright Canvas Diagnostics

## Objetivo

Aplicar procedimiento reutilizable para `playwright-canvas-diagnostics`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0347"></a>
## Archivo #347: .ai/skills/playwright-recipient-color-regression/SKILL.md

- **Ruta relativa:** `.ai/skills/playwright-recipient-color-regression/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/playwright-recipient-color-regression/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Playwright Recipient Color Regression

## Objetivo

Aplicar procedimiento reutilizable para `playwright-recipient-color-regression`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0348"></a>
## Archivo #348: .ai/skills/playwright-transform-regression/SKILL.md

- **Ruta relativa:** `.ai/skills/playwright-transform-regression/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/playwright-transform-regression/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Playwright Transform Regression

## Objetivo

Aplicar procedimiento reutilizable para `playwright-transform-regression`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0349"></a>
## Archivo #349: .ai/skills/public-api-surface-design/SKILL.md

- **Ruta relativa:** `.ai/skills/public-api-surface-design/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/public-api-surface-design/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Public Api Surface Design

## Objetivo

Aplicar procedimiento reutilizable para `public-api-surface-design`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0350"></a>
## Archivo #350: .ai/skills/quality-gates/SKILL.md

- **Ruta relativa:** `.ai/skills/quality-gates/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/quality-gates/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Quality Gates

## Objetivo

Aplicar procedimiento reutilizable para `quality-gates`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0351"></a>
## Archivo #351: .ai/skills/schema-icon-color-sync/SKILL.md

- **Ruta relativa:** `.ai/skills/schema-icon-color-sync/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/schema-icon-color-sync/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Schema Icon Color Sync

## Objetivo

Aplicar procedimiento reutilizable para `schema-icon-color-sync`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0352"></a>
## Archivo #352: .ai/skills/schema-owner-color-persistence/SKILL.md

- **Ruta relativa:** `.ai/skills/schema-owner-color-persistence/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/schema-owner-color-persistence/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Schema Owner Color Persistence

## Objetivo

Aplicar procedimiento reutilizable para `schema-owner-color-persistence`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0353"></a>
## Archivo #353: .ai/skills/schema-registry-extension/SKILL.md

- **Ruta relativa:** `.ai/skills/schema-registry-extension/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/schema-registry-extension/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Schema Registry Extension

## Objetivo

Aplicar procedimiento reutilizable para `schema-registry-extension`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0354"></a>
## Archivo #354: .ai/skills/schema-tone-resolution/SKILL.md

- **Ruta relativa:** `.ai/skills/schema-tone-resolution/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/schema-tone-resolution/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Schema Tone Resolution

## Objetivo

Aplicar procedimiento reutilizable para `schema-tone-resolution`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0355"></a>
## Archivo #355: .ai/skills/snapshot-transform-roundtrip/SKILL.md

- **Ruta relativa:** `.ai/skills/snapshot-transform-roundtrip/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/snapshot-transform-roundtrip/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Snapshot Transform Roundtrip

## Objetivo

Aplicar procedimiento reutilizable para `snapshot-transform-roundtrip`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0356"></a>
## Archivo #356: .ai/skills/test-results-forensics/SKILL.md

- **Ruta relativa:** `.ai/skills/test-results-forensics/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/test-results-forensics/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Test Results Forensics

## Objetivo

Aplicar procedimiento reutilizable para `test-results-forensics`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0357"></a>
## Archivo #357: .ai/skills/transform-interaction-state-machine/SKILL.md

- **Ruta relativa:** `.ai/skills/transform-interaction-state-machine/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/transform-interaction-state-machine/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Transform Interaction State Machine

## Objetivo

Aplicar procedimiento reutilizable para `transform-interaction-state-machine`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0358"></a>
## Archivo #358: .ai/skills/unique-recipient-palette/SKILL.md

- **Ruta relativa:** `.ai/skills/unique-recipient-palette/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/unique-recipient-palette/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Unique Recipient Palette

## Objetivo

Aplicar procedimiento reutilizable para `unique-recipient-palette`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0359"></a>
## Archivo #359: .ai/skills/unit-recipient-color-contracts/SKILL.md

- **Ruta relativa:** `.ai/skills/unit-recipient-color-contracts/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/unit-recipient-color-contracts/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Unit Recipient Color Contracts

## Objetivo

Aplicar procedimiento reutilizable para `unit-recipient-color-contracts`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0360"></a>
## Archivo #360: .ai/skills/unit-transform-state-contracts/SKILL.md

- **Ruta relativa:** `.ai/skills/unit-transform-state-contracts/SKILL.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai/skills/unit-transform-state-contracts/SKILL.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `31`

### Contenido original

# SKILL — Unit Transform State Contracts

## Objetivo

Aplicar procedimiento reutilizable para `unit-transform-state-contracts`.

## Entrada

- Contexto del dominio.
- Archivos reales localizados con `rg`.
- Reglas relevantes.
- Resultado esperado por el usuario.

## Procedimiento

1. Confirmar frontera de responsabilidad.
2. Identificar contrato público afectado.
3. Localizar implementación y tests.
4. Proponer cambio mínimo.
5. Validar con unit/integration/Playwright según aplique.
6. Actualizar docs si cambia contrato.

## Salida

```md
## Diagnóstico
## Archivos tocados
## Validación
## Riesgos
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

<a id="archivo-0361"></a>
## Archivo #361: src/sisad-pdfme/ui/designerEngine.api.md

- **Ruta relativa:** `src/sisad-pdfme/ui/designerEngine.api.md`
- **Ruta absoluta:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/src/sisad-pdfme/ui/designerEngine.api.md`
- **Extensión:** `.md`
- **Líneas aproximadas:** `81`

### Contenido original

# Designer Engine APIs

## Objetivo
Desacoplar el diseñador en piezas reutilizables para poder usar solo lo necesario:
- sidebars reemplazables
- canvas por slots
- feature flags
- estilos por `className`/`styleOverrides`
- metadata de schema (identidad, prefill, persistencia, API y formularios JSON)

## Builder

```ts
import { DesignerEngineBuilder } from '@sisad-pdfme/ui';

const engine = new DesignerEngineBuilder()
  .withLeftSidebar(MyLeftSidebar)
  .withRightSidebar(MyRightSidebar)
  .withCanvasFeatureToggles({
    guides: true,
    selecto: true,
    moveable: true,
    snapLines: true,
    padding: false,
    mask: true,
  })
  .withCanvasClassNames({
    canvasContainer: 'my-canvas',
    moveable: 'my-moveable',
    guides: 'my-guides',
  })
  .withCanvasStyleOverrides({
    canvasContainer: { background: '#f8fafc' },
    moveable: { color: '#7c3aed' },
    snapLines: { lineColor: '#0ea5e9', centerColor: '#ef4444' },
  })
  .withHttpAxiosConfig({
    inheritSystem: true,
    headers: { 'X-App': 'sisadbeta' },
  })
  .withSchemaConfigStorageKey('__designer')
  .withAutoAttachIdentity(true)
  .build();

const options = new DesignerEngineBuilder().buildOptions({
  themePreset: 'sisad',
  designerEngine: engine,
});
```

## Runtime API adicional

`Designer` expone:
- `getSchemaConfig(schemaIdOrName, matcher?)`
- `setSchemaConfig(schemaIdOrName, patch, matcher?)`
- `applyExternalPrefill(payload, matcher?)`

Matchers soportados:
- `id`
- `name`
- `identity`
- `prefill-source`

## Metadata de schema

Cada schema puede guardar config en `__designer` (o la key que definas):

```ts
{
  __designer: {
    identity: { id, key, namespace, version, tags },
    prefill: { enabled, strategy, sourceKey, resolverId, endpoint, method, mapping, headers },
    persistence: { enabled, mode, key, includeHidden, includeMeta },
    api: { enabled, endpoint, method, requestMode, http, headers, params, requestMapping, responseMapping, timeoutMs },
    form: { enabled, collect, format, rootKey, includeEmpty, includeHidden, includeMeta },
    integrations: [{ provider, operation, endpoint, authRef, params, enabled }],
    metadata: { className, style }
  }
}
```

[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)

---

# Estructura de carpetas analizada

```text
prueba-plugin
├── .ai
│   ├── agent-loop.md
│   ├── agents
│   │   ├── canvas-runtime-agent.md
│   │   ├── collaboration-lock-agent.md
│   │   ├── command-bus-agent.md
│   │   ├── content-custom-form-agent.md
│   │   ├── css-agent.md
│   │   ├── debugging-agent.md
│   │   ├── designer-engine-agent.md
│   │   ├── docs-governance-agent.md
│   │   ├── external-forms-agent.md
│   │   ├── frontend-architect-agent.md
│   │   ├── generator-converter-agent.md
│   │   ├── left-sidebar-catalog-agent.md
│   │   ├── legacy-cleanup-agent.md
│   │   ├── moveable-selecto-agent.md
│   │   ├── provider-sync-agent.md
│   │   ├── quality-agent.md
│   │   ├── recipient-color-agent.md
│   │   ├── registry.md
│   │   ├── release-agent.md
│   │   ├── right-sidebar-inspector-agent.md
│   │   ├── root-orchestrator-agent.md
│   │   ├── schema-icon-sync-agent.md
│   │   ├── schema-registry-agent.md
│   │   ├── security-agent.md
│   │   ├── sisad-pdfme-runtime-agent.md
│   │   ├── snapshot-agent.md
│   │   ├── testing-regression-agent.md
│   │   ├── token-economy-agent.md
│   │   └── ui-ux-agent.md
│   ├── architecture
│   │   ├── agent-routing.md
│   │   ├── assistant-architecture.md
│   │   ├── context-loading-ladder.md
│   │   ├── fork-safe-evolution.md
│   │   ├── module-boundaries.md
│   │   ├── provider-model.md
│   │   ├── quality-gate-model.md
│   │   └── runtime-ownership.md
│   ├── checklists
│   │   ├── before-change.md
│   │   ├── before-merge.md
│   │   ├── css-boundaries.md
│   │   ├── external-forms.md
│   │   ├── provider-sync.md
│   │   ├── quality-gates.md
│   │   ├── recipient-color.md
│   │   ├── release.md
│   │   ├── schema-transform.md
│   │   └── snapshot-roundtrip.md
│   ├── context
│   │   ├── canvas-coordinates-context.md
│   │   ├── code-map.md
│   │   ├── collaboration-locks-context.md
│   │   ├── command-bus-context.md
│   │   ├── content-custom-form-integration-context.md
│   │   ├── css-design-system-context.md
│   │   ├── css-map.md
│   │   ├── designer-engine-context.md
│   │   ├── docs-map.md
│   │   ├── external-forms-runner-context.md
│   │   ├── generator-converter-context.md
│   │   ├── integration-host-boundaries-context.md
│   │   ├── legacy-cleanup-context.md
│   │   ├── module-map.md
│   │   ├── moveable-selecto-context.md
│   │   ├── project-overview.md
│   │   ├── provider-compatibility-context.md
│   │   ├── recipient-color-context.md
│   │   ├── schema-icon-sync-context.md
│   │   ├── schema-owner-persistence-context.md
│   │   ├── schema-registry-context.md
│   │   ├── security-privacy-context.md
│   │   ├── selection-shortcuts-context.md
│   │   ├── sidebars-inspector-context.md
│   │   ├── sisad-pdfme-runtime-context.md
│   │   ├── snapshot-contract-context.md
│   │   ├── tests-quality-context.md
│   │   ├── transform-controls-context.md
│   │   └── ui-ux-compact-context.md
│   ├── context-map.md
│   ├── INDEX.md
│   ├── memory
│   │   ├── decisions.md
│   │   ├── incidents.md
│   │   ├── project-memory.md
│   │   ├── session-handoff.md
│   │   └── update-protocol.md
│   ├── prompts
│   │   ├── audit-css-boundaries.prompt.md
│   │   ├── audit-legacy-runtime-reduction.prompt.md
│   │   ├── audit-platform-boundaries.prompt.md
│   │   ├── build-regression-test-matrix.prompt.md
│   │   ├── create-playwright-canvas-scenarios.prompt.md
│   │   ├── create-test-fixtures-multi-recipient-colors.prompt.md
│   │   ├── fix-keyboard-shortcut-collisions.prompt.md
│   │   ├── generate-final-implementation-report.prompt.md
│   │   ├── harden-moveable-selecto-guards.prompt.md
│   │   ├── implement-unique-recipient-palette.prompt.md
│   │   ├── INDEX.md
│   │   ├── inspect-failed-test-results.prompt.md
│   │   ├── normalize-selection-transform-state-machine.prompt.md
│   │   ├── preserve-owner-color-on-existing-schemas.prompt.md
│   │   ├── protect-inline-edit-from-transform.prompt.md
│   │   ├── recipient-transform-master-plan.prompt.md
│   │   ├── refactor-left-rail-catalog.prompt.md
│   │   ├── refactor-right-inspector-layout.prompt.md
│   │   ├── refactor-transform-geometry-utils.prompt.md
│   │   ├── repair-contentcustomform-integration.prompt.md
│   │   ├── repair-external-forms-runner.prompt.md
│   │   ├── repair-floating-toolbar-position.prompt.md
│   │   ├── repair-recipient-color-sync.prompt.md
│   │   ├── repair-schema-icon-color-sync.prompt.md
│   │   ├── repair-sidebars-inspector.prompt.md
│   │   ├── repair-snapshot-roundtrip.prompt.md
│   │   ├── repair-transform-collisions.prompt.md
│   │   ├── review-css-for-transform-handle-breaks.prompt.md
│   │   ├── stabilize-designer-engine-api.prompt.md
│   │   ├── stabilize-schema-resize-rotation.prompt.md
│   │   ├── standardize-data-attributes-for-colors.prompt.md
│   │   ├── unify-css-architecture.prompt.md
│   │   ├── update-docs-recipient-transform.prompt.md
│   │   └── validate-ci-flow-recipient-transform.prompt.md
│   ├── providers
│   │   ├── claude-adapter.md
│   │   ├── codex-adapter.md
│   │   ├── gemini-adapter.md
│   │   ├── generic-provider-adapter.md
│   │   ├── github-copilot-adapter.md
│   │   └── provider-contract.md
│   ├── README.md
│   ├── rules
│   │   ├── collaboration-lock-rules.md
│   │   ├── command-bus-rules.md
│   │   ├── context-loading-ladder-rules.md
│   │   ├── css-boundary-rules.md
│   │   ├── docs-governance-rules.md
│   │   ├── external-forms-runner-rules.md
│   │   ├── generator-converter-rules.md
│   │   ├── global-rules.md
│   │   ├── host-runtime-boundary-rules.md
│   │   ├── legacy-reduction-rules.md
│   │   ├── moveable-selecto-rules.md
│   │   ├── provider-adapter-rules.md
│   │   ├── public-api-rules.md
│   │   ├── schema-icon-color-rules.md
│   │   ├── schema-ownership-rules.md
│   │   ├── security-privacy-rules.md
│   │   ├── sidebars-inspector-rules.md
│   │   ├── snapshot-contract-rules.md
│   │   ├── testing-quality-rules.md
│   │   ├── token-budget-rules.md
│   │   └── transform-interaction-rules.md
│   ├── skills
│   │   ├── active-recipient-color-contract
│   │   │   └── SKILL.md
│   │   ├── canvas-geometry-scaling
│   │   │   └── SKILL.md
│   │   ├── command-bus-transform-actions
│   │   │   └── SKILL.md
│   │   ├── component-composition
│   │   │   └── SKILL.md
│   │   ├── context-budget
│   │   │   └── SKILL.md
│   │   ├── context-menu-transform-guard
│   │   │   └── SKILL.md
│   │   ├── css-layering-and-overrides
│   │   │   └── SKILL.md
│   │   ├── css-recipient-color-tokens
│   │   │   └── SKILL.md
│   │   ├── css-transform-handle-safety
│   │   │   └── SKILL.md
│   │   ├── custom-schema-contracts
│   │   │   └── SKILL.md
│   │   ├── documentation-traceability
│   │   │   └── SKILL.md
│   │   ├── external-forms-runtime
│   │   │   └── SKILL.md
│   │   ├── floating-toolbar-transform-position
│   │   │   └── SKILL.md
│   │   ├── fork-safe-pdfme-evolution
│   │   │   └── SKILL.md
│   │   ├── form-viewer-generator-parity
│   │   │   └── SKILL.md
│   │   ├── inline-edit-transform-guard
│   │   │   └── SKILL.md
│   │   ├── keyboard-shortcut-transform-safety
│   │   │   └── SKILL.md
│   │   ├── legacy-runtime-reduction
│   │   │   └── SKILL.md
│   │   ├── moveable-selecto-integration
│   │   │   └── SKILL.md
│   │   ├── moveable-selecto-resize-rotate
│   │   │   └── SKILL.md
│   │   ├── playwright-canvas-diagnostics
│   │   │   └── SKILL.md
│   │   ├── playwright-recipient-color-regression
│   │   │   └── SKILL.md
│   │   ├── playwright-transform-regression
│   │   │   └── SKILL.md
│   │   ├── public-api-surface-design
│   │   │   └── SKILL.md
│   │   ├── quality-gates
│   │   │   └── SKILL.md
│   │   ├── schema-icon-color-sync
│   │   │   └── SKILL.md
│   │   ├── schema-owner-color-persistence
│   │   │   └── SKILL.md
│   │   ├── schema-registry-extension
│   │   │   └── SKILL.md
│   │   ├── schema-tone-resolution
│   │   │   └── SKILL.md
│   │   ├── snapshot-transform-roundtrip
│   │   │   └── SKILL.md
│   │   ├── test-results-forensics
│   │   │   └── SKILL.md
│   │   ├── transform-interaction-state-machine
│   │   │   └── SKILL.md
│   │   ├── unique-recipient-palette
│   │   │   └── SKILL.md
│   │   ├── unit-recipient-color-contracts
│   │   │   └── SKILL.md
│   │   └── unit-transform-state-contracts
│   │       └── SKILL.md
│   ├── subagents
│   │   ├── active-recipient-color-subagent.md
│   │   ├── assignments-filtering-subagent.md
│   │   ├── canvas-coordinate-subagent.md
│   │   ├── collaboration-locks-subagent.md
│   │   ├── command-bus-transform-subagent.md
│   │   ├── comments-overlay-subagent.md
│   │   ├── context-menu-guard-subagent.md
│   │   ├── converter-browser-node-subagent.md
│   │   ├── css-token-subagent.md
│   │   ├── css-transform-handle-subagent.md
│   │   ├── custom-plugin-contract-subagent.md
│   │   ├── detail-widgets-subagent.md
│   │   ├── docs-migration-subagent.md
│   │   ├── external-form-runner-subagent.md
│   │   ├── floating-toolbar-position-subagent.md
│   │   ├── form-viewer-parity-subagent.md
│   │   ├── generator-helper-subagent.md
│   │   ├── inline-edit-guard-subagent.md
│   │   ├── keyboard-shortcut-guard-subagent.md
│   │   ├── left-sidebar-catalog-color-subagent.md
│   │   ├── legacy-wrapper-subagent.md
│   │   ├── moveable-resize-subagent.md
│   │   ├── moveable-rotation-subagent.md
│   │   ├── overlay-manager-subagent.md
│   │   ├── owner-color-persistence-subagent.md
│   │   ├── paper-scale-layer-subagent.md
│   │   ├── playwright-canvas-subagent.md
│   │   ├── playwright-recipient-color-subagent.md
│   │   ├── plugin-icon-fallback-subagent.md
│   │   ├── prompt-catalog-subagent.md
│   │   ├── provider-drift-subagent.md
│   │   ├── public-api-surface-subagent.md
│   │   ├── right-inspector-transform-subagent.md
│   │   ├── schema-registry-extension-subagent.md
│   │   ├── schema-tone-resolution-subagent.md
│   │   ├── selecto-lifecycle-subagent.md
│   │   ├── snapshot-legacy-compat-subagent.md
│   │   ├── snapshot-roundtrip-subagent.md
│   │   ├── token-budget-subagent.md
│   │   ├── unique-palette-subagent.md
│   │   ├── visual-regression-css-subagent.md
│   │   └── vitest-contract-subagent.md
│   └── templates
│       ├── agent-report.md
│       ├── architecture-decision-record.md
│       ├── bug-ticket.md
│       ├── handoff.md
│       ├── qa-report.md
│       ├── refactor-report.md
│       └── test-failure-analysis.md
├── .claude
│   ├── commands
│   │   ├── audit-css-boundaries.md
│   │   ├── local-selective-scan.md
│   │   ├── repair-recipient-color.md
│   │   ├── repair-snapshot-roundtrip.md
│   │   ├── repair-transform-collisions.md
│   │   ├── startup.md
│   │   └── update-memory.md
│   └── README.md
├── .codex
│   ├── README.md
│   └── tasks
│       ├── atomic-fix.md
│       ├── legacy-cleanup-step.md
│       ├── quality-gates.md
│       ├── recipient-transform-implementation.md
│       └── refactor-safe.md
├── .gemini
│   ├── prompts
│   │   ├── audit-architecture.md
│   │   ├── audit-docs-vs-code.md
│   │   ├── audit-recipient-transform.md
│   │   └── audit-token-budget.md
│   └── README.md
├── .github
│   ├── copilot-instructions.md
│   ├── instructions
│   │   ├── architecture-boundaries.instructions.md
│   │   ├── canvas-transform-safety.instructions.md
│   │   ├── css-boundaries.instructions.md
│   │   ├── external-forms-runner.instructions.md
│   │   ├── recipient-color-system.instructions.md
│   │   ├── snapshot-contract.instructions.md
│   │   └── testing-quality.instructions.md
│   └── prompts
│       ├── audit-css-boundaries.prompt.md
│       ├── audit-legacy-runtime-reduction.prompt.md
│       ├── build-regression-test-matrix.prompt.md
│       ├── fix-keyboard-shortcut-collisions.prompt.md
│       ├── harden-moveable-selecto-guards.prompt.md
│       ├── implement-unique-recipient-palette.prompt.md
│       ├── inspect-failed-test-results.prompt.md
│       ├── preserve-owner-color-on-existing-schemas.prompt.md
│       ├── protect-inline-edit-from-transform.prompt.md
│       ├── recipient-transform-master-plan.prompt.md
│       ├── repair-external-forms-runner.prompt.md
│       ├── repair-floating-toolbar-position.prompt.md
│       ├── repair-recipient-color-sync.prompt.md
│       ├── repair-schema-icon-color-sync.prompt.md
│       ├── repair-snapshot-roundtrip.prompt.md
│       ├── repair-transform-collisions.prompt.md
│       ├── stabilize-designer-engine-api.prompt.md
│       ├── stabilize-schema-resize-rotation.prompt.md
│       ├── unify-css-architecture.prompt.md
│       └── update-docs-recipient-transform.prompt.md
├── AGENTS.md
├── AI-Memory
├── CLAUDE.md
├── CODEX.md
├── COPILOT.md
├── CURRENT_STATE.md
├── debug
│   ├── breakpoints-criticos.md
│   └── hardtrace-playbook.md
├── docs
│   ├── 00-indice
│   │   └── README.md
│   ├── 01-producto-y-vision
│   │   ├── 01-vision-producto.md
│   │   ├── 02-actores.md
│   │   ├── 03-objetivos.md
│   │   └── 04-no-objetivos.md
│   ├── 02-mapa-modulos
│   │   ├── 01-inventario-codigo.md
│   │   ├── 02-ui-designer-form-viewer.md
│   │   ├── 03-schemas-y-plugin-registry.md
│   │   ├── 04-generator-converter-pdflib.md
│   │   └── 05-tests-playwright-vitest.md
│   ├── 03-arquitectura
│   │   ├── 01-boundaries-host-runtime.md
│   │   ├── 02-runtime-visual.md
│   │   ├── 03-command-bus-events.md
│   │   ├── 04-snapshot-contract.md
│   │   ├── 05-external-forms-contract.md
│   │   ├── 06-collaboration-locks.md
│   │   ├── 07-public-api.md
│   │   └── 08-fork-safe-evolution.md
│   ├── 04-recipient-transform
│   │   ├── 01-recipient-color-behavior.md
│   │   ├── 02-schema-icon-color-sync.md
│   │   ├── 03-owner-color-persistence.md
│   │   ├── 04-transform-state-machine.md
│   │   ├── 05-moveable-selecto.md
│   │   ├── 06-shortcuts-and-inline-edit.md
│   │   └── 07-accessibility-colors.md
│   ├── 05-ui-ux
│   │   ├── 01-left-sidebar-catalog.md
│   │   ├── 02-right-sidebar-inspector.md
│   │   ├── 03-floating-toolbar.md
│   │   ├── 04-canvas-overlays.md
│   │   ├── 05-compact-header-host.md
│   │   └── 06-responsive.md
│   ├── 06-css
│   │   ├── 01-css-boundaries.md
│   │   ├── 02-token-system.md
│   │   ├── 03-transform-handle-safety.md
│   │   └── 04-visual-regression.md
│   ├── 07-calidad
│   │   ├── 01-comandos-validacion.md
│   │   ├── 02-matriz-regresion.md
│   │   ├── 03-testing-gaps.md
│   │   └── 04-test-results-forensics.md
│   ├── 08-ia-agentes
│   │   ├── 01-arquitectura-asistente.md
│   │   ├── 02-catalogo-agentes.md
│   │   ├── 03-catalogo-prompts.md
│   │   ├── 04-economia-tokens.md
│   │   └── 05-providers.md
│   ├── 09-operacion-debug
│   │   ├── 01-breakpoints-criticos.md
│   │   ├── 02-hardtrace-playbook.md
│   │   └── 03-troubleshooting.md
│   ├── 10-handoff
│   │   ├── 01-handoff-sesion.md
│   │   ├── 02-plan-fases.md
│   │   └── 03-tickets-sugeridos.md
│   └── 99-archivo
│       └── README.md
├── documentacion-sisad-pdfme.md
├── GEMINI.md
├── GUARDRAILS.md
├── handoff
│   ├── plan-ejecucion-fases.md
│   ├── README.md
│   ├── riesgos-residuales.md
│   ├── session-handoff.md
│   └── tickets-sugeridos.md
├── INSTALL_MAC.md
├── MANIFEST.md
├── metadata
├── MIGRATION_GUIDE.md
├── PACKAGE_SUMMARY.md
├── package-scripts-sugeridos.md
├── public
│   └── templates
├── README.md
├── reports
│   └── current-snapshot
│       ├── analysis-summary.md
│       ├── css-summary.md
│       ├── docs-summary.md
│       ├── module-inventory.md
│       └── risk-summary.md
├── scripts
│   └── ai
├── src
│   ├── features
│   │   └── pdfcomponent
│   │       ├── domain
│   │       ├── examples
│   │       └── utils
│   ├── sisad-pdfme
│   │   ├── assignments
│   │   ├── canvas
│   │   ├── collaboration
│   │   ├── commands
│   │   ├── comments
│   │   ├── common
│   │   ├── context
│   │   ├── contracts
│   │   ├── converter
│   │   ├── documents
│   │   ├── editor
│   │   ├── externalForms
│   │   ├── generator
│   │   ├── pdf-lib
│   │   │   ├── api
│   │   │   │   ├── form
│   │   │   │   ├── image
│   │   │   │   └── text
│   │   │   ├── core
│   │   │   │   ├── acroform
│   │   │   │   ├── annotation
│   │   │   │   ├── document
│   │   │   │   ├── embedders
│   │   │   │   ├── interactive
│   │   │   │   ├── objects
│   │   │   │   ├── operators
│   │   │   │   ├── parser
│   │   │   │   ├── streams
│   │   │   │   ├── structures
│   │   │   │   ├── syntax
│   │   │   │   └── writers
│   │   │   ├── types
│   │   │   └── utils
│   │   │       └── elements
│   │   ├── schemas
│   │   │   ├── barcodes
│   │   │   ├── checkbox
│   │   │   ├── date
│   │   │   ├── graphics
│   │   │   ├── multiVariableText
│   │   │   ├── radioGroup
│   │   │   ├── select
│   │   │   ├── shapes
│   │   │   ├── signature
│   │   │   ├── tables
│   │   │   └── text
│   │   │       └── icons
│   │   ├── shared
│   │   └── ui
│   │       ├── commands
│   │       ├── components
│   │       │   ├── Designer
│   │       │   │   ├── Canvas
│   │       │   │   │   └── overlays
│   │       │   │   ├── Comments
│   │       │   │   ├── RightSidebar
│   │       │   │   │   ├── DetailView
│   │       │   │   │   ├── ListView
│   │       │   │   │   └── shared
│   │       │   │   ├── shared
│   │       │   │   └── Shortcuts
│   │       │   └── shared
│   │       ├── designerEngine.api.md
│   │       ├── styles
│   │       └── types
│   └── types
├── test-results
│   └── pdfme-editor-pdfme-editor--485d3--position-and-supports-undo-chromium
│       └── error-context.md
└── tests
    ├── matriz-pruebas-regresion-designer.md
    ├── matriz-pruebas-regresion-externalforms.md
    ├── plan-playwright.md
    ├── plan-vitest-unitario.md
    ├── playwright
    ├── README.md
    ├── testing-gaps.md
    └── unit
```
