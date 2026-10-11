import fs from 'fs';
import path from 'path';
import { parseDailySheet, SheetRow } from '../src/lib/dailySheetParser';

// Target acuan resmi PRD Tabel 3.1 & pembacaan riil kata kunci 'cek' dari official_data.md
const EXPECTED_OCTOBER: Record<string, { totalReports: number; uniqueDays: number; qcChecked: number }> = {
  'Muhamad Irvan': { totalReports: 2, uniqueDays: 2, qcChecked: 1 },
  'Ayong Sumarsih': { totalReports: 2, uniqueDays: 2, qcChecked: 1 },
  'Mulyana': { totalReports: 2, uniqueDays: 2, qcChecked: 1 },
  'Wahyudin': { totalReports: 2, uniqueDays: 2, qcChecked: 0 },
  'Dedi Agus Wigiantoro': { totalReports: 1, uniqueDays: 1, qcChecked: 0 },
  'Heri': { totalReports: 2, uniqueDays: 2, qcChecked: 1 },
  'Ramdani': { totalReports: 1, uniqueDays: 1, qcChecked: 0 },
};

const officialDataPath = path.resolve(process.cwd(), 'official_data.md');
if (!fs.existsSync(officialDataPath)) {
  console.error(`FATAL: File ${officialDataPath} tidak ditemukan!`);
  process.exit(1);
}

const content = fs.readFileSync(officialDataPath, 'utf-8');
const lines = content.split('\n');
const rows: SheetRow[] = [];

lines.forEach((line, index) => {
  const lineNum = index + 1;
  if (lineNum < 6) return;
  if (!line.trim().startsWith('|')) return;

  const parts = line.split('|').map((s) => s.trim());
  if (parts.length >= 8) {
    rows.push({
      rowNumber: lineNum,
      cells: [
        parts[1], // Tanggal
        parts[2], // Crew
        parts[3], // SOUND
        parts[4], // LIGHTING
        parts[5], // LED
        parts[6], // MULTIMEDIA
        parts[7], // REMARK
      ],
    });
  }
});

console.log(`[TEST T4] Membaca ${rows.length} baris data dari official_data.md...`);

const parsed = parseDailySheet(rows);
console.log(`[TEST T4] Total parsed entries: ${parsed.length}`);

// Verifikasi integritas: tidak boleh ada staf yang bertabrakan atau _unmatched
const unmatched = parsed.filter((p) => p._unmatched);
if (unmatched.length > 0) {
  console.error(`[TEST T4] GAGAL: Ditemukan ${unmatched.length} entri dengan staf yang tidak cocok:`);
  console.error(unmatched.map((u) => `Baris ${u.sheetRow}: ${u.staffName}`).join('\n'));
  process.exit(1);
}

// Agregasi hasil parse
const actualSummary: Record<string, { totalReports: number; uniqueDays: number; qcChecked: number; dates: Set<string> }> = {};

for (const entry of parsed) {
  const name = entry.staffName;
  if (!actualSummary[name]) {
    actualSummary[name] = { totalReports: 0, uniqueDays: 0, qcChecked: 0, dates: new Set() };
  }
  actualSummary[name].totalReports += 1;
  if (entry.isQc) actualSummary[name].qcChecked += 1;
  if (entry.date) actualSummary[name].dates.add(entry.date);
}

for (const name of Object.keys(actualSummary)) {
  actualSummary[name].uniqueDays = actualSummary[name].dates.size;
}

let hasError = false;

console.log('\n--- VERIFIKASI PER STAFF DENGAN ANGKA ACUAN ---');
for (const [staffName, expected] of Object.entries(EXPECTED_OCTOBER)) {
  const actual = actualSummary[staffName];
  if (!actual) {
    console.error(`❌ GAGAL: Staf ${staffName} tidak ditemukan dalam hasil parse!`);
    hasError = true;
    continue;
  }

  const reportsMatch = actual.totalReports === expected.totalReports;
  const daysMatch = actual.uniqueDays === expected.uniqueDays;
  const qcMatch = actual.qcChecked === expected.qcChecked;

  if (reportsMatch && daysMatch && qcMatch) {
    console.log(`✅ ${staffName}: Laporan=${actual.totalReports}, Hari=${actual.uniqueDays}, QC=${actual.qcChecked} (SESUAI)`);
  } else {
    console.error(`❌ ${staffName} TIDAK SESUAI:`);
    console.error(`   Total Laporan : Ekspektasi=${expected.totalReports}, Aktual=${actual.totalReports}`);
    console.error(`   Hari Unik     : Ekspektasi=${expected.uniqueDays}, Aktual=${actual.uniqueDays}`);
    console.error(`   QC Checked    : Ekspektasi=${expected.qcChecked}, Aktual=${actual.qcChecked}`);
    hasError = true;
  }
}

// Pastikan tidak ada staf siluman lain yang masuk (Aep, Gatot, dsb.)
const unexpectedStaff = Object.keys(actualSummary).filter((name) => !EXPECTED_OCTOBER[name]);
if (unexpectedStaff.length > 0) {
  console.error(`❌ Ditemukan staf tak terduga dalam data: ${unexpectedStaff.join(', ')}`);
  hasError = true;
}

if (hasError) {
  console.error('\n[TEST T4] GAGAL: Hasil parse tidak sesuai acuan.');
  process.exit(1);
}

console.log('\n[TEST T4] SEMUA VERIFIKASI LULUS 100%! Output parser identik dengan data resmi.\n');
process.exit(0);
