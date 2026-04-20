# `schemaRegistry.ts`

## Rol

`schemaRegistry.ts` define el catálogo efectivo de tipos de campo que el editor puede crear, renderizar y configurar. Se ubica junto a `PluginIcon.tsx`, `LeftSidebar*` y el resto del sistema de catálogo, lo que confirma que no es solo un diccionario técnico, sino la base del modelo mental de “qué puede insertar el usuario”. fileciteturn15file1turn19file12

## Responsabilidades

- registrar tipos de schema
- asociar íconos o metadatos visuales
- alimentar el sidebar izquierdo
- servir de puente entre plugins y UX de inserción

## Relación con otros componentes

- `LeftSidebar.tsx`
- `LeftSidebarGroup.tsx`
- `LeftSidebarSearch.tsx`
- `PluginIcon.tsx`
- `detailSchemas.ts`
- `detailWidgets.tsx`

## Importancia de producto

Si comercializas la plataforma, `schemaRegistry` es casi un SDK interno. Cada nuevo tipo de campo debe entrar por aquí o por mecanismos conectados a esta capa.

## Qué debería documentar

- shape del registro
- campos mínimos que debe declarar un plugin
- cómo se agrupa por categoría
- cómo se conecta con iconografía y detalle
- cómo se ordena y se busca

## Ejemplo conceptual

```ts
registerSchema({
  type: 'customer_lookup',
  label: 'Cliente',
  category: 'Data',
  icon: CustomerIcon,
  defaults: { width: 120, height: 32 },
  supportsInlineEdit: false,
});
```

## Recomendación

Convertir esta pieza en un contrato formal de extensión. Es un excelente punto para monetizar extensiones o verticales sectoriales si el proyecto crece.
