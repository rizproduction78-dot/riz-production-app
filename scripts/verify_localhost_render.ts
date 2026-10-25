import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // If on login screen, log in
  const selectExists = await page.$('select');
  if (selectExists) {
    await page.select('select', 'director-wahyu');
    await page.type('input[type="password"]', 'riz123');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 2500));
  }

  const stats = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tr'));
    const totalRow = rows.find(r => r.innerText.includes('TOTAL AKUMULASI'));
    
    const section05Heading = Array.from(document.querySelectorAll('h2')).find(h => h.innerText.includes('STATISTIK QC'));
    const section05Card = section05Heading ? section05Heading.closest('.space-y-4') : null;

    const section04Heading = Array.from(document.querySelectorAll('h2')).find(h => h.innerText.includes('PRODUKTIVITAS STAFF'));
    const section04Card = section04Heading ? section04Heading.closest('.space-y-4, .bg-white, .rounded-xl, div') : null;
    const section04Table = section04Heading ? section04Heading.parentElement?.querySelector('table') || document.querySelectorAll('table')[2] : null;

    const staffRows = Array.from(document.querySelectorAll('table')).map(table => {
      return Array.from(table.querySelectorAll('tbody tr')).map(tr => tr.innerText.replace(/\n/g, ' '));
    });

    return {
      totalRowText: totalRow ? totalRow.innerText : null,
      section05Text: section05Card ? section05Card.innerText : null,
      allTables: staffRows
    };
  });

  console.log('LOCALHOST:3000 VERIFICATION (AFTER LOGIN):');
  console.log(JSON.stringify(stats, null, 2));

  await browser.close();
})();
