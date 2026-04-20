# SISAD PDFME

Editor visual de PDFs basado en React, Vite y una integración modificada de `sisad-pdfme`. El proyecto combina un canvas editable, runtime de formularios, generación de PDF, conversión de documentos y soporte de colaboración.

## Qué hay aquí

- `src/sisad-pdfme/common`: contratos, helpers y tipos compartidos.
- `src/sisad-pdfme/converter`: conversión PDF e imágenes.
- `src/sisad-pdfme/generator`: generación final de PDFs.
- `src/sisad-pdfme/pdf-lib`: fork o adaptación de bajo nivel para PDF.
- `src/sisad-pdfme/schemas`: catálogo de campos y plugins.
- `src/sisad-pdfme/ui`: diseñador, visor, formularios y componentes del editor.
- `src/features/sisad-pdfme`: laboratorio y demo de la aplicación.

## Dónde empezar

- [docs/README.md](docs/README.md): entrada principal a la documentación.
- [docs/90-indice-verdad-actual.md](docs/90-indice-verdad-actual.md): documentación respaldada por el código actual.
- [docs/91-indice-conceptual.md](docs/91-indice-conceptual.md): visión conceptual y funcional.
- [docs/93-indice-roadmap-plataforma.md](docs/93-indice-roadmap-plataforma.md): roadmap de plataforma y empaquetado.
- [docs/96-sisad-pdfme-overview.md](docs/96-sisad-pdfme-overview.md): resumen técnico histórico de la plataforma.
- [docs/97-indice-generado.md](docs/97-indice-generado.md): índice generado para búsqueda histórica.
- [docs/reference/README.md](docs/reference/README.md): material histórico y archivo de apoyo.
- [documentacion-unificada.md](documentacion-unificada.md): volcado unificado generado automáticamente, útil solo como archivo histórico.

## Proceso actual importante

La carga múltiple de PDF se resuelve en [src/sisad-pdfme/ui/components/Designer/index.tsx](src/sisad-pdfme/ui/components/Designer/index.tsx) y el motor de configuración real vive en [src/sisad-pdfme/ui/designerEngine.ts](src/sisad-pdfme/ui/designerEngine.ts).

## Scripts útiles

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test
npm run test:e2e
```

## Verificación rápida

- El árbol actual no está organizado como monorepo con workspaces.
- Las propuestas de `platform/pdf` son roadmap, no implementación actual.
- La verdad operativa está en `src/sisad-pdfme/*` y en la cuarta tanda de documentación.
