import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { fileURLToPath } from 'url';
import { parseDailySheet, SheetRow, extractNormalizedDailySheetRows } from '../src/lib/dailySheetParser';
import { isFindingRemark } from '../src/lib/googleSheetSync';
import { DailyReport, LogbookEntry } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPREADSHEET_ID = '1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA';
const SYNC_TABS: { monthKey: string; gid: string; label: string }[] = [
  { monthKey: '2026-10', gid: '1340328886', label: 'Oktober 2026' },
  { monthKey: '2026-11', gid: '7916507', label: 'November 2026' },
  { monthKey: '2026-12', gid: '368237370', label: 'Desember 2026' },
];

console.log('================================================================');
console.log('    AGENT: GOOGLE SHEET R.A.G SYNC ENGINE (CSV FETCH)           ');
console.log('================================================================\n');

async function runAgent() {
  console.log(`[AGENT] Memulai proses fetch data multi-bulan dari Google Sheet...`);
  
  try {
    const allNewDailyReports: DailyReport[] = [];
    const allNewLogbookEntries: LogbookEntry[] = [];
    const syncedMonthPrefixes = new Set<string>();
    let mdContent = '<!-- markdownlint-disable -->\n';
    mdContent += '# DATA SINKRONISASI GOOGLE SHEET (OFFICIAL)\n\n';
    const headers = ['Tanggal', 'Crew', 'SOUND', 'LIGHTING', 'LED', 'MULTIMEDIA', 'REMARK'];

    for (const tab of SYNC_TABS) {
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${tab.gid}`;
      console.log(`[AGENT] Fetching ${tab.label} (gid=${tab.gid}) -> ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`[AGENT] Gagal fetch ${tab.label}, status: ${response.status}`);
        continue;
      }

      const csvText = await response.text();
      console.log(`[AGENT] ${tab.label}: Data berhasil di-fetch (${csvText.length} karakter).`);

      const parsed = Papa.parse(csvText, { skipEmptyLines: true });
      const rows = parsed.data as string[][];
      if (rows.length === 0) continue;

      const sheetRows: SheetRow[] = extractNormalizedDailySheetRows(rows);
      console.log(`[AGENT] ${tab.label}: Ditemukan ${sheetRows.length} baris data ternormalisasi.`);

      mdContent += `## ${tab.label} (GID: ${tab.gid})\n\n`;
      mdContent += '| ' + headers.join(' | ') + ' |\n';
      mdContent += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
      sheetRows.forEach((r) => {
        const sanitizedRow = r.cells.slice(0, 7).map(cell => cell.replace(/\n/g, '<br>').replace(/\|/g, '&#124;'));
        mdContent += '| ' + sanitizedRow.join(' | ') + ' |\n';
      });
      mdContent += '\n';

      const parsedEntries = parseDailySheet(sheetRows, tab.monthKey);
      console.log(`[AGENT] ${tab.label}: Total parsed entries = ${parsedEntries.length}`);

      if (parsedEntries.length > 0) {
        syncedMonthPrefixes.add(tab.monthKey);
      }

      const dailyReports: DailyReport[] = parsedEntries.map((e) => ({
        id: e.id,
        date: e.date,
        staffName: e.staffName,
        division: e.division,
        activity: e.activity,
        notes: e.notes || '',
        status: 'Submitted',
        _source: 'google_sheet'
      }));

      const logbookEntries: LogbookEntry[] = parsedEntries
        .filter((e) => e.isQc)
        .map((e) => {
          const isNg = isFindingRemark(e.notes);
          return {
            id: `log-${e.id}`,
            date: e.date,
            division: e.division,
            staffName: e.staffName,
            activity: e.activity,
            result: isNg ? ('NG' as const) : ('OK' as const),
            followUp: e.notes || (isNg ? 'Perlu perbaikan teknis' : 'Pengecekan selesai aman'),
            status: isNg ? ('Open' as const) : ('Close' as const),
            verification: 'Auto-Synced',
            checklists: { [e.activity.substring(0, 40)]: { status: isNg ? ('NG' as const) : ('OK' as const), notes: e.notes || 'Synced from Google Sheet' } },
            _source: 'google_sheet'
          };
        });

      allNewDailyReports.push(...dailyReports);
      allNewLogbookEntries.push(...logbookEntries);
    }

    const mdPath = path.join(__dirname, '../official_data_synced.md');
    fs.writeFileSync(mdPath, mdContent);
    console.log(`[AGENT] Data berhasil di-dump ke: official_data_synced.md`);

    console.log(`[AGENT] Berhasil membuat total ${allNewDailyReports.length} Daily Reports & ${allNewLogbookEntries.length} Logbook Entries QC.`);

    // ==========================================
    // PHASE 3: SAFE MONTH-SCOPED MERGE (T6)
    // ==========================================
    const tsPath = path.join(__dirname, '../src/data/canonicalFirestoreData.ts');
    if (fs.existsSync(tsPath)) {
      const canonicalModule = await import('../src/data/canonicalFirestoreData');
      const existingReports = (canonicalModule.CANONICAL_FIRESTORE_DAILY_REPORTS || []) as DailyReport[];
      const existingLogs = (canonicalModule.CANONICAL_FIRESTORE_LOGBOOK_ENTRIES || []) as LogbookEntry[];
      const existingFindings = canonicalModule.CANONICAL_FIRESTORE_FINDINGS || [];
      const existingWOs = canonicalModule.CANONICAL_FIRESTORE_WORK_ORDERS || [];

      const preservedReports = existingReports.filter(
        (r) => !(r.date && Array.from(syncedMonthPrefixes).some(prefix => r.date.startsWith(prefix)) && r._source === 'google_sheet')
      );
      const reportMap = new Map<string, DailyReport>();
      for (const r of [...preservedReports, ...allNewDailyReports]) {
        reportMap.set(r.id, r);
      }
      const mergedReports = Array.from(reportMap.values());

      const preservedLogs = existingLogs.filter(
        (l) => !(l.date && Array.from(syncedMonthPrefixes).some(prefix => l.date.startsWith(prefix)) && l._source === 'google_sheet')
      );
      const logMap = new Map<string, LogbookEntry>();
      for (const l of [...preservedLogs, ...allNewLogbookEntries]) {
        logMap.set(l.id, l);
      }
      const mergedLogs = Array.from(logMap.values());

      const updatedContent = `import { DailyReport, LogbookEntry, Finding, WorkOrder } from '../types';

/**
 * DATA KANONIKAL RESMI CLOUD FIRESTORE & GOOGLE SHEET PT. RIZ PRODUCTION MULTI KREASI
 * Disinkronkan langsung dari Cloud Firestore (wh-logbook-2026).
 * Total: ${mergedReports.length} Daily Reports | ${mergedLogs.length} Logbook Entries | ${existingFindings.length} Findings | ${existingWOs.length} Work Orders
 */

export const CANONICAL_FIRESTORE_DAILY_REPORTS: DailyReport[] = ${JSON.stringify(mergedReports, null, 2)};

export const CANONICAL_FIRESTORE_LOGBOOK_ENTRIES: LogbookEntry[] = ${JSON.stringify(mergedLogs, null, 2)};

export const CANONICAL_FIRESTORE_FINDINGS: Finding[] = ${JSON.stringify(existingFindings, null, 2)};

export const CANONICAL_FIRESTORE_WORK_ORDERS: WorkOrder[] = ${JSON.stringify(existingWOs, null, 2)};
`;

      fs.writeFileSync(tsPath, updatedContent);
      console.log(`[AGENT] Month-scoped replace selesai:`);
      console.log(`   - Daily Reports Total: ${mergedReports.length} (Synced gsheet: ${allNewDailyReports.length})`);
      console.log(`   - Logbook Entries QC Total: ${mergedLogs.length} (Synced gsheet: ${allNewLogbookEntries.length})`);
      console.log(`   - Findings & Work Orders: TIDAK TERSENTUH (${existingFindings.length} findings, ${existingWOs.length} work orders).`);
    }
    
    console.log('[AGENT] SINKRONISASI SELESAI.');
    
  } catch (err: any) {
    console.error(`[AGENT ERROR] Terjadi kesalahan saat sinkronisasi: ${err.message}`);
  }
}

runAgent();
