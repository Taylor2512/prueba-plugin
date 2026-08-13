import { createContext } from 'react';
import type { SisadPdfmeProviderValue } from '../config/SisadPdfmeConfig.js';

/**
 * Contexto del provider de sisad-pdfme.
 *
 * Vive en su propio módulo, separado de `SisadPdfmeProvider.tsx`: exportar el
 * contexto junto al componente rompía el Fast Refresh del provider
 * (`react-refresh/only-export-components`), que al recargarse habría
 * reconstruido el contexto y desmontado todo el árbol del designer.
 */
export const SisadPdfmeContext = createContext<SisadPdfmeProviderValue | null>(null);
