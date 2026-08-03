# Usuarios, ownership y color

## Regla central

```txt
LeftSidebar/futuros schemas → activeRecipientColor
schema existente            → stored ownerColor
schema recién creado         → activeRecipientColor persistido como ownerColor
```

Cambiar Alice→Bob→Carla no recolorea schemas existentes.

## Prioridad de color

1. schema.ownerColor
2. schema.userColor/recipientColor legacy
3. metadata `__designer`
4. recipient registry
5. fallback explícito

## Semantic color

Approve verde, Decline rojo, Note informativo, image/SVG/barcode/shape conservan
su contenido. El owner color se limita al chrome externo.

## Reasignar

Visible con `assignableRecipientCount > 1` y selección. Disabled con reason si
no hay permiso. Preserva geometry, routing, readOnly y locks.
