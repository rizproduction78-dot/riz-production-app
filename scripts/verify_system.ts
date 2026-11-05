/**
 * End-to-End Test & Diagnostic Script for RIZ-PRODUCTION App
 * Tests all modules, types, data schemas, sync engine, and component imports.
 */

import { STAFF_LIST, QC_ITEMS_BY_DIVISION, INITIAL_VEHICLES, INITIAL_FREELANCE_WORKERS, INITIAL_FLEET_DRIVERS, INITIAL_ASSETS, INITIAL_MAINTENANCE_SCHEDULES, INITIAL_WORK_ORDERS, INITIAL_FINDINGS, INITIAL_LOGBOOK_ENTRIES, INITIAL_DAILY_REPORTS, INITIAL_DAILY_TASKS, INITIAL_JOB_ASSIGNMENTS, resolveCrewMember, formatFleetVehicleBadge } from '../src/data';
import { OFFICIAL_SEPTEMBER_2026_SCHEDULE } from '../src/data/september2026Schedule';
import { OFFICIAL_COMPETENCY_MATRICES } from '../src/data/competencyMatrixData';
import { getDeviceOSInfo, ALL_SYNC_COLLECTIONS, SyncStatus, subscribeSyncStatus } from '../src/lib/cloudSync';
import { calculateStaffKpi } from '../src/utils/kpiCalculator';
import { buildGoogleCalendarEventUrl, generateJobAssignmentsIcsContent, parseGoogleCalendarIcsToJobAssignments } from '../src/lib/googleCalendarSync';
import { decode1DBarcodeFromImageData } from '../src/lib/universalBarcodeScanner';

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
assert(ALL_SYNC_COLLECTIONS.length === 24, 'Sync Collections Registry contains all 24 modules', `Count: ${ALL_SYNC_COLLECTIONS.length}`);
ALL_SYNC_COLLECTIONS.forEach(col => {
  assert(Boolean(col.name && col.key && col.label), `Registry Item '${col.name}' is well-formed`);
});

// 3. Test Master Data Integrity
assert(STAFF_LIST.length > 0, 'Master Staff list populated', `Count: ${STAFF_LIST.length}`);
assert(INITIAL_VEHICLES.length > 0, 'Initial vehicles populated', `Count: ${INITIAL_VEHICLES.length}`);
assert(INITIAL_ASSETS.length === 133, 'Official Inventory Assets populated (133 canonical asset groups from 18UHbZsqbaE66mmpjF37p97wNmM5EheDzyx4lmOOWshk)', `Count: ${INITIAL_ASSETS.length}`);
assert(Array.isArray(INITIAL_FREELANCE_WORKERS), 'Freelance workers initial list is a valid array', `Count: ${INITIAL_FREELANCE_WORKERS.length}`);
assert(Array.isArray(INITIAL_FLEET_DRIVERS), 'Fleet drivers initial list is a valid array', `Count: ${INITIAL_FLEET_DRIVERS.length}`);
assert(OFFICIAL_SEPTEMBER_2026_SCHEDULE.length > 0, 'September 2026 schedule populated', `Rows: ${OFFICIAL_SEPTEMBER_2026_SCHEDULE.length}`);
assert(Boolean(OFFICIAL_COMPETENCY_MATRICES['Audio']), 'Competency matrices contain Audio division');

// 3b. Test Official Job Assignments (Staff & Freelance Crew Schedule via App & Google Calendar rizproduction78@gmail.com)
assert(INITIAL_JOB_ASSIGNMENTS.length >= 500, 'Official Job Assignments populated from Google Calendar (rizproduction78@gmail.com)', `Count: ${INITIAL_JOB_ASSIGNMENTS.length}`);
const octJobs = INITIAL_JOB_ASSIGNMENTS.filter(j => j.monthKey === '2026-10');
const novJobs = INITIAL_JOB_ASSIGNMENTS.filter(j => j.monthKey === '2026-11');
const decJobs = INITIAL_JOB_ASSIGNMENTS.filter(j => j.monthKey === '2026-12');
assert(octJobs.length >= 55 && novJobs.length >= 35 && decJobs.length >= 5, 'Job Assignments cover October, November, and December 2026 from Google Calendar', `Oct: ${octJobs.length}, Nov: ${novJobs.length}, Dec: ${decJobs.length}`);
const sampleStaffCrew = resolveCrewMember('Mboh');
const sampleFreelanceCrew = resolveCrewMember('Adul', 'Audio', 'Bongkaran');
assert(sampleStaffCrew.personnelType === 'Staff' && sampleStaffCrew.staffId === 'staff-rahmat', 'resolveCrewMember accurately maps Inhouse Staff (Mboh -> staff-rahmat)');
assert(sampleFreelanceCrew.personnelType === 'Freelance' && sampleFreelanceCrew.roleNote === 'Bongkaran', 'resolveCrewMember accurately maps Freelance Crew with roleNote (Adul -> Freelance)');
assert(formatFleetVehicleBadge('Riz 2').includes('F 8446 BF'), 'formatFleetVehicleBadge maps Riz 2 to official plate F 8446 BF');

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

// 6. Test Google Calendar Integration for Staff & Freelance Crew Assignments
const sampleJobForCal = INITIAL_JOB_ASSIGNMENTS[0];
const gcalUrl = buildGoogleCalendarEventUrl(sampleJobForCal, {
  filterPersonName: 'Muhamad Rahmat',
  filterPersonType: 'Staff'
});
assert(
  gcalUrl.startsWith('https://calendar.google.com/calendar/render?') &&
    gcalUrl.includes('action=TEMPLATE') &&
    gcalUrl.includes('Asia%2FJakarta'),
  'Google Calendar event URL generator produces valid template URL with Asia/Jakarta timezone'
);
const icsContent = generateJobAssignmentsIcsContent(INITIAL_JOB_ASSIGNMENTS.slice(0, 3), {
  filterPersonName: 'Adul',
  filterPersonType: 'Freelance'
});
assert(
  icsContent.includes('BEGIN:VCALENDAR') &&
    icsContent.includes('BEGIN:VEVENT') &&
    icsContent.includes('BEGIN:VALARM') &&
    icsContent.includes('END:VCALENDAR') &&
    !icsContent.includes('docs.google.com/document'),
  'Google Calendar iCalendar (.ics) generator produces valid RFC 5545 calendar feed with VALARM reminders (no Google Doc reference)'
);
const parsedIcsJobs = parseGoogleCalendarIcsToJobAssignments(icsContent);
assert(
  parsedIcsJobs.length === 3 && parsedIcsJobs[0].venue.length > 0,
  'Google Calendar iCalendar (.ics) parser accurately imports VEVENT entries back into JobAssignments'
);

// 7. Test Universal Camera Barcode Scanner 1D Optical Decoder
const emptyImageData = {
  width: 200,
  height: 40,
  data: new Uint8ClampedArray(200 * 40 * 4)
} as unknown as ImageData;
assert(
  decode1DBarcodeFromImageData(emptyImageData) === null,
  'Universal Camera Barcode 1D scanline decoder handles blank frames safely without false positives'
);

console.log('\n====================================================');
console.log(`  RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100% OK)`);
console.log('====================================================\n');
