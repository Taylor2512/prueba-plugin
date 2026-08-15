# Signature adoption contract

Separate three axes:

1. identity:
   - fullName;
   - initials.

2. adoption style:
   - styleId;
   - fontKey;
   - visual recipe.

3. acquisition/execution method:
   - styled;
   - draw;
   - upload;
   - certificate/P12;
   - provider.

`allowedMethods` is not the same thing as the currently selected method.

Provider/certificate metadata is shown only when applicable.

Signature and initials may share the adoption style but produce separate artifacts.

Changing the current profile style does not mutate a previously adopted artifact.

External OneShot-like flows are SignatureProvider implementations, not hardcoded branches.
