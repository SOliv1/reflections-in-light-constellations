const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const app = document.querySelector('.App');
    if (app) {
      app.classList.remove('mood-storm','mood-rain','mood-neutral');
      app.classList.add('mood-sunny');
    }
    const veil = document.getElementById('veil');
    if (veil) {
      veil.classList.remove('veil-on','veil-lift','mood-sunny','mood-rain','mood-storm');
      veil.classList.add('veil-off');
    }
    const cal = document.querySelector('.calendar-wrapper');
    if (cal) cal.scrollIntoView({ behavior: 'auto', block: 'center' });
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/workspaces/reflections-in-light-constellations/app_calendar_mood_sunny.png' });
  await browser.close();
})();
