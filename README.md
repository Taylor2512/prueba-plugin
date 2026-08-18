# SISAD-PDFME tooling architecture cleanup

Overlay para consolidar `scripts`, `tools` y la arquitectura Markdown del repositorio
`prueba-plugin`.

No ejecuta automáticamente la limpieza del repositorio del usuario.

## Primero

```bash
node scripts/install-project-tools.mjs \
  "/Users/desarrollo1/Documents/proyectos de Taylor/frontend/prueba-plugin"
```

Eso es dry-run.

Después de revisar:

```bash
node scripts/install-project-tools.mjs \
  "/Users/desarrollo1/Documents/proyectos de Taylor/frontend/prueba-plugin" \
  --apply
```

Luego:

```bash
cd "/Users/desarrollo1/Documents/proyectos de Taylor/frontend/prueba-plugin"
npm run tools:doctor
npm run docs:sanitize
```

No ejecutar `docs:sanitize:apply` hasta revisar las colisiones.

<!-- project-tools:navigation:start -->

## Navegación generada

### Secciones

- [.ai](.ai/README.md)
- [Claude adapter](.claude/README.md)
- [Codex adapter](.codex/README.md)
- [Documentación de `sisad-pdfme`](./docs/README.md)

### Notas

- [AGENTS.md — SISAD-PDFME](./AGENTS.md)
- [Claude Code — adaptador](./CLAUDE.md)
- [Codex — adaptador](./CODEX.md)

<!-- project-tools:navigation:end -->
