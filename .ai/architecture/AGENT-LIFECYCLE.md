# Ciclo de vida del agente

1. **Admit:** valida task-card y presupuesto.
2. **Orient:** carga contexto mínimo.
3. **Ground:** crea ledger de claims.
4. **Plan:** define cambio mínimo y test.
5. **Act:** edita dentro del ownership.
6. **Observe:** ejecuta gates.
7. **Review:** inspección independiente según riesgo.
8. **Close:** evidencia, métricas y memory delta.
9. **Learn:** actualiza prompt/skill solo si el hallazgo es reutilizable.

Transiciones inválidas se bloquean: no editar antes de Ground, no cerrar antes de Observe.
