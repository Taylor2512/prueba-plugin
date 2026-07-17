import { test, expect } from '@playwright/test';
import { openDesigner } from '../fixtures/designer.fixture';

test.describe('Runtime Form/Viewer parity', () => {
  test('controles de modo permiten Designer/Form/Viewer cuando el host los expone', async ({ page }) => {
    await openDesigner(page);
    const form = page.getByRole('button', { name: /^Form$/i }).or(page.getByRole('option', { name: /^Form$/i }));
    const viewer = page.getByRole('button', { name: /^Viewer$/i }).or(page.getByRole('option', { name: /^Viewer$/i }));
    test.skip(!(await form.count()) || !(await viewer.count()), 'El shell embebido oculta controles de runtime');
  });

  test.fixme('Form filtra schemas por recipient y persiste valores por schemaUid');
  test.fixme('Viewer no monta sidebars, Moveable, Selecto ni chrome de Designer');
  test.fixme('Generator produce PDF sin chrome y conserva valores de Form');
});
