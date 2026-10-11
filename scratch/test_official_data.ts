import fs from 'fs';
import path from 'path';
import { parseDailySheet, SheetRow } from '../src/lib/dailySheetParser';

const officialDataPath = path.resolve(process.cwd(), 'official_data.md');
const content = fs.readFileSync(officialDataPath, 'utf-8');

const lines = content.split('\n');
const rows: SheetRow[] = [];

// Header ada di baris 4 dan pemisah di baris 5. Baris data mulai baris 6 (1-indexed).
lines.forEach((line, index) => {
  const lineNum = index + 1;
  if (lineNum < 6) return;
  if (!line.trim().startsWith('|')) return;

  const parts = line.split('|').map(s => s.trim());
  // parts[0] = '', parts[1]=Tanggal, parts[2]=Crew, parts[3]=SOUND, parts[4]=LIGHTING, parts[5]=LED, parts[6]=MULTIMEDIA, parts[7]=REMARK
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
      ]
    });
  }
});

console.log(`Berhasil membaca ${rows.length} baris data dari official_data.md`);

const parsed = parseDailySheet(rows);
console.log(`Total parsed entries: ${parsed.length}\n`);

// Agregasi per staff
const staffSummary: Record<string, { totalReports: number; qcCount: number; dates: Set<string>; rows: number[] }> = {};

for (const entry of parsed) {
  const key = entry.staffName;
  if (!staffSummary[key]) {
    staffSummary[key] = { totalReports: 0, qcCount: 0, dates: new Set(), rows: [] };
  }
  staffSummary[key].totalReports += 1;
  if (entry.isQc) staffSummary[key].qcCount += 1;
  if (entry.date) staffSummary[key].dates.add(entry.date);
  staffSummary[key].rows.push(entry.sheetRow);
}

console.log('=== HASIL PARSING OFFICIAL_DATA.MD SESUAI K1-b, K2-c, K3-b ===');
console.table(
  Object.entries(staffSummary).map(([name, data]) => ({
    Staff: name,
    'Total Laporan': data.totalReports,
    'QC Checked': data.qcCount,
    'Hari Unik': data.dates.size,
    'Tanggal': Array.from(data.dates).sort().join(', '),
    'Baris Sheet': data.rows.join(', ')
  }))
);
