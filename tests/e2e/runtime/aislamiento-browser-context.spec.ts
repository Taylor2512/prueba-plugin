import { expect, test } from '@playwright/test';
import { CAMPOS, escribirCampo, desenfocar, abrirForm } from '../../support/playwright';

/**
 * Aislamiento entre CONTEXTOS de navegador.
 *
 * Dos sesiones independientes no pueden compartir estado aunque corran contra
 * la misma aplicación. Es la garantía que separa "estado local del runtime" de
 * "estado global accidental" (un módulo con estado a nivel de import, por
 * ejemplo, sí se compartiría entre pestañas del mismo contexto).
 */
// @caso RUN-002
// @caso QLT-006
test('dos BrowserContext aislados no comparten estado del Form', async ({ browser }) => {
  const contextoA = await browser.newContext();
  const contextoB = await browser.newContext();

  try {
    const paginaA = await contextoA.newPage();
    const paginaB = await contextoB.newPage();

    await abrirForm(paginaA, '/runtime/form/digital-agreements');
    await abrirForm(paginaB, '/runtime/form/digital-agreements');

    const inicialB = await paginaB.locator(CAMPOS.text).textContent();

    await escribirCampo(paginaA.locator(CAMPOS.text), 'Sólo contexto A');
    await desenfocar(paginaA);
    await expect(paginaA.locator(CAMPOS.text)).toHaveText('Sólo contexto A');

    // B no puede haber visto nada de A.
    await expect(paginaB.locator(CAMPOS.text)).toHaveText(inicialB ?? '');
  } finally {
    await contextoA.close();
    await contextoB.close();
  }
});
