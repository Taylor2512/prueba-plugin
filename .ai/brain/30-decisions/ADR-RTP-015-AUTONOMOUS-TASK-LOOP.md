# ADR RTP-015 — Autonomous task loop

Decision: la campaña puede ejecutarse de forma continua por un coordinator.

La unidad de trabajo sigue siendo una task pequeña con evidence, pero la sesión no se detiene
automáticamente después de cada task. El coordinator carga la siguiente y continúa.
