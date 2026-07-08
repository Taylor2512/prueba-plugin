# CONTEXT_BUDGET

## Presupuesto estándar

```txt
1 task-card
1 contexto
1 regla principal
1 playbook
2-3 comandos rg
8 archivos abiertos
5 archivos modificados
1 proceso por pasada
```

## Presupuesto extendido

Solo para auditorías explícitas pedidas por el usuario:

```txt
1 auditoría
máximo 20 archivos inspeccionados
máximo 0-3 archivos modificados
reporte obligatorio
sin cambios de lógica
```

## Criterio de parada

Detenerse si:

- se requiere tocar otro dominio;
- se exceden 5 archivos modificados;
- se necesita `Moveable`, `Selecto`, snapshot o generator sin task-card;
- no hay evidencia suficiente;
- un archivo buscado no existe.

## Anti-token

No cargar:

- todo `codigo-sisad-pdfme.txt`;
- todos los markdown;
- todos los CSS completos si solo se toca un selector;
- reportes históricos salvo evidencia necesaria.
