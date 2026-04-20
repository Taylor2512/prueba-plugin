
para cambiar el nombre de esta propiedad y así aislar configuraciones entre distintos proyectos.

### **Identidad y hooks de creación de esquema**

La identidad de los campos es clave para la deduplicación y la persistencia.**  **El Builder permite:

* **`withSchemaIdentityFactory(identityFactory: SchemaIdentityFactory)`**: define una función que, al crear un campo, genera un objeto identidad con `id`, `key`, `namespace`, `version` y `tags`.**  **Si no se proporciona, el motor utiliza el `id` y el nombre del esquema para construirla.
* **`withSchemaCreationHook(onCreate: SchemaCreationHook)`**: define un callback que se ejecuta cada vez que se crea un nuevo esquema (por ejemplo, para aplicar reglas de negocio, colores por destinatario, inicializar persistencia, etc.).
* **`withAutoAttachIdentity(autoAttachIdentity: boolean)`**: controla si el motor debe asignar automáticamente identidad a un campo cuando se crea.**  **Desactivarlo puede ser útil si la identidad se gestiona de forma externa.

### ### **Método **

**`build()`**

Finalmente, **`build()`** genera un objeto `DesignerEngine` con toda la configuración.**  **Este engine se inyecta a los componentes del diseñador y se guarda en las opciones del runtime.**  **Existe también **`buildOptions()`** que combina las opciones de UI con la propiedad `designerEngine`.

## **Configuración y almacenamiento del esquema**

`sisad‑pdfme` persiste la configuración específica de cada campo dentro de la propiedad definida por `configStorageKey` (por defecto `__designer`).**  **Para gestionarla se exponen varias funciones:

* **`getSchemaDesignerConfig(schema, engine?)`**: extrae del esquema la configuración guardada.**  **Si no existe devuelve `undefined`.
* **`setSchemaDesignerConfig(schema, config, engine?)`**: devuelve un nuevo esquema con la configuración persistida.
* **`mergeSchemaDesignerConfig(schema, patch, engine?)`**: combina la configuración actual con un parche.**  **Esta función es muy utilizada cuando el usuario cambia opciones de persistencia, salida JSON o mapeos API; garantiza que no se pierdan campos anidados al actualizar parcialmentе

.

* **`resolveDesignerHttpClientConfig(schemaConfig, engine?)`**: resuelve la configuración efectiva de cliente HTTP combinando lo definido en el motor con lo especificado en el campo (endpoint, método, params, cabeceras y autenticación).**  **Esto se usa en tiempo de ejecución para las peticiones API o de pre‑relleno.

### **Opciones de configuración de esquema**

Cada campo puede almacenar las siguientes secciones (todas opcionales):

* **`identity`**: resultado de la `identityFactory`, contiene `id`, `key`, `namespace`, `version` y `tags`.**  **Permite rastrear el campo incluso si el usuario lo renombra o modifica.
* **`prefill`**: estrategia para rellenar el valor inicial del campo.**  **Admite `strategy = 'static' | 'api' | 'param'`, `value`, `mapping`, `endpoint`, `params`, etc.
* **`persistence`**: controla la persistencia local del valor (por ejemplo, en `localStorage`).**  **Permite habilitarla, elegir modo (`local`, `session`, `indexedDB`, `hybrid`), definir la clave, incluir campos ocultos y almacenar datos como JSON.
* **`api`**: define una consulta remota que se ejecutará cuando cambie el valor del campo.**  **Incluye `enabled`, `endpoint`, `method` (`GET`, `POST`, etc.), `params`, `requestMode` (`read`, `write`, `read-write`), `requestMapping` (cómo mapear inputs a cuerpo de petición), `responseMapping` (cómo mapear respuesta a valores), `http` (baseURL, headers, auth) y `timeoutMs`.
* **`form`**: describe cómo debe incluirse el campo en la salida JSON: si se recoge su valor (`collect`), si se habilita la exportación (`enabled`), el formato (`flat` o `nested`), la raíz y opciones para incluir campos vacíos, ocultos o metadatos.
* **`metadata`**: espacio libre para metadatos arbitrarios; el motor no lo utiliza pero se persiste.
* **`integrations`**: reservada para integraciones con servicios de firma electrónica, almacenamiento u otros sistemas.

## **Adaptador de datos y ejecución remota**

El motor no realiza peticiones HTTP directamente.**  **En su lugar expone **`createSchemaDataRuntimeAdapter`**, que recibe opcionalmente:

