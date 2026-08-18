import { test, expect, type Locator, type Page } from '@playwright/test';
import { abrirDesigner, arrastrarAlCentro, paginaCanvas } from '../../support/playwright';

/**
 * Grupos de opciones: el mecanismo de creación no puede cambiar las capacidades.
 *
 * Regresión que cubre esta spec: `checkboxGroup` y `radioGroup` declaraban
 * `id`/`groupId`/`group` como claves propias con valor `undefined`. Como
 * `Designer.addSchema` construía el schema nuevo con `{ id: uuid(),
 * ...defaultSchema }`, esas claves ganaban el spread y borraban el uuid. Un
 * grupo declarado en la plantilla funcionaba —trae su identidad escrita— y el
 * mismo grupo arrastrado desde el catálogo nacía sin `data-schema-id`, así que
 * la selección no lo resolvía y agregar o eliminar opciones no hacía nada.
 *
 * Por eso las aserciones son un contrato ÚNICO (`assertCapacidadesDeGrupo`)
 * que se ejecuta contra el grupo declarativo y contra el arrastrado.
 */

const TIPOS = ['checkboxGroup', 'radioGroup'] as const;
type TipoGrupo = (typeof TIPOS)[number];

/**
 * Vigilante de consola.
 *
 * Un bucle de render de React no rompe la UI: la deja funcionando y gritando
 * en consola. Sin este guard un test podía pasar mientras React entraba en
 * bucle, así que el ruido de consola es parte del contrato, no un detalle.
 */
const vigilarConsola = (page: Page) => {
  const criticos: string[] = [];
  page.on('console', (mensaje) => {
    const texto = mensaje.text();
    if (/Maximum update depth exceeded/i.test(texto)) criticos.push(texto);
  });
  page.on('pageerror', (error) => criticos.push(`pageerror: ${error.message}`));
  return criticos;
};

/** Nodos del canvas de un tipo de grupo, ya filtrados por identidad publicada. */
const gruposEnCanvas = (canvas: Locator, tipo: TipoGrupo): Locator =>
  canvas.locator(`[data-schema-type="${tipo}"][data-schema-id]`);

const contarOpciones = (page: Page, schemaId: string): Promise<number> =>
  page.locator(`[data-schema-id="${schemaId}"] [data-option-id]`).count();

/**
 * Selecciona el grupo pinchando su esquina.
 *
 * El centro puede quedar cubierto por el overlay de selección de otro schema;
 * la esquina superior izquierda pertenece siempre al propio nodo.
 */
const seleccionarGrupo = async (page: Page, schemaId: string): Promise<void> => {
  const nodo = page.locator(`[data-schema-id="${schemaId}"]`);
  await nodo.click({ position: { x: 3, y: 3 } });
  await expect(nodo).toHaveAttribute('data-schema-active', 'true');
};

/** Inserta un grupo desde el catálogo y devuelve su `data-schema-id`. */
const arrastrarGrupo = async (
  page: Page,
  canvas: Locator,
  tipo: TipoGrupo,
  offsetX = 0,
  offsetY = 0,
): Promise<string> => {
  const items = gruposEnCanvas(canvas, tipo);
  const antes = await items.count();
  const origen = page.locator(`button[data-schema-type="${tipo}"][aria-roledescription="draggable"]`).first();
  await expect(origen, `el catálogo debe exponer ${tipo}`).toBeVisible();
  await arrastrarAlCentro(page, origen, canvas, offsetX, offsetY);
  await expect
    .poll(() => items.count(), { message: `arrastrar ${tipo} debe insertar un schema con identidad` })
    .toBe(antes + 1);

  const schemaId = await items.last().getAttribute('data-schema-id');
  expect(schemaId, `${tipo} arrastrado debe publicar data-schema-id`).toBeTruthy();
  return schemaId as string;
};

/**
 * Contrato funcional del grupo, idéntico para cualquier vía de creación.
 *
 * Comprueba identidad, recuento inicial, selección, agregar opción y que la
 * identidad del schema sobrevive a la mutación.
 */
const assertCapacidadesDeGrupo = async (
  page: Page,
  schemaId: string,
  tipo: TipoGrupo,
): Promise<void> => {
  const nodo = page.locator(`[data-schema-id="${schemaId}"]`);
  await expect(nodo, 'la identidad debe resolver a un único nodo').toHaveCount(1);
  await expect(nodo).toHaveAttribute('data-schema-type', tipo);
  const uid = await nodo.getAttribute('data-schema-uid');
  expect(uid, 'el grupo debe publicar schemaUid').toBeTruthy();

  const opcionesIniciales = await contarOpciones(page, schemaId);
  expect(opcionesIniciales, `${tipo} debe nacer con 2 opciones`).toBe(2);

  await seleccionarGrupo(page, schemaId);

  const agregar = page.locator('[data-role="group-add-option"]');
  await expect(agregar, 'un grupo seleccionado debe ofrecer el botón de agregar opción').toHaveCount(1);
  await agregar.click();
  await expect
    .poll(() => contarOpciones(page, schemaId), { message: 'agregar opción debe aumentar el grupo' })
    .toBe(opcionesIniciales + 1);

  // La mutación no puede recrear el schema: mismo uid, mismo nodo.
  await expect(nodo).toHaveCount(1);
  expect(await nodo.getAttribute('data-schema-uid')).toBe(uid);
};

