# Schemas, registry y guía de extensión

## 1. Rol del sistema de schemas

El sistema de schemas define qué tipos de field existen y cómo participan en:

- render UI;
- render PDF;
- prop panel;
- serialización;
- validación.

## 2. Valor del registry

`schemaRegistry` es la puerta para escalar el editor sin tocar todos los paneles manualmente. Si está bien modelado, nuevos fields pueden integrarse con menos fricción.

## 3. Familias actuales de schema

Se observan familias como:
- text
- barcodes
- checkbox
- date
- graphics
- multiVariableText
- radioGroup
- select
- shapes
- tables

Eso ya es un ecosistema amplio.

## 4. Patrón actual saludable

Cada family suele dividirse en:
- `types`
- `helper`
- `pdfRender`
- `uiRender`
- `propPanel`

Ese patrón es muy valioso porque separa responsabilidades.

## 5. Guía para crear un schema nuevo

### Paso 1
Definir tipo y contrato.

### Paso 2
Definir helper y defaults.

### Paso 3
Implementar `uiRender`.

### Paso 4
Implementar `pdfRender`.

### Paso 5
Definir integración con prop panel.

### Paso 6
Registrar en registry y catálogo.

## 6. Recomendación para fields enterprise

Crear una categoría de schemas de negocio:
- firma avanzada;
- identidad;
- lookup remoto;
- bloques repetibles;
- secciones colaborativas.

## 7. Riesgo actual

Si el registry crece sin convención, la plataforma se desordena rápido.

## 8. Recomendaciones de gobernanza

- naming consistente;
- contrato mínimo obligatorio;
- docs por schema family;
- ejemplos de uso;
- pruebas por render UI y PDF.

## 9. `propPanel` y widgets

El `propPanel` de cada schema debe integrarse con el inspector declarativo, no generar UI suelta por fuera.

## 10. Conclusión

El sistema de schemas es tu SDK interno. Debe ser tratado como producto para extensores, no solo como carpeta de renderizadores.
