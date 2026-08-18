import { expect, type Page } from '@playwright/test';
import { desenfocar, escribirCampo } from './interactions';

/**
 * Contrato de campos del Form del laboratorio.
 *
 * Los identificadores los publica el renderer a partir del nombre del schema
 * (`#<tipo base>-<nombre>-<índice>`), así que son un contrato del producto y no
 * un detalle de layout. Se centralizan aquí porque cinco specs distintos los
 * necesitaban y cada uno mantenía su propia copia.
 */
export const CAMPOS = {
  text: '#text-text-0',
  number: '#text-number-1',
  fullName: '#text-fullName-2',
  email: '#text-emailAddress-3',
  company: '#text-company-4',
  title: '#text-title-5',
  multiVariable: '#text-multiVariableText-6',
  dateSigned: '#text-dateSigned-9',
  dateTime: '#text-dateTime-10',
  date: '#text-date-11',
  time: '#text-time-12',
} as const;

/** Schemas no textuales: se comprueba presencia e interacción, no tecleo. */
export const NO_TEXTUALES = {
  signature: '#signature-7',
  initials: '#initials-8',
  select: '#select-13',
  attachment: '#attachment-14',
  note: '#note-15',
  approve: '#approve-16',
  decline: '#decline-17',
  selectSecundario: '#select-18',
  dropdown: '#dropdown-19',
  radioGroup: '#radioGroup-20',
  checkboxGroup: '#checkboxGroup-21',
} as const;

export type ClaveCampo = keyof typeof CAMPOS;

/** Fija el valor de un campo por clave y confirma saliendo del campo. */
export async function fijar(page: Page, clave: ClaveCampo, valor: string): Promise<void> {
  await escribirCampo(page.locator(CAMPOS[clave]), valor);
  await desenfocar(page);
}

/** Comprueba varios campos a la vez; el mensaje nombra el campo que falla. */
export async function esperarValores(
  page: Page,
  esperado: Partial<Record<ClaveCampo, string>>,
): Promise<void> {
  for (const [clave, valor] of Object.entries(esperado) as [ClaveCampo, string][]) {
    await expect(page.locator(CAMPOS[clave]), `campo ${clave}`).toHaveText(valor);
  }
}

export const selectorUsuario = (page: Page) => page.getByTestId('lab-active-user-select');
export const selectorDocumento = (page: Page) => page.getByTestId('lab-active-document-select');

export async function cambiarUsuario(page: Page, userId: string): Promise<void> {
  await selectorUsuario(page).selectOption(userId);
  await expect(selectorUsuario(page)).toHaveValue(userId);
}

export async function cambiarDocumento(page: Page, documentId: string): Promise<void> {
  await selectorDocumento(page).selectOption(documentId);
  await expect(selectorDocumento(page)).toHaveValue(documentId);
}

/**
 * Lee el estado de interacción que expone el MODELO, no el DOM del campo.
 *
 * El shell inmersivo mantiene el panel plegado y, abierto, cubre el área de
 * edición. Por eso se abre sólo para leer y se cierra por teclado: así el gate
 * observa el modelo sin alterar cómo se interactúa con el formulario.
 */
export async function leerInteraccion(
  page: Page,
  schemaName: string,
  atributos: string[],
): Promise<Record<string, string | null>> {
  await page.getByTestId('-info-toggle').click();
  const fila = page.getByTestId(`lab-interaction-${schemaName}`);
  await expect(fila).toHaveCount(1);

  const resultado: Record<string, string | null> = {};
  for (const atributo of atributos) {
    resultado[atributo] = await fila.getAttribute(atributo);
  }

  // El drawer es un diálogo modal: su overlay cubre el botón que lo abrió, así
  // que se cierra por teclado, que es como lo cerraría un usuario.
  await page.getByTestId('-info-panel').press('Escape');
  await expect(page.getByTestId('-info-panel')).toHaveCount(0);
  return resultado;
}
