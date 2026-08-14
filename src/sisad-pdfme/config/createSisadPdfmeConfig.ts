import { compileSisadPdfmeConfig } from './configCompiler.js';
import type { ResolvedSisadPdfmeConfig, SisadPdfmeGlobalConfig } from './SisadPdfmeConfig.js';

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
