# Adaptadores del host

El host debe convertir sus datos reales a contratos genéricos.

## Recipient

```ts
type SisadPdfmeRecipient = {
  id: string;
  label: string;
  role?: string;
  email?: string;
  color?: string;
  metadata?: Record<string, unknown>;
};
```

## Regla

El host entrega recipients una vez. El componente los registra en `RecipientRegistry` y los reutiliza en Canvas, schema creation, RightSidebar, DetailView, AssignmentDialog, Form, Viewer, Snapshot y eventos.

## No hacer

- No crear mapas locales de recipients en cada pantalla.
- No crear un modal de reasignación propio.
- No duplicar owner color resolvers.
