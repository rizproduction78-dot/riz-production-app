import puppeteer from 'puppeteer';

async function checkStorage() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const reports = await page.evaluate(() => {
    const raw = localStorage.getItem('riz_daily_reports_v2');
    return raw ? JSON.parse(raw) : [];
  });

  console.log(`Total reports in browser localStorage: ${reports.length}`);
  const octReports = reports.filter((r: any) => r.date && r.date.startsWith('2026-10'));
  console.log(`October reports in browser localStorage (${octReports.length}):`);
  console.log(octReports.map((r: any) => ({ id: r.id, staffName: r.staffName, activity: r.activity?.substring(0, 30) })));

  await browser.close();
}

checkStorage();
