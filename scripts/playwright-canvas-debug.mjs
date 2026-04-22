import playwright from 'playwright';

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  const url = process.env.URL || 'http://localhost:5174/sisad-pdfme';
  console.log('goto', url);
  await page.goto(url, { waitUntil: 'load' });
  // select designer mode
  try {
    await page.selectOption('[data-testid="mode-select"]', 'designer');
  } catch (e) {
    console.log('selectOption err', e.message);
  }
  // wait until designer runtime actions become available (undo button enabled)
  try {
    await page.waitForSelector('[data-testid="btn-undo"]:not([disabled])', { timeout: 5000 });
    console.log('designer undo button enabled');
  } catch (e) {
    console.log('undo button not enabled yet');
  }
  // click add schema via UI control
  const btn = await page.$('[data-testid="btn-add-schema"]');
  if (btn) {
    try {
      await btn.click();
    } catch (e) {
      await btn.evaluate((el) => el.click());
    }
    console.log('clicked add-schema');
  } else {
    console.log('btn-add-schema not found');
  }

  // Also try designer runtime API if available
  const hasDesigner = await page.evaluate(() => !!(window.__PDFME_DESIGNER && typeof window.__PDFME_DESIGNER.addSchemaByType === 'function'));
  console.log('hasDesigner runtime API:', hasDesigner);
  if (hasDesigner) {
    await page.evaluate(() => {
       
      window.__PDFME_DESIGNER.addSchemaByType('text');
    });
    console.log('invoked window.__PDFME_DESIGNER.addSchemaByType');
  }

  if (hasDesigner) {
    const pluginsInfo = await page.evaluate(() => {
       
      const d = window.__PDFME_DESIGNER;
      const regs = d?._toolbarRegistrations ? Object.keys(d._toolbarRegistrations) : [];
      const entries = [];
      try {
        const regEntries = d?._pluginsRegistry?._map ? Array.from(d._pluginsRegistry._map.entries()) : [];
        for (const [k, v] of regEntries) {
          entries.push({ key: k, hasPropPanel: !!v.propPanel, defaultSchema: v.propPanel?.defaultSchema?.type });
        }
      } catch (e) {}
      return { regs, entries };
    });
    console.log('designer plugins info:', JSON.stringify(pluginsInfo, null, 2));
  }
  await page.waitForTimeout(1500);

  const count = await page.evaluate(() => {
    const selectors = ['[data-schema-selectable="true"]', '[data-schema-id]', '[data-schema-type]', '[data-schema-name]'];
    const out = {};
    selectors.forEach((s) => { out[s] = document.querySelectorAll(s).length; });
    return out;
  });
  console.log('selector counts:', count);
  if (count['[data-schema-id]'] > 0) {
    const outer = await page.evaluate(() => document.querySelector('[data-schema-id]')?.outerHTML);
    console.log('first data-schema-id outer snippet:', outer?.slice(0, 400));
  } else {
    console.log('no schema elements present in DOM after addSchema');
    const html = await page.content();
    console.log('page length', html.length);
  }

  await browser.close();
})();
