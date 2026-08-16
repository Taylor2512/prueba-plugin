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

## Rejected input

Literal secret fields are not accepted by the current contract, including when
wrapped in a migration or compatibility adapter. Hosts must provide `none`,
`inherit`, or `credentialRef` and resolve references at the boundary.
