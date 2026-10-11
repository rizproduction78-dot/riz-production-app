import puppeteer from 'puppeteer';

async function debugBrowser() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  const debugInfo = await page.evaluate(() => {
    const rawReports = localStorage.getItem('riz_daily_reports_v2');
    const reports = rawReports ? JSON.parse(rawReports) : [];
    const oct = reports.filter((r: any) => r.date && r.date.startsWith('2026-10'));
    
    // Find all rows in Section 04 table
    const table = Array.from(document.querySelectorAll('table')).find(t => t.textContent?.includes('Nama Staff') && t.textContent?.includes('Daily Report'));
    const rows = table ? Array.from(table.querySelectorAll('tbody tr')).map(tr => tr.textContent?.trim().replace(/\s+/g, ' ')) : [];

    return {
      octReportsInStorage: oct,
      tableRowsInDom: rows
    };
  });

  console.log('=== DEBUG INFO DARI DALAM BROWSER ===');
  console.log('October Reports in LocalStorage:', JSON.stringify(debugInfo.octReportsInStorage, null, 2));
  console.log('\nDOM Table Rows:', JSON.stringify(debugInfo.tableRowsInDom, null, 2));

  await browser.close();
}

debugBrowser();