* `engine`: para acceder a la configuración global de HTTP.
* `storage`: objeto con métodos `getItem`, `setItem`, `removeItem` (por defecto usa `localStorage`).
* `fetchImpl`: implementación de `fetch` a utilizar (por defecto `window.fetch`).
* `now`: función para obtener la marca temporal actual.

El adaptador devuelve un objeto con métodos:

### **Persistencia local**

* **`readPersistedValue(storageKey)`**: lee un valor del almacenamiento seguro (`localStorage` u otro).**  **Devuelve `null` si no existe o hay error.
* **`writePersistedValue(storageKey, value)`**: escribe un valor.**  **Los errores se ignoran para no bloquear la UI.

### **Resolución de peticiones**

* **`resolveRequest(field, snapshot)`**: a partir de la configuración del campo (`api` o `prefill`), de los inputs actuales (`snapshot.currentInput`) y del cliente HTTP global, construye un objeto de solicitud con:

  * `schemaId` y `schemaName` del campo.
  * `source` (`api` o `prefill`).
  * `requestMode` (`read` o `write`).
  * `method`, `url`, `headers`, `params` y `body` resueltos.
  * `timeoutMs` y `withCredentials`.

    Devuelve `null` si la configuración no está habilitada o faltan datos.
* **`executeRequest(request)`**: envía la solicitud usando `fetch`.**  **Si el contenido es JSON, lo parsea automáticamente; si no, devuelve texto.**  **Maneja expiración por `timeoutMs` usando `AbortController` y propaga errores HTTP con detalles.
* **`mapResponseToValues(response, field, request)`**: transforma la respuesta en un diccionario `{ nombreCampo: valor }`.**  **Si se define un `responseMapping`, extrae los valores mediante rutas (p. ej., `user.name` → `nombre`); si no, convierte todas las propiedades primitivas a cadenas.**  **Esto se utiliza para rellenar otros campos del formulario de manera reactiva.

### **Generación de JSON de formulario**

* **`buildFormJson(snapshot)`**: a partir del *snapshot* de la plantilla (campos activos y inputs actuales) genera un objeto con dos propiedades: `data` y `meta`.**  **Dependiendo de la configuración `form` de cada campo, puede crear un JSON plano (`flat`) o anidado (`nested`), incluir campos ocultos, campos vacíos y meta información (página actual, total de páginas, cantidad de campos, fecha de generación).**  **Este método es la base para exportar el formulario completo a sistemas externos o para pasar datos al Runner.

## **Adjuntos y utilidades auxiliares**

El motor implementa varias funciones internas que son utilizadas tanto por el adaptador como por el diseñador:

* **`buildQueryString(params)`**: construye una cadena de consulta a partir de un objeto (filtra pares con valores vacíos y usa `URLSearchParams`).
* **`buildResolvedHeaders(requestHeaders, auth, systemHeaders)`**: mezcla cabeceras de petición y cabeceras del sistema, y aplica cabecera de autorización según el tipo de autenticación.
* **`buildRequestBodyFromMapping(input, mapping)`**: construye el cuerpo de la petición copiando todos los campos de `input` o siguiendo un mapa { campo → ruta } para generar estructuras anidadas.
* **`buildValuesFromResponse(response, mapping)`**: extrae valores de la respuesta siguiendo un mapa { ruta → campo } o bien aplanando todas las propiedades primitivas de un objeto JSON.
* **`resolveRuntimeEndpoint(endpoint, baseURL, params)`**: normaliza un endpoint relativo/absoluto, combina el `baseURL` y añade parámetros de consulta.**  **Devuelve `null` si no se puede construir un URL válido.**  **Estas funciones trabajan en conjunto para que las consultas remotas sean seguras y predecibles.

## **API de tiempo de ejecución (runtime API)**

Cuando el motor se inicializa en un componente, expone un **Runtime API** que permite al Builder y a otros componentes externos controlar la experiencia de diseño.**  **Estas funciones incluyen:

