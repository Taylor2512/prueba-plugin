# `collaboration.ts`

## Rol

El proyecto ya incluye capacidades de colaboración y sincronización, visibles tanto en el árbol de código como en pruebas específicas (`collaboration.test.ts`, `collaborationSync.test.ts`) y en widgets del inspector como `SchemaCollaborationWidget.tsx`. Esto significa que la colaboración no es una idea futura: ya es un subsistema real. fileciteturn15file1

## Ubicación

Existen archivos de colaboración en:
- `src/sisad-pdfme/common/collaboration.ts`
- `src/sisad-pdfme/ui/collaboration.ts`
- `SchemaCollaborationWidget.tsx` dentro del detalle fileciteturn15file1

## Responsabilidades posibles

Aunque el snippet no expone el contenido completo, por la estructura del repo se infiere que esta capa cubre:
- comentarios o anotaciones por schema
- sincronización de cambios
- estado multiusuario
- quizá presencia o locking lógico

## Relación con identidad de schema

La colaboración depende fuertemente de identidades estables para no perder referencia sobre campos renombrados o movidos. Esto conecta directamente con `identityFactory`, `autoAttachIdentity` y los hooks del `DesignerEngineBuilder`. fileciteturn19file15turn19file17

## Riesgos

- conflictos entre edición inline y edición remota
- sincronización de layout y contenido
- necesidad de merges parciales
- locks blandos vs duros
- visibilidad de comentarios en canvas vs inspector

## Qué documentar

- modelo de comentario
- modelo de evento de sincronización
- política de resolución de conflicto
- vínculo con schema identity
- cómo se integra con el inspector de detalle

## Ejemplo conceptual

```ts
const comment = {
  schemaId: field.identity.id,
  authorId: currentUser.id,
  body: 'Revisar etiqueta legal',
  createdAt: Date.now(),
};

collaborationApi.addComment(comment);
```

## Recomendación estratégica

La colaboración es una de las piezas con más potencial comercial del sistema. Si vas hacia una `platform/pdf`, documenta esta capa como módulo opcional:
- core editor
- data connectors
- collaboration add-on
