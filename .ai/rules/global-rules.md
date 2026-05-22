# Reglas globales para modelos IA en `sisad-pdfme`

## Identidad del proyecto

`sisad-pdfme` es un fork aislado de edición documental PDF. Debe comportarse como una librería/componente autónomo, configurable y extensible.

## Reglas obligatorias

### 1. Aislamiento

No introducir referencias rígidas a:

- Clientes externos.
- Workflows externos.
- Endpoints.
- Rutas de aplicaciones consumidoras.
- Servicios de autenticación.
- Servicios de firma concretos.
- Pantallas específicas fuera del fork.

### 2. Configurabilidad

Toda nueva habilidad debe poder configurarse mediante:

- `features`.
- `layout`.
- `plugins`.
- `theme`.
- `permissions`.
- `commands`.
- `events`.
- `adapters`.

### 3. Composición

Preferir componentes genéricos:

- `Designer`
- `Canvas`
- `LeftSidebar`
- `RightSidebar`
- `SchemaCatalog`
- `Inspector`
- `FloatingToolbar`
- `DocsRail`
- `CommentsRail`
- `Form`
- `Viewer`
- `SnapshotEngine`

No crear variantes por caso de uso.

### 4. Estabilidad visual

No romper:

- PDF background.
- Paper geometry.
- Zoom.
- Scroll.
- Coordenadas.
- Moveable.
- Selecto.
- Overlays.
- Sidebars.
- Toolbar contextual.

### 5. Snapshot como fuente de verdad

El snapshot debe representar el estado portable del fork. No guardar nodos DOM, funciones, tokens ni credenciales.

### 6. Testing

Toda modificación importante debe tener al menos una validación:

- Unit test.
- Playwright test.
- Snapshot round-trip.
- Validación manual documentada.

### 7. Documentación

Actualizar docs si se cambia:

- API pública.
- Contrato de schema.
- Snapshot.
- Eventos.
- Comandos.
- Comportamiento de componentes.
- Estilos o tokens globales.
