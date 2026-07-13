# Plan de corrección — RightSidebar ListView: reasignación de usuario y renombrado

## 1. Diagnóstico de las capturas

### 1.1. Problemas visuales detectados

1. En el panel `Campos`, todos los ítems parecen “seleccionados” porque la barra azul lateral se repite en cada fila.

   - La barra azul debe indicar propietario/recipient o estado, pero no selección real.
   - La selección real debe tener un borde más claro, fondo distinto y foco visible.
2. Los chips `Propio` y `Cliente Principal` se repiten en todas las filas y aumentan demasiado la altura.

   - En vista normal deben compactarse en una sola línea secundaria.
   - En vista compacta deben mostrarse solo si aportan información distinta al usuario activo.
3. Los botones del header no comunican bien su propósito:

   - El botón con ícono de usuario aparece solo cuando hay selección, pero no se entiende como “Reasignar”.
   - El botón de lápiz muestra tooltip `Renombrar`, pero su utilidad es dudosa porque el nombre del campo ya se puede editar en el detalle.
4. En modo renombrado masivo aparece un panel muy alto, con textarea grande y botones inferiores que quedan visualmente desconectados.

   - Ese modo debe eliminarse del header principal o moverse a una acción secundaria en menú `Más`.
5. El botón de reasignación debe comportarse como una acción principal contextual:

   - Sin selección: oculto o deshabilitado.
   - Con 1 schema seleccionado: `Asignar campo`.
   - Con N schemas seleccionados: `Asignar N campos`.

---

## 2. Decisión UX recomendada

### 2.1. Reasignar usuario sí debe existir

La acción es útil y debe mantenerse, pero con mejor semántica:

```txt
Botón actual: icono solo + tooltip "Asignar a Cliente Principal"
Botón recomendado: icono usuario + texto corto si hay espacio
Tooltip: "Reasignar responsable"
Modal: "Reasignar campos"
```

Debe abrir un modal con usuarios disponibles y permitir cambiar `ownerRecipientId`/`recipientId`/`ownerColor` sin modificar `locked`, `readOnly` ni `objectLocked`.

### 2.2. Renombrar no debe estar como acción principal

El botón `Renombrar` del header no aporta suficiente valor si:

- ya existe edición del nombre en `DetailView`;
- ya existe click/doble click o edición inline del item;
- el bulk rename obliga a mostrar una textarea grande y rompe el layout.

Recomendación:

- mover `Renombrar` al menú `Más`;
- mantenerlo solo para renombrado masivo avanzado;
- si hay un solo campo seleccionado, renombrar debe abrir `DetailView > Información del campo`, no un modo bulk.

---

## 3. Comportamiento objetivo

### 3.1. Header del panel Campos

Estado sin selección:

```txt
Campos        11/11
[Buscar campo o nombre]
[Todos los tipos]
```

Estado con 1 selección:

```txt
Campos        11/11    1 seleccionado
[Reasignar] [Más]
[Buscar...]
[Tipo...]
```

Estado con selección múltiple:

```txt
Campos        11/11    3 seleccionados
[Reasignar] [Más]
```

Reglas:

- `Reasignar` solo aparece si `selectedSchemaIds.length > 0`.
- `Renombrar` no aparece en el header principal.
- `Más` contiene: renombrar, bloquear/desbloquear, ocultar/mostrar, eliminar si aplica.
- El header no debe crecer más de 110–130px.

---

## 4. Modal objetivo — Reasignar responsable

### 4.1. UI

```txt
Reasignar responsable

Campos seleccionados
contract_name
contract_date
2 campos

Responsable actual
Cliente Principal

Nuevo responsable
[ Buscar usuario... ]

○ Cliente Principal
○ Empresa
○ Apoderado
○ Testigo 1

[Cancelar]                         [Reasignar]
```

### 4.2. Reglas funcionales

- Si todos los campos seleccionados tienen el mismo propietario, mostrar `Responsable actual`.
- Si tienen propietarios diferentes, mostrar `Responsables mixtos`.
- Excluir usuarios inexistentes o sin permisos.
- Deshabilitar botón `Reasignar` si no se seleccionó nuevo usuario.
- Si el nuevo usuario es el mismo owner para todos, deshabilitar con texto `Ya asignado`.
- No duplicar co-owners.
- No cambiar estado de bloqueo.
- No convertir automáticamente a solo lectura.
- Actualizar color visual según nuevo propietario.
- Refrescar Canvas, DetailView, ListView y snapshot.

---

## 5. Modelo único de actualización

Crear o consolidar un servicio pequeño:

