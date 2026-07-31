# Checklist de aceptación

## Inventario

- [ ] Todas las coincidencias están clasificadas.
- [ ] Se identificaron exports públicos.
- [ ] Se identificaron valores persistidos.
- [ ] Se identificaron rutas de terceros.
- [ ] Se excluyeron backups/reportes históricos sin ocultar código activo.

## Naming

- [ ] No quedan identifiers internos con `Canonical`.
- [ ] No quedan identifiers internos con `Legacy`.
- [ ] Los formatos antiguos usan V1/V2/V3/preV2.
- [ ] Los bridges nombran origen y destino.
- [ ] Los resolvers nombran el concepto resuelto.
- [ ] Los archivos activos no usan `canonicalize` ni `legacy` salvo migración versionada.

## Compatibilidad

- [ ] Config V1/deprecada migra a Config V2.
- [ ] Snapshot anterior se importa.
- [ ] Snapshot actual hace round-trip.
- [ ] `__designer` V2 migra a V3.
- [ ] `__commentAnchors` se lee mientras dure la ventana.
- [ ] callbacks `onX` conservan paridad.
- [ ] provider `'legacy'` migra a `'websocket'`.
- [ ] aliases públicos tienen `@deprecated` y fecha de retiro.

## Excepciones

- [ ] `pdfjs-dist/legacy/**` está allowlisted por string exacto.
- [ ] Ninguna carpeta completa está excluida solo para ocultar la palabra.
- [ ] Vendor y generated están identificados.

## Gates

- [ ] lint.
- [ ] build.
- [ ] dead-code.
- [ ] jscpd.
- [ ] architecture.
- [ ] unit config.
- [ ] unit runtime/events.
- [ ] unit snapshot/migration.
- [ ] unit comments.
- [ ] unit collaboration.
- [ ] Playwright focal.
- [ ] audit de nomenclatura strict.

## Entrega

- [ ] Rename map final.
- [ ] Compat aliases report.
- [ ] Breaking changes report.
- [ ] Migration guide.
- [ ] Memory delta.
- [ ] Próxima major claramente definida.
