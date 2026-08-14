import { expect, test, type Page } from '@playwright/test';

/**
 * Aislamiento entre siblings del Form.
 *
 * Cubre la regresión del incidente "selective sibling rollback": editar un
 * campo no puede alterar el valor canónico de otro. Los campos se eligen para
 * cruzar plugins distintos, porque el defecto original separaba justamente los
 * schemas que reutilizan el `ui` de otro plugin (`fullName`, `company`,
 * `title`) de los que lo definen (`text`, `number`).
 */

const F = {
  text: '#text-text-0',
  number: '#text-number-1',
  fullName: '#text-fullName-2',
  email: '#text-emailAddress-3',
  company: '#text-company-4',
  title: '#text-title-5',
} as const;

type FieldKey = keyof typeof F;

const blur = (page: Page) => page.locator('body').click({ position: { x: 5, y: 5 } });

const setValue = async (page: Page, key: FieldKey, value: string) => {
  await page.locator(F[key]).click();
  await page.keyboard.press('ControlOrMeta+a');
  if (value === '') {
    await page.keyboard.press('Delete');
  } else {
    await page.keyboard.type(value);
  }
  await blur(page);
};

const expectAll = async (page: Page, expected: Partial<Record<FieldKey, string>>) => {
  for (const [key, value] of Object.entries(expected) as [FieldKey, string][]) {
    await expect(page.locator(F[key])).toHaveText(value);
  }
};

test.beforeEach(async ({ page }) => {
  await page.goto('/runtime/form');
  await page.waitForSelector(F.text);
});

test('20 ediciones alternadas convergen en todos los campos', async ({ page }) => {
  const order: FieldKey[] = ['text', 'number', 'fullName', 'company'];
  const expected: Partial<Record<FieldKey, string>> = {};
  // `number` normaliza el contenido no numérico, así que recibe dígitos.
  const valueFor = (key: FieldKey, round: number) =>
    key === 'number' ? `${round}0` : `${key.slice(0, 2)}${round}`;

  for (let round = 1; round <= 5; round += 1) {
    for (const key of order) {
      const value = valueFor(key, round);
      await setValue(page, key, value);
      expected[key] = value;
      await expectAll(page, expected);
    }
  }
});

test('escritura rápida encadenada sin esperar entre campos', async ({ page }) => {
  await setValue(page, 'text', 'A1');
  await setValue(page, 'fullName', 'C1');
  await setValue(page, 'company', 'D1');
  await setValue(page, 'text', 'A2');

  await expectAll(page, { text: 'A2', fullName: 'C1', company: 'D1' });
});

test('borrar un campo y volver a escribirlo no arrastra a sus siblings', async ({ page }) => {
  await setValue(page, 'fullName', 'Primero');
  await setValue(page, 'company', 'Compania');

  await setValue(page, 'fullName', '');
  await expectAll(page, { fullName: '', company: 'Compania' });

  await setValue(page, 'fullName', 'Segundo');
  await expectAll(page, { fullName: 'Segundo', company: 'Compania' });
});

test('un vacío intencional sobrevive a la edición de un sibling', async ({ page }) => {
  await setValue(page, 'company', '');
  await expectAll(page, { company: '' });

  await setValue(page, 'text', 'algo');

  // No debe repintarse con el valor inicial del template.
  await expectAll(page, { company: '', text: 'algo' });
});

test('el cero sobrevive a la edición de un sibling', async ({ page }) => {
  await setValue(page, 'number', '0');
  await setValue(page, 'text', 'x');

  await expectAll(page, { number: '0', text: 'x' });
});

test('transiciones entre plugins distintos preservan ambos valores', async ({ page }) => {
  // text -> number -> text
  await setValue(page, 'text', 't1');
  await setValue(page, 'number', '77');
  await setValue(page, 'text', 't2');
  await expectAll(page, { text: 't2', number: '77' });

  // text -> textLike -> text
  await setValue(page, 'fullName', 'Ada');
  await setValue(page, 'text', 't3');
  await expectAll(page, { text: 't3', fullName: 'Ada', number: '77' });

  // textLike -> textLike
  await setValue(page, 'title', 'Cargo');
  await expectAll(page, { fullName: 'Ada', title: 'Cargo' });
});

