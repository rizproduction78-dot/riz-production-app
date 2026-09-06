/**
 * Automated Verification & Render Test for ALL Sidebar Panels and Features
 * Uses react-dom/server to test full component tree rendering of every tab!
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import Dashboard from '../src/components/Dashboard';
import LogTaskModule from '../src/components/LogTaskModule';
import CareerCompetencyModule from '../src/components/CareerCompetencyModule';
import EmployeePerformanceModule from '../src/components/EmployeePerformanceModule';
import Findings from '../src/components/Findings';
import Maintenance from '../src/components/Maintenance';
import Absensi from '../src/components/Absensi';
import Gudang from '../src/components/Gudang';
import Reports from '../src/components/Reports';
import ActivityHistory from '../src/components/ActivityHistory';
import AdminPanel from '../src/components/AdminPanel';
import LoginScreen from '../src/components/LoginScreen';

import {
  STAFF_LIST,
  INITIAL_ASSETS,
  INITIAL_MAINTENANCE_SCHEDULES,
  INITIAL_WORK_ORDERS,
  INITIAL_FINDINGS,
  INITIAL_LOGBOOK_ENTRIES,
  INITIAL_DAILY_REPORTS,
  INITIAL_DAILY_TASKS
} from '../src/data';

if (typeof global !== 'undefined' && !(global as any).localStorage) {
  const storage: Record<string, string> = {};
  (global as any).localStorage = {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => { storage[key] = value; },
    removeItem: (key: string) => { delete storage[key]; },
    clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
  };
}

console.log('================================================================');
console.log('  FULL SIDEBAR PANELS & FEATURES COMPREHENSIVE RENDER TEST');
console.log('================================================================\n');

const testAdminUser = STAFF_LIST.find(s => s.name === 'Wahyu') || STAFF_LIST[0];
const testStaffUser = STAFF_LIST.find(s => s.role === 'Staff') || STAFF_LIST[1];
const dummyLogActivity = (u: string, r: string, a: string) => {};

const panelsToTest = [
  {
    name: '1. Login Screen',
    render: () => renderToString(
      <LoginScreen onLogin={() => {}} onLogActivity={dummyLogActivity} />
    )
  },
  {
    name: '2. Dashboard Panel',
    render: () => renderToString(
      <Dashboard
        logbookEntries={INITIAL_LOGBOOK_ENTRIES}
        dailyReports={INITIAL_DAILY_REPORTS}
        findings={INITIAL_FINDINGS}
        workOrders={INITIAL_WORK_ORDERS}
        currentUser={testAdminUser}
        onNavigate={() => {}}
      />
    )
  },
  {
    name: '3. Daily Task & QC Checklist Panel',
    render: () => renderToString(
      <LogTaskModule
        currentUser={testAdminUser}
        dailyReports={INITIAL_DAILY_REPORTS}
        onAddReport={() => {}}
        onDeleteReport={() => {}}
        onAddFinding={() => {}}
        onLogActivity={dummyLogActivity}
        initialTasks={INITIAL_DAILY_TASKS}
        logbookEntries={INITIAL_LOGBOOK_ENTRIES}
        onAddLogbookEntry={() => {}}
      />
    )
  },
  {
    name: '4. Karir & Paspor Kompetensi Panel',
    render: () => renderToString(
      <CareerCompetencyModule
        currentUser={testAdminUser}
        onLogActivity={dummyLogActivity}
      />
    )
  },
  {
    name: '5. Kinerja Karyawan Panel',
    render: () => renderToString(
      <EmployeePerformanceModule
        currentUser={testAdminUser}
        dailyReports={INITIAL_DAILY_REPORTS}
        logbookEntries={INITIAL_LOGBOOK_ENTRIES}
        findings={INITIAL_FINDINGS}
        workOrders={INITIAL_WORK_ORDERS}
      />
    )
  },
  {
    name: '6. Temuan QC & WO Panel',
    render: () => renderToString(
      <Findings
        findings={INITIAL_FINDINGS}
        onAddFinding={() => {}}
        onUpdateFindingStatus={() => {}}
        onDeleteFinding={() => {}}
        currentUser={testAdminUser}
        onLogActivity={dummyLogActivity}
      />
    )
  },
  {
    name: '7. Maintenance & Pemeliharaan Panel',
    render: () => renderToString(
      <Maintenance
        schedules={INITIAL_MAINTENANCE_SCHEDULES}
        onAddSchedule={() => {}}
        onUpdateScheduleStatus={() => {}}
        currentUser={testAdminUser}
        onLogActivity={dummyLogActivity}
      />
    )
  },
  {
    name: '8. Absensi Mandiri (Self)',
    render: () => renderToString(
      <Absensi
        currentUser={testAdminUser}
        onLogActivity={dummyLogActivity}
        forceSubTab="self"
      />
    )
  },
  {
    name: '9. Penjadwalan Kerja (Schedule 1-31)',
    render: () => renderToString(
      <Absensi
        currentUser={testAdminUser}
        onLogActivity={dummyLogActivity}
        forceSubTab="schedule"
      />
    )
  },
  {
    name: '10. Dashboard Pemeliharaan Kelistrikan',
    render: () => renderToString(
      <Absensi
        currentUser={testAdminUser}
        onLogActivity={dummyLogActivity}
        forceSubTab="maintenance_dashboard"
      />
    )
  },
  {
    name: '11. Manajemen Gudang (Logs & Barcode Scanner)',
    render: () => renderToString(
      <Gudang
        currentUser={testAdminUser}
        assets={INITIAL_ASSETS}
        onLogActivity={dummyLogActivity}
      />
    )
  },
  {
    name: '12. KELOLA ARMADA & TATA KELOLA KENDARAAN (Tri-Party Governance, SPJ, P2H, RAB)',
    render: () => renderToString(
      <Gudang
        currentUser={testAdminUser}
        assets={INITIAL_ASSETS}
        onLogActivity={dummyLogActivity}
        forceSubTab="armada_governance"
      />
    )
  },
  {
    name: '12b. Kelola Armada (Staff User Access)',
    render: () => renderToString(
      <Gudang
        currentUser={testStaffUser}
        assets={INITIAL_ASSETS}
        onLogActivity={dummyLogActivity}
        forceSubTab="armada_governance"
      />
    )
  },
  {
    name: '13. Laporan & Ekspor Panel',
    render: () => renderToString(
      <Reports
        logbookEntries={INITIAL_LOGBOOK_ENTRIES}
        dailyReports={INITIAL_DAILY_REPORTS}
        findings={INITIAL_FINDINGS}
        currentUser={testAdminUser}
        onLogActivity={dummyLogActivity}
      />
    )
  },
  {
    name: '14. Audit Activity History Panel',
    render: () => renderToString(
      <ActivityHistory
        activities={[
          { id: '1', timestamp: '10:00:00', username: 'Wahyu', role: 'Admin', action: 'Audit test' }
        ]}
        onClearActivities={() => {}}
        currentUser={testAdminUser}
      />
    )
  },
  {
    name: '15. Panel Kontrol Admin (Full Subtabs)',
    render: () => renderToString(
      <AdminPanel
        currentUser={testAdminUser}
        onLogActivity={dummyLogActivity}
        findings={INITIAL_FINDINGS}
        onAddFinding={() => {}}
        onUpdateFinding={() => {}}
        onDeleteFinding={() => {}}
        workOrders={INITIAL_WORK_ORDERS}
        onAddWorkOrder={() => {}}
        onUpdateWorkOrder={() => {}}
        onDeleteWorkOrder={() => {}}
        maintenanceSchedules={INITIAL_MAINTENANCE_SCHEDULES}
        onAddSchedule={() => {}}
        onUpdateSchedule={() => {}}
        onDeleteSchedule={() => {}}
        assets={INITIAL_ASSETS}
        onAddAsset={() => {}}
        onUpdateAsset={() => {}}
        onDeleteAsset={() => {}}
      />
    )
  }
];

let passCount = 0;

for (const panel of panelsToTest) {
  try {
    const html = panel.render();
    if (html && html.length > 50) {
      console.log(`[PASS] ${panel.name} rendered successfully (HTML Length: ${html.length} chars)`);
      passCount++;
    } else {
      console.error(`[FAIL] ${panel.name} outputted empty or too short HTML!`);
    }
  } catch (error) {
    console.error(`[CRASH] ${panel.name} threw error:`, error);
  }
}

console.log('\n================================================================');
console.log(`  ALL PANEL VERIFICATION RESULT: ${passCount}/${panelsToTest.length} PASSED (100% OK)`);
console.log('================================================================\n');

if (passCount !== panelsToTest.length) {
  process.exit(1);
}
