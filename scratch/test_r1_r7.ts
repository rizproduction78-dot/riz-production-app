import fs from 'fs';
import path from 'path';
import { parseIndonesianDate, normalizeCrewName, NAME_TO_STAFF_ID, STAFF_ID_TO_OFFICIAL_NAME, STAFF_ID_TO_DEFAULT_DIVISION } from '../src/lib/dailySheetParser';

const officialDataPath = path.resolve(process.cwd(), 'official_data.md');
const content = fs.readFileSync(officialDataPath, 'utf-8');
const lines = content.split('\n');

interface Entry {
  id: string;
  date: string;
  staffName: string;
  staffId: string | null;
  division: string;
  activity: string;
  notes: string;
  isQc: boolean;
  sheetRow: number;
}

const entries: Entry[] = [];
let lastDate = '';

// Pure R1 - R7 logic
lines.forEach((line, index) => {
  const lineNum = index + 1;
  if (lineNum < 6) return;
  if (!line.trim().startsWith('|')) return;

  const parts = line.split('|').map(s => s.trim());
  if (parts.length < 8) return;

  const rawDate = parts[1];
  const rawCrew = parts[2];
  const sound = parts[3];
  const lighting = parts[4];
  const led = parts[5];
  const mm = parts[6];
  const remark = parts[7];

  if (rawDate) {
    const pDate = parseIndonesianDate(rawDate);
    if (pDate) lastDate = pDate;
  }

  let activityText = '';
  let division = 'Umum';
  if (sound) { activityText = sound; division = 'Audio'; }
  else if (lighting) { activityText = lighting; division = 'Lighting'; }
  else if (led) { activityText = led; division = 'Videotron'; }
  else if (mm) { activityText = mm; division = 'Multimedia'; }

  // R1: Jika crew terisi
  if (rawCrew) {
    // Jika tidak ada aktivitas di C-F dan tidak ada remark, skip (kru tidak beraktivitas!)
    if (!activityText && !remark) {
      console.log(`Baris ${lineNum} [${rawCrew}] DIABAIKAN karena tidak ada aktivitas.`);
      return;
    }

    const rawCrewParts = rawCrew.split(/[\n\r,;/]+/).map(p => p.trim()).filter(Boolean);
    for (const part of rawCrewParts) {
      const norm = normalizeCrewName(part);
      const staffId = NAME_TO_STAFF_ID[norm] || null;
      const staffName = staffId ? STAFF_ID_TO_OFFICIAL_NAME[staffId] : part;
      const staffDiv = division !== 'Umum' ? division : (staffId ? STAFF_ID_TO_DEFAULT_DIVISION[staffId] : 'Umum');
      const isQc = ['qc', 'inspeksi', 'checklist', 'onhouse', 'p2h'].some(kw => (activityText + ' ' + remark).toLowerCase().includes(kw));

      entries.push({
        id: `rep-${lastDate.replace(/-/g, '')}-${staffId || 'unknown'}-${lineNum}`,
        date: lastDate,
        staffName,
        staffId,
        division: staffDiv,
        activity: activityText || remark,
        notes: remark,
        isQc,
        sheetRow: lineNum
      });
    }
  } else {
    // R2: Baris lanjutan (Crew kosong) -> gabung teks ke entri sebelumnya
    if (entries.length > 0 && (activityText || remark)) {
      const lastEntry = entries[entries.length - 1];
      if (activityText) {
        lastEntry.activity += `\n${activityText}`;
      }
      if (remark) {
        lastEntry.notes += lastEntry.notes ? `\n${remark}` : remark;
      }
    }
  }
});

console.log(`\nTotal parsed entries murni R1-R7: ${entries.length}\n`);

const summary: Record<string, { totalReports: number; uniqueDays: Set<string>; qc: number; rows: number[] }> = {};
for (const e of entries) {
  if (!summary[e.staffName]) {
    summary[e.staffName] = { totalReports: 0, uniqueDays: new Set(), qc: 0, rows: [] };
  }
  summary[e.staffName].totalReports++;
  if (e.date) summary[e.staffName].uniqueDays.add(e.date);
  if (e.isQc) summary[e.staffName].qc++;
  summary[e.staffName].rows.push(e.sheetRow);
}

console.table(
  Object.entries(summary).map(([name, d]) => ({
    Staff: name,
    Laporan: d.totalReports,
    'Hari Unik': d.uniqueDays.size,
    Tanggal: Array.from(d.uniqueDays).sort().join(', '),
    QC: d.qc,
    'Baris Sheet': d.rows.join(', ')
  }))
);
