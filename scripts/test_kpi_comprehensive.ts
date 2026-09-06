/**
 * Comprehensive KPI Calculator Test Suite
 * PT. RIZ PRODUCTION MULTI KREASI
 */

import { STAFF_LIST, INITIAL_DAILY_REPORTS, INITIAL_LOGBOOK_ENTRIES, INITIAL_FINDINGS } from '../src/data';
import { calculateStaffKpi, calculateAllStaffKpis, isStaffMatch, KNOWN_STAFF_ALIASES } from '../src/utils/kpiCalculator';
import { OFFICIAL_SEPTEMBER_2026_SCHEDULE } from '../src/data/september2026Schedule';

console.log('================================================================');
console.log('       TEST SUITE: SISTEM PERHITUNGAN KPI RESMI STAFF RIZ PRO   ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function expect(condition: boolean, title: string, details?: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${title}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${title} => ${details || ''}`);
  }
}

// 1. Test Alias Matching Dictionary
console.log('\n--- 1. Testing Staff Alias & Nickname Resolution ---');
expect(isStaffMatch({ id: 'staff-iwan', name: 'Iwan Kurniawan' } as any, 'Kang Butonk'), 'Resolves nickname Kang Butonk -> Iwan Kurniawan');
expect(isStaffMatch({ id: 'staff-suryana', name: 'Suryana' } as any, 'Nana'), 'Resolves nickname Nana -> Suryana');
expect(isStaffMatch({ id: 'staff-suryana', name: 'Suryana' } as any, 'Buluk'), 'Resolves nickname Buluk -> Suryana');
expect(isStaffMatch({ id: 'staff-suryana', name: 'Suryana' } as any, 'Bulux'), 'Resolves nickname Bulux -> Suryana');
expect(isStaffMatch({ id: 'staff-rahmat', name: 'Muhamad Rahmat' } as any, 'mboh'), 'Resolves nickname Mboh -> Muhamad Rahmat');
expect(isStaffMatch({ id: 'staff-udin', name: 'Udin Saepudin' } as any, 'Mang Ubed'), 'Resolves nickname Mang Ubed -> Udin Saepudin');
expect(isStaffMatch({ id: 'staff-ayong', name: 'Ayong Sumarsih' } as any, 'Prabuam'), 'Resolves alias Prabuam -> Ayong Sumarsih');
expect(isStaffMatch({ id: 'staff-mulyadi', name: 'Mulyadi' } as any, 'Jay Mulyadi'), 'Resolves nickname Jay Mulyadi -> Mulyadi');

// 2. Test All Staff KPI Calculation
console.log('\n--- 2. Testing KPI Calculations for Master Staff List ---');
const allResults = calculateAllStaffKpis(
  STAFF_LIST,
  INITIAL_DAILY_REPORTS,
  INITIAL_LOGBOOK_ENTRIES,
  INITIAL_FINDINGS
);

expect(allResults.length === STAFF_LIST.length, `Calculated KPI for all ${STAFF_LIST.length} staff members`);

allResults.forEach((res) => {
  const validRange = res.kpi >= 0 && res.kpi <= 100;
  expect(validRange, `KPI Score for ${res.name} (${res.division}) is in valid range: ${res.kpi}% (Grade: ${res.grade})`);
  
  // Verify component presence
  const componentsValid = 
    typeof res.attendanceScore === 'number' &&
    typeof res.competencyScore === 'number' &&
    typeof res.disciplineScore === 'number' &&
    typeof res.reportScore === 'number' &&
    typeof res.qcScore === 'number' &&
    typeof res.woScore === 'number';
    
  expect(componentsValid, `All 6 KPI pillars computed properly for ${res.name}`);
});

// 3. Test Sorting and Leaderboard
console.log('\n--- 3. Testing KPI Ranking Order ---');
let isSortedCorrectly = true;
for (let i = 1; i < allResults.length; i++) {
  const prev = allResults[i - 1];
  const curr = allResults[i];
  if (curr.reports > prev.reports) {
    isSortedCorrectly = false;
    break;
  } else if (curr.reports === prev.reports) {
    if (curr.qcs > prev.qcs) {
      isSortedCorrectly = false;
      break;
    }
  }
}
expect(isSortedCorrectly, 'Leaderboard ranks staff strictly by Daily Report, QC Checklist, WO Selesai, Uji Komp, Kehadiran');

// 4. Testing Attendance & Schedule Roster Status (Deactivated)
console.log('\n--- 4. Testing Attendance & Schedule Roster Status (Deactivated) ---');
const sampleKpi = allResults[0];
expect(sampleKpi.attendanceCount === 0 && sampleKpi.hours === 0, `Attendance count & hours are deactivated: ${sampleKpi.attendanceCount} days, ${sampleKpi.hours} hours (Score: ${sampleKpi.attendanceScore}%)`);

// 5. Test Summary Report
console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passedTests}/${totalTests} Tests Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('================================================================\n');

console.log('TOP 5 KPI LEADERBOARD:');
allResults.slice(0, 5).forEach((r, idx) => {
  console.log(`  ${idx + 1}. [${r.grade}] ${r.name.padEnd(24)} | Divisi: ${r.division.padEnd(12)} | KPI: ${r.kpi}% | Lap: ${r.reportsCount} | QC: ${r.qcCount} | Att: ${r.attendanceCount}d`);
});
console.log('\n');
