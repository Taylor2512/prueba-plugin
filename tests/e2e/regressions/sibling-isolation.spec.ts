import { expect, test } from '@playwright/test';
import {
  abrirForm,
  CAMPOS,
  esperarValores,
  fijar,
  instanciasRuntime,
  selectores,
  type ClaveCampo,
} from '../../support/playwright';

/**
 * Regresión "selective sibling rollback": editar un campo no puede alterar el
 * valor canónico de otro.
 *
 * Los campos se eligen para cruzar plugins distintos, porque el defecto
 * original separaba justamente los schemas que reutilizan el `ui` de otro
 * plugin (`fullName`, `company`, `title`) de los que lo definen (`text`,
 * `number`).
 *
 * Corre sobre `/runtime/form`, no sobre `digital-agreements`: es la plantilla
 * mínima donde apareció el defecto. La matriz completa de familias está en
 * `tests/e2e/form/digital-agreements/aislamiento-siblings.spec.ts`.
 */
test.beforeEach(async ({ page }) => {
  await abrirForm(page, '/runtime/form');
  await expect(page.locator(CAMPOS.text)).toBeVisible();
});

test('20 ediciones alternadas convergen en todos los campos', async ({ page }) => {
  const orden: ClaveCampo[] = ['text', 'number', 'fullName', 'company'];
  const esperado: Partial<Record<ClaveCampo, string>> = {};
  // `number` normaliza el contenido no numérico, así que recibe dígitos.
  const valorDe = (clave: ClaveCampo, ronda: number) =>
    clave === 'number' ? `${ronda}0` : `${clave.slice(0, 2)}${ronda}`;

  for (let ronda = 1; ronda <= 5; ronda += 1) {
    for (const clave of orden) {
      const valor = valorDe(clave, ronda);
      await fijar(page, clave, valor);
      esperado[clave] = valor;
      await esperarValores(page, esperado);
    }
  }
});

test('escritura rápida encadenada sin esperar entre campos', async ({ page }) => {
  await fijar(page, 'text', 'A1');
  await fijar(page, 'fullName', 'C1');
  await fijar(page, 'company', 'D1');
  await fijar(page, 'text', 'A2');

  await esperarValores(page, { text: 'A2', fullName: 'C1', company: 'D1' });
});

test('borrar un campo y volver a escribirlo no arrastra a sus siblings', async ({ page }) => {
  await fijar(page, 'fullName', 'Primero');
  await fijar(page, 'company', 'Compania');

  await fijar(page, 'fullName', '');
  await esperarValores(page, { fullName: '', company: 'Compania' });

  await fijar(page, 'fullName', 'Segundo');
  await esperarValores(page, { fullName: 'Segundo', company: 'Compania' });
});

test('un vacío intencional sobrevive a la edición de un sibling', async ({ page }) => {
  await fijar(page, 'company', '');
  await esperarValores(page, { company: '' });

  await fijar(page, 'text', 'algo');

  // No debe repintarse con el valor inicial del template.
  await esperarValores(page, { company: '', text: 'algo' });
});

test('el cero sobrevive a la edición de un sibling', async ({ page }) => {
  await fijar(page, 'number', '0');
  await fijar(page, 'text', 'x');

  await esperarValores(page, { number: '0', text: 'x' });
});

test('transiciones entre plugins distintos preservan ambos valores', async ({ page }) => {
  // text -> number -> text
  await fijar(page, 'text', 't1');
  await fijar(page, 'number', '77');
  await fijar(page, 'text', 't2');
  await esperarValores(page, { text: 't2', number: '77' });

  // text -> textLike -> text
  await fijar(page, 'fullName', 'Ada');
  await fijar(page, 'text', 't3');
  await esperarValores(page, { text: 't3', fullName: 'Ada', number: '77' });

  // textLike -> textLike
  await fijar(page, 'title', 'Cargo');
  await esperarValores(page, { fullName: 'Ada', title: 'Cargo' });
});

test('los cuatro presets textLike son independientes entre sí', async ({ page }) => {
  await fijar(page, 'fullName', 'N');
  await fijar(page, 'email', 'E');
  await fijar(page, 'company', 'C');
  await fijar(page, 'title', 'T');

  await esperarValores(page, { fullName: 'N', email: 'E', company: 'C', title: 'T' });
});

test('escribir no remonta la instancia del runtime', async ({ page }) => {
  const antes = await instanciasRuntime(page);
  expect(antes).toBeGreaterThan(0);

  await fijar(page, 'text', 'uno');
  await fijar(page, 'fullName', 'dos');
  await fijar(page, 'company', 'tres');

  expect(await instanciasRuntime(page)).toBe(antes);
});

/**
 * Los schemas de opción (`select`, `radioGroup`, `checkboxGroup`) también pasan
 * por `text.ui`, así que entran en la misma composición de plugins que rompía a
 * los presets `textLike`. Aquí sólo se comprueba el aislamiento entre familias:
 * la semántica propia de cada una queda fuera de este incidente.
 */
const selectsDeOpcion = (page: import('@playwright/test').Page) =>
  page.locator(`${selectores.hostRuntime} select`);

test('alternar entre texto y schemas de opción preserva ambos lados', async ({ page }) => {
  const select = selectsDeOpcion(page).first();

  // text -> select
  await fijar(page, 'text', 'A1');
  await select.selectOption('option1');
  await expect(select).toHaveValue('option1');
  await esperarValores(page, { text: 'A1' });

  // select -> text
  await fijar(page, 'fullName', 'C1');
  await expect(select).toHaveValue('option1');
  await esperarValores(page, { text: 'A1', fullName: 'C1' });

  // number -> checkbox -> text
  await fijar(page, 'number', '7');
  const checkbox = page.locator('[role="checkbox"]').first();
  await checkbox.click();
  await expect(checkbox).toHaveAttribute('aria-checked', 'true');

  await fijar(page, 'company', 'D1');

  await expect(select).toHaveValue('option1');
  await expect(checkbox).toHaveAttribute('aria-checked', 'true');
  await esperarValores(page, { text: 'A1', fullName: 'C1', number: '7', company: 'D1' });
});

test('la selección de un schema de opción sobrevive a editar un sibling de texto', async ({
  page,
}) => {
  const select = selectsDeOpcion(page).first();
  await select.selectOption('option2');
  await expect(select).toHaveValue('option2');

  for (const clave of ['text', 'fullName', 'company', 'title'] as ClaveCampo[]) {
    await fijar(page, clave, `${clave}-x`);
    await expect(select).toHaveValue('option2');
  }
});

test('un sibling nunca tocado conserva su valor inicial del template', async ({ page }) => {
  await expect(page.locator(CAMPOS.title)).toHaveText('Analista senior');

  await fijar(page, 'text', 'a');
  await fijar(page, 'fullName', 'b');
  await fijar(page, 'company', 'c');

  await expect(page.locator(CAMPOS.title)).toHaveText('Analista senior');
});
