# ADR RTP-002 — Local-first Form

Una interacción del usuario actualiza primero el runtime local mediante transacción atómica y luego notifica al host. El host puede reconciliar por origin/revision, pero no es autoridad sincrónica del draft de teclado.
