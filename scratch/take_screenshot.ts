import puppeteer from 'puppeteer';
import path from 'path';

async function capture() {
  const artifactDir = '/Users/mamangsound/.gemini/antigravity-ide/brain/fc274110-7b0b-48e5-aea2-d0b178a30a39';
  const outPath = path.join(artifactDir, 'dashboard_oktober_2026_verified.png');

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080 });

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('riz_current_user', JSON.stringify({
      id: 'director-wahyu',
      name: 'Wahyu',
      fullName: 'Wahyu',
      nickname: 'Wahyu',
      role: 'Direktur',
      division: 'Admin',
      level: 8
    }));
    localStorage.setItem('riz_active_tab', 'dashboard');
    localStorage.setItem('riz_active_month', '2026-10');
  });

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  // Find Section 04 container and scroll to it
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2, span'));
    const h = headings.find(el => el.textContent && el.textContent.includes('PRODUKTIVITAS STAFF'));
    if (h) {
      const container = h.closest('.space-y-4') || h;
      container.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: outPath, fullPage: false });
  console.log('Clean screenshot saved to:', outPath);

  await browser.close();
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
