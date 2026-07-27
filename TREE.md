# Árbol

```text
sisad-pdfme-ai-architecture-v6
├── .agents
│   └── skills
│       ├── sisad-accessibility
│       │   └── SKILL.md
│       ├── sisad-canvas-interaction
│       │   └── SKILL.md
│       ├── sisad-collaboration-assignments
│       │   └── SKILL.md
│       ├── sisad-configuration-service
│       │   └── SKILL.md
│       ├── sisad-context-budget
│       │   └── SKILL.md
│       ├── sisad-dry-refactor
│       │   └── SKILL.md
│       ├── sisad-evidence-grounding
│       │   └── SKILL.md
│       ├── sisad-frontend-component-architecture
│       │   └── SKILL.md
│       ├── sisad-incident-recovery
│       │   └── SKILL.md
│       ├── sisad-inspector-contract
│       │   └── SKILL.md
│       ├── sisad-memory-delta
│       │   └── SKILL.md
│       ├── sisad-multi-document-routing
│       │   └── SKILL.md
│       ├── sisad-prompt-evaluation
│       │   └── SKILL.md
│       ├── sisad-public-api-compatibility
│       │   └── SKILL.md
│       ├── sisad-react-performance
│       │   └── SKILL.md
│       ├── sisad-responsive-ux
│       │   └── SKILL.md
│       ├── sisad-schema-plugin
│       │   └── SKILL.md
│       ├── sisad-security-privacy
│       │   └── SKILL.md
│       ├── sisad-snapshot-compatibility
│       │   └── SKILL.md
│       ├── sisad-tailwind-design-system
│       │   └── SKILL.md
│       ├── sisad-task-orchestration
│       │   └── SKILL.md
│       ├── sisad-testing-pyramid
│       │   └── SKILL.md
│       └── sisad-visual-regression
│           └── SKILL.md
├── .ai
│   ├── agents
│   │   ├── ACCESSIBILITY.md
│   │   ├── ARCHITECT.md
│   │   ├── CANVAS-SPECIALIST.md
│   │   ├── CONFIG-SPECIALIST.md
│   │   ├── COORDINATOR.md
│   │   ├── EXPLORER.md
│   │   ├── IMPLEMENTER.md
│   │   ├── INCIDENT-RESPONDER.md
│   │   ├── MEMORY-STEWARD.md
│   │   ├── PERFORMANCE.md
│   │   ├── QA.md
│   │   ├── REVIEWER.md
│   │   ├── RUNTIME-ARCHITECT.md
│   │   ├── SCHEMA-SPECIALIST.md
│   │   └── UX-DESIGNER.md
│   ├── architecture
│   │   ├── AGENT-LIFECYCLE.md
│   │   ├── ASSISTANT-SYSTEM.md
│   │   ├── CONFIGURATION-ARCHITECTURE.md
│   │   ├── DESIGN-SYSTEM.md
│   │   ├── FRONTEND-COMPONENT-ARCHITECTURE.md
│   │   ├── LAYER-CONTRACTS.md
│   │   ├── PATTERN-DECISION-MATRIX.md
│   │   └── PUBLIC-API-COMPATIBILITY.md
│   ├── governance
│   │   ├── ANTI-HALLUCINATION.md
│   │   ├── ANTI-LOOP.md
│   │   ├── ANTI-OVERFLOW.md
│   │   ├── EVIDENCE-POLICY.md
│   │   ├── HUMAN-IN-THE-LOOP.md
│   │   ├── MEMORY-POLICY.md
│   │   ├── PARALLELISM-POLICY.md
│   │   ├── PROMPT-POLICY.md
│   │   ├── QUALITY-POLICY.md
│   │   ├── REVIEW-POLICY.md
│   │   └── TOOL-POLICY.md
│   ├── memory
│   │   ├── CURRENT.md
│   │   ├── DECISIONS.md
│   │   ├── HANDOFF.md
│   │   ├── MEMORY-DELTA.template.md
│   │   ├── MEMORY-GC.md
│   │   ├── METRICS.md
│   │   ├── PROJECT.md
│   │   ├── README.md
│   │   └── RISKS.md
│   ├── plans
│   │   ├── AI-ARCHITECTURE-MIGRATION.md
│   │   ├── CONFIGURATION-CONTINUITY.md
│   │   ├── MASTER-PLAN-V6.md
│   │   └── UX-CONTINUITY.md
│   ├── playbooks
│   │   ├── ACCESSIBILITY-REVIEW.md
│   │   ├── BUILD-SCHEMA-PLUGIN.md
│   │   ├── CONFIGURE-COMPONENT.md
│   │   ├── DEBUG-REGRESSION.md
│   │   ├── EXECUTE-TASK.md
│   │   ├── INCIDENT.md
│   │   ├── MIGRATE-TAILWIND.md
│   │   ├── REFACTOR-DRY.md
│   │   ├── RELEASE.md
│   │   ├── UX-REVIEW.md
│   │   └── VISUAL-REGRESSION.md
│   ├── prompts
│   │   ├── ANALYZE.prompt.md
│   │   ├── HANDOFF.prompt.md
│   │   ├── IMPLEMENT.prompt.md
│   │   ├── INCIDENT.prompt.md
│   │   ├── MASTER.prompt.md
│   │   ├── MEMORY.prompt.md
│   │   ├── PLAN.prompt.md
│   │   ├── QA.prompt.md
│   │   ├── REVIEW.prompt.md
│   │   └── UX-AUDIT.prompt.md
│   ├── research
│   │   ├── ANTI-HALLUCINATION-FINDINGS.md
│   │   ├── ARCHITECTURE-AUDIT-V5.md
│   │   ├── OFFICIAL-SOURCES.md
│   │   └── TOKEN-EFFICIENCY.md
│   ├── routes
│   │   ├── accessibility.md
│   │   ├── canvas.md
│   │   ├── configuration.md
│   │   ├── css-tailwind.md
│   │   ├── docs-memory.md
│   │   ├── inspector.md
│   │   ├── left-sidebar.md
│   │   ├── performance.md
│   │   ├── quality.md
│   │   ├── right-sidebar.md
│   │   ├── runtime.md
│   │   ├── schemas.md
│   │   ├── snapshot.md
│   │   ├── testing.md
│   │   └── ux-design.md
│   ├── scrum
│   │   ├── BOARD.md
│   │   ├── DEFINITION-OF-DONE.md
│   │   ├── DEFINITION-OF-READY.md
│   │   ├── PRODUCT-GOAL.md
│   │   └── RETROSPECTIVE.md
│   ├── tasks
│   │   ├── ACTIVE.md
│   │   ├── AI-001-anti-hallucination-gate.md
│   │   ├── AI-002-context-overflow-checkpoints.md
│   │   ├── CONFIG-001-unified-config-service.md
│   │   ├── README.md
│   │   └── TEMPLATE.md
│   ├── templates
│   │   ├── ADR.md
│   │   ├── CLAIM-LEDGER.md
│   │   ├── CONTEXT-CHECKPOINT.md
│   │   ├── DESIGN-AUDIT.md
│   │   ├── EVAL-CASE.md
│   │   ├── EVIDENCE.md
│   │   ├── HANDOFF.md
│   │   ├── INCIDENT.md
│   │   ├── PLAN.md
│   │   └── REVIEW.md
│   ├── CONTEXT-BUDGET.md
│   ├── CONTEXT-POLICY.md
│   ├── EVALS.md
│   ├── INDEX.md
│   ├── MODEL-ROUTER.md
│   ├── OBSERVABILITY.md
│   ├── ORCHESTRATION.md
│   ├── OWNER-MAP.md
│   ├── ROUTER.md
│   ├── SCOPE.md
│   ├── SECURITY.md
│   └── START.md
├── .claude
│   ├── agents
│   │   ├── sisad-explorer.md
│   │   └── sisad-reviewer.md
│   └── README.md
├── .codex
│   └── README.md
├── .github
│   ├── agents
│   │   ├── sisad-architect.agent.md
│   │   ├── sisad-config.agent.md
│   │   ├── sisad-implementer.agent.md
│   │   ├── sisad-qa.agent.md
│   │   ├── sisad-reviewer.agent.md
│   │   └── sisad-ux.agent.md
│   └── copilot-instructions.md
├── .serena
│   └── memories
│       └── memory_maintenance.md
├── src
│   └── sisad-pdfme
│       ├── config
│       │   └── AGENTS.md
│       ├── schemas
│       │   └── AGENTS.md
│       ├── shared
│       │   └── AGENTS.md
│       ├── ui
│       │   └── components
│       │       └── Designer
│       │           ├── Canvas
│       │           │   └── AGENTS.md
│       │           └── RightSidebar
│       │               └── AGENTS.md
│       └── AGENTS.md
├── AGENTS.md
├── CLAUDE.md
├── INSTALLATION.md
├── MANIFEST.md
├── MIGRATION_V5_TO_V6.md
└── README_ENTREGA.md
```