* **Historial y zoom**: `undo()`, `redo()`, `setZoom(level)`, `getZoom()`, `fitToWidth()`, `fitToPage()`, `fitToDevice()`, `setViewportMode(mode)`, `getViewportMode()`.
* **Navegación de páginas**: `setPage(page)`, `getPage()`, `nextPage()`, `prevPage()`, `centerPage(page?)`, `duplicatePage()`, `removePage()`, `addPageAfter()`.**  **Gracias a estas funciones, el usuario puede trabajar con plantillas de múltiples páginas.
* **Gestión del lienzo**: `setSidebarOpen(open)`, `toggleSidebar()`, `setCanvasFeatureToggle(key, value)`, `getCanvasFeatureToggles()`, `getCanvasMetrics()` (obtiene el tamaño y posición del lienzo), `focusField(schemaIdOrName)`, `highlightField(schemaIdOrName)`.
* **Manipulación de campos**:
  * `addSchema(schema)`: inserta un nuevo campo en el centro de la página actual.
  * `addSchemaByType(type)`: crea un nuevo campo del tipo especificado usando un generador de esquemas (plugin).
  * `duplicatePage()`: clona la página actual con todos sus campos.
  * `setSchemaConfig(id, patch, matcher)`: actualiza la configuración de un campo concreto usando `mergeSchemaDesignerConfig`.
  * `getSchemaConfig(id, matcher)`: obtiene la configuración de un campo en un formato legible.
* **Prefill externo**: `applyExternalPrefill(idOrName, values)` permite aplicar valores a un esquema desde fuera del diseñador (por ejemplo, para pre‑rellenar datos del usuario).

El Runtime API se pasa a los componentes personalizados mediante el *bridge* (`componentBridge.runtime`) y posibilita la integración con botones externos, atajos de teclado y menús contextuales.

## **Módulos de dominio**

En la carpeta `core/domain` del proyecto se encuentran los módulos que encapsulan la lógica de negocio que opera sobre el motor.**  **Aunque físicamente no residen dentro de `sisad‑pdfme`, su funcionamiento está estrechamente relacionado.**  **Los más relevantes son:

### **`schemaIdentity.js`**

Define la función **`getSchemaIdentity(schema, engine?)`**, que devuelve un objeto identidad determinista basado en `schemaUid` (o `id`), `key`, `namespace` (`designer`), `version` (`1`) y tags (`type` del campo).**  **Esta identidad se usa para rastrear campos aunque el usuario los renombre o modifique.**  **También incluye utilidades como `getSchemaIdentityMeta()` y `firstDefinedString()` para construir claves únicas.

### **`schemaOwnership.js`**

Resuelve la propiedad de un campo en función del modo de entrega (paralelo o secuencial) y de los destinatarios definidos.**  **Expone funciones que producen un objeto **owner** con `ownerMode` (`global` o `recipient`), `ownerRecipientId`, `ownerRecipientIds`, `ownerColor`, `backgroundColor` y `borderColor`.**  **El motor utiliza esta información para pintar los campos con el color del destinatario y para ocultarlos o ponerlos en solo lectura en el Runner.

### **`schemaAssignmentRules.js`**

Contiene las reglas para construir las **assignments** (asignaciones) de campos a destinatarios, archivos y páginas.**  **Estas reglas consideran si el flujo es paralelo o secuencial, la posición de los destinatarios, los archivos activos y la presencia de múltiples páginas.**  **La estructura persistida recomendada es `assignments[recipientId][fileId][pageIndex] = [schemaUid, ...]`.**  **Estas asignaciones son leídas por `externalForms` para determinar qué campos debe rellenar o firmar cada destinatario.

### **`recipientRules.js`**

Define utilidades para validar y normalizar los destinatarios.**  **Asegura que cada destinatario tenga un identificador único, define roles (`solo llena`, `firma y llena`, `solo firma`, `copia`), posiciones en el flujo y canales de comunicación (SMS, email, WhatsApp).**  **El motor se apoya en estas reglas para pintar correctamente los campos y en el Runner para bloquear la edición de campos que no correspondan al destinatario actual.

## **Componentes principales del motor**

El motor se compone de varios componentes de React.**  **A continuación se describen los más importantes:

### **`<Designer />`**

Es el componente central del diseñador.**  **Recibe la plantilla (lista de documentos PDF y campos), el motor (`designerEngine`), los plugins (campos personalizados), las opciones de UI y callbacks para actualizar la plantilla.**  **Genera internamente un `runtimeApi` que expone funciones para manipular la plantilla.**  **Controla estados como la página actual, el nivel de zoom, la visibilidad de la barra lateral y la fase de interacción (selección, arrastre, redimensionamiento, rotación).**  **También gestiona la duplicación de páginas, la navegación entre documentos, el scroll y la persistencia temporal de las dimensiones del lienzo.

### ### ### **`<Preview />`**

** y **

**`<Form />`**

