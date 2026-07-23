# Informe de refactorización DRY — SISAD PDFME

## 1. Resultado ejecutivo

Se reconstruyó y analizó el código disponible del paquete consolidado de `prueba-plugin`, se cruzó con los reportes de `jscpd` y `knip`, y se aplicó una refactorización conservadora orientada a **compartir comportamiento real**, no a ocultar clones mediante exclusiones.

### Medición oficial recibida

El reporte original de `jscpd` registraba:

| Formato | Clones | Líneas duplicadas |
|---|---:|---:|
| TypeScript | 112 | 2.455 |
| TSX | 12 | 153 |
| Markdown | 26 | 441 |
| Total | 150 | 3.049 |

CSS, JavaScript y JSX figuraban con `0` clones. El total oficial incluía el fork interno de `pdf-lib`, documentación Markdown consolidada y archivos generados/históricos.

### Medición comparable sobre código propio disponible

Para comparar antes/después sobre el mismo conjunto de archivos completos, se utilizó un detector normalizado de bloques de al menos 6 líneas significativas y 50 tokens, excluyendo únicamente:

- `src/sisad-pdfme/pdf-lib/**` por ser código tercero/fork embebido;
- reportes, respaldos y documentación generada;
- archivos que el consolidado entregó truncados o redactados.

| Métrica | Antes | Después | Reducción |
|---|---:|---:|---:|
| Bloques repetidos | 71 | 2 | 97.18% |
| Líneas significativas duplicadas | 1134 | 20 | 98.24% |

Quedan solamente dos coincidencias del detector:

1. un bloque de importaciones de 7 líneas entre `schemas/number/index.ts` y `schemas/textLike/textLikeSchemaFactory.ts`;
2. 13 líneas repetidas en `ui/theme.ts`, archivo que llegó redactado/malformado (`token: [REDACTED]`) y no se modificó para no inventar contenido.

No queda lógica de negocio duplicada detectada en el conjunto completo y utilizable que fue refactorizado.

## 2. Volumen del cambio

- **55 archivos fuente** modificados o creados.
- **10 módulos compartidos nuevos**.
- **1.840 inserciones**.
- **2.612 eliminaciones**.
- Reducción neta: **772 líneas**.
- No se tocaron `Moveable`, `Selecto`, geometría global del canvas ni el fork `pdf-lib`.
- No se modificaron hojas CSS: el reporte original ya mostraba `0` clones CSS. Solo se eliminó un bloque redundante dentro de `ui/runtimeStyles.ts`.

## 3. Refactorizaciones aplicadas

### 3.1 Catálogos del laboratorio

Nuevo módulo:

- `src/features/pdfcomponent/labs/examples/catalog/labCatalogFixtures.ts`

Centraliza:

- PDF base y rutas de plantillas;
- ordenamiento y exclusión de schemas;
- resolución de posiciones `x/y`;
- factories de texto, select, checkbox y grupos de opciones;
- overrides de ejemplos básicos y extendidos;
- creación de páginas showcase.

Se simplificaron:

- `basicDesigner.ts`;
- `collaborationShowcases.ts`;
- `generatorRuntime.ts`;
- `multiDocumentRouting.ts`.

### 3.2 Assignments, colaboración y comentarios

Nuevo módulo:

- `src/sisad-pdfme/common/schemaPageTraversal.ts`

Centraliza recorridos por página/schema y búsquedas reutilizables. También se consolidaron:

- proyecciones de assignments por documento y página;
- deduplicación profunda de buckets;
- actualización de locks y comentarios;
- transformación de comentarios top-level;
- resolución de metadata colaborativa.

**Corrección funcional incluida:** al desasociar un comentario de un schema, ahora se elimina realmente `schemaUid` del anchor; antes podía conservarse accidentalmente.

### 3.3 Canvas y estado de render

`useCanvasRenderState.ts` reutiliza la derivación pura del estado en vez de mantener dos implementaciones paralelas para online/offline.

### 3.4 Form, Viewer y wrappers React

Nuevos módulos:

- `src/sisad-pdfme/ui/PagedPreviewUI.tsx`;
- `src/sisad-pdfme/react/SisadPdfmePreviewRuntime.tsx`;
- `src/sisad-pdfme/react/useSisadPdfmeRecipientRuntime.ts`.

Ahora comparten:

- navegación paginada;
- shell de preview;
- resolución de configuración;
- registry/contexto de recipients;
- construcción del runtime Form/Viewer.

Se preservó `Form.getFormJson()` y los métodos públicos de cursor/paginación se mantienen mediante herencia desde `PagedPreviewUI`.

### 3.5 Acciones Aprobar/Rechazar

Nuevo módulo:

- `src/sisad-pdfme/schemas/actions/createDecisionActionPlugin.ts`

`approve.ts` y `decline.ts` quedan como configuraciones delgadas sobre una factory común. Se comparte renderer, PDF, inspector, estados, iconografía, accesibilidad y metadata.

### 3.6 Inspector y prop panels

`commonInspectorFields.ts` pasó a ser la fuente compartida para:

- tipografía;
- tamaños y espaciado;
- colores hexadecimales;
- alineación;
- comportamiento básico;
- ayuda, labels y validación.

Se redujo duplicidad en texto, fecha, códigos, tablas, shapes, checkbox y grupos de opciones.

