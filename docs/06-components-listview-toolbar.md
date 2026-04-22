# `ListViewToolbar.tsx`

## Propósito

La toolbar del outline/listado de campos es una pieza pequeña pero crítica. Las capturas anteriores mostraban problemas de layout en esta zona, especialmente en headers donde el texto podía romperse verticalmente y convivir mal con acciones como renombrar, buscar o cambiar el contexto de la vista. El componente vive dentro del subsistema `RightSidebar/ListView`. fileciteturn15file1

## Responsabilidades

- renderizar título del listado
- mostrar conteo
- ofrecer búsqueda
- exponer acciones ligeras como renombrar o filtros

## Riesgos típicos

- ancho mínimo mal resuelto
- `white-space` y `min-width` insuficientes
- mezcla de acciones principales y secundarias
- exceso de controles visibles en sidebars estrechas

## Recomendaciones

1. Mantener un layout con:
   - título
   - contador
   - búsqueda
   - overflow menu
2. Pasar acciones poco frecuentes a menú de overflow.
3. Documentar claramente breakpoints y comportamiento en sidebars comprimidas.

## Ejemplo de diseño deseado

```tsx
<ListViewToolbar
  title="Campos del documento"
  count={schemas.length}
  searchValue={search}
  onSearchChange={setSearch}
  onRenameGroup={openRenameDialog}
/>
```

## Qué mejorar en docs

- props exactas
- layout contract
- qué acciones son primary vs secondary
- cómo se integra con `ListViewFooter`
