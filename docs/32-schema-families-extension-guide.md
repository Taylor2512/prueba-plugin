# Familias de schemas y guía de extensión

## 1. Inventario observable

La capa `schemas` ya está organizada por familias:
- `text`
- `tables`
- `barcodes`
- `date`
- `graphics`
- `signature`
- `checkbox`
- `radioGroup`
- `select`
- `shapes`
- `multiVariableText`

Esto ya es una base fuerte para un SDK de campos reutilizable.

## 2. Qué debe ser una familia de schema

Una familia completa debe incluir, idealmente:
- tipos
- helper
- render UI
- render PDF
- prop panel o configuración
- iconografía
- registro/index

## 3. Contrato sugerido para una familia

```ts
export interface FieldPluginDefinition {
  type: string;
  label: string;
  category: string;
  icon?: React.ComponentType;
  createDefault(): Schema;
  uiRender: FieldUiRenderer;
  pdfRender: FieldPdfRenderer;
  getInspectorSchema?: () => DetailSchemaSection[];
}
```

## 4. Ejemplo: text

La familia `text` es la mejor candidata para documentarse como ejemplo canónico porque toca:
- edición inline
- layout
- style
- render visual
- render PDF
- integración con toolbar contextual

## 5. Guía para crear un nuevo schema

### Paso 1. Crear carpeta
```text
src/sisad-pdfme/schemas/signatureStamp/
  index.ts
  types.ts
  helper.ts
  uiRender.ts
  pdfRender.ts
  propPanel.ts
```

### Paso 2. Tipos base
```ts
export interface SignatureStampSchema extends Schema {
  type: "signatureStamp";
  signerName?: string;
  signedAt?: string;
  showSeal?: boolean;
}
```

### Paso 3. Create default
```ts
export const createSignatureStamp = (): SignatureStampSchema => ({
  name: "signature_stamp",
  type: "signatureStamp",
  position: { x: 24, y: 24 },
  width: 120,
  height: 36,
  signerName: "",
  signedAt: "",
  showSeal: true,
});
```

### Paso 4. UI renderer
Representa cómo se ve en canvas y viewer.

### Paso 5. PDF renderer
Dibuja el resultado final en la página PDF.

### Paso 6. Registro
Agregarlo en `schemas/index.ts` y `schemaRegistry.ts`.

Si el schema debe funcionar como built-in real, no basta con aparecer en el catalogo.
Tambien debe quedar alineado con los registros usados por runtime y generator.
En este fork eso implica mantener en paridad:
- `schemaPlugins`
- `flatSchemaPlugins`
- `builtInSchemaDefinitions`
- `builtInPlugins`

Ejemplo actual: `signature` ya existe como una familia built-in de firma visual basada en imagen.
Su primera version reutiliza el pipeline de `graphics/image` para render UI y PDF, muestra un placeholder solo en UI cuando esta vacia y no pretende resolver firma digital criptografica PDF.

## 6. Regla de oro

Nunca crear un schema que solo funcione en inspector pero no tenga representación clara en:
- canvas
- viewer/form
- generator

## 7. Preguntas que toda nueva familia debe responder

1. ¿Cómo se crea por defecto?
2. ¿Cómo se selecciona?
3. ¿Qué acciones tiene en toolbar?
4. ¿Qué secciones aparecen en detalle?
5. ¿Cómo se serializa?
6. ¿Cómo se renderiza en PDF?
7. ¿Cómo participa en form-json?
8. ¿Cómo colabora/persiste?

## 8. Extensibilidad comercial

Si quieres vender la plataforma, puedes empaquetar familias así:
- core fields
- enterprise forms
- signatures pack
- compliance pack
- analytics pack

## 9. Recomendación documental

Cada familia debería tener su propio `.md` técnico con:
- propósito
- contrato
- props
- ejemplos
- restricciones
- patrón de render
- edge cases
