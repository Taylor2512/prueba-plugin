import { compileSisadPdfmeConfig } from '@sisad-pdfme/config/configCompiler';
import type { ResolvedSisadPdfmeConfig, SisadPdfmeGlobalConfig } from '@sisad-pdfme/config/SisadPdfmeConfig';

/**
 * Entrada pública de compilación.
 *
 * Delega en `compileSisadPdfmeConfig`, que además de resolver añade identidad
 * (`revision`, `hash`) y congela `config`/`visibility`. Antes era un alias
 * directo de `resolveSisadPdfmeConfig` y devolvía un objeto mutable sin
 * identidad (RTP-435).
 */
export const createSisadPdfmeConfig = (input: SisadPdfmeGlobalConfig = {}): ResolvedSisadPdfmeConfig =>
  compileSisadPdfmeConfig(input);
