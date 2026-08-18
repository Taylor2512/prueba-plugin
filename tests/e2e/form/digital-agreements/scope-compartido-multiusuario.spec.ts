import { expect, test } from '@playwright/test';
import {
  abrirForm,
  CAMPOS,
  cambiarUsuario,
  esperarValores,
  fijar,
  instanciasRuntime,
  selectorUsuario,
} from '../../../support/playwright';

/**
 * CARACTERIZACIÓN de scope compartido, no de aislamiento.
 *
 * En esta plantilla NINGÚN schema declara asignación por usuario, así que todos
 * los valores caen en scope compartido: que Bob vea lo que escribió Alice es el
 * comportamiento CORRECTO del modelo, no una fuga.
 *
 * Se fija de forma explícita para que un cambio futuro a scope per-user rompa
 * este spec y obligue a revisarlo. El aislamiento real per-user se demuestra en
 * `tests/e2e/runtime/ownership-multiusuario.spec.ts`, que usa una plantilla con
 * asignaciones declaradas.
 */
test.beforeEach(async ({ page }) => {
  await abrirForm(page, '/runtime/form/digital-agreements');
});

test.describe('Form digital-agreements — scope compartido entre usuarios', () => {
  // @caso DECL-UC-008
  test('el conmutador de usuario activo está disponible', async ({ page }) => {
    await expect(selectorUsuario(page)).toHaveCount(1);
    await expect(selectorUsuario(page).locator('option')).toHaveCount(3);
  });

  // @caso DECL-UC-008
  // @caso UC-07
  test('sin asignación per-user el valor es compartido entre usuarios', async ({ page }) => {
    await cambiarUsuario(page, 'alice');
    await fijar(page, 'text', 'Escrito por Alice');
    await esperarValores(page, { text: 'Escrito por Alice' });

    await cambiarUsuario(page, 'bob');
    await expect(
      page.locator(CAMPOS.text),
      'scope compartido: Bob ve el valor de Alice porque el schema no está asignado',
    ).toHaveText('Escrito por Alice');

    await cambiarUsuario(page, 'alice');
    await esperarValores(page, { text: 'Escrito por Alice' });
  });

  // @caso RUN-005
  test('conmutación rápida A→B→A no pierde ni mezcla valores', async ({ page }) => {
    await cambiarUsuario(page, 'alice');
    await fijar(page, 'company', 'ACME-Alice');

    for (let i = 0; i < 4; i += 1) {
      await selectorUsuario(page).selectOption('bob');
      await selectorUsuario(page).selectOption('alice');
    }
    await esperarValores(page, { company: 'ACME-Alice' });
  });

  // @caso RUN-012
  test('el runtime no se remonta al conmutar de usuario', async ({ page }) => {
    const antes = await instanciasRuntime(page);
    expect(antes).toBeGreaterThan(0);

    await cambiarUsuario(page, 'bob');
    await cambiarUsuario(page, 'carla');

    expect(await instanciasRuntime(page)).toBe(antes);
  });
});
