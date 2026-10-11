import { CANONICAL_FIRESTORE_DAILY_REPORTS } from '../src/data/canonicalFirestoreData';
import { STAFF_LIST } from '../src/data';
import { calculateAllStaffKpis, isStaffMatch } from '../src/utils/kpiCalculator';

console.log('=== TEST: MENGAPA AEP SAEPUDIN MUNCUL DI DASHBOARD? ===\n');

const octReports = CANONICAL_FIRESTORE_DAILY_REPORTS.filter(r => r.date && r.date.startsWith('2026-10'));
console.log('Oct reports:', octReports.map(r => ({ id: r.id, staffName: r.staffName, activity: r.activity })));

console.log('\n--- UJI isStaffMatch TERHADAP octReports ---');
for (const staff of STAFF_LIST) {
  const matched = octReports.filter(r => isStaffMatch(staff, r.staffName));
  if (matched.length > 0) {
    console.log(`Staff [${staff.id}] ${staff.name} cocok dengan:`, matched.map(m => m.staffName));
  }
}

const aep = STAFF_LIST.find(s => s.id === 'staff-absobur')!;
const unyin = STAFF_LIST.find(s => s.id === 'staff-unyin')!;

console.log('\nAep Saepudin aliases:', (aep as any).nickname, aep.name);
for (const r of octReports) {
  console.log(`isStaffMatch(Aep, "${r.staffName}") =`, isStaffMatch(aep, r.staffName));
  console.log(`isStaffMatch(Wahyudin, "${r.staffName}") =`, isStaffMatch(unyin, r.staffName));
}