Ambos componentes derivan de una clase base `PreviewUI`.**  ****`<Preview />`** renderiza una plantilla en modo sólo vista; se utiliza para mostrar un PDF ya generado o para previsualizar una solicitud.**  ****`<Form />`** extiende `PreviewUI` añadiendo soporte de edición; gestiona los estados de entrada (`inputs`), expone callbacks `onChangeInput`, `onChangeInputs`, `onChangeFormJson` y `onPageChange`, y permite actualizar el valor de campos con métodos `setInputs()` y `setInput()`.**  **Internamente usa `AppContextProvider` para proporcionar contexto de idioma, fuentes y registro de plugins.

### ### ### **`<RightSidebar />`**

** y **

**`<LeftSidebar />`**

Las barras laterales son componentes intercambiables.**  **La barra izquierda suele contener el **catálogo de campos**, el buscador y filtros.**  **La barra derecha muestra los **detalles del campo seleccionado**, divididos en secciones (coordenadas, tamaño, persistencia, salida JSON, API/prefill, validación, opciones avanzadas).**  **Estas secciones se generan a partir de los plugins y de la configuración del campo, permitiendo extender la UI con nuevos grupos de opciones.

## **Estilos y diseño visual**

El archivo unificado de estilos (`styles-unificados(9).css`) agrupa varios CSS que definen la apariencia del motor.**  **Algunos puntos importantes:

* **Variables CSS**: se declaran en `:root` abreviaturas como `--bg-hover`, `--text-primary`, `--border-subtle` y tipografías.**  **Estas variables provienen de un sistema de tokens importado (`tokens.css`) que estandariza colores, tamaños y fuentes.
* **Reset y base**: todos los elementos usan `box-sizing: border-box`; el `body` fija la fuente (`DM Sans` y `JetBrains Mono`), el tamaño base y el color de fondo.**  **Las barras de scroll se estilizan para ser delgadas y discretas.
* **Layout**: clases como `.app-shell`, `.main-nav`, `.sisad-pdfme-page`, `.sisad-pdfme-header` y `.sisad-pdfme-grid` organizan la estructura general de la aplicación (navegación, encabezado, grid principal, workspace).**  **El header incluye un título y una descripción.**  **La grid divide las áreas de lienzo y barras laterales.
* **Canvas**: las clases `.sisad-pdfme-canvas`, `.sisad-pdfme-designer-root`, `.sisad-pdfme-designer-background` y `.sisad-pdfme-designer-stage` controlan el posicionamiento del lienzo, los márgenes, el color de fondo y la altura mínima.**  **Se aplican rejillas y reglas verticales para ayudar al alineamiento.
* **Interacciones**: se incluyen estilos para botones de la barra de herramientas, menús contextuales, estados activos y hover, badges y chips.**  **Los colores de los campos se actualizan dinámicamente con variables `--owner-color` cuando se asigna un destinatario.

Gracias a estas hojas de estilo, el motor soporta tanto temas claros como oscuros y es fácilmente modificable mediante variables o sobrescrituras.

## **Soporte multi‑archivo y multi‑destinatario**

Una de las principales mejoras del motor es el soporte integral para **múltiples documentos** y **múltiples destinatarios**.**  **Esto se refleja tanto en la UI como en la arquitectura interna:

* En el paso 1 del diseñador se pueden cargar varios PDFs a la vez.**  **Cada archivo aparece en una rejilla superior y se puede seleccionar para establecerlo como el documento activo

.**  **El motor gestiona internamente un identificador estable (`fileId`) para cada documento.

* Los destinatarios se pueden agregar de forma manual o masiva.**  **Cada destinatario tiene rol (llena, firma), canales de notificación y un color.**  **El diseñador permite alternar entre vista global o vista por destinatario.**  **Al arrastrar un campo cuando hay un destinatario activo, el motor asigna automáticamente el `ownerRecipientId`, colorea el campo y actualiza las assignations.
* La estructura de assignations se extiende a **tres dimensiones**: `recipient → file → página → lista de campos`.**  **Esto evita que un campo se comparta involuntariamente entre documentos y garantiza que al cambiar de archivo en la pestaña **Docs** no se dupliquen campos en otros PDFs.
* El motor implementa un **caché por documento** y `usePreviewRuntime` para reducir la latencia al alternar entre PDFs.**  **Solo se vuelve a renderizar la página activa y se conserva el estado de scroll y zoom.**  **Si se detecta que los campos no tienen `fileId` o `pageNumber` correcto, `useTemplateLoader` y `usePdfAssignments` aplican normalización y emiten advertencias.

## **Casos de uso comunes**

### **1. Configurar plantilla con múltiples PDFs y destinatarios**

