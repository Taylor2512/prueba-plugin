# SISAD PDFME — Arquitectura Markdown Reset v1

Generado: `2026-06-15T14:26:34Z`

Paquete para reiniciar la documentación Markdown del proyecto con una arquitectura más pequeña, trazable y optimizada para IA.

## Objetivos

- Reducir cientos de `.md` a una base gobernable.
- Separar memoria, contexto, reglas, prompts y docs.
- Cargar contexto por intención, no por volumen.
- Evitar prompts repetidos por proveedor.
- Mantener contratos de comportamiento por proceso.
- Incluir scripts seguros para eliminar `.md` existentes antes de instalar el nuevo esquema.

## Instalación recomendada

```bash
# 1. Ver lo que se eliminaría
node scripts/delete-existing-markdown.mjs /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin --dry-run

# 2. Respaldar y eliminar .md existentes
node scripts/delete-existing-markdown.mjs /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin --confirm --backup

# 3. Copiar esta arquitectura a la raíz del proyecto
rsync -av sisad-pdfme-md-architecture-reset-v1/ /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/
```

## Principio rector

```txt
No se corrige por síntoma. Se corrige por proceso:
Proceso -> Componentes -> Fuente de verdad -> Estados -> Datos preservados -> Validaciones -> Implementación
```

## Carga de contexto recomendada

```txt
1 memoria + 1 contexto principal + máximo 2 reglas + 1 prompt + rg sobre código real
```
