import { test, expect } from '@playwright/test';

test.describe('App.spec.ts', ()=>{
  test('App.spec.ts renders', async ({ page }) => {
    await page.goto(process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5174');
    // TODO: navigate to the route or mount the component
    // Example: await page.click('text=Open Designer');
    expect(true).toBeTruthy();
  });
});
