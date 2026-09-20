import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPREADSHEET_ID = '1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA';
const GID = '198998470';
const URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${GID}`;

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
    
    // Find the actual start of the data by looking for 'Tanggal'
    let startIndex = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] && rows[i][0].trim() === 'Tanggal') {
        startIndex = i;
        break;
      }
    }
    
    const headers = ['Tanggal', 'Crew', 'SOUND', 'LIGHTING', 'LED', 'MULTIMEDIA', 'REMARK'];
    
    // Data starts 2 rows after the 'Tanggal' row (skipping the sub-headers)
    const dataRows = rows.slice(startIndex + 2).filter(row => row.some(cell => cell.trim() !== ''));

    console.log(`[AGENT] Ditemukan ${dataRows.length} baris data valid. Mem-format ulang ke Markdown...`);
    
    let mdContent = '<!-- markdownlint-disable -->\n';
    mdContent += '# DATA SINKRONISASI GOOGLE SHEET (OFFICIAL)\n\n';
    
    // Write headers
    mdContent += '| ' + headers.join(' | ') + ' |\n';
    mdContent += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
    
    dataRows.forEach((row) => {
      // Ensure row has exact same number of columns as headers (7)
      const paddedRow = row.slice(0, 7);
      while (paddedRow.length < 7) {
        paddedRow.push('');
      }
      const sanitizedRow = paddedRow.map(cell => cell.replace(/\n/g, '<br>').replace(/\|/g, '&#124;'));
      mdContent += '| ' + sanitizedRow.join(' | ') + ' |\n';
    });
    
    const mdPath = path.join(__dirname, '../official_data.md');
    fs.writeFileSync(mdPath, mdContent);
    console.log(`[AGENT] Data berhasil di-dump ke: official_data.md`);

    // ==========================================
    // PHASE 2: AST / CODE INJECTION TO FRONTEND
    // ==========================================
    console.log(`[AGENT] Mem-parsing data baris ke struktur TypeScript untuk Dashboard UI...`);
    
    const dailyReports: any[] = [];
    const logbookEntries: any[] = [];
    let currentDate = "2026-09-01";

    dataRows.forEach((row, i) => {
      const paddedRow = row.slice(0, 7);
      while (paddedRow.length < 7) paddedRow.push('');

      let rawDate = paddedRow[0].trim();
      if (rawDate) {
        const match = rawDate.match(/(\d+)\s+September\s+2026/i);
        if (match) {
          const day = match[1].padStart(2, '0');
          currentDate = `2026-09-${day}`;
        }
      }

      let crewString = paddedRow[1].trim();
      if (!crewString) return; // Skip empty crew rows

      // Split multiple crew names by newlines, commas, or slashes, and remove leading dashes
      const crews = crewString.split(/[\n,\/]+/)
        .map(c => c.replace(/^- /g, '').trim())
        .filter(c => c.length > 0);

      let division = "Umum";
      let activity = "";
      if (paddedRow[2].trim()) { division = "Audio"; activity = paddedRow[2].trim(); }
      else if (paddedRow[3].trim()) { division = "Lighting"; activity = paddedRow[3].trim(); }
      else if (paddedRow[4].trim()) { division = "Videotron"; activity = paddedRow[4].trim(); }
      else if (paddedRow[5].trim()) { division = "Multimedia"; activity = paddedRow[5].trim(); }

      const notes = paddedRow[6].trim();

      if (activity) {
        crews.forEach((crew, index) => {
          dailyReports.push({
            id: `rep-${currentDate.replace(/-/g, '')}-${crew.toLowerCase().replace(/[^a-z0-9]/g, '')}-${i}-${index}`,
            date: currentDate,
            staffName: crew,
            division: division,
            activity: activity,
            notes: notes,
            status: "Submitted",
            _source: "google_sheet"
          });

          // Only push a logbook entry for QC stats if it actually represents a QC/Maintenance activity
          const actLower = activity.toLowerCase();
          const isQc = ['cek', 'qc', 'cleaning', 'repair', 'ganti', 'perbaikan', 'service'].some(kw => actLower.includes(kw));
          
          if (isQc) {
            logbookEntries.push({
              id: `log-${currentDate.replace(/-/g, '')}-${crew.toLowerCase().replace(/[^a-z0-9]/g, '')}-${i}-${index}`,
              date: currentDate,
              division: division,
              staffName: crew,
              activity: activity,
              result: "OK",
              followUp: notes || "Tugas harian selesai",
              status: "Close",
              verification: "Auto-Synced",
              checklists: { "Sync": { status: "OK", notes: "Synced from Google Sheet" } },
              _source: "google_sheet"
            });
          }
        });
      }
    });

    console.log(`[AGENT] Berhasil membuat ${dailyReports.length} Daily Reports & Logbook Entries dari data asli.`);

    // Replace the mock data in canonicalFirestoreData.ts
    const tsPath = path.join(__dirname, '../src/data/canonicalFirestoreData.ts');
    if (fs.existsSync(tsPath)) {
      let tsContent = fs.readFileSync(tsPath, 'utf8');

      // Simple string replacement using regex to clear out the arrays
      tsContent = tsContent.replace(/export const CANONICAL_FIRESTORE_DAILY_REPORTS: DailyReport\[\] = \[[\s\S]*?\];/, `export const CANONICAL_FIRESTORE_DAILY_REPORTS: DailyReport[] = ${JSON.stringify(dailyReports, null, 2)};`);
      
      tsContent = tsContent.replace(/export const CANONICAL_FIRESTORE_LOGBOOK_ENTRIES: LogbookEntry\[\] = \[[\s\S]*?\];/, `export const CANONICAL_FIRESTORE_LOGBOOK_ENTRIES: LogbookEntry[] = ${JSON.stringify(logbookEntries, null, 2)};`);

      // Clear the other fake data
      tsContent = tsContent.replace(/export const CANONICAL_FIRESTORE_FINDINGS: Finding\[\] = \[[\s\S]*?\];/, `export const CANONICAL_FIRESTORE_FINDINGS: Finding[] = [];`);
      tsContent = tsContent.replace(/export const CANONICAL_FIRESTORE_WORK_ORDERS: WorkOrder\[\] = \[[\s\S]*?\];/, `export const CANONICAL_FIRESTORE_WORK_ORDERS: WorkOrder[] = [];`);

      fs.writeFileSync(tsPath, tsContent);
      console.log(`[AGENT] Berhasil memperbarui src/data/canonicalFirestoreData.ts dengan data asli (NO HALLUCINATION).`);
    }
    
    console.log('[AGENT] SINKRONISASI SELESAI. SILAKAN PERIKSA FRONTEND DASHBOARD.');
    
  } catch (err: any) {
    console.error(`[AGENT ERROR] Terjadi kesalahan saat sinkronisasi: ${err.message}`);
  }
}

runAgent();
