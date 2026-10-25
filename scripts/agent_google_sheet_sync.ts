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
const GID = '1340328886';
const URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;

console.log('================================================================');
console.log('    AGENT: GOOGLE SHEET R.A.G SYNC ENGINE (CSV FETCH)           ');
console.log('================================================================\n');

async function runAgent() {
  console.log(`[AGENT] Memulai proses fetch data dari Google Sheet...`);
  console.log(`[URL] ${URL}`);
  
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`Gagal fetch Google Sheet, status: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log(`[AGENT] Data berhasil di-fetch. Ukuran: ${csvText.length} karakter.`);
    
    // Parse CSV
    const parsed = Papa.parse(csvText, {
      skipEmptyLines: true
    });
    
    const rows = parsed.data as string[][];
    if (rows.length === 0) {
      console.log('[AGENT] Data CSV kosong.');
      return;
    }
    
    const sheetRows: SheetRow[] = extractNormalizedDailySheetRows(rows);
    console.log(`[AGENT] Ditemukan ${sheetRows.length} baris data ternormalisasi. Mem-format ulang ke Markdown...`);
    
    let mdContent = '<!-- markdownlint-disable -->\n';
    mdContent += '# DATA SINKRONISASI GOOGLE SHEET (OFFICIAL)\n\n';
    
    const headers = ['Tanggal', 'Crew', 'SOUND', 'LIGHTING', 'LED', 'MULTIMEDIA', 'REMARK'];
    mdContent += '| ' + headers.join(' | ') + ' |\n';
    mdContent += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
    
    sheetRows.forEach((r) => {
      const sanitizedRow = r.cells.map(cell => cell.replace(/\n/g, '<br>').replace(/\|/g, '&#124;'));
      mdContent += '| ' + sanitizedRow.join(' | ') + ' |\n';
    });
    
    const mdPath = path.join(__dirname, '../official_data_synced.md');
    fs.writeFileSync(mdPath, mdContent);
    console.log(`[AGENT] Data berhasil di-dump ke: official_data_synced.md`);

    // ==========================================
    // PHASE 2: PARSE VIA DAILY_SHEET_PARSER (T6)
    // ==========================================
    console.log(`[AGENT] Mem-parsing data baris menggunakan dailySheetParser bersama...`);
    const parsedEntries = parseDailySheet(sheetRows);
    console.log(`[AGENT] Total parsed entries: ${parsedEntries.length}`);

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

    console.log(`[AGENT] Berhasil membuat ${dailyReports.length} Daily Reports & ${logbookEntries.length} Logbook Entries QC.`);

    // ==========================================
    // PHASE 3: SAFE MONTH-SCOPED MERGE (T6)
    // ==========================================
    const tsPath = path.join(__dirname, '../src/data/canonicalFirestoreData.ts');
    if (fs.existsSync(tsPath)) {
      // Import existing arrays dynamically
      const canonicalModule = await import('../src/data/canonicalFirestoreData');
      const existingReports = (canonicalModule.CANONICAL_FIRESTORE_DAILY_REPORTS || []) as DailyReport[];
      const existingLogs = (canonicalModule.CANONICAL_FIRESTORE_LOGBOOK_ENTRIES || []) as LogbookEntry[];
      const existingFindings = canonicalModule.CANONICAL_FIRESTORE_FINDINGS || [];
      const existingWOs = canonicalModule.CANONICAL_FIRESTORE_WORK_ORDERS || [];

      // Month-scoped replace untuk bulan Oktober (2026-10) dengan _source: google_sheet
      // Seluruh data bulan lain (September, dsb.) dan non-google_sheet TETAP UTUH!
      const targetMonthPrefix = '2026-10';

      const preservedReports = existingReports.filter(
        (r) => !(r.date && r.date.startsWith(targetMonthPrefix) && r._source === 'google_sheet')
      );
      const mergedReports = [...preservedReports, ...dailyReports];

      const preservedLogs = existingLogs.filter(
        (l) => !(l.date && l.date.startsWith(targetMonthPrefix) && l._source === 'google_sheet')
      );
      const mergedLogs = [...preservedLogs, ...logbookEntries];

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
      console.log(`   - Daily Reports Total: ${mergedReports.length} (Oktober gsheet: ${dailyReports.length})`);
      console.log(`   - Logbook Entries QC Total: ${mergedLogs.length} (Oktober gsheet: ${logbookEntries.length})`);
      console.log(`   - Findings & Work Orders: TIDAK TERSENTUH (${existingFindings.length} findings, ${existingWOs.length} work orders).`);
    }
    
    console.log('[AGENT] SINKRONISASI SELESAI.');
    
  } catch (err: any) {
    console.error(`[AGENT ERROR] Terjadi kesalahan saat sinkronisasi: ${err.message}`);
  }
}

runAgent();
