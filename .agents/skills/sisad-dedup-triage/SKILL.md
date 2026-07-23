---
name: sisad-dedup-triage
description: Classify jscpd or manual duplication findings into owned, vendor, generated, acceptable, or false-positive and produce an ordered refactor backlog. Use before any broad DRY refactor.
---

# Triage duplication

Run the report parser. Group clones by shared responsibility, not file proximity. For each group record risk, frequency of change, likely canonical owner, candidate pattern and characterization tests. Never reduce the metric by excluding owned code without written justification. Vendor and generated outputs receive separate reports.

Use `.ai/DUPLICATION-POLICY.md` and `.ai/patterns/DUPLICATION-TAXONOMY.md`.
