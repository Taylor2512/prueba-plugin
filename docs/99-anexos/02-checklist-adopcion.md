# Checklist de adopción

> Documentación generada para consumo externo de `sisad-pdfme`.

## Integración
- [ ] Definir distribución: alias local, submódulo o paquete privado.
- [ ] Confirmar entrypoints públicos.
- [ ] Definir almacenamiento de template.
- [ ] Definir almacenamiento de PDFs base.
- [ ] Definir documents, recipients, assignments y comments.
- [ ] Definir providers de firma.
- [ ] Definir callbacks del host.

## Designer
- [ ] Contenedor con alto fijo/estable.
- [ ] Engine memoizado.
- [ ] Plugins memoizados.
- [ ] Cleanup diferido.
- [ ] Autosave debounced.
- [ ] Tests de documento/página/selección.

## Form/Viewer/Generate
- [ ] Inputs mapeados por schema.name.
- [ ] Requeridos validados.
- [ ] Viewer estable en scroll.
- [ ] PDF generado coincide con preview.

## Producción
- [ ] Runtime guard sin warnings.
- [ ] Tests unit/e2e pasan.
- [ ] Documentación de backend lista.
- [ ] Versionado/changelog actualizado.
