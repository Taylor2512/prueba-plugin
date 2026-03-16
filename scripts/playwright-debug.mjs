import playwright from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  page.on('console', (msg) => {
    try {
      const text = msg.text();
      console.log('[console]', msg.type(), text);
    } catch (e) {
      console.log('[console] <unreadable>');
    }
  });

  page.on('pageerror', (err) => console.log('[pageerror]', err.message));
  page.on('requestfailed', (req) => console.log('[requestfailed]', req.url(), req.failure()));

  const url = process.env.URL || 'http://localhost:5174/pdfme';
  console.log('navigating to', url);
  await page.goto(url, { waitUntil: 'load', timeout: 30000 }).catch((e) => console.log('goto err', e.message));

  // give runtime a few seconds
  await page.waitForTimeout(2000);

  const html = await page.content();
  fs.writeFileSync('tmp/playwright-debug-page.html', html);
  await page.screenshot({ path: 'tmp/playwright-debug-screenshot.png', fullPage: true }).catch(() => {});

  console.log('wrote tmp/playwright-debug-page.html and screenshot');

  await browser.close();
})();
