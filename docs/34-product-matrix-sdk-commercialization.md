# Matriz de producto, SDK y comercialización

## 1. Qué estás construyendo realmente

No es solo un editor PDF. La plataforma actual combina:

- diseño visual de templates
- runtime de formularios
- viewer
- persistencia local
- API remota por field
- form-json
- colaboración
- conversión y generación
- sistema de plugins/schemas
- integración con un motor PDF interno

Eso permite venderlo como:

### A. SDK embebible
Para integrarlo dentro de apps empresariales.

### B. White-label editor
Para clientes que necesitan un builder visual.

### C. Suite modular
Con planes o módulos extra.

## 2. Línea base de producto

### Core package
- editor
- viewer
- form view
- text/select/date/checkbox/tables
- generate
- converter básico

### Pro package
- form-json avanzado
- schema persistence
- API/HTTP por field
- mappings
- collaboration básica

### Enterprise package
- comentarios
- awareness multiusuario
- bloqueo
- auditoría
- firma electrónica
- integraciones SSO/headers

## 3. Matriz técnica

| Área | Estado actual | Potencial comercial |
|---|---|---|
| Editor canvas | alto | muy alto |
| Detail inspector | alto | alto |
| Form JSON | medio-alto | muy alto |
| API por field | alto | muy alto |
| Collaboration | medio | muy alto |
| Converter/generator | alto | alto |
| SDK de schemas | medio | muy alto |

## 4. Qué necesita un SDK vendible

- surface API estable
- branding propio
- empaquetado por módulos
- documentación versionada
- changelog
- ejemplos de integración
- licencia clara
- testing reproducible

## 5. Paquetes recomendados

```text
@platform/pdf/editor
@platform/pdf/generator
@platform/pdf/converter
@platform/pdf/schemas
@platform/pdf/contracts
@platform/pdf/collaboration
```

## 6. Ejemplos de bundles vendibles

### Starter
- editor básico
- schemas core
- viewer
- generate

### Business
- starter +
- persistence
- API
- form-json
- branding básico

### Enterprise
- business +
- collaboration
- comments
- locks
- observability
- auth enterprise

## 7. Checklist previo a monetización

- remover nombres heredados
- congelar exports públicos
- consolidar contratos
- generar docs por subsistema
- cerrar edge cases de runtime
- asegurar tests críticos
- medir rendimiento con templates grandes

## 8. Recomendación de posicionamiento

No venderlo como “fork de pdfme”.
Venderlo como:
- plataforma de edición PDF y formularios
- SDK embebible de diseño y captura documental
- motor de workflows documentales con extensibilidad por campos

## 9. Ejemplo de pitch técnico

“Platform PDF provee un editor visual embebible, runtime de formularios, generación PDF, sincronización de datos por campo, persistencia, integraciones HTTP y extensibilidad mediante plugins de schema, listo para productos enterprise y white-label.”
