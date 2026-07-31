# Subagent decision matrix

| Situation | Delegate? | Agent |
|---|---:|---|
| grep/read across many files | yes | explorer |
| test log >100 lines | yes | log-distiller |
| independent review | yes | reviewer |
| same file as writer | no | — |
| trivial edit | no | — |
| architecture decision sharing same context | usually no | architect in main |
| provider docs verification | yes | provider auditor |
| trace update after diff | yes/read-only | traceability |

Estimate context saved before delegation.
