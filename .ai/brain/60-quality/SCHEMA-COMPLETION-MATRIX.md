# Schema completion matrix

Cada schema registrado se clasifica por `interactionKind`.

Gates según capability:

```text
input      -> edit/clear/codec/validation/touched/dirty
choice     -> atomic selection + false/[] semantics
signing    -> accepted signature/initials + isolation
artifact   -> stable artifact reference + retry/cancel
action     -> accepted action result
computed   -> dependency/system regeneration
visual     -> render/parity/no completion block
complex    -> instance-local editing + codec/validation
```
