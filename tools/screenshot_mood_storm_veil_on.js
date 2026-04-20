const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const app = document.querySelector('.App');
    if (app) {
      app.classList.remove('mood-sunny','mood-rain','mood-neutral');
      app.classList.add('mood-storm');
    }
    const veil = document.getElementById('veil');
    if (veil) {
      veil.classList.remove('veil-lift','mood-sunny','mood-rain');
      veil.classList.add('veil-on','mood-storm');
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(450);
  await page.screenshot({ path: '/workspaces/reflections-in-light-constellations/app_mood_storm_veil_on.png' });
  await browser.close();
})();
