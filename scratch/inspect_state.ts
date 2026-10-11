import puppeteer from 'puppeteer';

async function inspect() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('riz_current_user', JSON.stringify({
      id: 'director-wahyu',
      name: 'Wahyu',
      role: 'Direktur',
      division: 'Admin'
    }));
    localStorage.setItem('riz_active_tab', 'dashboard');
    localStorage.setItem('riz_active_month', '2026-10');
  });

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  const tableData = await page.evaluate(() => {
    const table = Array.from(document.querySelectorAll('table')).find(t => t.textContent?.includes('Nama Staff') && t.textContent?.includes('Daily Report'));
    if (!table) return null;
    return Array.from(table.querySelectorAll('tbody tr')).map(tr => {
      const cols = Array.from(tr.querySelectorAll('td')).map(td => td.textContent?.trim().replace(/\s+/g, ' ') || '');
      return cols;
    });
  });

  console.log('=== REAL TABLE ROWS IN BROWSER RIGHT NOW ===');
  console.log(tableData);

  await browser.close();
}

inspect();