En el paso 1, el usuario define el nombre y la descripción de la plantilla, arrastra varios PDFs y rellena la tabla de destinatarios.**  **El motor asigna a cada destinatario un color único y valida que el correo y los canales estén completos.**  **Los campos de la tabla permiten establecer el rol (solo llena, llena y firma, solo firma) y si se envía por SMS, correo o WhatsApp

.

### **2. Diseñar campos por destinatario y documento**

En el paso 2, al seleccionar un destinatario, el motor pinta los campos existentes con su color.**  **Al arrastrar un campo del catálogo al lienzo, se ejecuta el `schemaCreationHook` que establece el `ownerRecipientId`, `fileId` (documento activo), `pageNumber` y el valor de persistencia por defecto.**  **El menú contextual permite duplicar, eliminar, bloquear, ocultar y cambiar propiedades del campo.**  **El panel derecho muestra las coordenadas, el tamaño, opciones de persistencia y API, así como opciones avanzadas específicas del tipo de campo

.

### **3. Persistir datos y generar JSON de formulario**

En la sección “Conexiones y persistencia” del panel de propiedades, el usuario puede activar la persistencia local de un campo, elegir la estrategia (`local`, `session`, `indexedDB`, `hybrid`), la clave y si incluye ocultos.**  **También puede configurar la salida JSON (formato plano o anidado, raíz y opciones avanzadas).**  **Al generarse la solicitud, el Builder compone un objeto `{ originalForm, assignments }` que contiene la plantilla normalizada y las asignaciones, así como un `payloadVersion` para compatibilidad futura.

### **4. Consultas API y pre‑relleno**

Si se habilita la sección “Consulta API/Axios”, el campo enviará una petición al endpoint configurado cuando cambie su valor.**  **El adaptador runtime resuelve la URL, aplica cabeceras de autenticación y mapea la respuesta a otros campos.**  **También es posible habilitar “Prefill” para que un campo se rellene automáticamente a partir de un endpoint o de un parámetro de la URL de ejecución.

### **5. Ejecución en modo paralelo y secuencial**

En el Runner (`externalForms`), el usuario final visualiza sólo los campos que le corresponden.**  **Si el flujo es paralelo, los campos de otros destinatarios se ocultan; si es secuencial, se muestran los campos anteriores en solo lectura (y los posteriores ocultos) según el algoritmo de scoping definido en `schemaAccess.utils.js`.**  **Gracias a la estructura `assignments` y a las propiedades `ownerRecipientId/Ids`, el motor puede determinar con precisión el estado de cada campo.

## **Conclusiones y recomendaciones**

La migración a `sisad‑pdfme` ha dotado al motor de diseño PDF de **SISAD** de mayor flexibilidad y escalabilidad.**  **La arquitectura modular permite reemplazar barras laterales, canvas y plugins; la configuración por esquema soporta persistencia local, salida JSON y peticiones API; y el adaptador runtime abstrae la persistencia y las consultas remotas.**  **Además, el soporte multi‑archivo y multi‑destinatario, combinado con un contrato de identidad estable y reglas de asignación robustas, permite construir flujos complejos de firma y captura de datos.

Para aprovechar al máximo el motor se recomienda:

1. **Asignar siempre una identidad estable a cada campo** (utilizando `schemaIdentity` o un `identityFactory` personalizado) para evitar duplicados al cambiar nombres.
2. **Establecer el ****`fileId`**** y el ****`pageNumber`**** cuando se crea un campo**.**  **El `schemaCreationHook` del Builder es el lugar adecuado para ello.
3. **Utilizar ****`mergeSchemaDesignerConfig`** para actualizar configuraciones sin perder propiedades anidadas.
4. **Persistir sólo lo necesario**.**  **Si un campo es puramente decorativo o se calcula a partir de otros valores, se puede desactivar la opción “Guardar datos ingresados” para que no se envíe al Runner.
5. **Aprovechar las capacidades de API/prefill** para validar y completar datos automáticamente, pero manejar los errores de forma amable y dejar claro al usuario si falla la conexión.
6. **Probar exhaustivamente en modo multi‑archivo/multi‑destinatario**.**  **Verificar que los campos no se mezclen entre documentos al duplicar páginas o cambiar de vista; si se detectan inconsistencias, revisar `usePdfAssignments` y la normalización de `fileId`.

La combinación de esta guía con los módulos de dominio (`schemaIdentity`, `schemaOwnership`, `schemaAssignmentRules`, `recipientRules`) y con los estilos unificados garantiza una base sólida para el desarrollo y la evolución futura del diseñador de formularios de SISAD.
