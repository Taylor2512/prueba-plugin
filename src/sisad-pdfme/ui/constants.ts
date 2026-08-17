/**
 * Constantes visuales y de runtime UI.
 *
 * Rol arquitectónico:
 * - Centraliza valores base para idioma, errores, clases CSS, dimensiones de layout,
 *   separación de páginas, sidebars, fondo y zoom máximo.
 *
 * Regla:
 * - No agregar aquí configuración de negocio ni valores específicos de un host.
 * - Cambios en PAGE_GAP, sidebar widths o class prefixes pueden afectar tests visuales.
 */

import type { Lang } from '@sisad-pdfme/common';

/**
 * Idioma por defecto del runtime UI y ÚNICA autoridad del fallback de idioma.
 *
 * Ninguna otra capa debe declarar su propio default (`?? 'en'`, `|| 'es'`, …):
 * si necesitas resolver un idioma posiblemente inválido usa `resolveLang` de
 * `@sisad-pdfme/ui/i18n`, que ya cae aquí.
 */
export const DEFAULT_LANG: Lang = 'es';

export const DESTROYED_ERR_MSG = '[@sisad-pdfme/ui] this instance is already destroyed';

export const SELECTABLE_CLASSNAME = 'selectable';

export const RULER_HEIGHT = 22;

export const PAGE_GAP = 10;

export const LEFT_SIDEBAR_WIDTH = 45;

export const RIGHT_SIDEBAR_WIDTH = 320;

export const DEFAULT_MAX_ZOOM = 2;

export const DESIGNER_CLASSNAME = 'sisad-pdfme-designer-';

export const UI_CLASSNAME = 'sisad-pdfme-ui-';
