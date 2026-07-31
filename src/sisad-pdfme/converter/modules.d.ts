/**
 * Declaraciones de módulos para imports especiales del worker de PDF.js.
 *
 * Vite/bundlers permiten importar archivos con `?url` para obtener
 * la URL pública del asset. TypeScript no conoce ese sufijo por defecto,
 * por eso se declara aquí.
 */
declare module 'pdfjs-dist//build/pdf.worker.min.js?url' {
  const workerUrl: string;
  export default workerUrl;
}

/**
 * Declaración para el worker usado en la variante Node.
 */
declare module 'pdfjs-dist//build/pdf.worker.js' {
  const workerSrc: string;
  export default workerSrc;
}