test.describe('Designer — grupos de opciones', () => {
  for (const tipo of TIPOS) {
    // @caso SCH-008
    // @caso SCH-009
    // @caso INT-010
    test(`${tipo} — declarativo y arrastrado cumplen el MISMO contrato`, async ({ page }) => {
      test.slow();
      const criticos = vigilarConsola(page);
      await abrirDesigner(page, '/designer/single-user');
      const canvas = await paginaCanvas(page, 0);

      const declarativo = gruposEnCanvas(canvas, tipo).first();
      await expect(declarativo, `la plantilla demo debe traer un ${tipo}`).toBeVisible();
      const idDeclarativo = (await declarativo.getAttribute('data-schema-id')) as string;
      await assertCapacidadesDeGrupo(page, idDeclarativo, tipo);

      const idArrastrado = await arrastrarGrupo(page, canvas, tipo, 90, -110);
      expect(idArrastrado, 'el arrastrado no puede compartir identidad con el declarativo').not.toBe(idDeclarativo);
      await assertCapacidadesDeGrupo(page, idArrastrado, tipo);

      expect(criticos, 'la interacción no debe producir bucles de render ni errores de página').toEqual([]);
    });

    // @caso INT-010
    // @caso SCH-008
    test(`${tipo} — dos grupos arrastrados quedan aislados entre sí`, async ({ page }) => {
      test.slow();
      const criticos = vigilarConsola(page);
      await abrirDesigner(page, '/designer/single-user');
      const canvas = await paginaCanvas(page, 0);

      const primero = await arrastrarGrupo(page, canvas, tipo, -90, -110);
      const segundo = await arrastrarGrupo(page, canvas, tipo, 90, -110);
      expect(segundo, 'cada arrastre debe generar una identidad nueva').not.toBe(primero);

      // Ambos existen como nodos independientes: con identidad compartida React
      // colapsaba los dos en uno solo y el segundo arrastre no se veía.
      await expect(page.locator(`[data-schema-id="${primero}"]`)).toHaveCount(1);
      await expect(page.locator(`[data-schema-id="${segundo}"]`)).toHaveCount(1);

      expect(await contarOpciones(page, primero)).toBe(2);
      expect(await contarOpciones(page, segundo)).toBe(2);

      await seleccionarGrupo(page, segundo);
      await page.locator('[data-role="group-add-option"]').click();
      await expect.poll(() => contarOpciones(page, segundo)).toBe(3);

      expect(
        await contarOpciones(page, primero),
        'agregar una opción a un grupo no puede alterar al otro',
      ).toBe(2);

      expect(criticos).toEqual([]);
    });

    // @caso INT-010
    // @caso CMD-001
    // @caso CMD-002
    test(`${tipo} — agregar opción es deshacible y rehacible sin perder identidad`, async ({ page }) => {
      test.slow();
      const criticos = vigilarConsola(page);
      await abrirDesigner(page, '/designer/single-user');
      const canvas = await paginaCanvas(page, 0);

      const schemaId = await arrastrarGrupo(page, canvas, tipo, 0, -110);
      const uid = await page.locator(`[data-schema-id="${schemaId}"]`).getAttribute('data-schema-uid');

      await seleccionarGrupo(page, schemaId);
      await page.locator('[data-role="group-add-option"]').click();
      await expect.poll(() => contarOpciones(page, schemaId)).toBe(3);

      const deshacer = page.getByTestId('designer-undo');
      await expect(deshacer).toBeEnabled();
      await deshacer.click();
      await expect
        .poll(() => contarOpciones(page, schemaId), { message: 'undo debe devolver el grupo a 2 opciones' })
        .toBe(2);

      const rehacer = page.getByTestId('designer-redo');
      await expect(rehacer).toBeEnabled();
      await rehacer.click();
      await expect
        .poll(() => contarOpciones(page, schemaId), { message: 'redo debe volver a aplicar la opción' })
        .toBe(3);

      expect(await page.locator(`[data-schema-id="${schemaId}"]`).getAttribute('data-schema-uid')).toBe(uid);
      expect(criticos).toEqual([]);
    });
  }

  // @caso INT-010
  // @caso INT-001
  test('ciclos repetidos de agregar opción no degradan identidad ni consola', async ({ page }) => {
    test.slow();
    const criticos = vigilarConsola(page);
    await abrirDesigner(page, '/designer/single-user');
    const canvas = await paginaCanvas(page, 0);

    const schemaId = await arrastrarGrupo(page, canvas, 'checkboxGroup', 0, -110);
    const nodo = page.locator(`[data-schema-id="${schemaId}"]`);
    const uid = await nodo.getAttribute('data-schema-uid');

    for (let iteracion = 0; iteracion < 6; iteracion += 1) {
      await seleccionarGrupo(page, schemaId);
      await page.locator('[data-role="group-add-option"]').click();
      await expect.poll(() => contarOpciones(page, schemaId)).toBe(3 + iteracion);
    }

    await expect(nodo).toHaveCount(1);
    expect(await nodo.getAttribute('data-schema-uid')).toBe(uid);
    expect(criticos, 'el estrés no debe producir bucles de render').toEqual([]);
  });
});
