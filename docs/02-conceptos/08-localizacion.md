# Localización (i18n)

Toda la interfaz reutilizable de SISAD-PDFME resuelve sus textos desde una sola
autoridad de i18n. No hay diccionarios locales en componentes ni condicionales
por idioma repartidos por la UI.

## Idioma por defecto

El idioma por defecto es **español (`es`)** y está declarado en un único sitio:

```ts
// src/sisad-pdfme/ui/constants.ts
export const DEFAULT_LANG: Lang = 'es';
```

Ninguna otra capa declara su propio default. Si necesitas resolver un idioma que
puede no ser válido, usa el resolutor canónico:

```ts
import { resolveLang } from '@sisad-pdfme/ui/i18n';

resolveLang('en');    // 'en'
resolveLang('pt-BR'); // 'es'  → cae en DEFAULT_LANG
resolveLang(undefined); // 'es'
```

## Precedencia

```
options.labels            (override textual por key)
    >
idioma explícito del host (options.lang / app.locale)
    >
DEFAULT_LANG (es)         (también como fallback ante idioma no resoluble)
```

El merge lo aplica `AppContextProvider`: toma el diccionario COMPLETO del idioma
activo y encima aplica `options.labels`. Nunca se completan keys faltantes con
otro idioma, porque eso produciría interfaces bilingües.

### Ejemplos mínimos

Español por defecto — no hace falta configurar nada:

```ts
new Designer({ domContainer, template });
```

Inglés explícito:

```ts
new Designer({ domContainer, template, options: { lang: 'en' } });
```

Override de una etiqueta concreta sobre el diccionario inglés:

```ts
new Designer({
  domContainer,
  template,
  options: {
    lang: 'en',
    labels: { cancel: 'Persist' }, // sólo esta key cambia; el resto sigue en inglés
  },
});
```

Configuración declarativa (`SisadPdfmeGlobalConfig`):

```ts
{ app: { locale: 'en' } }
```

`app.locale` es un `string` libre, así que la capa declarativa lo valida con
`resolveLang` antes de convertirlo en `options.lang`. La API imperativa es más
estricta: `checkUIProps` rechaza un `options.lang` no soportado en el borde, para
que el host se entere del locale inválido en vez de ver media interfaz sin
traducir.

`lang` es el nombre canónico del contrato. No existen `locale`, `language` ni
`defaultLanguage` como conceptos alternativos en la API del runtime.

## Cambio de idioma en runtime

```ts
instance.updateOptions({ lang: 'en' });
```

Sólo cambia el idioma activo: se repropaga el diccionario por los context
providers y React vuelve a pintar las etiquetas. **No** se reinicializa el
engine, y se conservan template, schemas, valores, selección, usuario activo y
assignments.

## Identidad vs. presentación

`schema.type` y los IDs técnicos son contratos estables: aparecen en templates,
snapshots, plugins y API pública. **Nunca se traducen ni se renombran.** Sólo se
traduce su etiqueta visible.

```
type:        'fullName'          ← identidad, estable
label es:    'Nombre completo'   ← presentación
label en:    'Full name'         ← presentación
```

Esto aplica igual a `fullName`, `emailAddress`, `company`, `title`,
`multiVariableText`, `dateTime`, `dateSigned`, `initials`, etc. Migrar
`fullName` a `nombreCompleto` rompería templates, snapshots e integraciones.

El resolutor de presentación del Designer es único:

```ts
import { getSchemaTypeLabel } from '@sisad-pdfme/ui/components/Designer/shared/designerLabels';

getSchemaTypeLabel(translate, 'fullName'); // 'Nombre completo' | 'Full name' | …
```

Las etiquetas viven en `Dict` bajo `schemaTypes.<type>` y `schemaCategories.<key>`.
La *category key* también es identidad: ordena y agrupa el catálogo; sólo su
etiqueta se localiza.

Los nombres de estándares de código de barras (`QR Code`, `EAN-13`,
`GS1 DataMatrix`, …) son nombres propios y son idénticos en todos los idiomas,
aunque siguen siendo etiquetas de presentación distintas del identificador.

### Plugins del host

Un plugin externo no necesita registrar todos los idiomas:

- si su `type` tiene key en `Dict`, gana el diccionario;
- si no, se conserva la etiqueta que aportó el plugin;
- como último recurso se muestra un title-case de su identificador, nunca
  `undefined` ni vacío;
- su `type` no se altera en ningún caso.

## Idioma de la UI vs. locale del dato

Son ejes distintos:

- **idioma de la UI**: `options.lang`, controla la presentación;
- **locale del dato**: p. ej. `schema.locale` en `date`/`dateTime`/`dateSigned`/`time`,
  controla cómo se representa el valor.

Un `schema.locale` explícito manda sobre el idioma activo. Cambiar el idioma de
la interfaz no reescribe el `locale` de schemas existentes. Al **crear** un
schema sí puede usarse el idioma activo como default.

## Contenido inicial localizado vs. contenido persistido

Un plugin no puede escribir su contenido inicial ya traducido: `defaultSchema`
se evalúa al importar el módulo, cuando todavía no hay idioma activo. Por eso el
contenido inicial se declara con una translation key y se materializa **una sola
vez, al crear el schema**:

```ts
defaultSchema: {
  type: 'multiVariableText',
  text: '',
  __i18nDefaults: { text: 'schemas.mvt.defaultContent' },
}
```

```
SCHEMA NUEVO
    ↓
resolver idioma activo
    ↓
materializar contenido inicial localizado (una vez)
    ↓
persistir  → desde aquí es DATO DEL DOCUMENTO
```

A partir de ese momento el texto es dato del documento:

- cambiar el idioma de la UI **no** lo reescribe;
- un template histórico que contenga `Add text here using {} for variables` se
  conserva tal cual, sea por decisión histórica o porque lo escribió la persona
  usuaria;
- un valor explícito aportado por el host gana sobre el default localizado.

Tampoco se traducen datos del usuario ni metadata del host: nombres, correos,
empresas, cargos escritos como dato, nombres de documentos, variables o valores
remotos. Que exista texto inglés dentro de datos reales no es un defecto de i18n.

## Diccionarios

`src/sisad-pdfme/ui/i18n.ts` contiene los 11 idiomas del contrato `Lang`:
`en`, `es`, `fr`, `de`, `it`, `pl`, `ja`, `ko`, `zh`, `ar`, `th`.

Cada diccionario está tipado como `Record<keyof Dict, string>`, así que
TypeScript rechaza un diccionario incompleto. Añadir una key a `Dict`
(`src/sisad-pdfme/common/schema.ts`) obliga a cubrirla en los 11 idiomas.

No se admite ocultar keys faltantes con `as any`, `Record<string, any>`,
optional chaining indiscriminado ni fallback a un literal en otro idioma.

La paridad se verifica en
`tests/unit/sisad-pdfme-comprehensive/contracts/common/localization.test.ts`,
que valida cada diccionario contra el propio Zod `Dict`.

## Accesibilidad

La localización cubre también el árbol de accesibilidad: `aria-label`, `title`,
`alt`, tooltips, nombres accesibles de botones y títulos de diálogo. Un botón
puede verse como icono y seguir anunciándose en otro idioma, así que su nombre
accesible se resuelve por i18n igual que el texto visible.
