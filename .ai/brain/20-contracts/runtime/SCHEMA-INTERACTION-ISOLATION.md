# Schema interaction isolation

Una interacción sobre schema B no puede revertir estado aceptado de schema A.

Claves:
- local-first;
- patch multi-key atómico;
- schemaUid estable;
- `origin + revision + transactionId` para reconcile;
- no reconstruir estado desde DOM;
- no usar truthiness para empty/equality;
- plugins no escriben storage de siblings directamente;
- dos Forms simultáneos no comparten mutable singleton state.

Gate obligatorio: pairwise interaction matrix además del test individual de cada schema.
