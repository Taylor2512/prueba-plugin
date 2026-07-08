# Tailwind Bridge

El bridge permite migrar estilos sin romper classNames existentes.

Reglas:

- no activar preflight;
- no tocar geometría/paper/zoom;
- no tocar `.moveable-*` ni `.selecto-*` desde host;
- no duplicar reglas entre CSS legacy y Tailwind.
