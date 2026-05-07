# CommandBus, actionRegistry y comandos de selección

> Documentación generada para consumo externo de `sisad-pdfme`.

## Problema que resuelve
El diseñador tiene acciones en toolbar, menú contextual, shortcuts y sidebar. Si cada lugar implementa su propia lógica, aparecen colisiones.

## Regla
Toda acción estructural debe pasar por comandos comunes:
- `createCommandBus`.
- `registerDesignerCommands`.
- `createSelectionCommands`.
- `emitInlineEditRequest`.
- `setInlineEditRequestHandler`.

## Acciones cubiertas
- duplicar;
- eliminar;
- alinear;
- distribuir;
- traer adelante/enviar atrás;
- toggle requerido/readonly/hidden;
- editar texto inline;
- abrir propiedades;
- comentar.

## Flujo correcto
```text
Botón / atajo / menú
  → acción registrada
  → selectionCommands
  → changeSchemas / commandBus
  → un solo evento de cambio
```

## Pruebas necesarias
- Un click en toolbar y un shortcut producen el mismo resultado.
- No se ejecutan shortcuts cuando el foco está en input del inspector.
- Eliminar/duplicar no actúa sobre schemas ocultos por filtro multiusuario.