test('los cuatro presets textLike son independientes entre sí', async ({ page }) => {
  await setValue(page, 'fullName', 'N');
  await setValue(page, 'email', 'E');
  await setValue(page, 'company', 'C');
  await setValue(page, 'title', 'T');

  await expectAll(page, { fullName: 'N', email: 'E', company: 'C', title: 'T' });
});

test('escribir no remonta la instancia del runtime', async ({ page }) => {
  // Se marca el host del runtime, no los nodos de campo: el renderer imperativo
  // reconstruye el DOM de cada schema por diseño, pero la instancia debe vivir.
  const before = await page.evaluate(() => {
    const hosts = Array.from(document.querySelectorAll('.sisad-pdfme-lab-runtime-host'));
    hosts.forEach((el, i) => { (el as HTMLElement).dataset.rtpHost = String(i); });
    return hosts.length;
  });
  expect(before).toBeGreaterThan(0);

  await setValue(page, 'text', 'uno');
  await setValue(page, 'fullName', 'dos');
  await setValue(page, 'company', 'tres');

  const after = await page.evaluate(() => ({
    total: document.querySelectorAll('.sisad-pdfme-lab-runtime-host').length,
    marked: document.querySelectorAll('.sisad-pdfme-lab-runtime-host[data-rtp-host]').length,
  }));

  expect(after.total).toBe(before);
  expect(after.marked).toBe(before);
});

/**
 * Los schemas de opción (`select`, `radioGroup`, `checkboxGroup`) también
 * pasan por `text.ui`, así que entran en la misma composición de plugins que
 * rompía a los presets `textLike`. Aquí solo se comprueba el aislamiento entre
 * familias: la semántica propia de cada una queda fuera de este incidente.
 */
const optionSelects = (page: Page) => page.locator('.sisad-pdfme-lab-runtime-host select');

test('alternar entre texto y schemas de opción preserva ambos lados', async ({ page }) => {
  const select = optionSelects(page).first();

  // text -> select
  await setValue(page, 'text', 'A1');
  await select.selectOption('option1');
  await expect(select).toHaveValue('option1');
  await expectAll(page, { text: 'A1' });

  // select -> text
  await setValue(page, 'fullName', 'C1');
  await expect(select).toHaveValue('option1');
  await expectAll(page, { text: 'A1', fullName: 'C1' });

  // number -> checkbox -> text
  await setValue(page, 'number', '7');
  const checkbox = page.locator('[role="checkbox"]').first();
  await checkbox.click();
  await expect(checkbox).toHaveAttribute('aria-checked', 'true');

  await setValue(page, 'company', 'D1');

  await expect(select).toHaveValue('option1');
  await expect(checkbox).toHaveAttribute('aria-checked', 'true');
  await expectAll(page, { text: 'A1', fullName: 'C1', number: '7', company: 'D1' });
});

test('la selección de un schema de opción sobrevive a editar un sibling de texto', async ({ page }) => {
  const select = optionSelects(page).first();
  await select.selectOption('option2');
  await expect(select).toHaveValue('option2');

  for (const key of ['text', 'fullName', 'company', 'title'] as FieldKey[]) {
    await setValue(page, key, `${key}-x`);
    await expect(select).toHaveValue('option2');
  }
});

test('un sibling nunca tocado conserva su valor inicial del template', async ({ page }) => {
  await expect(page.locator(F.title)).toHaveText('Analista senior');

  await setValue(page, 'text', 'a');
  await setValue(page, 'fullName', 'b');
  await setValue(page, 'company', 'c');

  await expect(page.locator(F.title)).toHaveText('Analista senior');
});
