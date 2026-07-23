# Política integral de duplicidad

## No toda coincidencia es deuda

Clasifica cada hallazgo:

1. `owned-actionable`: lógica propia con riesgo de divergencia.
2. `owned-acceptable`: repetición pequeña que mejora legibilidad o independencia.
3. `vendor`: código vendorizado/upstream.
4. `generated`: salida consolidada o generada.
5. `test-fixture`: repetición explícita para claridad de escenarios.
6. `false-positive`: tokens similares sin responsabilidad común.

## Preguntas antes de extraer

- ¿Cambiarían ambos bloques por la misma razón?
- ¿Comparten invariantes y modelo de errores?
- ¿Existe un nombre de dominio claro para la abstracción?
- ¿La extracción reduce puntos de cambio?
- ¿Añade branching o parámetros booleanos que recrean los originales?
- ¿Puede caracterizarse el comportamiento antes de moverlo?

## Patrones por duplicidad

| Síntoma | Herramienta preferida |
|---|---|
| DOM/chrome repetido | composición o primitive |
| hook con mismos efectos | custom hook con contrato real |
| variantes por tipo | Strategy |
| creación de plugins | Factory + Registry |
| DTO/API repetido | Adapter |
| secuencia de servicios | Facade/use case |
| booleanos incompatibles | Reducer/State Machine |
| acciones/atajos | Command Registry |
| permisos/visibilidad | Policy/Resolver |
| normalización pequeña | función pura |
| estilos equivalentes | token/variant/CVA/Tailwind component |

## Señales de mala abstracción

- helper con más parámetros que los bloques originales;
- `isFoo`, `isBar`, `mode` y switches internos crecientes;
- wrapper de una sola línea sin política;
- archivo `utils` sin dominio;
- hook que no usa estado, efectos ni composición React;
- factory con un único producto estable;
- base class para componentes funcionales sin necesidad.

## Excluir no es corregir

Las exclusiones se reservan para vendor, generado o límites técnicos documentados. Un clon propio se resuelve, se acepta con razón o se convierte en task-card.
