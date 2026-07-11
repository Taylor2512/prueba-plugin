/**
 * Secciones disponibles dentro del inspector de propiedades del schema.
 *
 * Cada sección representa un grupo visual/lógico del RightSidebar DetailView.
 * Las familias de plugins pueden declarar cuáles de estas secciones deben
 * mostrarse mediante `visibleSections`.
 */
export type SchemaInspectorSection =
  /**
   * Información general del campo.
   *
   * Ejemplos:
   * - nombre;
   * - etiqueta;
   * - tipo;
   * - descripción;
   * - identificadores.
   */
  | 'general'

  /**
   * Propiedades de posición y tamaño.
   *
   * Ejemplos:
   * - x;
   * - y;
   * - width;
   * - height;
   * - página;
   * - alineación.
   */
  | 'layout'

  /**
   * Propiedades visuales del campo.
   *
   * Ejemplos:
   * - color;
   * - borde;
   * - fuente;
   * - fondo;
   * - radio;
   * - apariencia.
   */
  | 'style'

  /**
   * Propiedades de datos o valor del campo.
   *
   * Ejemplos:
   * - variable;
   * - valor inicial;
   * - formato;
   * - mapeo con input;
   * - origen de datos.
   */
  | 'data'

  /**
   * Configuración de conexiones externas.
   *
   * Ejemplos:
   * - API;
   * - prefill remoto;
   * - integraciones;
   * - sincronización;
   * - dependencias entre campos.
   */
  | 'connections'

  /**
   * Ayuda contextual del schema.
   *
   * Puede usarse para instrucciones, tips, descripción funcional
   * o documentación corta dentro del inspector.
   */
  | 'help'

  /**
   * Configuración colaborativa del campo.
   *
   * Ejemplos:
   * - propietario;
   * - destinatario;
   * - permisos;
   * - color de usuario;
   * - estado compartido.
   */
  | 'collaboration'

  /**
   * Reglas de validación del campo.
   *
   * Ejemplos:
   * - requerido;
   * - longitud mínima/máxima;
   * - patrón;
   * - validación custom;
   * - mensajes de error.
   */
  | 'validation'

  /**
   * Opciones avanzadas del schema.
   *
   * Se recomienda usar esta sección para propiedades poco frecuentes,
   * flags internos o comportamiento especializado que no debe saturar
   * la vista principal.
   */
  | 'advanced'

  /**
   * Comentarios asociados al campo.
   *
   * Permite exponer comentarios, hilos, resolución o acciones relacionadas
   * con feedback del schema.
   */
  | 'comments';

/**
 * Definición declarativa de una acción soportada por un plugin/schema.
 *
 * Este contrato permite que una familia de plugin informe al diseñador
 * qué acciones puede ejecutar y en qué superficies de UI deberían aparecer.
 *
 * No ejecuta la acción directamente; solo describe la acción disponible.
 */
export type PluginActionDefinition = {
  /**
   * Identificador único de la acción.
   *
   * Debe ser estable para poder usarlo en toolbars, menús contextuales,
   * telemetría, permisos o pruebas.
   */
  id: string;

  /**
   * Etiqueta visible de la acción.
   *
   * Se usa en botones, menús, tooltips o paneles del inspector.
   */
  label: string;

  /**
   * Comando lógico asociado a la acción.
   *
   * Este valor permite mapear una acción declarada por el plugin
   * con una operación concreta del diseñador.
   */
  command:
    /**
     * Agrega un nuevo campo/schema.
     */
    | 'addField'

    /**
     * Edita contenido textual del campo.
     */
    | 'editText'

    /**
     * Renombra la variable asociada al schema.
     */
    | 'renameVariable'

    /**
     * Cambia el tamaño del campo.
     */
    | 'resizeField'

    /**
     * Mueve el campo dentro del canvas.
     */
    | 'moveField'

    /**
     * Duplica el campo.
     */
    | 'duplicateField'

    /**
     * Elimina el campo.
     */
    | 'deleteField'

    /**
     * Cambia el color o apariencia principal del campo.
     */
    | 'changeColor'

    /**
     * Activa o desactiva persistencia del valor.
     */
    | 'togglePersistence'

    /**
     * Agrega un comentario asociado al campo.
     */
    | 'addComment'

    /**
     * Marca un comentario como resuelto.
     */
    | 'resolveComment'

    /**
     * Bloquea el campo para edición colaborativa.
     */
    | 'lockField'

    /**
     * Desbloquea el campo para edición colaborativa.
     */
    | 'unlockField';

  /**
   * Superficies donde esta acción puede mostrarse.
   *
   * Si no se define, el consumidor puede decidir una ubicación por defecto.
   */
  placement?: Array<
    /**
     * Barra de herramientas principal o contextual.
     */
    | 'toolbar'

    /**
     * Menú contextual del canvas o del schema.
     */
    | 'context-menu'

    /**
     * Inspector del RightSidebar DetailView.
     */
    | 'inspector'

    /**
     * Panel o rail de comentarios.
     */
    | 'comments-panel'
  >;
};

