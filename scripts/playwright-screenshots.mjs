import { chromium } from 'playwright';
import fs from 'fs';

const BASE = process.env.BASE || 'http://localhost:5174';
const OUT = 'output/playwright/screens';

await fs.promises.mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

const routes = ['/', '/sisad-pdfme', '/about'];
for (const route of routes) {
  const url = `${BASE}${route}`;
  try {
    console.log('Capturing', url);
    await page.goto(url, { waitUntil: 'networkidle' , timeout: 30000});
    await page.waitForTimeout(500);
    // If we're on the sisad-pdfme route, try to open the right sidebar via the toggle
    if (route === '/sisad-pdfme') {
      try {
        const toggle = await page.$('.sisad-pdfme-designer-right-sidebar-toggle-btn');
        if (toggle) {
          await toggle.click();
          await page.waitForTimeout(300);
        }
      } catch (err) {
        console.warn('Could not click right-sidebar toggle:', err.message);
      }
    }
    const name = route === '/' ? 'home' : route.replace(/\//g, '_').replace(/^_/, '');
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
    console.log('Saved', `${OUT}/${name}.png`);
  } catch (err) {
    console.error('Failed to capture', url, err.message);
  }
}

await browser.close();
console.log('Done. Screenshots in', OUT);
