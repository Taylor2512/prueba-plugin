# Implementación en otro proyecto React

> Documentación generada para consumo externo de `sisad-pdfme`.

## Alias Vite/TS mientras no haya paquete publicado
```ts
resolve: {
  alias: {
    '@sisad-pdfme/ui': path.resolve(__dirname, 'src/sisad-pdfme/ui'),
    '@sisad-pdfme/common': path.resolve(__dirname, 'src/sisad-pdfme/common'),
    '@sisad-pdfme/schemas': path.resolve(__dirname, 'src/sisad-pdfme/schemas'),
    '@sisad-pdfme/generator': path.resolve(__dirname, 'src/sisad-pdfme/generator'),
    '@sisad-pdfme/converter': path.resolve(__dirname, 'src/sisad-pdfme/converter/index.browser.ts')
  }
}
```

## Host mínimo
```tsx
function PdfDesignerHost({ template, onTemplateChange }) {
  const ref = useRef(null);
  const engine = useMemo(() => new DesignerEngineBuilder().build(), []);
  const plugins = useMemo(() => builtInSchemaDefinitions, []);

  useEffect(() => {
    if (!ref.current) return;
    const designer = new Designer({
      domContainer: ref.current,
      template,
      plugins,
      options: { lang: 'es', designerEngine: engine }
    });
    designer.onChangeTemplate?.(onTemplateChange);
    return () => queueMicrotask(() => designer.destroy());
  }, [template.version, engine, plugins]);

  return <div ref={ref} style={{ height: '100%', minHeight: 720 }} />;
}
```

## Reglas del host
- Altura estable para el contenedor.
- Props memoizadas.
- No recrear runtime en scroll.
- Separar estado por documento.
