# Guide — Project tools

Start with:

```bash
npm run docs -- doctor .
```

For cleanup:

```bash
npm run docs -- sanitize .
npm run docs -- sanitize . --apply
npm run docs -- index .
npm run docs -- links .
npm run docs -- validate .
```

For overlay/package integration use `npm run docs -- import .`.

Never use destructive sync (`--delete`) for `.ai` architecture.
