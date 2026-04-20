# Arquitectura de plataforma y engine

## 1. Visión general

La arquitectura actual de `sisad-pdfme` ya está organizada en subsistemas que se parecen más a una plataforma que a un paquete UI aislado. La estructura consolidada deja ver claramente seis capas principales:

- `common`
- `converter`
- `generator`
- `pdf-lib`
- `schemas`
- `ui`

Cada una cumple una responsabilidad diferenciada y, en conjunto, componen un editor PDF extensible.

## 2. Mapa de capas

### 2.1 `common`
Contiene contratos, helpers, registro de plugins, tipos base, template dinámico, identidad y utilidades comunes.

### 2.2 `converter`
Resuelve flujos de conversión:
- PDF a imágenes
- PDF a tamaños
- imágenes a PDF

### 2.3 `generator`
Construye el PDF final a partir de template, inputs y plugins.

### 2.4 `pdf-lib`
Fork o adaptación del backend de bajo nivel para manipulación PDF. Esta capa conviene tratarla como infraestructura, no como superficie pública inmediata.

### 2.5 `schemas`
Contiene implementaciones por tipo de schema:
- texto
- imagen
- fecha
- select
- radio
- checkbox
- códigos
- shapes
- tablas
- multiVariableText

### 2.6 `ui`
Contiene el editor y sus componentes:
- `Designer`
- `Form`
- `Viewer`
- `designerEngine`
- sidebars
- canvas
- overlays
- widgets del inspector
- runtime de preview

## 3. La pieza central: `DesignerEngine`

El `DesignerEngine` ya no es solo una colección de flags. Funciona como una capa de orquestación que define:

- configuración HTTP global
- renderers y sidebars customizables
- toggles de canvas
- estilo/clases de canvas
- hooks de identidad y creación de schema
- configuración de colaboración

Esto lo convierte en el verdadero contrato de plataforma para proyectos externos.

## 4. Responsabilidades del engine

### 4.1 Configuración global de UI
Permite inyectar comportamiento y slots de render de sidebars y canvas sin tocar el núcleo visual.

### 4.2 Configuración de runtime HTTP
Permite heredar configuración tipo Axios para requests por schema. Esto habilita casos de consulta remota, prefill y submit parcial sin duplicar configuración en cada campo.

### 4.3 Configuración del ciclo de vida del schema
El engine ya soporta:
- `configStorageKey`
- `autoAttachIdentity`
- `identityFactory`
- `onCreate`

Esto hace posible estandarizar identidad, persistencia y auditoría.

### 4.4 Configuración de colaboración
Permite inyectar una estrategia de sincronización y metadatos colaborativos.

## 5. Por qué esta capa ya es “plataforma”

Hay varios rasgos de plataforma clara:

1. el motor no está acoplado a una sola vista
2. las sidebars pueden sustituirse o configurarse
3. los schemas pueden extenderse por plugin registry
4. existe configuración de runtime por campo
5. hay pruebas específicas del engine
6. la documentación ya reconoce hooks de identidad, persistencia y HTTP

## 6. Builder y composición

El proyecto usa un patrón tipo builder para construir opciones del editor y combinar:

- configuración de canvas
- configuración de sidebars
- configuración HTTP
- configuración de schema
- configuración de colaboración

Ese builder debería entenderse como la **API principal de integración**.

### Ejemplo conceptual

```ts
const engine = new DesignerEngineBuilder()
  .withHttpAxiosConfig({
    inheritSystem: true,
    baseURL: 'https://api.midominio.com',
    timeoutMs: 12000,
  })
  .withCanvasFeatureToggles({
    guides: true,
    snapLines: true,
    padding: true,
    mask: false,
  })
  .withSchemaConfigStorageKey('__sisad_pdf_designer')
  .withSchemaIdentityFactory((schema, context) => ({
    id: `${context.pageIndex}-${schema.id}`,
    key: schema.name || schema.id,
    namespace: 'contratos',
    version: 'v1',
    tags: ['editor', 'produccion'],
  }))
  .build();
```

## 7. Arquitectura pública vs arquitectura interna

Conviene separar la plataforma en dos caras.

### 7.1 Cara pública
Lo que terceros deberían usar:
- builder
- `Designer`, `Form`, `Viewer`
- contratos de schema config
- registry de widgets/plugins
- helpers públicos documentados

### 7.2 Cara interna
Lo que no conviene prometer todavía:
- internals de `pdf-lib`
- detalles del DOM del canvas
- nombres exactos de clases CSS del inspector
- estrategia de layout del shell
- estructuras muy específicas del overlay geometry

## 8. Riesgos actuales

### 8.1 Acoplamiento de marca heredada
Aunque ya fue renombrado a `sisad-pdfme`, aún conserva semántica heredada del fork original. Para producto vendible, conviene seguir desacoplando nombres públicos.

### 8.2 Mezcla de responsabilidad entre UI y runtime
Algunas piezas del inspector y de widgets conocen demasiado del runtime. A futuro conviene extraer servicios de datos y validación.

### 8.3 Crecimiento del `designerEngine`
Si todo sigue entrando al engine sin segmentación, puede convertirse en un objeto demasiado ancho.

## 9. Recomendación estructural

### 9.1 Separar contratos de engine por módulos
Propuesta:

- `engine.canvas.ts`
- `engine.http.ts`
- `engine.schema.ts`
- `engine.collaboration.ts`
- `engine.types.ts`

### 9.2 Crear una superficie “platform”
A futuro, esta sería una mejor exposición:

```ts
export {
  DesignerEngineBuilder,
  createSchemaDataRuntimeAdapter,
  resolveDesignerHttpClientConfig,
  getSchemaDesignerConfig,
  setSchemaDesignerConfig,
  mergeSchemaDesignerConfig,
} from '@sisad-pdfme/ui';
```

## 10. Ejemplo de integración completa

```ts
import { DesignerEngineBuilder } from '@sisad-pdfme/ui';

const engine = new DesignerEngineBuilder()
  .withHttpAxiosConfig({
    inheritSystem: true,
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      'X-App': 'sisad-pdfme',
    },
    auth: {
      mode: 'inherit',
    },
  })
  .withSchemaConfigStorageKey('__designer_config')
  .withSchemaCreationHook((schema, context) => {
    return {
      ...schema,
      pageNumber: context.pageNumber,
      createdAt: context.timestamp,
      fileId: context.fileId ?? null,
      ownerRecipientId: context.ownerRecipientId ?? null,
    };
  })
  .build();
```

## 11. Guía de refactor futuro

Si el proyecto se venderá o reutilizará, el siguiente paso natural es migrar de “fork grande” a “plataforma con marca propia”:

1. estabilizar exports públicos
2. separar core/runtime/editor/platform
3. marcar `pdf-lib` como infraestructura
4. documentar contratos como producto
5. reducir dependencia del nombre histórico

## 12. Checklist de arquitectura

- ¿El cambio toca UI, runtime o contrato?
- ¿Necesita ir al builder o puede vivir como widget local?
- ¿Debe documentarse como API pública?
- ¿Rompe compatibilidad de schema config?
- ¿Requiere test unitario del engine?
- ¿Requiere test Playwright del shell?

## 13. Resumen operativo

Si una persona nueva entra al proyecto, debería entenderlo así:

- `common` define base semántica
- `schemas` define tipos de campo
- `generator` renderiza PDF final
- `converter` transforma PDF/imagen
- `ui` opera como editor visual
- `designerEngine` es el contrato principal de personalización
