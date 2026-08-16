status: PASS

# Fugas de implementación en el inspector — corregidas

Origen: análisis de 52 capturas del Designer. Cada afirmación se verificó
contra el source vivo antes de actuar; las cuatro eran ciertas.

## 1. «Heredar Axios del sistema» en la UI de producto

`SchemaConnectionsWidget.tsx` exponía Axios como concepto de producto en cuatro
puntos: el switch principal, dos etiquetas de estado (`Axios sistema` /
`Axios local`) y el texto descriptivo.

Contradice directamente `HTTP-CLIENT-CONTRACT`, que declara Axios como
**integración opcional** y `HttpClientAdapter` como la autoridad. El host puede
usar fetch, Ky, un SDK o cualquier transporte futuro.

Corregido a lenguaje de transporte:

```text
Heredar Axios del sistema        → Heredar el cliente HTTP del host
Axios sistema / Axios local      → Cliente del host / Cliente local
Usa la configuración global      → Usa el cliente HTTP que inyecta la
de Axios                           aplicación anfitriona
```

La clave de configuración `inheritSystem` no cambia: es correcta y neutral.

## 2. Fuga de i18n en `multiVariableText`

`propPanel.ts` incotrolaba dos títulos en inglés dentro de una interfaz
española: `'Variables Sample Data'` y `'Placeholder Dynamic Variable'`.

El panel **ya recibía `i18n`** —lo usaba en otro punto del mismo archivo— y la
traducción española ya existía. Simplemente no se invocaba.

- `variablesSampleData` pasa a resolverse por `i18n`; su valor español se
  corrigió de `'Variables Datos de muestra'` a `'Datos de muestra de variables'`.
- `placeholderDynamicVar` no existía como clave: se añadió a los **11
  diccionarios** y al esquema `Dict`.

### Regresión introducida y cerrada en la misma pasada

Al añadir la clave a los diccionarios sin declararla antes en el esquema Zod
`Dict` (`common/schema.ts`), `tsc` pasó de **148 a 159 errores** — uno por
idioma. `Dict` es `z.infer` de un objeto con unión de claves fija, así que la
autoridad es el esquema, no los diccionarios.

Declarada la clave en `common/schema.ts`, el recuento vuelve a **148**.

Medido con `--incremental false` para descartar `tsconfig.tsbuildinfo` obsoleto
como causa antes de diagnosticar.

## 3. Duplicación de jerarquía (D5)

La sección «Datos y conexiones» contenía un `CompactConfigPanel` titulado
«Datos y conexión»: dos cabeceras seguidas diciendo lo mismo y consumiendo
vertical.

`CompactConfigPanel` gana `embedded?: boolean`, que suprime título y
descripción **visuales** conservando `title` como propiedad obligatoria —
sigue alimentando el modal de edición detallada y la etiqueta accesible.

`SchemaConnectionsWidget` lo declara `embedded`.

## Verificación

- `tsc`: **148 = baseline**, 0 errores en archivos modificados.
- Contratos unit: **47 archivos / 1127 tests PASS**.
- E2E: **46 PASS, 2 skipped, 0 fallos**.

## Pendiente del mismo análisis

Confirmado como cierto pero no abordado aquí:

- `recipient.name/email/company/title` sigue siendo la fuente de prefill en
  `ui/recipientPrefill.ts` → RTP-525;
- el inspector sigue siendo genérico en vez de derivarse de `dataBinding` y
  capabilities → F3;
- el modelo de firma no separa método de adquisición de estilo adoptado;
- UID técnico, `single`, `user-1` y `file-01` visibles en UI normal.
