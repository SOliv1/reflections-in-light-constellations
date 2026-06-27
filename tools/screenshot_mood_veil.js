const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const app = document.querySelector('.App');
    if (app) app.classList.add('mood-sunny');
    const veil = document.getElementById('veil');
    if (veil) veil.classList.add('veil-on', 'mood-sunny');
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/workspaces/reflections-in-light-constellations/app_mood_sunny_veil_on.png' });
  await browser.close();
})();
