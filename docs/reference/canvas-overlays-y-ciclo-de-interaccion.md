# Canvas, overlays y ciclo de interacción

## 1. Rol del canvas

El canvas es el corazón perceptual del producto. Todo lo demás —catálogo, inspector, docs rail, toolbar superior— existe para apoyar lo que ocurre aquí.

En este proyecto, el canvas no es un simple contenedor visual. Ya es un entorno de edición con:

- selección;
- arrastre;
- resize;
- snap;
- métricas;
- edición inline;
- menú contextual;
- toolbar contextual multinivel.

## 2. Pipeline de interacción actual

El ciclo ideal de interacción puede entenderse así:

1. usuario inserta un field desde catálogo;
2. field aparece en canvas;
3. usuario selecciona;
4. overlays contextuales reaccionan;
5. usuario mueve/redimensiona/edita;
6. inspector refleja configuración;
7. runtime persiste/deriva configuración avanzada.

## 3. Rol de cada overlay

### 3.1 `CanvasOverlayManager`
Es el agregador visual del estado contextual.

### 3.2 `SelectionContextToolbar`
Entrega acciones rápidas sin obligar a usar siempre el inspector.

### 3.3 `InlineMetricsOverlay`
Expone ancho/alto, ayudando a ajuste preciso.

### 3.4 `SnapFeedbackOverlay`
Da confirmación visual de alineaciones y acoples.

### 3.5 `InlineEditOverlay`
Permite mantener al usuario dentro del canvas al editar contenido.

## 4. Reglas de jerarquía visual recomendadas

No todos los overlays deben gritar al mismo tiempo.

### Jerarquía propuesta
1. selección activa;
2. edición inline;
3. toolbar contextual;
4. snap feedback;
5. métricas;
6. guías/rulers.

## 5. Qué no debe pasar

- toolbar y edición inline visibles simultáneamente;
- métricas persistentes cuando el usuario ya terminó resize;
- snap feedback congelado tras finalizar movimiento;
- overlays tapando un schema pequeño sin relocalización.

## 6. Toolbar contextual: interpretación del estado

Los modos `micro`, `compact` y `expanded` son una muy buena decisión porque introducen densidad progresiva.

### 6.1 `micro`
Debe vivir para:
- editar;
- abrir propiedades;
- duplicar;
- acción mínima por tipo.

### 6.2 `compact`
Debe vivir para:
- las acciones más frecuentes sin cambiar de panel;
- required;
- lock;
- delete;
- propiedades.

### 6.3 `expanded`
Debe reservarse para:
- acciones específicas por schema;
- estilo rápido;
- orden;
- copiar estilo;
- agrupación o distribución.

## 7. Inline edit: estándar de oro

La edición inline debe sentirse natural y reversible.

### Reglas mínimas
- Enter confirma;
- Escape cancela;
- blur controlado;
- selección persiste tras guardar;
- drag/select se suspenden temporalmente;
- no debe depender de `window.prompt`.

## 8. Moveable, Selecto y SnapLines

La combinación de estas piezas convierte al canvas en un editor serio. Sin embargo, el valor real no está solo en la librería subyacente, sino en cómo se orquesta visualmente.

### Recomendaciones
- reducir ruido de handles cuando el zoom es bajo;
- hacer más visibles los estados locked/readOnly;
- usar snapping semántico a márgenes y padding;
- diferenciar multi-select de single-select con claridad.

## 9. Focus mode

El canvas se beneficiaría de un “modo foco” que:

- colapse panel izquierdo;
- colapse panel derecho;
- mantenga toolbar superior mínima;
- deje el canvas con máxima prioridad visual.

Eso es especialmente útil en documentos densos.

## 10. Accesibilidad on-canvas

### Recomendaciones mínimas
- foco visible en schemas navegables;
- labels accesibles para acciones contextuales;
- atajos documentados;
- navegación por teclado entre elementos;
- acciones principales accesibles sin mouse.

## 11. Performance del canvas

Las mejoras funcionales deben cuidarse para no degradar el loop visual.

### Reglas
- overlays derivados y memoizados;
- throttle en métricas si fuera necesario;
- render condicional de overlays avanzados;
- desacoplar runtime HTTP del loop de drag/resize.

## 12. Conclusión

El canvas ya tiene arquitectura de editor profesional. La mejora futura no está en agregar más overlays, sino en pulir su orquestación, visibilidad y accesibilidad.
