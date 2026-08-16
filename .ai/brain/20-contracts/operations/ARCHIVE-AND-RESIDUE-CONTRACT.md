# Archive and residue contract

Before deletion classify:

- transient — recreable scratch data;
- generated — regenerable projection/index;
- historical — Git history is the record; do not copy into the active tree;
- provider-adapter — current host boundary only, never a historical compatibility surface;
- canonical — source of truth;
- unknown — do not touch automatically.

Rules:

- `.trace-tmp` may be removed only when the external reference scan is empty and a backup exists.
- Replaced campaign generations are deleted after unique current knowledge is migrated;
  Git retains their history.
- empty files are not automatically trash.
- duplicate provider skills are not automatically trash.
