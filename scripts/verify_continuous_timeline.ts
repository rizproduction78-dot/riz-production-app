import { STAFF_LIST, INITIAL_DAILY_REPORTS, INITIAL_LOGBOOK_ENTRIES, INITIAL_FINDINGS } from '../src/data';
import { calculateAllStaffKpis } from '../src/utils/kpiCalculator';

console.log('================================================================');
console.log('  VERIFIKASI KONTINUITAS DATA OPERASIONAL HARIAN & BULANAN      ');
console.log('================================================================');

const dates = ['2026-09-01', '2026-09-03', '2026-09-04', '2026-09-05', '2026-09-06', '2026-09-07', '2026-09-09', '2026-09-10', '2026-09-11'];

dates.forEach(d => {
  const reps = INITIAL_DAILY_REPORTS.filter(r => r.date === d);
  const logs = INITIAL_LOGBOOK_ENTRIES.filter(e => e.date === d);
  const find = INITIAL_FINDINGS.filter(f => f.dateCreated === d || f.targetDate === d);
  const results = calculateAllStaffKpis(STAFF_LIST, reps, logs, find);
  const activeStaff = results.filter(s => s.reports > 0 || s.qcs > 0 || s.wos > 0);
  
  console.log(`\n--- TANGGAL: ${d} ---`);
  console.log(`Total Laporan: ${reps.length}, Total QC: ${logs.length}, Total Temuan/WO: ${find.length}`);
  activeStaff.forEach((s, idx) => {
    console.log(`  ${idx + 1}. ${s.name} (${s.division}) => Lap: ${s.reports}, QC: ${s.qcs}, WO: ${s.wos}`);
  });
});

console.log('\n================================================================');
console.log('  REKAP AKUMULASI BULANAN BERKELANJUTAN (SEPTEMBER 2026)        ');
console.log('================================================================');

const monthResults = calculateAllStaffKpis(
  STAFF_LIST,
  INITIAL_DAILY_REPORTS,
  INITIAL_LOGBOOK_ENTRIES,
  INITIAL_FINDINGS
);

monthResults.filter(s => s.reports > 0 || s.qcs > 0 || s.wos > 0).forEach((s, idx) => {
  console.log(`  #${idx + 1} [Grade ${s.grade}] ${s.name.padEnd(22)} | Divisi: ${s.division.padEnd(12)} | Total Lap: ${s.reports} | Total QC: ${s.qcs} | Total WO: ${s.wos} | Kehadiran Roster: ${s.attendanceCount} Hari | KPI: ${s.kpi}%`);
});

console.log('\n');
