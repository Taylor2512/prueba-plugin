# Colaboración, sincronización y comentarios

## 1. Estado actual

La base de código ya tiene soporte explícito para colaboración. Esto ya no es una intención futura; está codificado en:

- `common/collaboration.ts`
- `ui/collaboration.ts`
- tests de colaboración y sync
- `SchemaCollaborationWidget`
- metadatos en `SchemaDesignerConfig`

## 2. Qué cubre la colaboración

Actualmente se perciben estos ejes:

- metadatos colaborativos por schema
- estado de lock o solo lectura
- ownership/recipient
- timestamps y autoría
- comentarios y anchors
- sincronización configurada desde engine

## 3. Lugar correcto de la colaboración

La colaboración no debería depender solo del inspector ni del canvas. Tiene 3 capas:

### 3.1 Contrato de datos
- schema uid
- owner
- comments
- anchors
- state
- created/updated by

### 3.2 Runtime de sincronización
- estrategia de sync
- polling o push
- reconciliación
- conflictos

### 3.3 UI
- widget de colaboración
- indicadores visuales
- bloqueo/estado compartido
- comentarios anclados

## 4. `SchemaCollaborationWidget`

Este widget ya vive dentro del panel derecho y sirve para configurar o visualizar:

- estado colaborativo
- comments
- anchors
- locks
- ownership
- información de auditoría

### Recomendación
Mantenerlo como sección específica y no mezclarlo con configuración general de datos o layout.

## 5. `SchemaCollaborativeMetadata`

Aunque la estructura completa debe seguir documentándose directamente desde código, conceptualmente incluye:
- identidad compartida del schema
- owner actual
- bloqueos
- comentarios
- anchors
- timestamps de creación y modificación

## 6. Comentarios y anchors

La presencia de `comments`, `commentAnchors` y `commentsAnchors` en el schema activo indica que el modelo ya contempla anotaciones asociadas a posiciones o elementos concretos.

### Casos de uso
- revisión interna
- aprobación por rol
- QA documental
- comentarios sobre campos específicos

## 7. Locking y ownership

Dos ideas deben mantenerse separadas:

### Lock
Impide edición inmediata del schema por el usuario actual.

### Ownership
Define a quién pertenece el schema desde la lógica del negocio o del flujo documental.

No todo schema locked tiene owner distinto, y no todo owner implica lock.

## 8. Sync desde engine

La configuración de colaboración ya vive en `DesignerEngine`, lo cual es correcto. La estrategia de sync no debería colgar del inspector ni del widget. Debe venir del engine como política de plataforma.

## 9. Pruebas existentes

El proyecto ya tiene:
- `collaboration.test.ts`
- `collaborationSync.test.ts`

Eso significa que la colaboración ya debe tratarse como feature seria y no como experimento.

## 10. Buenas prácticas de colaboración

1. toda acción colaborativa debe ser auditable
2. los comentarios deben poder anclarse sin romper el canvas
3. los locks deben ser visibles pero no invasivos
4. el inspector debe mostrar información útil sin sobrecargarse
5. el engine debe definir la política, no el widget

## 11. Ejemplo conceptual de metadata colaborativa

```ts
const schemaConfig = {
  collaboration: {
    state: 'review',
    ownerRecipientId: 'recipient-1',
    lockedBy: 'user-12',
    commentsEnabled: true,
  },
};
```

## 12. Ejemplo conceptual de sync config

```ts
const engine = new DesignerEngineBuilder()
  .withCollaboration({
    enabled: true,
    mode: 'push',
    channel: 'document-45',
    debounceMs: 300,
  })
  .build();
```

## 13. Riesgos típicos

### 13.1 Colisiones de edición
Dos usuarios editando el mismo schema.

### 13.2 Anchors huérfanos
Comentarios referenciando schemas o posiciones ya modificadas.

### 13.3 Locks permanentes
Bloqueos no liberados por error de red o desconexión.

### 13.4 Comentarios invisibles
Si los anchors no se renderizan de forma contextual, los comentarios se pierden.

## 14. Recomendaciones de evolución

### 14.1 Separar comentarios de configuración base
Los comentarios son colaboración, no propiedades del campo.

### 14.2 Definir reconciliación
Documentar si gana:
- último write
- write por owner
- merge con resolución manual

### 14.3 Añadir una capa de visualización en canvas
Badges o indicators mínimos, sin saturar la UI.

## 15. Checklist para tocar colaboración

- ¿El cambio es de contrato, runtime o UI?
- ¿Necesita pruebas de conflicto?
- ¿Rompe sync existente?
- ¿Afecta comments o anchors?
- ¿Debe reflejarse en el inspector?
- ¿Requiere badge o señal visual en canvas?

## 16. Resumen operativo

La colaboración ya existe como eje del producto. El siguiente paso no es “añadir comments”, sino consolidar:
- contratos
- reconciliación
- visualización contextual
- pruebas de conflicto
- documentación de ownership y lock
