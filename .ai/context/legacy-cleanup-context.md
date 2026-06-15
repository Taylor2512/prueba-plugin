# Legacy Cleanup Context

Buscar duplicidad en `sidebarOpen`, `zoom`, `pageIndex`, `selectedSchema`, `floatingToolbar`, `innerHTML`, `Object.assign(...style)`, `as any`, `Record<string, any>`.

Clasificar:

A. Pertenece a `sisad-pdfme`: eliminar del host.
B. Pertenece a negocio: mantener.
C. Adaptador: mover a infra.
D. Legacy sin uso: eliminar.
