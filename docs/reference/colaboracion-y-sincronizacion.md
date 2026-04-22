# Colaboración, ownership, destinatarios y sincronización

## Fase crítica: contrato aditivo vigente

Esta referencia define la semántica vigente para la fase crítica multiusuario/multidocumento sin cambios breaking:

- se mantiene `buildSchemaAssignments` (recipient/file/page);
- se mantiene `buildUserSchemaAssignments` (author/file/page);
- se agrega `buildUserRecipientAssignments` (author+recipient/file/page);
- `__shared__` permanece como bucket técnico complementario para visibilidad compartida.

## Introducción

La versión reciente de SISAD PDFME ya incorpora piezas de colaboración en `common/collaboration.ts` y `ui/collaboration.ts`. Esto cambia el alcance del producto: deja de ser solo un diseñador local y pasa a ser base para experiencias multiusuario y multi-destinatario.

## Conceptos principales

### Ownership del schema
Cada schema puede pertenecer a uno o varios destinatarios:

- `ownerRecipientId`
- `ownerRecipientIds`

### Identidad del schema
Para colaboración es crucial que cada schema tenga una identidad estable (`schemaUid` o equivalente) y esté asociado a:

- `fileId`
- página
- destinatario(s)

### Asignaciones
La función `buildSchemaAssignments` agrupa por:

- recipient
- file
- page

Las pruebas muestran agrupación determinista por destinatario, archivo y página.

### Asignaciones por autor y destinatario (nuevo helper)

Helper:

- `buildUserRecipientAssignments(schemas, options?)`

Forma:

- `assignments[userId][recipientId][fileId][pageNumber] = schemaUid[]`

Notas de contrato:

- `pageNumber` se mantiene 1-based;
- `ownerMode: 'shared'` puede reflejarse además en `assignments[userId].__shared__[fileId][pageNumber]`;
- `__shared__` separa visibilidad compartida de la autoría real del schema;
- deduplicación por `schemaUid` dentro de cada bucket de página.

### Eventos colaborativos
`applyCollaborationEvent` procesa eventos como updates sobre schemas.

## Implicaciones de diseño

1. un campo debe mantener identidad estable aunque cambie nombre;
2. los cambios de un usuario deben poder aplicarse sobre un template serializable;
3. el sistema debe distinguir entre update inexistente y update aplicable;
4. las asignaciones deben ser reconstruibles.

## Flujo posible

1. usuario A inserta schema;
2. engine adjunta identidad y contexto colaborativo;
3. defaults colaborativos aplican ownerRecipientId;
4. el cambio se serializa;
5. otro cliente recibe evento y ejecuta `applyCollaborationEvent`;
6. se reconstruyen assignments.

## Unificación de creación/duplicación/pegado

La fase crítica establece una ruta única de contexto colaborativo para todas las operaciones de creación:

- create desde catálogo/context menu;
- duplicate de selección;
- paste entre páginas/documentos.

Reglas:

- `duplicate`: regenera `schemaUid/id`, conserva configuración funcional, reasigna `createdBy/userColor` al usuario activo;
- `paste`: actualiza `fileId/pageNumber` destino, conserva metadata no conflictiva;
- `delete`: elimina schema + anchors/comments asociados y emite evento de sincronización.

## Ejemplo de evento

```ts
const event = {
  type: 'update',
  schemaId: 'schema-1',
  patch: {
    readOnly: true,
  },
};
```

## Ejemplo de build assignments

```ts
const assignments = buildSchemaAssignments([
  [
    {
      id: 'schema-1',
      name: 'field-a',
      type: 'text',
      schemaUid: 'uid-a',
      fileId: 'file-1',
      ownerRecipientId: 'recipient-1',
    },
  ],
  [
    {
      id: 'schema-2',
      name: 'field-b',
      type: 'text',
      schemaUid: 'uid-b',
      fileId: 'file-1',
      ownerRecipientIds: ['recipient-1', 'recipient-2'],
    },
  ],
]);
```

Resultado esperado:

- `recipient-1.file-1.page0 = ['uid-a']`
- `recipient-1.file-1.page1 = ['uid-b']`
- `recipient-2.file-1.page1 = ['uid-b']`

## Qué debe documentarse mejor

- diferencias entre ownership simple y múltiple;
- qué defaults aplica el engine al crear un schema en modo colaborativo;
- precedencia entre evento remoto y edición local;
- validaciones para schemas sin `fileId` o `schemaUid`;
- efectos en pestañas de campos y docs;
- impacto en persistencia y output JSON.

## Recomendaciones de implementación

1. toda colaboración debe apoyarse en identidad estable;
2. todo evento debe ser idempotente;
3. los schemas sin identidad no deben entrar a sincronización remota;
4. la documentación debe incluir diagramas de secuencia;
5. los ejemplos deben mostrar escenarios multi-file y multi-recipient.

## Ejemplo de política de merge

```ts
function reconcileRemotePatch(localSchema, patch) {
  return {
    ...localSchema,
    ...patch,
    updatedAt: Date.now(),
  };
}
```

## Checklist de pruebas

- update sobre schema existente;
- update sobre schema inexistente;
- build assignments con recipient único;
- build assignments con múltiples recipients;
- recarga del template;
- reordenamiento por página;
- visibilidad por destinatario.

## Política Playwright de consola

Para pruebas E2E de colaboración:

- fallar en `console.error` y `pageerror`;
- usar allowlist explícita para ruido externo conocido;
- no ocultar errores del dominio `sisad-pdfme`;
- verificar flujos multiusuario/multidocumento con comentarios anclados y cambios de vista (`Usuario activo`/`Global`).
