import puppeteer from 'puppeteer';
import path from 'path';

async function capture() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Handle Login if present
  const passwordInput = await page.$('input[type="password"]');
  if (passwordInput) {
    console.log('Login screen detected. Entering credentials...');
    // Select first staff if dropdown exists
    const selectStaff = await page.$('select');
    if (selectStaff) {
      await page.select('select', 'staff-fahrul');
    }
    await passwordInput.type('riz123');
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    }
  }

  await new Promise(r => setTimeout(r, 2000));

  const artifactDir = '/Users/mamangsound/.gemini/antigravity-ide/brain/fc274110-7b0b-48e5-aea2-d0b178a30a39';
  const dashPath = path.join(artifactDir, 'bukti_nyata_dashboard.png');
  await page.screenshot({ path: dashPath, fullPage: false });
  console.log('Saved dashboard screenshot:', dashPath);

  // Navigate to Reports / Laporan
  const buttons = await page.$$('button, a');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && (text.includes('Reports') || text.includes('Laporan'))) {
      console.log('Navigating to Reports tab...');
      await b.click();
      await new Promise(r => setTimeout(r, 2000));
      const repPath = path.join(artifactDir, 'bukti_nyata_reports.png');
      await page.screenshot({ path: repPath, fullPage: false });
      console.log('Saved reports screenshot:', repPath);
      break;
    }
  }

  // Navigate to Findings / Temuan & WO
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && (text.includes('Temuan') || text.includes('Findings') || text.includes('Work Order'))) {
      console.log('Navigating to Findings tab...');
      await b.click();
      await new Promise(r => setTimeout(r, 2000));
      const findPath = path.join(artifactDir, 'bukti_nyata_temuan_wo.png');
      await page.screenshot({ path: findPath, fullPage: false });
      console.log('Saved findings screenshot:', findPath);
      break;
    }
  }

  await browser.close();
  console.log('Screenshots captured successfully.');
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
