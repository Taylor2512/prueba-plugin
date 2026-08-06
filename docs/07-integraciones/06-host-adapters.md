# Adapters del host

## Automáticos

```ts
const adapters = {
  recipients: createRecipientsAdapter(),
  documents: createDocumentsAdapter(),
  signatures: createSignatureProviderAdapter(),
};
```

Las factories actuales no reciben opciones.

## Personalizados

Implemente:

```ts
const recipientsAdapter = {
  toRecipient: (user) => ({
    id: user.userId,
    label: user.fullName,
    email: user.mail,
    color: user.hexColor,
  }),
  toRecipients: (users) => users.map((user) => ({
    id: user.userId,
    label: user.fullName,
    email: user.mail,
    color: user.hexColor,
  })),
};
```

Entréguelo en `resources.adapters`.

En multidocumento, el adapter de documentos debe preservar `template`.
