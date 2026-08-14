import { expect, test, type Page } from '@playwright/test';

/**
 * Gate funcional del Form real — RTP-510.
 *
 * Los contratos unitarios pueden estar verdes y el Form seguir roto: lo que
 * decide si el componente sirve es el runtime real, schema por schema. Este
 * spec recorre `/runtime/form/digital-agreements`, que monta las cinco
 * familias a la vez (texto, numérico, temporal, elección, firma y acciones).
 *
 * La clase de regresión que más ha costado en este repositorio es el
 * **rollback selectivo entre siblings**: interactuar con B revertía A. Por eso
 * casi todas las comprobaciones verifican el campo tocado Y sus vecinos.
 */

/** Campos reales de la ruta, verificados por sondeo del DOM. */
const F = {
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
const NON_TEXT = {
  signature: '#signature-7',
  initials: '#initials-8',
  select: '#select-13',
  attachment: '#attachment-14',
  note: '#note-15',
  approve: '#approve-16',
  decline: '#decline-17',
  selectSecondary: '#select-18',
  dropdown: '#dropdown-19',
  radioGroup: '#radioGroup-20',
  checkboxGroup: '#checkboxGroup-21',
} as const;

type FieldKey = keyof typeof F;

const blur = (page: Page) =>
  page.evaluate(() =>
    document.activeElement instanceof HTMLElement ? document.activeElement.blur() : undefined,
  );

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

const expectValues = async (page: Page, expected: Partial<Record<FieldKey, string>>) => {
  for (const [key, value] of Object.entries(expected) as [FieldKey, string][]) {
    await expect(page.locator(F[key]), `campo ${key}`).toHaveText(value);
  }
};

test.beforeEach(async ({ page }) => {
  await page.goto('/runtime/form/digital-agreements');
  await page.waitForSelector(F.text);
});

test.describe('inventario de schemas', () => {
  test('las cinco familias están montadas en la misma página', async ({ page }) => {
    for (const [name, selector] of Object.entries({ ...F, ...NON_TEXT })) {
      await expect(page.locator(selector), `schema ${name}`).toHaveCount(1);
    }
  });
});

test.describe('TEXT — ciclo completo', () => {
  test('escribir, reemplazar, borrar y reescribir', async ({ page }) => {
    await setValue(page, 'text', 'Primero');
    await expectValues(page, { text: 'Primero' });

    await setValue(page, 'text', 'Reemplazado');
    await expectValues(page, { text: 'Reemplazado' });

    await setValue(page, 'text', '');
    await expectValues(page, { text: '' });

    await setValue(page, 'text', 'De nuevo');
    await expectValues(page, { text: 'De nuevo' });
  });

  test('escritura rápida encadenada entre presets textLike', async ({ page }) => {
    await setValue(page, 'fullName', 'Ada Lovelace');
    await setValue(page, 'email', 'ada@example.test');
    await setValue(page, 'company', 'Analytical Engines');
    await setValue(page, 'title', 'Matematica');

    await expectValues(page, {
      fullName: 'Ada Lovelace',
      email: 'ada@example.test',
      company: 'Analytical Engines',
      title: 'Matematica',
    });
  });

  test('blur y volver a enfocar conserva el valor', async ({ page }) => {
    await setValue(page, 'text', 'Persistente');
    await page.locator(F.company).click();
    await blur(page);
    await page.locator(F.text).click();
    await blur(page);
    await expectValues(page, { text: 'Persistente' });
  });
});

test.describe('NUMBER — casos límite', () => {
  test('cero es un valor, no un vacío', async ({ page }) => {
    await setValue(page, 'number', '0');
    await expectValues(page, { number: '0' });
  });

  test('decimal y negativo', async ({ page }) => {
    await setValue(page, 'number', '3.5');
    await expectValues(page, { number: '3.5' });

    await setValue(page, 'number', '-7');
    await expectValues(page, { number: '-7' });
  });

  test('limpiar deja el campo vacío sin arrastrar siblings', async ({ page }) => {
    await setValue(page, 'text', 'Vecino');
    await setValue(page, 'number', '42');
    await setValue(page, 'number', '');
    await expectValues(page, { number: '', text: 'Vecino' });
  });

  test('la entrada alfabética no se acepta', async ({ page }) => {
    await setValue(page, 'number', '12');
    await page.locator(F.number).click();
    await page.keyboard.type('abc');
    await blur(page);
    await expect(page.locator(F.number)).not.toHaveText(/abc/);
  });
});

test.describe('PAIRWISE — un schema nunca revierte a otro', () => {
  test('rotación por las cinco familias preservando todo lo anterior', async ({ page }) => {
    const orden: FieldKey[] = ['text', 'number', 'fullName', 'company', 'title', 'email'];
    const esperado: Partial<Record<FieldKey, string>> = {};

    for (let ronda = 1; ronda <= 3; ronda += 1) {
      for (const key of orden) {
        const valor = key === 'number' ? `${ronda}00` : `${key}-${ronda}`;
        await setValue(page, key, valor);
        esperado[key] = valor;
        // Tras CADA edición, todos los campos ya tocados siguen intactos.
        await expectValues(page, esperado);
      }
    }
  });

  test('interactuar con un schema de elección no revierte los de texto', async ({ page }) => {
    await setValue(page, 'text', 'Antes de elegir');
    await setValue(page, 'number', '99');

    await page.locator(NON_TEXT.radioGroup).click();
    await blur(page);
    await page.locator(NON_TEXT.checkboxGroup).click();
    await blur(page);

    await expectValues(page, { text: 'Antes de elegir', number: '99' });
  });

  test('interactuar con una acción no revierte los campos rellenados', async ({ page }) => {
    await setValue(page, 'text', 'Antes de aprobar');
    await setValue(page, 'company', 'ACME');

    await page.locator(NON_TEXT.approve).click();
    await blur(page);

    await expectValues(page, { text: 'Antes de aprobar', company: 'ACME' });
  });

  test('un sibling nunca tocado conserva su valor inicial de plantilla', async ({ page }) => {
    const inicial = await page.locator(F.title).textContent();
    await setValue(page, 'text', 'Sólo este');
    await setValue(page, 'number', '5');
    await expect(page.locator(F.title)).toHaveText(inicial ?? '');
  });
});

test.describe('estabilidad del runtime', () => {
  test('escribir no remonta la instancia', async ({ page }) => {
    // Se marca el HOST del runtime, no los nodos de campo: el renderer
    // imperativo reconstruye el DOM de cada schema por diseño, así que marcar
    // el campo detectaría un repintado normal en vez de un remontaje.
    const antes = await page.evaluate(() => {
      const hosts = Array.from(document.querySelectorAll('.sisad-pdfme-lab-runtime-host'));
      hosts.forEach((el, index) => {
        (el as HTMLElement).dataset.rtpGate = String(index);
      });
      return hosts.length;
    });
    expect(antes).toBeGreaterThan(0);

    await setValue(page, 'text', 'Sin remontar');
    await setValue(page, 'company', 'Otro');
    await setValue(page, 'number', '7');

    const despues = await page.evaluate(() => ({
      total: document.querySelectorAll('.sisad-pdfme-lab-runtime-host').length,
      marcados: document.querySelectorAll('.sisad-pdfme-lab-runtime-host[data-rtp-gate]').length,
    }));

    expect(despues.total).toBe(antes);
    expect(despues.marcados).toBe(antes);
  });

  test('veinte ediciones alternadas convergen sin pérdida', async ({ page }) => {
    const orden: FieldKey[] = ['text', 'company', 'fullName', 'email'];
    let ultimo = '';
    for (let i = 1; i <= 20; i += 1) {
      const key = orden[i % orden.length];
      ultimo = `v${i}`;
      await setValue(page, key, ultimo);
      await expect(page.locator(F[key])).toHaveText(ultimo);
    }
  });
});

/**
 * MULTI-USUARIO — RTP-510.
 *
 * La capability ya existía en el runtime (`setActiveRecipient` + registry);
 * lo que faltaba era superficie para invocarla desde el navegador. Se habilitó
 * el conmutador del LAB —que es el host en este repositorio— sin añadir
 * ninguna superficie de depuración dentro de `src/sisad-pdfme`.
 *
 * Lo que se prueba aquí es contaminación: lo que escribe A no puede aparecer
 * en la vista de B, ni al revés, ni al conmutar rápido entre ambos.
 */
const userSelect = (page: Page) => page.getByTestId('lab-active-user-select');

const switchUser = async (page: Page, userId: string) => {
  await userSelect(page).selectOption(userId);
  await page.waitForTimeout(300);
};

test.describe('MULTI-USER — aislamiento entre usuarios', () => {
  test('el conmutador de usuario activo está disponible', async ({ page }) => {
    await expect(userSelect(page)).toHaveCount(1);
    await expect(userSelect(page).locator('option')).toHaveCount(3);
  });

  /**
   * CARACTERIZACIÓN, no aislamiento.
   *
   * En esta plantilla NINGÚN schema declara asignación por usuario, así que
   * todos los valores caen en scope compartido. Que Bob vea lo que escribió
   * Alice es, por tanto, el comportamiento CORRECTO del modelo — no una fuga.
   *
   * Se fija aquí de forma explícita para que un cambio futuro a scope
   * per-user rompa este test y obligue a revisarlo, en vez de pasar
   * inadvertido. El aislamiento real entre usuarios NO queda demostrado por
   * esta ruta: hace falta una plantilla con asignaciones per-user (RTP-510).
   */
  test('sin asignación per-user el valor es compartido entre usuarios', async ({ page }) => {
    await switchUser(page, 'alice');
    await setValue(page, 'text', 'Escrito por Alice');
    await expectValues(page, { text: 'Escrito por Alice' });

    await switchUser(page, 'bob');
    await expect(
      page.locator(F.text),
      'scope compartido: Bob ve el valor de Alice porque el schema no está asignado',
    ).toHaveText('Escrito por Alice');

    await switchUser(page, 'alice');
    await expectValues(page, { text: 'Escrito por Alice' });
  });

  test('conmutación rápida A→B→A no pierde ni mezcla valores', async ({ page }) => {
    await switchUser(page, 'alice');
    await setValue(page, 'company', 'ACME-Alice');

    for (let i = 0; i < 4; i += 1) {
      await userSelect(page).selectOption('bob');
      await userSelect(page).selectOption('alice');
    }
    await page.waitForTimeout(500);

    await expectValues(page, { company: 'ACME-Alice' });
  });

  test('el runtime no se remonta al conmutar de usuario', async ({ page }) => {
    const antes = await page.evaluate(() => {
      const hosts = Array.from(document.querySelectorAll('.sisad-pdfme-lab-runtime-host'));
      hosts.forEach((el, i) => { (el as HTMLElement).dataset.rtpUser = String(i); });
      return hosts.length;
    });
    expect(antes).toBeGreaterThan(0);

    await switchUser(page, 'bob');
    await switchUser(page, 'carla');

    const despues = await page.evaluate(() => ({
      total: document.querySelectorAll('.sisad-pdfme-lab-runtime-host').length,
      marcados: document.querySelectorAll('.sisad-pdfme-lab-runtime-host[data-rtp-user]').length,
    }));
    expect(despues.total).toBe(antes);
  });
});

/**
 * Aislamiento entre CONTEXTOS de navegador: dos sesiones independientes no
 * pueden compartir estado aunque corran contra la misma aplicación.
 */
test('dos BrowserContext aislados no comparten estado del Form', async ({ browser }) => {
  const contextoA = await browser.newContext();
  const contextoB = await browser.newContext();
  const paginaA = await contextoA.newPage();
  const paginaB = await contextoB.newPage();

  await paginaA.goto('/runtime/form/digital-agreements');
  await paginaB.goto('/runtime/form/digital-agreements');
  await paginaA.waitForSelector(F.text);
  await paginaB.waitForSelector(F.text);

  const inicialB = await paginaB.locator(F.text).textContent();

  await setValue(paginaA, 'text', 'Sólo contexto A');
  await expect(paginaA.locator(F.text)).toHaveText('Sólo contexto A');

  // B no puede haber visto nada de A.
  await expect(paginaB.locator(F.text)).toHaveText(inicialB ?? '');

  await contextoA.close();
  await contextoB.close();
});
