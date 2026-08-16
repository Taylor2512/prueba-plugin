# Credential reference contract

## Security invariant

Serializable templates/snapshots must never require literal bearer tokens, API keys,
passwords, authorization headers or private provider secrets.

## Preferred model

```ts
type HostAuthReference =
  | { mode: 'inherit' }
  | { mode: 'credentialRef'; credentialRef: string }
  | { mode: 'none' };
```

The host resolves `credentialRef` into runtime transport configuration.

## Runtime rule

- credential resolution happens at the integration boundary;
- resolved credentials are ephemeral;
- resolved credentials are not written to schema metadata;
- resolved credentials are not serialized into snapshots;
- credentials are never forwarded to an arbitrary origin without explicit host policy.

## Compatibility

Legacy literal fields may be read only through a narrow migration/compatibility adapter
until removed. They are not the canonical product API.