```ts
export type AssignSchemaOwnerInput = {
  template: Template;
  schemaUids: string[];
  nextOwnerRecipientId: string;
  recipients: CollaboratorUser[];
};

export type AssignSchemaOwnerResult = {
  template: Template;
  changedSchemaUids: string[];
};

export function assignSchemaOwner(input: AssignSchemaOwnerInput): AssignSchemaOwnerResult {
  const owner = input.recipients.find((r) => r.id === input.nextOwnerRecipientId);
  if (!owner) return { template: input.template, changedSchemaUids: [] };

  const changedSchemaUids: string[] = [];

  const nextTemplate = {
    ...input.template,
    schemas: input.template.schemas.map((page) =>
      page.map((schema) => {
        const schemaUid = String((schema as any).schemaUid || schema.name || '');
        if (!input.schemaUids.includes(schemaUid)) return schema;

        changedSchemaUids.push(schemaUid);

        return {
          ...schema,
          ownerRecipientId: owner.id,
          recipientId: owner.id,
          ownerId: owner.id,
          assignedTo: owner.id,
          ownerName: owner.name,
          recipientName: owner.name,
          ownerColor: owner.color,
          userColor: owner.color,

          // Importante: NO tocar estos estados.
          locked: (schema as any).locked,
          readOnly: (schema as any).readOnly,
          objectLocked: (schema as any).objectLocked,
        };
      }),
    ),
  };

  return { template: nextTemplate, changedSchemaUids };
}
```

Ubicación sugerida:

```txt
src/sisad-pdfme/ui/components/Designer/shared/schemaAssignmentService.ts
```

---

## 6. Componentes a crear/modificar

### 6.1. Crear `SchemaAssignmentDialog.tsx`

Ruta:

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SchemaAssignmentDialog.tsx
```

Responsabilidad:

- renderizar modal;
- listar usuarios disponibles;
- buscar usuario;
- confirmar reasignación;
- no mutar template directamente; solo llamar `onConfirm`.

Props sugeridas:

```ts
type SchemaAssignmentDialogProps = {
  open: boolean;
  selectedSchemas: SchemaForUI[];
  recipients: CollaboratorUser[];
  currentRecipientId?: string | null;
  onClose: () => void;
  onConfirm: (recipientId: string) => void;
};
```

### 6.2. Modificar `ListViewToolbar.tsx`

Ruta:

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx
```

Cambios:

- reemplazar `bulk rename` visible por botón secundario `Más`;
- mostrar `Reasignar` cuando `selectedCount > 0`;
- tooltip: `Reasignar responsable`;
- label responsive:
  - ancho suficiente: `Reasignar`;
  - mini: solo icono.

Props nuevas o normalizadas:

```ts
selectedCount?: number;
canAssignSelected?: boolean;
onAssignSelected?: () => void;
onOpenBulkRename?: () => void;
```

### 6.3. Modificar `ListView.tsx`

Ruta:

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView.tsx
```

Cambios:

- controlar `assignmentDialogOpen`;
- derivar `selectedSchemas` desde `activeSchemaIds`;
- pasar `onAssignSelected` a toolbar;
- al confirmar, ejecutar un comando central o update centralizado.

Flujo:

```ts
const selectedSchemas = useMemo(
  () => viewSchemas.filter((schema) => activeSchemaIds.includes(resolveSchemaUid(schema))),
  [viewSchemas, activeSchemaIds],
);

const handleConfirmAssign = useCallback((recipientId: string) => {
  onAssignSchemas?.({
    schemaUids: selectedSchemas.map(resolveSchemaUid),
    recipientId,
  });
  setAssignmentDialogOpen(false);
}, [onAssignSchemas, selectedSchemas]);
```

### 6.4. Modificar `Item.tsx`

Ruta:

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx
```

Cambios:

- diferenciar visualmente owner/estado/selección:
  - owner: mini punto o borde tenue con color del usuario;
  - selected: borde `ring-2` o fondo `bg-sky-50`;
  - locked: candado visible, no texto dominante.
- mover chips repetidos a línea secundaria compacta.
- no mostrar `Bloqueado` como texto duro salvo que sea relevante.

### 6.5. Modificar `SchemaCollaborationWidget.tsx`

Ruta:

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx
```

Cambios:

- reutilizar el mismo modal `SchemaAssignmentDialog`;
- botón principal: `Gestionar` o `Reasignar`;
- no duplicar owner en co-owners;
- resolver IDs a nombres visibles;
- técnico cerrado por defecto.

---

## 7. Cambios visuales Tailwind

### 7.1. Toolbar del ListView

Reemplazar composición actual por estructura:

```tsx
<div className="flex min-w-0 flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm">
  <div className="flex items-center justify-between gap-2">
    <div className="flex min-w-0 items-center gap-2">
      <Layers className="h-4 w-4 text-slate-500" />
      <div className="min-w-0">
        <div className="text-sm font-bold text-slate-900">Campos</div>
        <div className="text-xs text-slate-500">11/11</div>
      </div>
    </div>

    <div className="flex shrink-0 items-center gap-1">
      {selectedCount > 0 && (
        <button className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-2 text-xs font-semibold text-sky-700">
          <Users className="h-3.5 w-3.5" />
          <span className="hidden xl:inline">Reasignar</span>
        </button>
      )}
      <button className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  </div>
