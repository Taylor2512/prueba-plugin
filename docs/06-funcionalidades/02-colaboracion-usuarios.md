# Colaboración, usuarios, roles y locks

> Documentación generada para consumo externo de `sisad-pdfme`.

## Modelo por schema
```ts
collaboration: {
  ownerMode: 'user' | 'group' | 'shared';
  ownerId: 'sales-user-1';
  ownerIds: ['sales-user-1'];
  ownerGroupId: 'sales-team';
  visibleTo: ['sales-user-1', 'legal-user-1'];
  editableBy: ['sales-user-1'];
  state: 'draft' | 'locked' | 'merged';
  lock: { lockedBy, lockedAt, reason, sessionId };
}
```

## Vistas
- `user`: muestra propios, compartidos y visibles para usuario activo.
- `global`: muestra todos los campos con owner/color/lock.

## Reglas
- Cambio de usuario limpia selección oculta.
- Campo locked bloquea edición estructural.
- Owner color se ve en canvas, lista y detalle.
- Comentarios preservan autor y color.

## Backend futuro
SSE/WebSocket para presencia y eventos, endpoints para locks, comentarios y auditoría.