/**
 * Estrategia funcional declarada por un plugin/schema.
 *
 * Una estrategia describe una capacidad especializada que el diseñador
 * o runtime puede activar para una familia de campos.
 */
export type PluginStrategyDefinition = {
  /**
   * Identificador único de la estrategia.
   *
   * Debe ser estable para poder resolverla desde registries,
   * configuraciones o adaptadores externos.
   */
  id: string;

  /**
   * Tipo de estrategia soportada.
   */
  type:
    /**
     * Estrategia de validación de valores.
     */
    | 'validation'

    /**
     * Estrategia de carga de archivos o assets.
     */
    | 'upload'

    /**
     * Estrategia para precargar valores desde fuentes locales o remotas.
     */
    | 'prefill'

    /**
     * Estrategia de persistencia local o remota.
     */
    | 'persistence'

    /**
     * Estrategia relacionada con comentarios.
     */
    | 'comments'

    /**
     * Estrategia de bloqueo colaborativo.
     */
    | 'locking';

  /**
   * Etiqueta visible de la estrategia.
   *
   * Útil para inspector, documentación, debugging o UI administrativa.
   */
  label: string;
};

/**
 * Definición declarativa de una familia de plugins/schemas.
 *
 * Este contrato permite agrupar schemas por comportamiento y capacidades,
 * indicando:
 *
 * - a qué familia pertenecen;
 * - qué secciones del inspector deben mostrarse;
 * - cómo se mapean propiedades a secciones;
 * - qué acciones soportan;
 * - qué estrategias runtime tienen disponibles;
 * - si soportan comentarios, locking y presencia.
 */
export type PluginFamilyDefinition = {
  /**
   * Familia funcional del plugin/schema.
   *
   * Se usa para agrupar campos con comportamiento similar en sidebar,
   * inspector, renderizado, validación o documentación.
   */
  family:
    /**
     * Campos textuales o similares a texto.
     *
     * Ejemplos:
     * - text;
     * - number;
     * - date;
     * - select/dropdown.
     */
    | 'text'

    /**
     * Campos visuales o multimedia.
     *
     * Ejemplos:
     * - image;
     * - svg;
     * - firma visual;
     * - iniciales.
     */
    | 'mediaVisual'

    /**
     * Campos booleanos o de selección simple/múltiple.
     *
     * Ejemplos:
     * - checkbox;
     * - checkboxGroup;
     * - radioGroup;
     * - optionGroup.
     */
    | 'boolean'

    /**
     * Figuras, líneas, códigos de barra o elementos geométricos.
     *
     * Ejemplos:
     * - rect;
     * - ellipse;
     * - line;
     * - barcode;
     * - QR.
     */
    | 'shapeBarcode'

    /**
     * Campos tabulares.
     *
     * Ejemplos:
     * - table;
     * - listas repetibles;
     * - estructuras dinámicas con filas/columnas.
     */
    | 'table';

  /**
   * Secciones visibles del inspector para esta familia.
   *
   * Define qué bloques debe renderizar el DetailView cuando selecciona
   * un schema perteneciente a esta familia.
   */
  visibleSections: SchemaInspectorSection[];

  /**
   * Mapa de propiedades hacia secciones del inspector.
   *
   * Permite decidir en qué sección debe mostrarse cada propiedad.
   *
   * Ejemplo:
   *
   * {
   *   name: 'general',
   *   position: 'layout',
   *   fontSize: 'style',
   *   required: 'validation'
   * }
   */
  propertyMap: Partial<Record<string, SchemaInspectorSection>>;

  /**
   * Acciones soportadas por esta familia de plugin/schema.
   *
   * El diseñador puede usar esta lista para construir toolbars,
   * menús contextuales, acciones del inspector o comandos disponibles.
   */
  supportedActions: PluginActionDefinition[];

  /**
   * Estrategias funcionales soportadas por esta familia.
   *
   * El runtime o diseñador puede usarlas para activar capacidades como:
   *
   * - validación;
   * - prefill;
   * - persistencia;
   * - comentarios;
   * - locking.
   */
  strategies: PluginStrategyDefinition[];

  /**
   * Indica si los schemas de esta familia soportan comentarios.
   */
  supportsComments: boolean;

  /**
   * Indica si los schemas de esta familia soportan bloqueo colaborativo.
   */
  supportsLocking: boolean;

  /**
   * Indica si los schemas de esta familia soportan presencia colaborativa.
   *
   * Por ejemplo: mostrar qué usuario está interactuando con un campo,
   * seleccionándolo, editándolo o visualizándolo.
   */
  supportsPresence: boolean;
};
