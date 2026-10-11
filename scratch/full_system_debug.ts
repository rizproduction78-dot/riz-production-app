import puppeteer from 'puppeteer';
import { CANONICAL_FIRESTORE_DAILY_REPORTS, CANONICAL_FIRESTORE_LOGBOOK_ENTRIES, CANONICAL_FIRESTORE_FINDINGS, CANONICAL_FIRESTORE_WORK_ORDERS } from '../src/data/canonicalFirestoreData';
import { getMasterStaffList, INITIAL_DAILY_TASKS } from '../src/data';
import { calculateAllStaffKpis } from '../src/utils/kpiCalculator';
import { parseDailySheet } from '../src/lib/dailySheetParser';
import fs from 'fs';

async function runComprehensiveDebug() {
  console.log('================================================================');
  console.log('   FULL SYSTEM DIAGNOSTIC & DEBUG AUDIT REPORT                  ');
  console.log('   PT. RIZ PRODUCTION MULTI KREASI                              ');
  console.log('================================================================\n');

  // 1. DATA AUDIT (HULU)
  console.log('--- 1. AUDIT DATA KANONIKAL & SUMBER RESMI ---');
  const allStaff = getMasterStaffList();
  console.log(`Total Master Staff Terdaftar: ${allStaff.length} orang (Target: 22)`);
  if (allStaff.length !== 22) {
    console.error(`❌ ERROR: Jumlah master staff tidak 22 (${allStaff.length})`);
  } else {
    console.log('✅ Master staff tepat 22 orang.');
  }

  const octReportsCanonical = CANONICAL_FIRESTORE_DAILY_REPORTS.filter(r => r.date.startsWith('2026-10'));
  const sepReportsCanonical = CANONICAL_FIRESTORE_DAILY_REPORTS.filter(r => r.date.startsWith('2026-09'));
  console.log(`Canonical Daily Reports September: ${sepReportsCanonical.length}`);
  console.log(`Canonical Daily Reports Oktober: ${octReportsCanonical.length} (Target: 11)`);
  console.log(`Canonical Findings: ${CANONICAL_FIRESTORE_FINDINGS.length}`);
  console.log(`Canonical Work Orders: ${CANONICAL_FIRESTORE_WORK_ORDERS.length}`);

  // 2. PARSER AUDIT TERHADAP official_data.md
  console.log('\n--- 2. AUDIT PARSER (official_data.md -> parseDailySheet) ---');
  const officialContent = fs.readFileSync('official_data.md', 'utf-8');
  const lines = officialContent.split('\n');
  const sheetRows = [];
  let rowIdx = 6;
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    const parts = line.split('|').map(s => s.trim());
    if (parts.length < 9) continue;
    const colA = parts[1];
    if (colA === 'Tanggal' || colA === '---') continue;
    sheetRows.push({
      rowNumber: rowIdx++,
      cells: [parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7]]
    });
  }
  const parsedOct = parseDailySheet(sheetRows);
  console.log(`Parsed October entries from official sheet: ${parsedOct.length} (Target: 11)`);
  const parsedQcCount = parsedOct.filter(p => p.isQc).length;
  console.log(`Parsed October QC count: ${parsedQcCount} (Target: 0)`);

  // 3. KPI CALCULATOR AUDIT
  console.log('\n--- 3. AUDIT KALKULASI KPI & PRODUKTIVITAS STAF (OKTOBER 2026) ---');
  const kpisOct = calculateAllStaffKpis(
    allStaff,
    octReportsCanonical,
    [],
    [],
    undefined,
    undefined,
    undefined,
    [],
    []
  );
  const activeStaffOct = kpisOct.filter(s => s.reports > 0 || s.qcs > 0 || s.wos > 0 || s.attendanceCount > 0);
  console.log(`Staf Aktif Oktober: ${activeStaffOct.length} orang (Target: 7)`);
  activeStaffOct.forEach((s, idx) => {
    console.log(`  ${idx + 1}. ${s.name} (${s.division}): Lap=${s.reports}, QC=${s.qcs}, Kehadiran=${s.attendanceCount} Hari, Jam=${s.hours} Jam, KPI=${s.kpi}%`);
  });

  // 4. BROWSER RUNTIME AUDIT
  console.log('\n--- 4. AUDIT RUNTIME BROWSER (PUPPETEER E2E) ---');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Login as Wahyu (Owner / Director)
  await page.select('select', 'director-wahyu');
  await page.type('input[type="password"]', 'riz123');
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) await submitBtn.click();
  await new Promise(r => setTimeout(r, 3000));

  const browserAudit = await page.evaluate(() => {
    // 1. Check Section 04 table
    const table04 = Array.from(document.querySelectorAll('table')).find(t => t.textContent?.includes('Nama Staff') && t.textContent?.includes('Daily Report'));
    const rows04 = table04 ? Array.from(table04.querySelectorAll('tbody tr')).map(tr => Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim()).join(' | ')) : [];

    // 2. Check Section 05 QC stats
    const statsContainer = document.querySelector('.bg-emerald-50\\/40, .border-emerald-200')?.parentElement;
    const bodyText = document.body.innerText;

    // Check if there are any NaN or undefined in DOM
    const hasNaN = /NaN/.test(bodyText);
    const hasUndefined = /undefined/.test(bodyText);

    // Read localStorage stats
    const rawReports = localStorage.getItem('riz_daily_reports_v2');
    const reports = rawReports ? JSON.parse(rawReports) : [];
    const octReports = reports.filter((r: any) => r.date && r.date.startsWith('2026-10'));

    return {
      table04Rows: rows04,
      hasNaN,
      hasUndefined,
      octReportsCountInStorage: octReports.length
    };
  });

  console.log(`Browser LocalStorage October Reports: ${browserAudit.octReportsCountInStorage}`);
  console.log(`Browser DOM Section 04 Table Rows (${browserAudit.table04Rows.length} staf):`);
  browserAudit.table04Rows.forEach(r => console.log('  ' + r));

  console.log(`DOM contains NaN: ${browserAudit.hasNaN ? '❌ YA' : '✅ TIDAK'}`);
  console.log(`DOM contains undefined: ${browserAudit.hasUndefined ? '❌ YA' : '✅ TIDAK'}`);
  console.log(`Console Errors: ${consoleErrors.length > 0 ? consoleErrors.join('; ') : '✅ BERSIH (0 Error)'}`);

  await browser.close();

  console.log('\n================================================================');
  console.log('   STATUS AUDIT DEBUG: SELESAI DENGAN VALIDASI EMPIRIS          ');
  console.log('================================================================');
}

runComprehensiveDebug().catch(err => {
  console.error('Debug script fatal error:', err);
  process.exit(1);
});
