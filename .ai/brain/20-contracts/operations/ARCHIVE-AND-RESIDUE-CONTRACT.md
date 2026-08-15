# Archive and residue contract

Before deletion classify:

- transient — recreable scratch data;
- generated — regenerable projection/index;
- historical — keep in archive;
- provider-adapter — compatibility surface;
- canonical — source of truth;
- unknown — do not touch automatically.

Rules:

- `.trace-tmp` may be removed only when the external reference scan is empty and a backup exists.
- SPRT/V2/AI8 history is archived, not deleted.
- empty files are not automatically trash.
- duplicate provider skills are not automatically trash.
