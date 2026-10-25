import { normalizeCollectionItems } from '../src/lib/cloudSync';
import { extractNormalizedDailySheetRows, parseDailySheet } from '../src/lib/dailySheetParser';
import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Get raw localStorage reports
  const rawReports = await page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem('riz_daily_reports_v2') || '[]');
    } catch { return []; }
  });
  await browser.close();

  const octRaw = rawReports.filter((r: any) => r.date && r.date.startsWith('2026-10'));
  console.log('octRaw count:', octRaw.length);

  const normalized = normalizeCollectionItems('daily_reports', octRaw);
  console.log('normalized count:', normalized.length);

  const byStaffNorm: Record<string, number> = {};
  normalized.forEach((r: any) => {
    byStaffNorm[r.staffName] = (byStaffNorm[r.staffName] || 0) + 1;
  });
  console.log('byStaff after normalizeCollectionItems:', byStaffNorm);
})();