</div>
```

### 7.2. Item seleccionado

```tsx
className={mergeClassNames(
  'group relative rounded-2xl border bg-white px-3 py-2 shadow-sm transition',
  isSelected
    ? 'border-sky-400 bg-sky-50/60 ring-2 ring-sky-100'
    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50',
)}
```

### 7.3. Owner color sin parecer selección

```tsx
<span
  className="absolute left-0 top-3 h-8 w-1 rounded-r-full"
  style={{ backgroundColor: ownerColor || '#CBD5E1' }}
/>
```

---

## 8. CommandBus y persistencia

No mutar directamente desde toolbar.

Crear comando:

```ts
createAssignRecipientCommand({
  schemaUids,
  recipientId,
  previousTemplate,
  nextTemplate,
});
```

Ubicación sugerida:

```txt
src/sisad-pdfme/ui/commands/designerCommands.ts
```

Registrar/exportar desde:

```txt
src/sisad-pdfme/commands/index.ts
```

Si por ahora no existe soporte completo de undo/redo, mínimo usar `createTemplateSnapshotCommand` y dejar TODO técnico para comando dedicado.

---

## 9. Validaciones Playwright

Crear o ampliar:

```txt
tests/e2e/right-sidebar-listview-assignment.spec.ts
```

Casos:

```txt
1. Seleccionar contract_name.
2. Ver botón Reasignar.
3. Click en Reasignar.
4. Modal muestra usuarios disponibles.
5. Seleccionar Empresa.
6. Confirmar.
7. Item muestra Empresa.
8. Canvas cambia color al color de Empresa.
9. DetailView muestra asignado a Empresa.
10. Campo no queda locked/readOnly si antes no lo estaba.
```

Caso múltiple:

```txt
1. Seleccionar contract_name + contract_date.
2. Click Reasignar.
3. Elegir Empresa.
4. Ambos cambian owner.
5. Orden y selección se mantienen.
```

Caso rename:

```txt
1. Header no muestra botón Renombrar principal.
2. Acción Renombrar existe en menú Más.
3. Para un solo campo, Renombrar abre DetailView o input inline.
4. Para múltiples, abre modo bulk rename compacto.
```

---

## 10. Prompt listo para Codex

```txt
Necesito corregir el RightSidebar/ListView del diseñador SISAD PDFME.

Objetivo principal:
- El botón de asignación de usuario debe aparecer solo cuando hay uno o varios schemas seleccionados.
- Al hacer click debe abrir un modal "Reasignar responsable" con la lista de usuarios/recipients disponibles.
- Al confirmar debe cambiar el owner/recipient del schema seleccionado o de todos los seleccionados.
- Debe actualizar Canvas, ListView, DetailView, snapshot y color por usuario.
- No debe cambiar locked, readOnly, objectLocked ni collaborationLock.

También necesito corregir el botón Renombrar:
- No debe estar como acción principal del header.
- Moverlo al menú "Más".
- Si hay un solo schema, renombrar debe abrir edición inline o DetailView > Información del campo.
- Si hay múltiples schemas, puede abrir bulk rename compacto, pero no una textarea gigante que rompa el layout.

Archivos principales:
- src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SchemaAssignmentDialog.tsx
- src/sisad-pdfme/ui/components/Designer/shared/schemaAssignmentService.ts
- src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionState.ts
- src/sisad-pdfme/ui/commands/designerCommands.ts
- src/sisad-pdfme/commands/index.ts

Reglas:
- Usar Tailwind en className o los bridges existentes, sin CSS disperso.
- No tocar Moveable.tsx ni Selecto.tsx.
- No mutar schemas directamente desde UI si existe CommandBus/update centralizado.
- Usar schemaUid como identidad.
- Resolver recipientId/ownerId a nombre visible.
- No mostrar recipient-1 en UI normal.
- Preservar data-testid existentes.
- Mantener drag handle y evitar que acciones de fila propaguen click accidental.
- Diferenciar visualmente: selección real, propietario/color, locked/readOnly.

Resultado esperado:
1. Selecciono un schema.
2. Aparece botón Reasignar.
3. Abre modal con usuarios disponibles.
4. Confirmo nuevo usuario.
5. El item, el canvas y el detalle muestran nuevo usuario/color.
6. El schema no queda bloqueado ni solo lectura por reasignar.
7. Renombrar ya no ocupa espacio principal ni rompe el panel.
8. npm run lint, npm run build y Playwright pasan.
```

---

## 11. Orden de implementación

1. Crear `schemaAssignmentService.ts`.
2. Crear `SchemaAssignmentDialog.tsx`.
3. Conectar props en `ListView.tsx`.
4. Rediseñar `ListViewToolbar.tsx`.
5. Ajustar `Item.tsx`.
6. Reusar modal en `SchemaCollaborationWidget.tsx`.
7. Conectar comando/snapshot.
8. Añadir pruebas.
9. Ejecutar build/lint/Playwright.
