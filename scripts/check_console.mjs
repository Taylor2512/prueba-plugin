import playwright from 'playwright';
const { chromium } = playwright;
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE_CONSOLE', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE_ERROR', err && err.stack ? err.stack : err));
  page.on('requestfailed', request => console.log('REQUEST_FAILED', request.url(), request.failure()?.errorText));
  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    console.log('PAGE_LOADED_OK');
    await page.screenshot({ path: '/tmp/sisad.screenshot.png', fullPage: true });
  } catch (e) {
    console.error('PLAYWRIGHT_ERROR', e);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
