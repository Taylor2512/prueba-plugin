# ADR RTP-004 — PDF lifecycle

Carga/render/cleanup/cancelación de PDF.js y object URL lifecycle tienen owner explícito. Unmount React no equivale automáticamente a cleanup seguro de PDF.js si existe render activo.
