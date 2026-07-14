import { resolveSisadPdfmeConfig } from './resolveSisadPdfmeConfig.js';
import type { ResolvedSisadPdfmeConfig, SisadPdfmeGlobalConfig } from './SisadPdfmeConfig.js';

export const createSisadPdfmeConfig = (input: SisadPdfmeGlobalConfig = {}): ResolvedSisadPdfmeConfig =>
  resolveSisadPdfmeConfig(input);
