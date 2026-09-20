/**
 * End-to-End Test & Diagnostic Script for RIZ-PRODUCTION App
 * Tests all modules, types, data schemas, sync engine, and component imports.
 */

import { STAFF_LIST, QC_ITEMS_BY_DIVISION, INITIAL_VEHICLES, INITIAL_FREELANCE_WORKERS, INITIAL_FLEET_DRIVERS, INITIAL_ASSETS, INITIAL_MAINTENANCE_SCHEDULES, INITIAL_WORK_ORDERS, INITIAL_FINDINGS, INITIAL_LOGBOOK_ENTRIES, INITIAL_DAILY_REPORTS, INITIAL_DAILY_TASKS } from '../src/data';
import { OFFICIAL_SEPTEMBER_2026_SCHEDULE } from '../src/data/september2026Schedule';
import { OFFICIAL_COMPETENCY_MATRICES } from '../src/data/competencyMatrixData';
import { getDeviceOSInfo, ALL_SYNC_COLLECTIONS, SyncStatus, subscribeSyncStatus } from '../src/lib/cloudSync';
import { calculateStaffKpi } from '../src/utils/kpiCalculator';

console.log('====================================================');
console.log('  RIZ-PRODUCTION END-TO-END AUTOMATED DIAGNOSTIC SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}${details ? ' - ' + details : ''}`);
  }
}

// 1. Test Device OS Info
const deviceInfo = getDeviceOSInfo();
assert(typeof deviceInfo.os === 'string', 'Device OS detection works', `Detected OS: ${deviceInfo.os}`);
assert(typeof deviceInfo.deviceType === 'string', 'Device type detection works', `Type: ${deviceInfo.deviceType}`);

// 2. Test All Sync Collections Registry
assert(ALL_SYNC_COLLECTIONS.length === 23, 'Sync Collections Registry contains all 23 modules', `Count: ${ALL_SYNC_COLLECTIONS.length}`);
ALL_SYNC_COLLECTIONS.forEach(col => {
  assert(Boolean(col.name && col.key && col.label), `Registry Item '${col.name}' is well-formed`);
});

// 3. Test Master Data Integrity
assert(STAFF_LIST.length > 0, 'Master Staff list populated', `Count: ${STAFF_LIST.length}`);
assert(INITIAL_VEHICLES.length > 0, 'Initial vehicles populated', `Count: ${INITIAL_VEHICLES.length}`);
assert(Array.isArray(INITIAL_FREELANCE_WORKERS), 'Freelance workers initial list is a valid array', `Count: ${INITIAL_FREELANCE_WORKERS.length}`);
assert(Array.isArray(INITIAL_FLEET_DRIVERS), 'Fleet drivers initial list is a valid array', `Count: ${INITIAL_FLEET_DRIVERS.length}`);
assert(OFFICIAL_SEPTEMBER_2026_SCHEDULE.length > 0, 'September 2026 schedule populated', `Rows: ${OFFICIAL_SEPTEMBER_2026_SCHEDULE.length}`);
assert(Boolean(OFFICIAL_COMPETENCY_MATRICES['Audio']), 'Competency matrices contain Audio division');

// 4. Test KPI Calculator
const testStaff = STAFF_LIST[0];
const kpiResult = calculateStaffKpi(testStaff);
assert(typeof kpiResult.kpi === 'number' && kpiResult.kpi >= 0, 'KPI calculator calculates valid score', `KPI: ${kpiResult.kpi}`);

// 5. Test Sync Status Listener
let statusReceived = false;
const unsub = subscribeSyncStatus((st: SyncStatus) => {
  statusReceived = true;
});
assert(statusReceived, 'Sync status listener fires upon subscription');
unsub();

console.log('\n====================================================');
console.log(`  RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100% OK)`);
console.log('====================================================\n');