### 3.7 Opciones y grupos

Se centralizaron:

- dimensiones/estilos del indicador;
- filtrado de IDs válidos;
- selección single/multiple;
- defaults de capacidades por familia.

### 3.8 Storage browser

Nuevo módulo:

- `src/sisad-pdfme/shared/webStorage.ts`

Unifica lectura, escritura, borrado, serialización y tolerancia a errores de `localStorage`/`sessionStorage`. `localFormStorage.ts` y `localSnapshotStore.ts` ya no mantienen implementaciones paralelas.

### 3.9 Conversores browser/node

Nuevos módulos:

- `src/sisad-pdfme/converter/createEnvironmentConverters.ts`;
- `src/sisad-pdfme/converter/index.shared.ts`.

Se comparten exports y wrappers de `pdf2img`, `pdf2size` e `img2pdf`, manteniendo únicamente la resolución del worker/entorno en cada entrypoint.

### 3.10 Carga de imágenes

Nuevo módulo:

- `src/sisad-pdfme/schemas/shared/imageFileInput.ts`.

Imagen y firma reutilizan la misma lectura de archivo, validación MIME y conversión a data URL.

### 3.11 Metadata del diseñador y snapshot

Se unificaron contratos anidados equivalentes de:

- assignment;
- ownership;
- firma;
- integración;
- estado oficial del diseñador.

El snapshot mantiene su forma pública; se eliminó redefinición redundante de estructuras.

## 4. Decisiones deliberadas

### Código no refactorizado

- `src/sisad-pdfme/pdf-lib/**`: fork/código tercero; mezclarlo con helpers propios elevaría el riesgo de incompatibilidad.
- Markdown generado/consolidado: sus clones son documentación repetitiva, no runtime.
- `src/sisad-pdfme/ui/theme.ts`: llegó redactado y sintácticamente incompleto.
- `src/sisad-pdfme/ui/components/Designer/index.tsx` y `LeftSidebar.tsx`: el paquete compacto los entregó truncados.
- Referencias ausentes como `objectGuards.ts`: no se inventaron archivos o APIs.

La extracción identificó **431 archivos de código completos** y una parte de referencias del reporte oficial no estaba disponible íntegramente. Por ello el ZIP es un **overlay de archivos modificados**, no una reconstrucción total del repositorio.

### Dead code de Knip

El reporte recibido lista:

- 56 archivos sin uso;
- 419 exports sin uso;
- 7 dependencias aparentemente sin uso;
- 10 dependencias no declaradas.

No se eliminaron automáticamente porque `sisad-pdfme` funciona como librería/paquete y `knip --production` puede marcar falsos positivos en barrels, entrypoints alternativos, APIs públicas, Node/browser adapters y componentes cargados por registro. Esa limpieza debe hacerse en una tarea separada, con `package.json`, exports públicos, tests e integraciones reales disponibles.

## 5. Validaciones ejecutadas

- Transpilación/sintaxis AST de los **55 archivos TS/TSX modificados**: **0 fallos**.
- `git diff --check`: sin whitespace errors ni marcadores conflictivos.
- El patch pasó `git apply --check`; aplicado sobre una copia limpia del baseline, los 55 archivos resultantes coincidieron byte a byte con el overlay.
- Comparación semántica contra el baseline: se corrigió el único error nuevo de tipo detectado (`OptionGroupType`).
- Los diagnósticos adicionales restantes en módulos nuevos son exclusivamente resolución de paquetes/tipos externos (`react`, `react/jsx-runtime`, `lucide-react`, `pdfjs-dist`) porque el sandbox no incluye `node_modules`.
- Medición DRY final: **2 coincidencias / 20 líneas significativas**, ninguna de lógica de negocio.

### Validación no ejecutable en el sandbox

No se afirma que `npm run build`, `npm run quality` o Playwright hayan pasado. El consolidado no incluye `node_modules` y contiene archivos preexistentes redactados/truncados. Estas pruebas deben ejecutarse en el checkout original.

## 6. Aplicación del ZIP

1. Crear una rama o backup:

```bash
git switch -c refactor/dedup-sisad-pdfme
```

2. Descomprimir el ZIP en la raíz de `prueba-plugin`, conservando rutas.

3. Revisar:

```bash
git status --short
git diff --check
```

4. Ejecutar gates en el proyecto real:

```bash
npm ci
npm run lint
npm run build
npm run quality:duplicates:strict
npm run quality
npm test
```

5. Ejecutar Playwright focal del diseñador, multipágina, assignments, comentarios, Form y Viewer.

## 7. Uso alternativo del patch

```bash
git apply --check sisad-pdfme-dedup.patch
git apply sisad-pdfme-dedup.patch
```

## 8. Configuración recomendada de medición

Para que el quality gate mida código propio y no confunda deuda de terceros/documentación con runtime, mantener `minLines: 6`, `minTokens: 50`, `mode: mild` y excluir únicamente:

```json
[
  "**/node_modules/**",
  "**/dist/**",
  "**/coverage/**",
  "**/test-results/**",
  "**/.tailwind-migration-backups/**",
  "**/reports/**",
  "src/sisad-pdfme/pdf-lib/**",
  "**/*.md"
]
```

No conviene excluir módulos propios solo para hacer bajar el porcentaje.
