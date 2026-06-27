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

    // Create overlay container
    let overlay = document.getElementById('gallery-overlay-preview');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'gallery-overlay-preview';
      overlay.style.position = 'fixed';
      overlay.style.left = '80px';
      overlay.style.top = '120px';
      overlay.style.width = '1100px';
      overlay.style.height = '580px';
      overlay.style.zIndex = '40000';
      overlay.style.background = 'transparent';
      overlay.style.display = 'flex';
      overlay.style.flexWrap = 'wrap';
      overlay.style.gap = '22px';
      overlay.style.padding = '18px';
      overlay.style.borderRadius = '12px';
      overlay.style.pointerEvents = 'none';
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = '';
    const urls = [
      'https://picsum.photos/seed/11/480/320',
      'https://picsum.photos/seed/12/480/320',
      'https://picsum.photos/seed/13/480/320',
      'https://picsum.photos/seed/14/480/320',
      'https://picsum.photos/seed/15/480/320',
      'https://picsum.photos/seed/16/480/320'
    ];
    for (const src of urls) {
      const tile = document.createElement('div');
      tile.className = 'photo-tile preview-tile';
      tile.style.width = '340px';
      tile.style.height = '220px';
      tile.style.borderRadius = '12px';
      tile.style.overflow = 'hidden';
      tile.style.pointerEvents = 'none';
      tile.style.transition = 'transform 0.25s ease, box-shadow 0.35s ease';
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'sample';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.display = 'block';
      tile.appendChild(img);
      overlay.appendChild(tile);
    }
  });
  // Wait for images to load
  await page.waitForTimeout(900);
  await page.screenshot({ path: '/workspaces/reflections-in-light-constellations/app_gallery_tiles_overlay.png' });
  await browser.close();
})();
