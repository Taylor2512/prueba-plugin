# LeftSidebar

El LeftSidebar muestra el catálogo de schemas disponibles.

## Debe permitir

- buscar fields;
- filtrar por familia;
- arrastrar al canvas;
- mostrar favoritos/recientes;
- respetar modo compacto.

## Colapso

- El handle (`data-testid="sidebar-collapse-left"`) va montado sobre el borde
  derecho del panel, a altura y tamaño constantes en ambos estados.
- Vive fuera del wrapper con `overflow-hidden`: el recorte del contenido nunca
  debe poder ocultarlo.
- `Ctrl/Cmd+B` alterna el panel salvo si el foco está en un campo o en contenido
  editable.
- La preferencia se recuerda en `sisad-pdfme:left-sidebar-expanded`, y solo se
  escribe en modo `docked` para que el colapso automático de `overlay` no la pise.
- Colapsado, los iconos del rail reabren el panel en su pestaña.

## No debe contener

- lógica de negocio del host;
- renderers duplicados;
- configuración avanzada que pertenece al inspector.
