import fs from 'fs';
import path from 'path';
import { parseDailySheet, SheetRow } from '../src/lib/dailySheetParser';
import { buildOperationalDashboardJson } from '../src/lib/operationalProcessor';

const officialDataPath = path.resolve(process.cwd(), 'official_data.md');
if (!fs.existsSync(officialDataPath)) {
  console.error(`File ${officialDataPath} tidak ditemukan!`);
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

const parsed = parseDailySheet(rows);
const resultJson = buildOperationalDashboardJson('01-10-2026 s/d 04-10-2026', parsed);

console.log('--- TEST OPERATIONAL PROCESSOR JSON ---');
console.log('Periode:', resultJson.periode);
console.log('Total Staf Terproses:', resultJson.produktivitas_staff.length);
console.log('Total Pekerjaan Selesai:', resultJson.monitoring_status.selesai.length);
console.log('Total Pekerjaan Pending/Fail:', resultJson.monitoring_status.pending_or_fail.length);
console.log('Total Handover Lintas Divisi:', resultJson.tindak_lanjut_handover.length);

if (resultJson.produktivitas_staff.length !== 7) {
  console.error(`FAIL: Ekspektasi 7 staf, didapat ${resultJson.produktivitas_staff.length}`);
  process.exit(1);
}

if (resultJson.monitoring_status.pending_or_fail.length === 0) {
  console.error('FAIL: Harus ada pekerjaan pending/fail untuk Tripot & Modul Kabinet!');
  process.exit(1);
}

// Test executeTaskUpdate
import { executeTaskUpdate } from '../src/lib/operationalProcessor';
const updateRes = executeTaskUpdate({
  task_id: 'TSK-041026-03',
  status: 'TRANSFERRED',
  transferred_to: 'MAINTENANCE_DIV',
  kpi_penalty_flag: false
});

console.log('--- TEST EXECUTE TASK UPDATE ---');
console.log('Action status:', updateRes.status);
console.log('Ticket ID:', updateRes.execution_results[0].result.ticket_id);
console.log('Updated KPI:', updateRes.execution_results[1].result.kpi_score);

if (updateRes.execution_results[1].result.kpi_score !== 100) {
  console.error('FAIL: KPI score should be 100 when kpi_penalty_flag is false!');
  process.exit(1);
}

console.log('\n[SUCCESS] Operational Processor berfungsi 100% sesuai spesifikasi.');
