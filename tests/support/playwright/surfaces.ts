import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Contratos de superficie de cada runtime.
 *
 * Antes existía un único `abrirSisad()` que exigía `.sisad-pdfme-root` para
 * CUALQUIER ruta. Esa clase sólo está declarada en `ui/styles/sisad-pdfme.css`:
 * ningún componente la aplica. Lo que los wrappers publican realmente es el
 * atributo `data-sisad-pdfme-root` con el modo (`designer` | `form` |
 * `viewer`), así que la precondición universal fallaba siempre aunque la
 * pantalla hubiera montado correctamente.
 *
 * La regla que sustituye a aquella: cada superficie espera SU propio contrato
 * funcional observable, no una clase de layout compartida.
 */

/** Marcadores públicos que publica cada wrapper React. */
export const raiz = {
  designer: '[data-sisad-pdfme-root="designer"]',
  form: '[data-sisad-pdfme-root="form"]',
  viewer: '[data-sisad-pdfme-root="viewer"]',
} as const;

export const selectores = {
  /** Nodo interno del runtime imperativo; identidad de la instancia montada. */
  hostRuntime: '.sisad-pdfme-lab-runtime-host',
  paginaCanvas: '[data-canvas-page="true"]',
  canvasDesigner: '.sisad-pdfme-designer-canvas',
  schema: '[data-schema-id][data-schema-type]',
  catalogoArrastrable: 'button[data-schema-type][aria-roledescription="draggable"]',
} as const;

const navegar = async (page: Page, ruta: string): Promise<void> => {
  const response = await page.goto(ruta, { waitUntil: 'domcontentloaded' });
  expect(response, `La ruta ${ruta} debe responder`).not.toBeNull();
  if (response) expect(response.status(), `HTTP de ${ruta}`).toBeLessThan(400);
};

/**
 * Designer: el contrato es que exista el árbol del diseñador Y al menos una
 * página de canvas pintada. Sin página no hay superficie sobre la que soltar
 * nada, así que esperar sólo la raíz dejaría pasar tests que fallarían después
 * por carrera de montaje.
 */
export async function abrirDesigner(page: Page, ruta = '/designer/multi-user'): Promise<void> {
  await navegar(page, ruta);
  await expect(page.locator(raiz.designer).first()).toBeVisible();
  await expect(page.locator(selectores.paginaCanvas).first()).toBeVisible();
}

/**
 * Form: raíz en modo `form` más el host del runtime imperativo. No se exige
 * canvas: el Form puede montar sin páginas visibles según el perfil.
 */
export async function abrirForm(page: Page, ruta = '/runtime/form'): Promise<void> {
  await navegar(page, ruta);
  await expect(page.locator(raiz.form).first()).toBeVisible();
  await expect(page.locator(selectores.hostRuntime).first()).toBeVisible();
}

/** Viewer: misma superficie que Form pero en modo de sólo lectura. */
export async function abrirViewer(page: Page, ruta = '/runtime/viewer'): Promise<void> {
  await navegar(page, ruta);
  await expect(page.locator(raiz.viewer).first()).toBeVisible();
  await expect(page.locator(selectores.hostRuntime).first()).toBeVisible();
}

/**
 * Runtime genérico: para rutas cuyo modo se decide por perfil y el test no
 * necesita fijarlo. Sigue siendo un contrato real —hay un runtime montado—,
 * no un comodín que acepte cualquier página.
 */
export async function abrirRuntime(page: Page, ruta: string): Promise<void> {
  await navegar(page, ruta);
  await expect(page.locator('[data-sisad-pdfme-root]').first()).toBeVisible();
  await expect(page.locator(selectores.hostRuntime).first()).toBeVisible();
}

/** Página de canvas por índice, ya verificada como visible. */
export async function paginaCanvas(page: Page, indice = 0): Promise<Locator> {
  const paginas = page.locator(selectores.paginaCanvas);
  await expect(paginas.first()).toBeVisible();
  await expect
    .poll(() => paginas.count(), { message: `Debe existir la página ${indice}` })
    .toBeGreaterThan(indice);
  return paginas.nth(indice);
}

/** Cuenta de instancias del runtime: sirve para detectar remontajes. */
export async function instanciasRuntime(page: Page): Promise<number> {
  return page.locator(selectores.hostRuntime).count();
}
