const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });

  await page.evaluate(() => {
    // Ensure mood and veil classes
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

    // Create a photo-gallery if none exists
    let gallery = document.querySelector('.photo-gallery');
    if (!gallery) {
      gallery = document.createElement('div');
      gallery.className = 'photo-gallery';
      // Append somewhere visible inside .App
      const appContent = document.querySelector('.App .app-content') || document.querySelector('.App');
      appContent.appendChild(gallery);
    }

    // Clear existing children and add sample tiles
    gallery.innerHTML = '';
    const sampleUrls = [
      'https://picsum.photos/seed/1/400/300',
      'https://picsum.photos/seed/2/400/300',
      'https://picsum.photos/seed/3/400/300',
      'https://picsum.photos/seed/4/400/300',
      'https://picsum.photos/seed/5/400/300',
      'https://picsum.photos/seed/6/400/300'
    ];

    for (const src of sampleUrls) {
      const tile = document.createElement('div');
      tile.className = 'photo-tile';
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Sample';
      img.style.width = '220px';
      img.style.height = '150px';
      img.style.objectFit = 'cover';
      tile.appendChild(img);
      gallery.appendChild(tile);
    }
  });

  // Wait for images to load and then scroll into view
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    const gallery = document.querySelector('.photo-gallery');
    if (gallery) gallery.scrollIntoView({ behavior: 'auto', block: 'center' });
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/workspaces/reflections-in-light-constellations/app_gallery_tiles.png', fullPage: false });
  await browser.close();
})();
