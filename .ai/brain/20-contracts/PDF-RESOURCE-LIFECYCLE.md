# PDF resource lifecycle

PDF.js document/page/render tasks y object URLs deben tener lifecycle explícito. Nunca llamar cleanup durante render activo. Cancelar/esperar renders al desmontar. Revocar object URLs cuando dejan de ser necesarios.
