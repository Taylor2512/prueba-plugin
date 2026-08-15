# Form completion contract

`touched`, `dirty`, `valid`, `committed` y `completed` son estados diferentes.

Completion se deriva de schema capabilities + required/access + codec/validation. El host
puede exigir un criterio de negocio superior, pero no debe inferirlo con truthiness.

Valores válidos como `0`, `false` y `[]` se evalúan con codec. Campos readonly/hidden que
no corresponden al User activo no bloquean completion salvo policy explícita.
