# Baseline de deduplicación

## Reporte oficial recibido

| Formato | Clones | Líneas duplicadas |
|---|---:|---:|
| TypeScript | 112 | 2.455 |
| TSX | 12 | 153 |
| Markdown | 26 | 441 |
| Total | 150 | 3.049 |

## Medición comparable de código propio

| Métrica | Antes | Después | Reducción |
|---|---:|---:|---:|
| Bloques repetidos | 71 | 2 | 97,18 % |
| Líneas significativas | 1.134 | 20 | 98,24 % |

La refactorización previa modificó o creó 55 archivos, añadió 10 módulos compartidos y redujo 772 líneas netas. Las coincidencias restantes no eran lógica de negocio: imports y un `theme.ts` redactado.

## Interpretación

El nuevo sistema no debe perseguir únicamente el 0 % textual. Debe evitar que vuelvan a aparecer fuentes paralelas de estado, contratos, UI, documentación y procesos.

## Exclusiones legítimas

- dependencias y fork `pdf-lib`;
- build, coverage y reportes;
- backups históricos;
- Markdown en el gate de código, pero con un gate documental separado.

Nunca excluir código propio solo para mejorar la métrica.
