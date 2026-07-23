# Rollback

La arquitectura no modifica código de aplicación al instalarse. Para revertir, elimina las rutas añadidas y restaura AGENTS/CLAUDE/Copilot anteriores desde Git. Los hooks permanecen desactivados mientras tengan extensión `.example`; no los habilites sin una prueba local.
